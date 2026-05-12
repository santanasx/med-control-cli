import os
import sys
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
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
    return db.query(storage.Medicamento).all()

@app.post("/pacientes", response_model=schemas.Medicamento)
def criar(med: schemas.MedicamentoCreate, db: Session = Depends(storage.get_db)):
    db_med = storage.Medicamento(**med.dict())
    db.add(db_med)
    db.commit()
    db.refresh(db_med)
    return db_med

# --- NOVA ROTA PARA DELETAR ---
@app.delete("/pacientes/{med_id}")
def deletar(med_id: int, db: Session = Depends(storage.get_db)):
    db_med = db.query(storage.Medicamento).filter(storage.Medicamento.id == med_id).first()
    if not db_med:
        raise HTTPException(status_code=404, detail="Medicamento não encontrado")
    db.delete(db_med)
    db.commit()
    return {"message": "Removido com sucesso"}

@app.get("/")
def root():
    return {"status": "online"}