const API_URL = "https://med-control-cli.onrender.com/pacientes";

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
                    <div>
                        <strong>💊 ${med.nome}</strong> - ${med.dosagem}<br>
                        <small>⏰ Horário: ${med.horario}</small>
                        <p style="margin: 5px 0 0 0; font-size: 0.85rem; color: #666;">${med.descricao || ''}</p>
                    </div>
                    <button class="btn-delete" onclick="removerMedicamento(${med.id})">🗑️</button>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error("Erro ao carregar:", error);
    }
}

// FUNÇÃO PARA REMOVER
async function removerMedicamento(id) {
    if (confirm("Deseja realmente excluir este medicamento?")) {
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (response.ok) {
                carregarMedicamentos(); // Atualiza a lista
            } else {
                alert("Erro ao excluir.");
            }
        } catch (error) {
            console.error("Erro de conexão:", error);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-medicamento');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            btn.disabled = true;
            btn.innerHTML = "Salvando...";

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
                    form.reset();
                    await carregarMedicamentos();
                }
            } finally {
                btn.disabled = false;
                btn.innerHTML = "+ Adicionar";
            }
        });
    }
    carregarMedicamentos();
});