const API_URL = "https://med-control-cli.onrender.com/pacientes";
let idParaRemover = null;
const modal = document.getElementById('modal-confirmacao');

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
                    <strong style="color: #2d5a4c;">${med.nome}</strong> (${med.dosagem})<br>
                    <small>⏰ ${med.horario}</small>
                </div>
                <button class="btn-delete" onclick="abrirModal(${med.id})">✕</button>
            </div>
        `).join('');
    } catch (e) { console.error("Erro ao buscar dados:", e); }
}

function abrirModal(id) {
    idParaRemover = id;
    modal.style.display = 'flex';
}

document.getElementById('btn-cancelar-modal').onclick = () => {
    modal.style.display = 'none';
    idParaRemover = null;
};

document.getElementById('btn-confirmar-exclusao').onclick = async () => {
    if (idParaRemover) {
        await fetch(`${API_URL}/${idParaRemover}`, { method: 'DELETE' });
        modal.style.display = 'none';
        carregarMedicamentos();
    }
};

document.getElementById('form-medicamento').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-submit');
    btn.innerText = "Salvando...";

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

    e.target.reset();
    btn.innerText = "+ Adicionar";
    carregarMedicamentos();
});

carregarMedicamentos();