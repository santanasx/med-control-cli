// URL da sua API no Render
const API_URL = "https://med-control-cli.onrender.com/pacientes";

// Elementos do DOM
const formMedicamento = document.getElementById('form-medicamento'); // Verifique se o ID no HTML é este
const listaMedicamentos = document.getElementById('lista-medicamentos');

// Função para listar os medicamentos (GET)
async function carregarMedicamentos() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erro ao buscar dados');
        
        const medicamentos = await response.json();
        exibirMedicamentos(medicamentos);
    } catch (error) {
        console.error("Erro:", error);
    }
}

// Função para exibir os medicamentos na tela
function exibirMedicamentos(medicamentos) {
    listaMedicamentos.innerHTML = ''; // Limpa a lista antes de carregar
    
    if (medicamentos.length === 0) {
        listaMedicamentos.innerHTML = '<p>Nenhum medicamento cadastrado.</p>';
        return;
    }

    medicamentos.forEach(med => {
        const div = document.createElement('div');
        div.className = 'medicamento-item';
        div.innerHTML = `
            <strong>${med.nome}</strong> - ${med.dosagem} (${med.horario})
            <p>${med.descricao || 'Sem observações'}</p>
            <hr>
        `;
        listaMedicamentos.appendChild(div);
    });
}

// Função para adicionar um novo medicamento (POST)
if (formMedicamento) {
    formMedicamento.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Pega os valores dos campos (Verifique se os IDs batem com seu HTML)
        const novoMed = {
            nome: document.getElementById('nome').value,
            dosagem: document.getElementById('dosagem').value,
            horario: document.getElementById('horario').value,
            descricao: document.getElementById('observacoes').value // No backend é 'descricao'
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(novoMed)
            });

            if (response.ok) {
                alert("✅ Medicamento salvo com sucesso!");
                formMedicamento.reset(); // Limpa o formulário
                carregarMedicamentos();  // Atualiza a lista
            } else {
                const erro = await response.json();
                console.error("Erro do servidor:", erro);
                alert("❌ Erro ao salvar no banco de dados.");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("❌ Não foi possível conectar ao servidor.");
        }
    });
}

// Carrega os dados assim que a página abrir
carregarMedicamentos();