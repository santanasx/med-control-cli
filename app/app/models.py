from pydantic import BaseModel, Field
from typing import Optional
import uuid

class MedicationCreate(BaseModel):
    name: str = Field(..., min_length=1, description="Nome do medicamento")
    time: str = Field(..., description="Horário de uso")
    dose: Optional[str] = Field(None, description="Dosagem (ex: 500mg)")
    notes: Optional[str] = Field(None, description="Observações extras")

class Medication(MedicationCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), description="ID único")
