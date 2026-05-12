import requests

OPENFDA_BASE_URL = "https://api.fda.gov/drug/label.json"


def buscar_info_medicamento(nome: str) -> dict:
    """
    Busca informações sobre um medicamento na API pública OpenFDA.
    Retorna um dicionário com informações relevantes ou mensagem de erro.
    """
    params = {
        "search": f'openfda.brand_name:"{nome}"',
        "limit": 1,
    }

    try:
        response = requests.get(OPENFDA_BASE_URL, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()

        resultados = data.get("results", [])
        if not resultados:
            # Tenta busca mais ampla pelo nome genérico
            params["search"] = f'openfda.generic_name:"{nome}"'
            response = requests.get(OPENFDA_BASE_URL, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            resultados = data.get("results", [])

        if not resultados:
            return {"encontrado": False, "mensagem": f"Nenhuma informação encontrada para '{nome}' na base da FDA."}

        resultado = resultados[0]
        openfda = resultado.get("openfda", {})

        info = {
            "encontrado": True,
            "nome_marca": openfda.get("brand_name", ["N/A"])[0] if openfda.get("brand_name") else "N/A",
            "nome_generico": openfda.get("generic_name", ["N/A"])[0] if openfda.get("generic_name") else "N/A",
            "fabricante": openfda.get("manufacturer_name", ["N/A"])[0] if openfda.get("manufacturer_name") else "N/A",
            "indicacoes": resultado.get("indications_and_usage", ["Não disponível"])[0][:300] + "..."
            if resultado.get("indications_and_usage")
            else "Não disponível",
            "advertencias": resultado.get("warnings", ["Não disponível"])[0][:300] + "..."
            if resultado.get("warnings")
            else "Não disponível",
        }
        return info

    except requests.exceptions.ConnectionError:
        return {"encontrado": False, "mensagem": "Erro de conexão. Verifique sua internet."}
    except requests.exceptions.Timeout:
        return {"encontrado": False, "mensagem": "A requisição demorou muito. Tente novamente."}
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 404:
            return {"encontrado": False, "mensagem": f"Medicamento '{nome}' não encontrado na base da FDA."}
        return {"encontrado": False, "mensagem": f"Erro na API: {e}"}
    except Exception as e:
        return {"encontrado": False, "mensagem": f"Erro inesperado: {e}"}


def formatar_info(info: dict) -> str:
    """Formata as informações do medicamento para exibição no CLI."""
    if not info.get("encontrado"):
        return f"\n⚠️  {info.get('mensagem')}\n"

    return (
        f"\n{'='*50}\n"
        f"📋 INFORMAÇÕES DO MEDICAMENTO (OpenFDA)\n"
        f"{'='*50}\n"
        f"Nome Comercial : {info['nome_marca']}\n"
        f"Nome Genérico  : {info['nome_generico']}\n"
        f"Fabricante     : {info['fabricante']}\n"
        f"\n📌 Indicações:\n{info['indicacoes']}\n"
        f"\n⚠️  Advertências:\n{info['advertencias']}\n"
        f"{'='*50}\n"
    )