from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# Usa a variável de ambiente DATABASE_URL se existir, senão usa SQLite local
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./medcontrol.db")

# O SQLite precisa desse argumento extra; PostgreSQL não precisa
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependência usada nas rotas para abrir/fechar sessão do banco
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()