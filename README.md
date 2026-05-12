# 💊 Med Control CLI

> **Aplicação CLI para controle de medicamentos e acompanhamento de tratamentos de saúde.**

**Nome:** Arthur Santana Rufino Gonçalves | **RA:** 22508744

---

## 🌐 Deploy

> ⚙️ Aplicação CLI — executável localmente (ver instruções abaixo) ou via Docker.
>
> **Como executar sem instalar nada (via GitHub Codespaces):**
> Acesse o repositório → clique em **Code** → **Codespaces** → **New codespace** → rode `python main.py`

---

## 📋 Sobre o Projeto

Sistema desenvolvido para auxiliar o usuário a ter mais controle sobre seus medicamentos e tratamentos de saúde. Funcionalidades:

- ✅ Registrar medicamentos com dosagem, horário e descrição
- ✅ Listar todos os medicamentos cadastrados
- ✅ Marcar medicamentos como tomados
- ✅ Acompanhar a adesão ao tratamento
- ✅ **[NOVO]** Buscar informações oficiais sobre medicamentos via **OpenFDA API**

---

## 🔌 Integração com API Pública — OpenFDA

A aplicação consome a **[OpenFDA Drug Label API](https://api.fda.gov/drug/label.json)**, uma API pública e gratuita mantida pela Food and Drug Administration (FDA) dos Estados Unidos.

**Valor agregado:** O usuário pode consultar, diretamente no CLI, informações oficiais sobre qualquer medicamento — como nome genérico, fabricante, indicações de uso e advertências — sem precisar sair da aplicação.

**Exemplo de uso:**
```
Escolha uma opção: 6
Nome do medicamento (em inglês, ex: ibuprofen): ibuprofen

==================================================
📋 INFORMAÇÕES DO MEDICAMENTO (OpenFDA)
==================================================
Nome Comercial : Advil
Nome Genérico  : IBUPROFEN
Fabricante     : Pfizer Consumer Healthcare

📌 Indicações:
Temporarily relieves minor aches and pains...

⚠️  Advertências:
Allergy alert: Ibuprofen may cause a severe allergic reaction...
==================================================
```

---

## 🚀 Como Executar

### Pré-requisitos
- Python 3.11+

### Instalação

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

---

## 🧪 Testes

### Rodar todos os testes (unitários + integração com mock)
```bash
pytest tests/ -v -k "not real_api"
```

### Rodar apenas os testes de integração com mock
```bash
pytest tests/test_integracao_openfda.py -v -k "not real_api"
```

### Rodar testes de integração real (requer internet)
```bash
pytest tests/ -v -m real_api
```

---

## 📁 Estrutura do Projeto

```
med-control-cli/
├── main.py                          # Ponto de entrada da aplicação (CLI)
├── requirements.txt                 # Dependências
├── pytest.ini                       # Configuração do pytest
├── src/
│   ├── __init__.py
│   ├── med_control.py               # Lógica principal (CRUD de medicamentos)
│   └── openfda_service.py           # Integração com a OpenFDA API ← NOVO
├── tests/
│   ├── __init__.py
│   ├── test_med_control.py          # Testes unitários
│   └── test_integracao_openfda.py   # Testes de integração ← NOVO
└── .github/
    └── workflows/
        └── ci.yml                   # Pipeline de CI (GitHub Actions)
```

---

## 🔄 Fluxo da Entrega Intermediária

1. **Issue criada** → `#1 - Integrar OpenFDA API para busca de informações de medicamentos`
2. **Branch criada** → `entrega-intermediaria`
3. **Funcionalidade desenvolvida** → `src/openfda_service.py`
4. **Testes de integração criados** → `tests/test_integracao_openfda.py` (7 testes, todos passando ✅)
5. **CI atualizado** → `.github/workflows/ci.yml`
6. **Pull Request aberto** → vinculado à Issue com `closes #1`
7. **Merge realizado** → branch `entrega-intermediaria` → `main`

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|---|---|
| Python 3.11+ | Linguagem principal |
| requests | Consumo da API REST (OpenFDA) |
| pytest | Testes unitários e de integração |
| unittest.mock | Mock das chamadas HTTP nos testes |
| GitHub Actions | Pipeline de CI/CD |
