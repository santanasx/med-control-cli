/* ============================================
   MedControl — script.js
   ============================================ */

// ── Estado ──────────────────────────────────
let medications = JSON.parse(localStorage.getItem('medcontrol_meds') || '[]');
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

// ── Utilitários ─────────────────────────────
function saveData() {
  localStorage.setItem('medcontrol_meds', JSON.stringify(medications));
}

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

// ── Remover ──────────────────────────────────
function confirmRemove() {
  if (!pendingRemoveId) return;

  // 1. Salva o ID em uma variável local antes de fechar o modal
  const idToRemove = pendingRemoveId; 
  
  const med = medications.find(m => m.id === idToRemove);
  const li = medList.querySelector(`[data-id="${idToRemove}"]`);

  if (li) {
    li.classList.add('removing');
    setTimeout(() => {
      // 2. Usa a variável local no filtro, em vez da global
      medications = medications.filter(m => m.id !== idToRemove);
      saveData();
      renderList(searchInput.value);
    }, 280);
  } else {
    medications = medications.filter(m => m.id !== idToRemove);
    saveData();
    renderList(searchInput.value);
  }

  closeModal(); // Aqui o pendingRemoveId vira null, mas não afeta mais o setTimeout
  showToast(`🗑 ${med ? med.name : 'Medicamento'} removido.`, '#6b3020');
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Adicionar ────────────────────────────────
function addMedication() {
  const name  = inputName.value.trim();
  const dose  = inputDose.value.trim();
  const time  = inputTime.value;
  const notes = inputNotes.value.trim();

  if (!name) return showError('⚠ Informe o nome do medicamento.');
  if (!dose) return showError('⚠ Informe a dosagem.');
  if (!time) return showError('⚠ Selecione o horário.');

  const med = { id: generateId(), name, dose, time, notes };
  medications.push(med);
  saveData();
  renderList(searchInput.value);

  // Limpar campos
  inputName.value  = '';
  inputDose.value  = '';
  inputTime.value  = '';
  inputNotes.value = '';
  inputName.focus();

  showToast(`✓ ${name} adicionado com sucesso!`);
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



// ── Eventos ──────────────────────────────────
btnAdd.addEventListener('click', addMedication);

// Adicionar com Enter em qualquer campo
[inputName, inputDose, inputTime, inputNotes].forEach(el => {
  el.addEventListener('keydown', e => {
    if (e.key === 'Enter') addMedication();
  });
});

searchInput.addEventListener('input', () => renderList(searchInput.value));

btnCancel.addEventListener('click', closeModal);
btnConfirm.addEventListener('click', confirmRemove);

// Fechar modal clicando no overlay
modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) closeModal();
});

// Fechar modal com Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// ── Init ────────────────────────────────────
renderList();

function createMedItem(med) {
  const li = document.createElement('li');
  // Adiciona o data-id para a função de remover conseguir encontrar o elemento
  li.dataset.id = med.id; 
  
  // Cria o conteúdo do item da lista
  li.innerHTML = `
    <div class="med-details">
      <strong>${escapeHtml(med.name)}</strong> - ${escapeHtml(med.dose)}
      <br>
      <span>⏰ ${formatTime(med.time)}</span>
      ${med.notes ? `<br><small>📝 ${escapeHtml(med.notes)}</small>` : ''}
    </div>
    <button class="btn-remove" onclick="openModal('${med.id}', '${escapeHtml(med.name)}')">Remover</button>
  `;
  
  return li;
}