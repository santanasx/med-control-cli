# ⊕ Med Control CLI

Aplicação para controle de medicamentos e acompanhamento de tratamentos de saúde — com interface web e autenticação de usuários.

**Nome:** Arthur Santana Rufino Gonçalves | **RA:** 22508744

---

## 🌐 Deploy

| Serviço | URL |
|---|---|
| 🖥️ Frontend (Web) | [med-control-cli-app.vercel.app](https://med-control-cli-app.vercel.app) |
| ⚙️ Backend (API) | [med-control-cli.onrender.com](https://med-control-cli.onrender.com) |

> **Como executar sem instalar nada (via GitHub Codespaces):** Acesse o repositório → clique em `Code` → `Codespaces` → `New codespace` → rode `python main.py`

---

## 📋 Sobre o Projeto

Sistema desenvolvido para auxiliar o usuário a ter mais controle sobre seus medicamentos e tratamentos de saúde. Cada pessoa acessa o sistema com sua própria conta, garantindo que os dados sejam individuais e privados.

Funcionalidades:

- ✅ Cadastro e login de usuários com e-mail e senha
- ✅ Autenticação segura via token JWT — cada usuário vê apenas seus próprios medicamentos
- ✅ Registrar medicamentos com nome, dosagem, horário e observações
- ✅ Listar e buscar medicamentos cadastrados
- ✅ Excluir medicamento com confirmação

---

## 🔐 Como funciona a autenticação

1. O usuário cria uma conta com e-mail e senha pela interface web
2. A senha é armazenada criptografada com **bcrypt**
3. Ao fazer login, o backend gera um **token JWT**
4. O token é enviado em todas as requisições seguintes
5. O backend valida o token e retorna **apenas os dados do usuário logado**

---

## 🚀 Como Executar

### Pré-requisitos
- Python 3.11+

### Aplicação CLI
```bash
# 1. Clone o repositório
git clone https://github.com/santanasx/med-control-cli.git
cd med-control-cli

# 2. (Opcional) Crie um ambiente virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# 3. Instale as dependências
pip install -r requirements.txt

# 4. Execute a aplicação
python main.py
```

### Backend (API)
```bash
# Na raiz do projeto
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend
Abra o arquivo `frontend/index.html` no navegador ou use a extensão **Live Server** no VS Code.

---

## 🧪 Testes

```bash
# Rodar todos os testes (unitários + integração com mock)
pytest tests/ -v -k "not real_api"

# Rodar apenas os testes de integração com mock
pytest API/src/tests/test_integracao_openfda.py -v -k "not real_api"

# Rodar testes de integração real (requer internet)
pytest tests/ -v -m real_api
```

---

## 📁 Estrutura do Projeto

```
med-control-cli/
├── .github/
│   └── workflows/
│       └── ci.yml                        # Pipeline de CI (GitHub Actions)
├── API/src/
│   ├── tests/
│   │   └── test_integracao_openfda.py    # Testes de integração OpenFDA
│   └── openfda_service.py                # Integração com a OpenFDA API
├── app/
│   ├── main.py                           # Ponto de entrada CLI
│   ├── models.py                         # Modelos de dados
│   └── storage.py                        # Persistência local
├── backend/
│   └── app/
│       ├── infraestrutura/
│       │   ├── database.py               # Conexão com o banco de dados
│       │   └── storage.py                # Modelos do banco (SQLAlchemy)
│       ├── main.py                       # Rotas da API REST (FastAPI)
│       └── schemas.py                    # Validação de dados (Pydantic)
├── banco/
│   ├── database.py                       # Configuração do banco
│   └── models.py                         # Modelos auxiliares
├── frontend/
│   ├── index.html                        # Interface web
│   ├── script.js                         # Lógica e consumo da API
│   └── style.css                         # Estilização
├── tests/unit/
│   ├── integration/                      # Testes de integração
│   └── test_storage.py                   # Testes unitários de storage
├── pytest.ini                            # Configuração do pytest
└── requirements.txt                      # Dependências
```

---

## 🔄 Fluxo da Entrega

- Interface web criada → `frontend/` (HTML, CSS, JS)
- Backend REST desenvolvido → `backend/app/main.py` com FastAPI
- Sistema de autenticação implementado → cadastro, login e token JWT
- Banco de dados configurado → SQLite local / PostgreSQL em produção
- Cada usuário acessa apenas seus próprios medicamentos
- Deploy realizado → Frontend no **Vercel**, Backend no **Render**
- CI atualizado → `.github/workflows/ci.yml`

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|---|---|
| Python 3.11+ | Linguagem principal |
| FastAPI | Framework da API REST |
| SQLAlchemy | ORM para banco de dados |
| bcrypt | Criptografia de senhas |
| python-jose | Geração e validação de tokens JWT |
| HTML5 / CSS3 / JavaScript | Interface web |
| pytest | Testes unitários e de integração |
| unittest.mock | Mock das chamadas HTTP nos testes |
| GitHub Actions | Pipeline de CI/CD |
| Vercel | Deploy do frontend |
| Render | Deploy do backend |