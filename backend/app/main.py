from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

# Importando nossos arquivos recém-criados
from backend.banco.database import engine, SessionLocal
from backend.banco import models
from backend.app import schemas

# Esta linha é a mágica: ela cria o arquivo do banco de dados e as tabelas automaticamente!
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="MedControl API")

# Configuração de CORS para o Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Função para abrir a conexão com o banco em cada requisição e fechar depois
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ── ROTAS DA API ────────────────────────────────────────

@app.get("/")
def read_root():
    return {"status": "sucesso", "mensagem": "API do MedControl rodando com Banco de Dados!"}

# 1. Rota para LISTAR (Buscar todos os medicamentos no banco)
@app.get("/medicamentos", response_model=list[schemas.MedicamentoResponse])
def listar_medicamentos(db: Session = Depends(get_db)):
    return db.query(models.Medicamento).all()

# 2. Rota para ADICIONAR (Salvar um novo medicamento no banco)
@app.post("/medicamentos", response_model=schemas.MedicamentoResponse)
def adicionar_medicamento(med: schemas.MedicamentoCreate, db: Session = Depends(get_db)):
    novo_med = models.Medicamento(
        id=med.id, 
        name=med.name, 
        dose=med.dose, 
        time=med.time, 
        notes=med.notes
    )
    db.add(novo_med)
    db.commit()
    db.refresh(novo_med)
    return novo_med

# 3. Rota para DELETAR (Remover um medicamento do banco)
@app.delete("/medicamentos/{med_id}")
def deletar_medicamento(med_id: str, db: Session = Depends(get_db)):
    med = db.query(models.Medicamento).filter(models.Medicamento.id == med_id).first()
    
    if not med:
        raise HTTPException(status_code=404, detail="Medicamento não encontrado")
    
    db.delete(med)
    db.commit()
    return {"mensagem": "Removido com sucesso"}