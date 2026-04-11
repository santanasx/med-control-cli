from pydantic import BaseModel
from typing import Optional

class MedicamentoBase(BaseModel):
    name: str
    dose: str
    time: str
    notes: Optional[str] = None

class MedicamentoCreate(MedicamentoBase):
    id: str

class MedicamentoResponse(MedicamentoBase):
    id: str

    class Config:
        from_attributes = True