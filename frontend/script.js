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
            lista.innerHTML = '<p class="empty-state" style="text-align:center; padding:20px; color:#999;">Nenhum medicamento cadastrado.</p>';
            return;
        }

        lista.innerHTML = medicamentos.map(med => `
            <div class="medicamento-item">
                <div>
                    <strong style="color: #2d5a4c; font-size: 1.05rem;">${med.nome}</strong> 
                    <span style="color: #888;">(${med.dosagem})</span><br>
                    <small style="color: #555; display: flex; align-items: center; gap: 4px; margin-top: 4px;">
                        ⏰ ${med.horario}
                    </small>
                </div>
                <button class="btn-delete" title="Excluir medicamento" onclick="abrirModal(${med.id})">✕</button>
            </div>
        `).join('');
    } catch (e) { 
        console.error("Erro ao buscar dados:", e);
        lista.innerHTML = '<p style="color:red; text-align:center;">Erro ao conectar com o servidor.</p>';
    }
}

function abrirModal(id) {
    idParaRemover = id;
    modal.style.display = 'flex';
}

// Fechar modal ao clicar em "Voltar"
document.getElementById('btn-cancelar-modal').onclick = () => {
    modal.style.display = 'none';
    idParaRemover = null;
};

// Confirmar exclusão
document.getElementById('btn-confirmar-exclusao').onclick = async () => {
    if (idParaRemover) {
        const btn = document.getElementById('btn-confirmar-exclusao');
        btn.innerText = "Excluindo...";
        
        try {
            await fetch(`${API_URL}/${idParaRemover}`, { method: 'DELETE' });
            modal.style.display = 'none';
            carregarMedicamentos();
        } catch (e) {
            alert("Erro ao excluir medicamento.");
        } finally {
            btn.innerText = "Sim, excluir";
            idParaRemover = null;
        }
    }
};

// Cadastro de Medicamento
document.getElementById('form-medicamento').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-submit');
    const textoOriginal = btn.innerText;
    btn.innerText = "Salvando...";
    btn.disabled = true;

    const dados = {
        nome: document.getElementById('nome').value,
        dosagem: document.getElementById('dosagem').value,
        horario: document.getElementById('horario').value,
        descricao: document.getElementById('observacoes').value
    };

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (res.ok) {
            e.target.reset();
            carregarMedicamentos();
        }
    } catch (e) {
        alert("Erro ao salvar medicamento.");
    } finally {
        btn.innerText = textoOriginal;
        btn.disabled = false;
    }
});

carregarMedicamentos();