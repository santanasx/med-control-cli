from src.med_control import (
    adicionar_medicamento,
    listar_medicamentos,
    marcar_como_tomado,
    remover_medicamento,
    acompanhar_tratamento,
)
from src.openfda_service import buscar_info_medicamento, formatar_info


def exibir_menu():
    print("\n" + "=" * 50)
    print("       💊 MED CONTROL - Controle de Medicamentos")
    print("=" * 50)
    print("1. Adicionar medicamento")
    print("2. Listar medicamentos")
    print("3. Marcar medicamento como tomado")
    print("4. Remover medicamento")
    print("5. Acompanhar tratamento")
    print("6. Buscar informações de um medicamento (OpenFDA)")
    print("0. Sair")
    print("=" * 50)


def menu_adicionar():
    print("\n--- Adicionar Medicamento ---")
    nome = input("Nome do medicamento: ").strip()
    dosagem = input("Dosagem (ex: 500mg): ").strip()
    horario = input("Horário (ex: 08:00): ").strip()
    descricao = input("Descrição (opcional): ").strip()
    med = adicionar_medicamento(nome, dosagem, horario, descricao)
    print(f"\n✅ Medicamento '{med['nome']}' adicionado com sucesso! (ID: {med['id']})")


def menu_listar():
    print("\n--- Lista de Medicamentos ---")
    meds = listar_medicamentos()
    if not meds:
        print("Nenhum medicamento cadastrado.")
        return
    for m in meds:
        status = "✅" if m["tomado"] else "⏳"
        print(f"{status} [{m['id']}] {m['nome']} | {m['dosagem']} | {m['horario']}")
        if m.get("descricao"):
            print(f"    📝 {m['descricao']}")


def menu_marcar():
    menu_listar()
    try:
        med_id = int(input("\nDigite o ID do medicamento tomado: "))
        if marcar_como_tomado(med_id):
            print(f"✅ Medicamento {med_id} marcado como tomado!")
        else:
            print("❌ ID não encontrado.")
    except ValueError:
        print("❌ ID inválido.")


def menu_remover():
    menu_listar()
    try:
        med_id = int(input("\nDigite o ID do medicamento a remover: "))
        if remover_medicamento(med_id):
            print(f"🗑️  Medicamento {med_id} removido.")
        else:
            print("❌ ID não encontrado.")
    except ValueError:
        print("❌ ID inválido.")


def menu_acompanhar():
    print("\n--- Acompanhamento do Tratamento ---")
    dados = acompanhar_tratamento()
    print(f"Total de medicamentos : {dados['total']}")
    print(f"Tomados               : {dados['tomados']}")
    print(f"Pendentes             : {dados['pendentes']}")
    if dados["total"] > 0:
        pct = (dados["tomados"] / dados["total"]) * 100
        print(f"Adesão ao tratamento  : {pct:.1f}%")


def menu_buscar_fda():
    print("\n--- Buscar Informações na OpenFDA ---")
    nome = input("Nome do medicamento (em inglês, ex: ibuprofen): ").strip()
    if not nome:
        print("❌ Nome não pode ser vazio.")
        return
    print("🔍 Buscando informações...")
    info = buscar_info_medicamento(nome)
    print(formatar_info(info))


def main():
    print("Bem-vindo ao Med Control!")
    while True:
        exibir_menu()
        opcao = input("Escolha uma opção: ").strip()
        if opcao == "1":
            menu_adicionar()
        elif opcao == "2":
            menu_listar()
        elif opcao == "3":
            menu_marcar()
        elif opcao == "4":
            menu_remover()
        elif opcao == "5":
            menu_acompanhar()
        elif opcao == "6":
            menu_buscar_fda()
        elif opcao == "0":
            print("\nAté logo! 💊")
            break
        else:
            print("❌ Opção inválida.")


if __name__ == "__main__":
    main()