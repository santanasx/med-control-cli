import os
import sys
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

# --- CORREÇÃO DE CAMINHO CRÍTICA ---
# Adiciona o diretório atual ao sys.path para que o Render encontre os arquivos vizinhos
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

# Importações agora sem o ponto (.), pois o sys.path já aponta para cá
import database
import models
import schemas

# Inicializa as tabelas do Banco de Dados
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="MedControl API")

# --- CONFIGURAÇÃO DE CORS PARA VERCEL ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "online", "backend": "Render", "frontend_allowed": "Vercel"}

@app.get("/pacientes", response_model=List[schemas.Medicamento])
def listar_medicamentos(db: Session = Depends(database.get_db)):
    return db.query(models.Medicamento).all()

@app.post("/pacientes", response_model=schemas.Medicamento)
def criar_medicamento(medicamento: schemas.MedicamentoCreate, db: Session = Depends(database.get_db)):
    db_medicamento = models.Medicamento(**medicamento.dict())
    db.add(db_medicamento)
    db.commit()
    db.refresh(db_medicamento)
    return db_medicamento

@app.delete("/pacientes/{med_id}")
def deletar_medicamento(med_id: int, db: Session = Depends(database.get_db)):
    db_med = db.query(models.Medicamento).filter(models.Medicamento.id == med_id).first()
    if not db_med:
        raise HTTPException(status_code=404, detail="Medicamento não encontrado")
    db.delete(db_med)
    db.commit()
    return {"message": "Sucesso"}