const API_URL = "https://med-control-cli.onrender.com/pacientes";

async function carregarMedicamentos() {
    const lista = document.getElementById('lista-medicamentos');
    const contador = document.getElementById('contador-meds');
    
    try {
        const response = await fetch(API_URL);
        const medicamentos = await response.json();
        
        contador.innerText = medicamentos.length;
        
        if (medicamentos.length === 0) {
            lista.innerHTML = '<p class="empty-state">Nenhum medicamento cadastrado.</p>';
            return;
        }

        lista.innerHTML = medicamentos.map(med => `
            <div class="medicamento-item">
                <div>
                    <strong style="color: #2d5a4c;">${med.nome}</strong> 
                    <span style="color: #666; font-size: 0.9rem;">(${med.dosagem})</span><br>
                    <small>⏰ ${med.horario}</small>
                </div>
                <button class="btn-delete" onclick="remover(${med.id})">✕</button>
            </div>
        `).join('');
    } catch (e) { console.error(e); }
}

async function remover(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    carregarMedicamentos();
}

document.getElementById('form-medicamento').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-submit');
    btn.innerHTML = "Salvando...";

    const dados = {
        nome: document.getElementById('nome').value,
        dosagem: document.getElementById('dosagem').value,
        horario: document.getElementById('horario').value,
        descricao: document.getElementById('observacoes').value
    };

    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });

    document.getElementById('form-medicamento').reset();
    btn.innerHTML = "+ Adicionar";
    carregarMedicamentos();
});

carregarMedicamentos();