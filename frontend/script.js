const API_URL = "https://med-control-cli.onrender.com/pacientes";

async function carregarMedicamentos() {
    const lista = document.getElementById('lista-medicamentos');
    try {
        const response = await fetch(API_URL);
        const medicamentos = await response.json();
        
        lista.innerHTML = medicamentos.length === 0 ? '<p>Nenhum cadastrado.</p>' : 
            medicamentos.map(med => `
                <div class="medicamento-item">
                    <div>
                        <strong>${med.nome}</strong> (${med.dosagem})<br>
                        <small>⏰ ${med.horario}</small>
                    </div>
                    <button class="btn-delete" onclick="remover(${med.id})">Excluir</button>
                </div>
            `).join('');
    } catch (e) { lista.innerHTML = '<p>Erro ao carregar.</p>'; }
}

async function remover(id) {
    if (confirm("Deseja excluir?")) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        carregarMedicamentos();
    }
}

document.getElementById('form-medicamento').addEventListener('submit', async (e) => {
    e.preventDefault();
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
        carregarMedicamentos();
    }
});

carregarMedicamentos();