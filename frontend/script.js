alert("O JavaScript carregou com sucesso!");

const API_URL = "https://med-control-cli.onrender.com/pacientes";

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM carregado. Procurando o formulário...");
    const form = document.getElementById('form-medicamento');
    
    if (form) {
        console.log("Formulário encontrado!");
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            alert("Você clicou no botão! Tentando salvar...");
            
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
                    alert("Salvo no banco!");
                    location.reload(); 
                } else {
                    alert("Erro no servidor.");
                }
            } catch (error) {
                alert("Erro de conexão.");
            }
        });
    } else {
        alert("ERRO: O JavaScript não achou o formulário com id='form-medicamento'");
    }
});