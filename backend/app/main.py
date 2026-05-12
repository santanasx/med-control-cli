from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

# Importações relativas para o Render encontrar os arquivos vizinhos
try:
    from . import database, models, schemas
except ImportError:
    import database, models, schemas

# Cria as tabelas no banco de dados (SQLite)
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="MedControl API")

# Configuração de CORS - LIBERA O ACESSO PARA A VERCEL
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"status": "online", "message": "API MedControl rodando com sucesso!"}

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