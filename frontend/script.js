const API_URL = "https://med-control-cli.onrender.com/pacientes";

async function carregarMedicamentos() {
    const lista = document.getElementById('lista-medicamentos');
    try {
        const response = await fetch(API_URL);
        const medicamentos = await response.json();
        
        lista.innerHTML = medicamentos.length === 0 ? '<p style="text-align:center; color:#888;">Nenhum cadastrado.</p>' : 
            medicamentos.map(med => `
                <div class="medicamento-item">
                    <div class="info">
                        <strong>💊 ${med.nome}</strong> <span>(${med.dosagem})</span><br>
                        <small>⏰ Horário: ${med.horario}</small>
                    </div>
                    <button class="btn-delete" onclick="remover(${med.id})">✕</button>
                </div>
            `).join('');
    } catch (e) { lista.innerHTML = '<p>Erro ao carregar.</p>'; }
}

// FUNÇÃO ATUALIZADA: Sem o alerta chato
async function remover(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (response.ok) {
            carregarMedicamentos(); // Atualiza a lista instantaneamente
        }
    } catch (e) {
        console.error("Erro ao remover:", e);
    }
}

document.getElementById('form-medicamento').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.disabled = true;
    btn.innerHTML = "Salvando...";

    const dados = {
        nome: document.getElementById('nome').value,
        dosagem: document.getElementById('dosagem').value,
        horario: document.getElementById('horario').value,
        descricao: document.getElementById('observacoes').value
    };

    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });

    if (res.ok) {
        document.getElementById('form-medicamento').reset();
        await carregarMedicamentos();
    }
    btn.disabled = false;
    btn.innerHTML = "+ Adicionar";
});

carregarMedicamentos();