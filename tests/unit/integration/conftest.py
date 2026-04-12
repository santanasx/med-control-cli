from app.storage import save_meds, load_meds  # Adicione o import correto aqui

def test_salvar_e_carregar():
    save_meds([{"nome": "Dipirona"}])
    data = load_meds()
    assert data["nome"] == "Dipirona"