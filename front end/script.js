const API_URL = 'http://192.168.1.14:8000/medicamentos';
let medications = [];
let pendingRemoveId = null;

// ── Elementos ───────────────────────────────
const btnAdd       = document.getElementById('btn-add');
const inputName    = document.getElementById('med-name');
const inputDose    = document.getElementById('med-dose');
const inputTime    = document.getElementById('med-time');
const inputNotes   = document.getElementById('med-notes');
const errorMsg     = document.getElementById('error-msg');

const medList      = document.getElementById('med-list');
const emptyState   = document.getElementById('empty-state');
const countBadge   = document.getElementById('count-badge');
const searchInput  = document.getElementById('search');

const modalOverlay = document.getElementById('modal-overlay');
const modalMsg     = document.getElementById('modal-msg');
const btnCancel    = document.getElementById('btn-cancel');
const btnConfirm   = document.getElementById('btn-confirm');
const toastEl      = document.getElementById('toast');

// ── Integração com a API ────────────────────
async function loadMedications() {
  try {
    const response = await fetch(API_URL);
    if (response.ok) {
      medications = await response.json();
      renderList(searchInput.value);
    }
  } catch (error) {
    showError('Erro ao conectar com o servidor.');
  }
}

// ── Utilitários ─────────────────────────────
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function showToast(msg, color = '#1a4a3a') {
  toastEl.textContent = msg;
  toastEl.style.background = color;
  toastEl.classList.add('show');
  setTimeout(() => toastEl.classList.remove('show'), 2800);
}

function showError(msg) {
  errorMsg.textContent = msg;
  setTimeout(() => (errorMsg.textContent = ''), 3000);
}

function formatTime(t) {
  if (!t) return '--:--';
  const [h, m] = t.split(':');
  return `${h}h${m}`;
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Renderização ────────────────────────────
function renderList(filter = '') {
  const term = filter.trim().toLowerCase();
  const filtered = term
    ? medications.filter(m =>
        m.name.toLowerCase().includes(term) ||
        m.dose.toLowerCase().includes(term)
      )
    : medications;

  // Ordenar por horário
  const sorted = [...filtered].sort((a, b) => a.time.localeCompare(b.time));

  medList.innerHTML = '';

  if (filtered.length === 0) {
    emptyState.classList.add('visible');
  } else {
    emptyState.classList.remove('visible');
    sorted.forEach(med => {
      const li = createMedItem(med);
      medList.appendChild(li);
    });
  }

  countBadge.textContent = medications.length;

  // Animação do badge
  countBadge.style.transform = 'scale(1.35)';
  setTimeout(() => (countBadge.style.transform = 'scale(1)'), 200);
}

function createMedItem(med) {
  const li = document.createElement('li');
  li.dataset.id = med.id; 
  li.className = 'med-item';
  
  li.innerHTML = `
    <div class="item-info">
      <div class="item-name">${escapeHtml(med.name)}</div>
      <div class="item-dose">${escapeHtml(med.dose)}</div>
      ${med.notes ? `<div class="item-notes">📝 ${escapeHtml(med.notes)}</div>` : ''}
    </div>
    <div class="item-time-badge">${formatTime(med.time)}</div>
    <button class="btn-remove" onclick="openModal('${med.id}', '${escapeHtml(med.name)}')">✖</button>
  `;
  return li;
}

// ── Adicionar ────────────────────────────────
async function addMedication() {
  const name  = inputName.value.trim();
  const dose  = inputDose.value.trim();
  const time  = inputTime.value;
  const notes = inputNotes.value.trim();

  if (!name) return showError('⚠ Informe o nome do medicamento.');
  if (!dose) return showError('⚠ Informe a dosagem.');
  if (!time) return showError('⚠ Selecione o horário.');

  const med = { id: generateId(), name, dose, time, notes };

  try {
    // Envia os dados para a API (Back End)
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(med)
    });

    if (response.ok) {
      const novoMed = await response.json();
      medications.push(novoMed);
      renderList(searchInput.value);

      // Limpar campos
      inputName.value  = '';
      inputDose.value  = '';
      inputTime.value  = '';
      inputNotes.value = '';
      inputName.focus();

      showToast(`✓ ${name} adicionado com sucesso!`);
    } else {
      showError('Erro ao salvar no banco de dados.');
    }
  } catch (error) {
    showError('Erro de conexão com o servidor.');
  }
}

// ── Remover ──────────────────────────────────
function openModal(id, name) {
  pendingRemoveId = id;
  modalMsg.textContent = `Deseja remover "${name}" da lista?`;
  modalOverlay.classList.add('active');
}

function closeModal() {
  pendingRemoveId = null;
  modalOverlay.classList.remove('active');
}

async function confirmRemove() {
  if (!pendingRemoveId) return;

  const idToRemove = pendingRemoveId; 
  const med = medications.find(m => m.id === idToRemove);
  const li = medList.querySelector(`[data-id="${idToRemove}"]`);

  try {
    // Avisa a API para deletar do banco de dados
    const response = await fetch(`${API_URL}/${idToRemove}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      if (li) {
        li.classList.add('removing');
        setTimeout(() => {
          medications = medications.filter(m => m.id !== idToRemove);
          renderList(searchInput.value);
        }, 280);
      } else {
        medications = medications.filter(m => m.id !== idToRemove);
        renderList(searchInput.value);
      }
      closeModal();
      showToast(`🗑 ${med ? med.name : 'Medicamento'} removido.`, '#c0392b');
    }
  } catch (error) {
    showError('Erro ao deletar no servidor.');
    closeModal();
  }
}

// ── Eventos ──────────────────────────────────
btnAdd.addEventListener('click', addMedication);

[inputName, inputDose, inputTime, inputNotes].forEach(el => {
  el.addEventListener('keydown', e => {
    if (e.key === 'Enter') addMedication();
  });
});

searchInput.addEventListener('input', () => renderList(searchInput.value));
btnCancel.addEventListener('click', closeModal);
btnConfirm.addEventListener('click', confirmRemove);

modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) closeModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// ── Init ────────────────────────────────────
// Carrega a lista do banco de dados ao abrir a página
loadMedications();