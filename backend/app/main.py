import os
import sys
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

# --- AJUSTE DE CAMINHO ---
# Adiciona a pasta 'app' ao sistema para que ele encontre 'storage' e 'schemas'
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Importações diretas agora que o caminho foi ajustado
from infraestrutura import storage
import schemas

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/pacientes", response_model=List[schemas.Medicamento])
def listar(db: Session = Depends(storage.get_db)):
    # Certifique-se que o modelo em storage.py se chama Medicamento
    return db.query(storage.Medicamento).all()

@app.post("/pacientes", response_model=schemas.Medicamento)
def criar(med: schemas.MedicamentoCreate, db: Session = Depends(storage.get_db)):
    db_med = storage.Medicamento(**med.dict())
    db.add(db_med)
    db.commit()
    db.refresh(db_med)
    return db_med

@app.get("/")
def root():
    return {"status": "online"}