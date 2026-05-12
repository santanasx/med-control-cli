from pydantic import BaseModel, EmailStr
from typing import Optional


# ── Autenticação ───────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str


# ── Medicamentos ───────────────────────────────────────────────────────────────

class MedicamentoCreate(BaseModel):
    nome: str
    dosagem: str
    horario: str
    descricao: Optional[str] = None

class Medicamento(BaseModel):
    id: int
    nome: str
    dosagem: str
    horario: str
    descricao: Optional[str] = None
    usuario_id: int

    class Config:
        from_attributes = True