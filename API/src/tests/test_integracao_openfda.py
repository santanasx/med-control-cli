"""
Testes de Integração — OpenFDA API
Valida que a aplicação consegue se comunicar corretamente com a API pública.
"""

import pytest
import requests
from unittest.mock import patch, MagicMock
from src.openfda_service import buscar_info_medicamento, formatar_info


# ──────────────────────────────────────────────
# Fixtures
# ──────────────────────────────────────────────

MOCK_FDA_RESPONSE = {
    "results": [
        {
            "openfda": {
                "brand_name": ["Advil"],
                "generic_name": ["IBUPROFEN"],
                "manufacturer_name": ["Pfizer Consumer Healthcare"],
            },
            "indications_and_usage": [
                "Temporarily relieves minor aches and pains due to: headache, toothache, back pain."
            ],
            "warnings": [
                "Allergy alert: Ibuprofen may cause a severe allergic reaction, especially in people allergic to aspirin."
            ],
        }
    ]
}

MOCK_FDA_NOT_FOUND = {"error": {"code": "NOT_FOUND", "message": "No matches found!"}}


# ──────────────────────────────────────────────
# Testes de Integração com Mock (sem rede real)
# ──────────────────────────────────────────────

class TestBuscarInfoMedicamentoMock:
    """Testa o serviço OpenFDA com respostas simuladas (mock)."""

    def test_medicamento_encontrado_retorna_dados_corretos(self):
        """Deve retornar dados estruturados quando o medicamento é encontrado."""
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = MOCK_FDA_RESPONSE
        mock_response.raise_for_status = MagicMock()

        with patch("requests.get", return_value=mock_response):
            resultado = buscar_info_medicamento("ibuprofen")

        assert resultado["encontrado"] is True
        assert resultado["nome_marca"] == "Advil"
        assert resultado["nome_generico"] == "IBUPROFEN"
        assert resultado["fabricante"] == "Pfizer Consumer Healthcare"
        assert "indicacoes" in resultado
        assert "advertencias" in resultado

    def test_medicamento_nao_encontrado_retorna_mensagem(self):
        """Deve retornar 'encontrado: False' quando API retorna 404."""
        mock_response = MagicMock()
        mock_response.status_code = 404
        mock_response.raise_for_status.side_effect = requests.exceptions.HTTPError(
            response=mock_response
        )

        with patch("requests.get", return_value=mock_response):
            resultado = buscar_info_medicamento("medicamentoXYZinexistente")

        assert resultado["encontrado"] is False
        assert "mensagem" in resultado

    def test_erro_de_conexao_retorna_mensagem_amigavel(self):
        """Deve tratar falha de rede com mensagem amigável."""
        with patch("requests.get", side_effect=requests.exceptions.ConnectionError):
            resultado = buscar_info_medicamento("ibuprofen")

        assert resultado["encontrado"] is False
        assert "conexão" in resultado["mensagem"].lower()

    def test_timeout_retorna_mensagem_amigavel(self):
        """Deve tratar timeout com mensagem amigável."""
        with patch("requests.get", side_effect=requests.exceptions.Timeout):
            resultado = buscar_info_medicamento("ibuprofen")

        assert resultado["encontrado"] is False
        assert "demorou" in resultado["mensagem"].lower()

    def test_resposta_sem_resultados_retorna_nao_encontrado(self):
        """Deve retornar 'encontrado: False' quando API retorna lista vazia."""
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"results": []}
        mock_response.raise_for_status = MagicMock()

        with patch("requests.get", return_value=mock_response):
            resultado = buscar_info_medicamento("abcxyz")

        assert resultado["encontrado"] is False


# ──────────────────────────────────────────────
# Testes de formatação
# ──────────────────────────────────────────────

class TestFormatarInfo:
    """Testa a formatação da saída das informações."""

    def test_formata_medicamento_encontrado(self):
        info = {
            "encontrado": True,
            "nome_marca": "Advil",
            "nome_generico": "IBUPROFEN",
            "fabricante": "Pfizer",
            "indicacoes": "Alivia dores leves.",
            "advertencias": "Não usar com outros AINEs.",
        }
        saida = formatar_info(info)
        assert "Advil" in saida
        assert "IBUPROFEN" in saida
        assert "Pfizer" in saida

    def test_formata_medicamento_nao_encontrado(self):
        info = {"encontrado": False, "mensagem": "Medicamento não encontrado."}
        saida = formatar_info(info)
        assert "Medicamento não encontrado." in saida


# ──────────────────────────────────────────────
# Teste de Integração Real (opcional — usa rede)
# Executar apenas com: pytest -m real_api
# ──────────────────────────────────────────────

@pytest.mark.real_api
class TestIntegracaoRealOpenFDA:
    """
    Testes que fazem chamadas reais à API OpenFDA.
    Marcados com @pytest.mark.real_api para não rodar no CI por padrão.
    Execute localmente com: pytest -m real_api
    """

    def test_api_retorna_status_200_para_ibuprofeno(self):
        """A API pública deve estar acessível e retornar dados para 'ibuprofen'."""
        response = requests.get(
            "https://api.fda.gov/drug/label.json",
            params={"search": 'openfda.generic_name:"ibuprofen"', "limit": 1},
            timeout=10,
        )
        assert response.status_code == 200
        data = response.json()
        assert "results" in data
        assert len(data["results"]) > 0

    def test_buscar_ibuprofeno_retorna_dados_validos(self):
        """Integração completa: função deve retornar dados reais da API."""
        resultado = buscar_info_medicamento("ibuprofen")
        assert resultado["encontrado"] is True
        assert resultado["nome_generico"] != "N/A"