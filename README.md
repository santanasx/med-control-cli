# Gerenciador de Medicamentos (MedControl)

## 📌 Problema
Muitas pessoas, especialmente idosos ou pacientes com tratamentos contínuos, enfrentam dificuldades para lembrar os horários exatos e as dosagens corretas de tomar seus remédios no dia a dia. A falta de uma rotina organizada e o esquecimento de uma dose podem comprometer seriamente a eficácia do tratamento médico e gerar riscos à saúde.

## 💡 Solução
O sistema desenvolvido tem como objetivo ajudar o usuário a ter um controle rigoroso e simplificado da sua rotina de saúde. A aplicação permite registrar os medicamentos prescritos, visualizar uma lista com tudo o que precisa ser tomado e remover os remédios de tratamentos que já foram finalizados. Dessa forma, o paciente (ou seu cuidador) passa a ter clareza total sobre a sua medicação diária, facilitando o acompanhamento para garantir que tudo seja tomado no horário correto e sem confusões.

## 👥 Público-alvo
Pacientes em uso contínuo de medicamentos, idosos, cuidadores e qualquer pessoa que queira organizar sua rotina de remédios.

## ⚙️ Funcionalidades
- Adicionar medicamentos
- Listar medicamentos ativos
- Remover medicamentos (tratamentos finalizados)

## 🛠 Tecnologias
- Python
- FastAPI
- Pytest
- Integrado com GitHub Actions
- Ruff

## ℹ️ Informações Adicionais
Versão Atual: 1.0.0

Autor: Arthur Santana Ruffino Gonçalves

Repositório: https://github.com/santanasx/med-control-cli.git

## ▶️ Como executar

```bash
Passo 1 - Garantir que possui o Python 3.11 ou superior instalado em sua máquina.

Passo 2 - Abrir o terminal e clonar o repositório 
git clone [https://github.com/santanasx/med-control-cli.git](https://github.com/santanasx/med-control-cli.git)
cd med-control-cli

Passo 3 - Criar um ambiente virtual e instalar dependências:
python -m venv venv
venv\Scripts\activate  # No Linux/Mac use: source venv/bin/activate
pip install -r requirements.txt

Passo 4 - Rodar a aplicação
uvicorn app.main:app --reload
