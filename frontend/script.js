const API_URL = "https://med-control-cli.onrender.com/pacientes";

// Função para listar os medicamentos
async function carregarMedicamentos() {
    try {
        const response = await fetch(API_URL);
        if (response.ok) {
            const medicamentos = await response.json();
            const lista = document.getElementById('lista-medicamentos');
            if (lista) {
                lista.innerHTML = medicamentos.map(med => `
                    <div class="medicamento-item" style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; border-radius: 8px;">
                        <strong>💊 ${med.nome}</strong> - ${med.dosagem}<br>
                        <small>⏰ Horário: ${med.horario}</small><br>
                        <p>📝 ${med.descricao || 'Sem observações'}</p>
                    </div>
                `).join('');
            }
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
            
            // Pega o botão para dar feedback visual
            const botao = form.querySelector('button');
            const textoOriginal = botao.innerHTML;
            
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
                    alert("✅ Medicamento salvo!");
                    form.reset();
                    await carregarMedicamentos();
                } else {
                    alert("❌ Erro no servidor. Verifique os campos.");
                }
            } catch (error) {
                alert("❌ Erro de conexão com o servidor.");
            } finally {
                // Reativa o botão independente de dar certo ou errado
                botao.disabled = false;
                botao.innerHTML = textoOriginal;
            }
        });
    }
    
    carregarMedicamentos();
});