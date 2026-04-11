from sqlalchemy import Column, String
from .database import Base

class Medicamento(Base):
    __tablename__ = "medicamentos"

    # Usamos String no ID porque seu JS gera um ID no formato "lpt1z2x..."
    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    dose = Column(String)
    time = Column(String)
    notes = Column(String, nullable=True)