# ... (imports de segurança)
from jose import jwt
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "sua_chave_secreta_super_segura" # Mude isso!

# Rota de Cadastro de Usuário
@app.post("/auth/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    hashed_password = pwd_context.hash(user.password)
    db_user = storage.Usuario(email=user.email, senha_hash=hashed_password)
    db.add(db_user)
    db.commit()
    return {"message": "Usuário criado!"}

# Rota de Login (Gera o Token/Crachá)
@app.post("/auth/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(storage.Usuario).filter(storage.Usuario.email == user.email).first()
    if not db_user or not pwd_context.verify(user.password, db_user.senha_hash):
        raise HTTPException(status_code=400, detail="E-mail ou senha incorretos")
    
    token = jwt.encode({"sub": str(db_user.id)}, SECRET_KEY, algorithm="HS256")
    return {"access_token": token, "token_type": "bearer"}

# AGORA A LISTAGEM FILTRA PELO USUÁRIO LOGADO
@app.get("/pacientes")
def listar(current_user: storage.Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(storage.Medicamento).filter(storage.Medicamento.usuario_id == current_user.id).all()