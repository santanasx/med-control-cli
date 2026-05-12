from pydantic import BaseModel
from typing import Optional

class MedicamentoBase(BaseModel):
    nome: str
    dosagem: str
    horario: str
    descricao: Optional[str] = None

class MedicamentoCreate(MedicamentoBase):
    pass

class Medicamento(MedicamentoBase):
    id: int
    tomado: bool = False

    class Config:
        from_attributes = True