from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Configuração do Banco de Dados SQLite
SQLALCHEMY_DATABASE_URL = "https://med-control-cli.onrender.com/pacientes.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Modelo da Tabela no Banco de Dados
class Medicamento(Base):
    __tablename__ = "medicamentos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String)
    dosagem = Column(String)
    horario = Column(String)
    descricao = Column(String, nullable=True)
    tomado = Column(Boolean, default=False)

# Cria a tabela se ela não existir
Base.metadata.create_all(bind=engine)

# Função para o FastAPI usar o banco
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()