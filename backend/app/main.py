from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import bcrypt

from .infraestrutura import storage
from .infraestrutura.database import get_db, engine
from . import schemas

# ── Cria as tabelas no banco (se ainda não existirem) ──────────────────────────
storage.Base.metadata.create_all(bind=engine)

# ── Configurações de segurança ─────────────────────────────────────────────────
SECRET_KEY = "medcontrol_chave_secreta_2024"
ALGORITHM  = "HS256"
bearer     = HTTPBearer()

app = FastAPI(title="MedControl API")

# ── CORS ───────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Helpers de senha ───────────────────────────────────────────────────────────
def hash_senha(senha: str) -> str:
    return bcrypt.hashpw(senha.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verificar_senha(senha: str, hash: str) -> bool:
    return bcrypt.checkpw(senha.encode("utf-8"), hash.encode("utf-8"))

# ── Dependência: valida token JWT ──────────────────────────────────────────────
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer),
    db: Session = Depends(get_db)
) -> storage.Usuario:
    token = credentials.credentials
    try:
        payload    = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        usuario_id = int(payload.get("sub"))
    except (JWTError, TypeError, ValueError):
        raise HTTPException(status_code=401, detail="Token inválido ou expirado")

    usuario = db.query(storage.Usuario).filter(storage.Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=401, detail="Usuário não encontrado")
    return usuario

# ══════════════════════════════════════════════════════════════════════════════
#  ROTAS PÚBLICAS
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/")
def root():
    return {"status": "online"}


@app.post("/auth/register", status_code=201)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existe = db.query(storage.Usuario).filter(storage.Usuario.email == user.email).first()
    if existe:
        raise HTTPException(status_code=400, detail="E-mail já cadastrado")

    novo = storage.Usuario(email=user.email, senha_hash=hash_senha(user.password))
    db.add(novo)
    db.commit()
    return {"message": "Usuário criado com sucesso!"}


@app.post("/auth/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(storage.Usuario).filter(storage.Usuario.email == user.email).first()
    if not db_user or not verificar_senha(user.password, db_user.senha_hash):
        raise HTTPException(status_code=400, detail="E-mail ou senha incorretos")

    token = jwt.encode({"sub": str(db_user.id)}, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token, "token_type": "bearer"}

# ══════════════════════════════════════════════════════════════════════════════
#  ROTAS PROTEGIDAS
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/pacientes")
def listar(
    current_user: storage.Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(storage.Medicamento)\
             .filter(storage.Medicamento.usuario_id == current_user.id)\
             .all()


@app.post("/pacientes", status_code=201)
def adicionar(
    med: schemas.MedicamentoCreate,
    current_user: storage.Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    novo = storage.Medicamento(
        nome       = med.nome,
        dosagem    = med.dosagem,
        horario    = med.horario,
        descricao  = med.descricao,
        usuario_id = current_user.id
    )
    db.add(novo)
    db.commit()
    db.refresh(novo)
    return novo


@app.delete("/pacientes/{med_id}", status_code=204)
def remover(
    med_id: int,
    current_user: storage.Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    med = db.query(storage.Medicamento).filter(
        storage.Medicamento.id         == med_id,
        storage.Medicamento.usuario_id == current_user.id
    ).first()

    if not med:
        raise HTTPException(status_code=404, detail="Medicamento não encontrado")

    db.delete(med)
    db.commit()