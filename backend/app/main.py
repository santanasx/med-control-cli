from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

# Importações do seu próprio projeto (verifique se os caminhos estão corretos)
from .database import engine, get_db
from . import models, schemas

# Cria as tabelas no banco de dados automaticamente ao iniciar
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="MedControl API")

# --- CONFIGURAÇÃO DE SEGURANÇA (CORS) ---
# Isso permite que o seu site na Vercel consiga conversar com esta API no Render
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, você pode trocar "*" pelo link da Vercel
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "API MedControl está online!"}

# Rota para listar medicamentos (o que seu script.js chama no fetch)
@app.get("/pacientes", response_model=List[schemas.Medicamento])
def listar_medicamentos(db: Session = Depends(get_db)):
    medicamentos = db.query(models.Medicamento).all()
    return medicamentos

# Rota para adicionar novo medicamento
@app.post("/pacientes", response_model=schemas.Medicamento)
def criar_medicamento(medicamento: schemas.MedicamentoCreate, db: Session = Depends(get_db)):
    db_medicamento = models.Medicamento(**medicamento.dict())
    db.add(db_medicamento)
    db.commit()
    db.refresh(db_medicamento)
    return db_medicamento

# Rota para deletar (caso seu front-end tenha essa função)
@app.delete("/pacientes/{med_id}")
def deletar_medicamento(med_id: int, db: Session = Depends(get_db)):
    db_med = db.query(models.Medicamento).filter(models.Medicamento.id == med_id).first()
    if not db_med:
        raise HTTPException(status_code=404, detail="Medicamento não encontrado")
    db.delete(db_med)
    db.commit()
    return {"message": "Removido com sucesso"}