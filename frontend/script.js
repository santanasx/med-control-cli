// ============================================================
//  MedControl — script.js (autenticação JWT)
// ============================================================

const API_URL = "https://med-control-cli.onrender.com";
let idParaRemover = null;
let todosMedicamentos = [];
const modal = document.getElementById('modal-confirmacao');

// ------------------------------------------------------------
//  HELPERS DE TOKEN
// ------------------------------------------------------------

function getToken() {
    return localStorage.getItem('medcontrol_token');
}

function setToken(token) {
    localStorage.setItem('medcontrol_token', token);
}

function getEmail() {
    return localStorage.getItem('medcontrol_email');
}

function setEmail(email) {
    localStorage.setItem('medcontrol_email', email);
}

// Monta o cabeçalho com o token JWT para todas as requisições autenticadas
function authHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    };
}

// ------------------------------------------------------------
//  TELAS: ABAS LOGIN / CADASTRO
// ------------------------------------------------------------

function mostrarAba(aba) {
    const isLogin = aba === 'login';
    document.getElementById('form-login').style.display    = isLogin ? 'block' : 'none';
    document.getElementById('form-cadastro').style.display = isLogin ? 'none'  : 'block';
    document.getElementById('tab-login').classList.toggle('active', isLogin);
    document.getElementById('tab-cadastro').classList.toggle('active', !isLogin);
    document.getElementById('erro-login').style.display    = 'none';
    document.getElementById('erro-cadastro').style.display = 'none';
    document.getElementById('sucesso-cadastro').style.display = 'none';
}

// Pressionar Enter nos campos de login
document.getElementById('login-senha').addEventListener('keydown', e => {
    if (e.key === 'Enter') entrar();
});

// ------------------------------------------------------------
//  CADASTRO
// ------------------------------------------------------------

async function cadastrar() {
    const nome  = document.getElementById('cad-nome').value.trim();
    const email = document.getElementById('cad-email').value.trim();
    const senha = document.getElementById('cad-senha').value;
    const erro  = document.getElementById('erro-cadastro');
    const ok    = document.getElementById('sucesso-cadastro');
    const btn   = document.getElementById('btn-cadastrar');

    erro.style.display = 'none';
    ok.style.display   = 'none';

    if (!email || !senha) {
        erro.textContent   = 'Preencha e-mail e senha.';
        erro.style.display = 'block';
        return;
    }
    if (senha.length < 6) {
        erro.textContent   = 'A senha deve ter pelo menos 6 caracteres.';
        erro.style.display = 'block';
        return;
    }

    btn.textContent = 'Criando conta...';
    btn.disabled    = true;

    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, password: senha })
        });

        if (res.ok) {
            ok.style.display = 'block';
            document.getElementById('cad-nome').value  = '';
            document.getElementById('cad-email').value = '';
            document.getElementById('cad-senha').value = '';
            // Leva o usuário para a aba de login após 1.5s
            setTimeout(() => mostrarAba('login'), 1500);
        } else {
            const data = await res.json();
            erro.textContent   = data.detail || 'Erro ao criar conta. Tente outro e-mail.';
            erro.style.display = 'block';
        }
    } catch (e) {
        erro.textContent   = 'Erro de conexão. Tente novamente.';
        erro.style.display = 'block';
    } finally {
        btn.textContent = 'Criar conta';
        btn.disabled    = false;
    }
}

// ------------------------------------------------------------
//  LOGIN
// ------------------------------------------------------------

async function entrar() {
    const email = document.getElementById('login-email').value.trim();
    const senha = document.getElementById('login-senha').value;
    const erro  = document.getElementById('erro-login');
    const btn   = document.getElementById('btn-entrar');

    erro.style.display = 'none';

    if (!email || !senha) {
        erro.textContent   = 'Preencha e-mail e senha.';
        erro.style.display = 'block';
        return;
    }

    btn.textContent = 'Entrando...';
    btn.disabled    = true;

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: senha })
        });

        if (res.ok) {
            const data = await res.json();
            setToken(data.access_token);
            setEmail(email);
            abrirDashboard();
        } else {
            const data = await res.json();
            erro.textContent   = data.detail || 'E-mail ou senha incorretos.';
            erro.style.display = 'block';
        }
    } catch (e) {
        erro.textContent   = 'Erro de conexão. Tente novamente.';
        erro.style.display = 'block';
    } finally {
        btn.textContent = 'Entrar';
        btn.disabled    = false;
    }
}

// ------------------------------------------------------------
//  DASHBOARD
// ------------------------------------------------------------

function abrirDashboard() {
    document.getElementById('tela-auth').style.display  = 'none';
    document.getElementById('dashboard').style.display  = 'block';
    document.getElementById('usuario-email-header').textContent = `👤 ${getEmail()}`;
    carregarMedicamentos();
}

function sair() {
    localStorage.removeItem('medcontrol_token');
    localStorage.removeItem('medcontrol_email');
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('tela-auth').style.display = 'flex';
    mostrarAba('login');
}

// ------------------------------------------------------------
//  MEDICAMENTOS
// ------------------------------------------------------------

async function carregarMedicamentos() {
    const lista    = document.getElementById('lista-medicamentos');
    const contador = document.getElementById('contador-meds');

    try {
        const res = await fetch(`${API_URL}/pacientes`, {
            headers: authHeaders()
        });

        // Token expirado ou inválido → manda pro login
        if (res.status === 401) { sair(); return; }

        const medicamentos = await res.json();
        todosMedicamentos  = medicamentos;
        contador.innerText = medicamentos.length;
        renderizarLista(medicamentos);
    } catch (e) {
        lista.innerHTML = '<p style="color:red; text-align:center;">Erro ao conectar com o servidor.</p>';
    }
}

function renderizarLista(medicamentos) {
    const lista = document.getElementById('lista-medicamentos');
    if (medicamentos.length === 0) {
        lista.innerHTML = '<p class="empty-state" style="text-align:center; padding:20px; color:#999;">Nenhum medicamento cadastrado.</p>';
        return;
    }
    lista.innerHTML = medicamentos.map(med => `
        <div class="medicamento-item">
            <div>
                <strong style="color:#2d5a4c; font-size:1.05rem;">${med.nome}</strong>
                <span style="color:#888;">(${med.dosagem})</span><br>
                <small style="color:#555; display:flex; align-items:center; gap:4px; margin-top:4px;">
                    ⏰ ${med.horario}
                </small>
            </div>
            <button class="btn-delete" title="Excluir" onclick="abrirModal(${med.id})">✕</button>
        </div>
    `).join('');
}

function filtrarBusca() {
    const termo    = document.getElementById('busca').value.toLowerCase();
    const filtrados = todosMedicamentos.filter(m =>
        m.nome.toLowerCase().includes(termo) ||
        m.dosagem.toLowerCase().includes(termo)
    );
    renderizarLista(filtrados);
}

// ------------------------------------------------------------
//  MODAL DE EXCLUSÃO
// ------------------------------------------------------------

function abrirModal(id) {
    idParaRemover = id;
    modal.style.display = 'flex';
}

document.getElementById('btn-cancelar-modal').onclick = () => {
    modal.style.display = 'none';
    idParaRemover = null;
};

document.getElementById('btn-confirmar-exclusao').onclick = async () => {
    if (!idParaRemover) return;
    const btn = document.getElementById('btn-confirmar-exclusao');
    btn.innerText = 'Excluindo...';
    try {
        await fetch(`${API_URL}/pacientes/${idParaRemover}`, {
            method: 'DELETE',
            headers: authHeaders()
        });
        modal.style.display = 'none';
        carregarMedicamentos();
    } catch (e) {
        alert('Erro ao excluir medicamento.');
    } finally {
        btn.innerText = 'Sim, excluir';
        idParaRemover = null;
    }
};

// ------------------------------------------------------------
//  CADASTRO DE MEDICAMENTO
// ------------------------------------------------------------

document.getElementById('form-medicamento').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-submit');
    btn.innerText = 'Salvando...';
    btn.disabled  = true;

    const dados = {
        nome:      document.getElementById('nome').value,
        dosagem:   document.getElementById('dosagem').value,
        horario:   document.getElementById('horario').value,
        descricao: document.getElementById('observacoes').value
    };

    try {
        const res = await fetch(`${API_URL}/pacientes`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(dados)
        });
        if (res.status === 401) { sair(); return; }
        if (res.ok) {
            e.target.reset();
            carregarMedicamentos();
        }
    } catch (err) {
        alert('Erro ao salvar medicamento.');
    } finally {
        btn.innerText = '+ Adicionar';
        btn.disabled  = false;
    }
});

// ------------------------------------------------------------
//  INICIALIZAÇÃO — se já tem token salvo, vai direto pro dashboard
// ------------------------------------------------------------

if (getToken()) {
    abrirDashboard();
}