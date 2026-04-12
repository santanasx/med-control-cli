from app import main


def test_main_executa_sem_erro(monkeypatch):
    # simula entrada do usuário se necessário
    monkeypatch.setattr("builtins.input", lambda _: "0")

    try:
        main.main()
    except SystemExit:
        pass  # esperado em CLI