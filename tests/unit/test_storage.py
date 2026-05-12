import os
import tempfile
from app import storage


def test_load_meds_arquivo_inexistente():
    with tempfile.TemporaryDirectory() as tmpdir:
        storage.FILE = os.path.join(tmpdir, "medications.json")

        resultado = storage.load_meds()

        assert resultado == []


def test_save_e_load_meds():
    with tempfile.TemporaryDirectory() as tmpdir:
        storage.FILE = os.path.join(tmpdir, "medications.json")

        dados = [{"nome": "Dipirona", "quantidade": 10}]
        storage.save_meds(dados)

        resultado = storage.load_meds()

        assert resultado == dados


def test_save_meds_cria_arquivo():
    with tempfile.TemporaryDirectory() as tmpdir:
        storage.FILE = os.path.join(tmpdir, "medications.json")

        storage.save_meds([{"nome": "Paracetamol"}])

        assert os.path.exists(storage.FILE)