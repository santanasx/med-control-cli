const API_URL = "https://med-control-cli.onrender.com/pacientes";

// Função para buscar e mostrar os medicamentos na tela
async function carregarMedicamentos() {
    try {
        const response = await fetch(API_URL);
        if (response.ok) {
            const medicamentos = await response.json();
            const lista = document.getElementById('lista-medicamentos');
            
            if (medicamentos.length === 0) {
                lista.innerHTML = '<p style="text-align:center; color: #888;">Nenhum medicamento cadastrado.</p>';
                return;
            }

            lista.innerHTML = medicamentos.map(med => `
                <div class="medicamento-item">
                    <strong>💊 ${med.nome}</strong> - ${med.dosagem}<br>
                    <small>⏰ Horário: ${med.horario}</small>
                    <p style="margin: 5px 0 0 0; font-size: 0.9rem; color: #666;">
                        ${med.descricao || 'Sem observações'}
                    </p>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error("Erro ao carregar lista:", error);
    }
}

// Configuração do Formulário
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-medicamento');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Feedback visual no botão
            const botao = form.querySelector('button');
            botao.disabled = true;
            botao.innerHTML = "Salvando...";

            const novoMed = {
                nome: document.getElementById('nome').value,
                dosagem: document.getElementById('dosagem').value,
                horario: document.getElementById('horario').value,
                descricao: document.getElementById('observacoes').value
            };

            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(novoMed)
                });

                if (response.ok) {
                    form.reset(); // Limpa os campos
                    await carregarMedicamentos(); // Atualiza a lista na hora
                } else {
                    alert("Erro ao salvar no servidor. Verifique o banco de dados.");
                }
            } catch (error) {
                console.error("Erro de conexão:", error);
            } finally {
                botao.disabled = false;
                botao.innerHTML = "+ Adicionar";
            }
        });
    }
    
    // Carrega a lista assim que abrir o site
    carregarMedicamentos();
});