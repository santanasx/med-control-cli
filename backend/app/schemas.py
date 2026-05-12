from pydantic import BaseModel
from typing import Optional

# Define o que o site PRECISA enviar ao cadastrar um remédio
class MedicamentoCreate(BaseModel):
    nome: str
    dosagem: str
    horario: str
    descricao: Optional[str] = None

# Define como o remédio SERÁ EXIBIDO (incluindo o ID e o status)
class Medicamento(BaseModel):
    id: int
    nome: str
    dosagem: str
    horario: str
    descricao: Optional[str] = None
    tomado: bool = False

    # Permite que o Pydantic leia os dados vindos do Banco de Dados (ORM)
    class Config:
        from_attributes = True