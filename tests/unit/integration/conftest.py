def test_salvar_e_carregar():
    save_meds([{"nome": "Dipirona"}])
    data = load_meds()
    assert data[0]["nome"] == "Dipirona"