import os
import sys
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

# Isso ajuda o Python a encontrar a pasta 'infraestrutura'
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Importações baseadas no que vejo no seu VS Code:
try:
    from infraestrutura import storage
    import schemas
except ImportError:
    # Caso o Python esteja rodando de um nível acima
    from .infraestrutura import storage
    from . import schemas

# O FastAPI inicia aqui
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
    # Note que usei 'storage' em vez de 'database' pois é o que aparece no seu print
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