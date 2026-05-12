from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class Usuario(Base):
    __tablename__ = "usuarios"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    senha_hash = Column(String)
    # Relacionamento: Um usuário tem muitos medicamentos
    medicamentos = relationship("Medicamento", back_populates="dono")

class Medicamento(Base):
    __tablename__ = "medicamentos"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String)
    dosagem = Column(String)
    horario = Column(String)
    descricao = Column(String, nullable=True)
    # Nova coluna para identificar o dono
    usuario_id = Column(Integer, ForeignKey("usuarios.id"))
    dono = relationship("Usuario", back_populates="medicamentos")