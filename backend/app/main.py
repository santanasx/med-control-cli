from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import sys
import os

# Força o Python a olhar dentro da pasta onde este arquivo está
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Importações diretas (como o sys.path foi ajustado, ele encontrará os arquivos vizinhos)
try:
    import database
    import models
    import schemas
except ImportError:
    from . import database, models, schemas

# Inicializa o Banco
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="MedControl API")

# Liberação para o seu site na Vercel
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"status": "online", "link": "https://med-control-cli.onrender.com/pacientes"}

@app.get("/pacientes", response_model=List[schemas.Medicamento])
def listar(db: Session = Depends(database.get_db)):
    return db.query(models.Medicamento).all()

@app.post("/pacientes", response_model=schemas.Medicamento)
def adicionar(med: schemas.MedicamentoCreate, db: Session = Depends(database.get_db)):
    db_med = models.Medicamento(**med.dict())
    db.add(db_med)
    db.commit()
    db.refresh(db_med)
    return db_med

@app.delete("/pacientes/{id}")
def remover(id: int, db: Session = Depends(database.get_db)):
    db_med = db.query(models.Medicamento).filter(models.Medicamento.id == id).first()
    if not db_med:
        raise HTTPException(status_code=404, detail="Não encontrado")
    db.delete(db_med)
    db.commit()
    return {"message": "Removido"}