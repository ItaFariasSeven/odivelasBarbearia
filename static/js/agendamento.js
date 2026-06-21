const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const TODOS_HORARIOS = [
    "08:30", "09:00", "09:30", "10:00", "10:30", "11:30",
    "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
];

let estadoAgendamento = {
    barbeiroNome: "",
    servicoNome: "",
    servicoValor: 0,
    dataBanco: "",
    horario: ""
};

document.addEventListener("DOMContentLoaded", () => {
    gerarCartoesDeData();
});

function gerarCartoesDeData() {
    const container = document.getElementById("listaData");
    container.innerHTML = ""; 
    
    const hoje = new Date();

    for (let i = 0; i < 7; i++) {
        const dataAlvo = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + i);

        const diaSemana = DIAS_SEMANA[dataAlvo.getDay()];
        const dia = String(dataAlvo.getDate()).padStart(2, '0');
        const mes = String(dataAlvo.getMonth() + 1).padStart(2, '0');
        const ano = dataAlvo.getFullYear();

        const dataFormatadaBanco = `${ano}-${mes}-${dia}`;
        const dataExibicao = `${dia}/${mes}`;

        const chipDiv = document.createElement('div');
        
        chipDiv.className = "flex flex-col items-center justify-center min-w-[70px] p-3 rounded-xl border border-zinc-700 bg-zinc-900 cursor-pointer hover:border-red-600 hover:bg-zinc-800 transition-all";
        
        chipDiv.innerHTML = `
            <span class="text-xs text-zinc-400 uppercase tracking-widest mb-1 dia-texto">${diaSemana}</span>
            <span class="text-lg font-bold text-white num-texto">${dataExibicao}</span>
        `;

        chipDiv.addEventListener('click', () => {
            selecionarData(chipDiv, dataFormatadaBanco);
        });

        container.appendChild(chipDiv);
    }
}

function selecionarData(elementoClicado, dataBanco) {
    const todosCartoes = document.querySelectorAll('#listaData > div');
    todosCartoes.forEach(cartao => {
        cartao.classList.remove('border-red-600', 'bg-red-900/20');
        cartao.classList.add('border-zinc-700', 'bg-zinc-900');
    });

    elementoClicado.classList.remove('border-zinc-700', 'bg-zinc-900');
    elementoClicado.classList.add('border-red-600', 'bg-red-900/20');

    estadoAgendamento.dataBanco = dataBanco;
    estadoAgendamento.horario = ""; 
    
    gerarHorarios(dataBanco);
    atualizarResumo(); 
}

async function gerarHorarios(dataSelecionada) {
    const container = document.getElementById("listaHorarios");
    const aviso = document.getElementById("avisoData");

    if (aviso) aviso.style.display = "none";
    
    container.innerHTML = "<p class='text-zinc-500 text-sm'>Carregando horários...</p>";

    try {
        const barbeiroId = estadoAgendamento.barbeiroId || 1;
        
        const resposta = await fetch(`/api/horarios-ocupados/?data=${dataSelecionada}&barbeiro_id=${barbeiroId}`);
        const dados = await resposta.json();
        
        const horariosOcupados = dados.ocupados || [];

        container.innerHTML = ""; 

        TODOS_HORARIOS.forEach(horario => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.textContent = horario;

            if (horariosOcupados.includes(horario)) {
                btn.className = "p-3 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-600 cursor-not-allowed line-through";
                btn.disabled = true; 
            } else {
                btn.className = "horario-btn p-3 rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-red-600 hover:text-white transition-all";
                
                btn.addEventListener('click', () => {
                    selecionarHorario(btn, horario);
                });
            }

            container.appendChild(btn);
        });
        
    } catch (erro) {
        console.error("Erro ao carregar horários:", erro);
        container.innerHTML = "<p class='text-red-500 text-sm'>Erro ao carregar os horários. Tente novamente.</p>";
    }
}

function selecionarHorario(elementoClicado, horarioEscolhido) {
    const todosBotoes = document.querySelectorAll('.horario-btn');
    todosBotoes.forEach(btn => {
        btn.classList.remove('border-red-600', 'text-white', 'bg-red-900/20');
        btn.classList.add('border-zinc-700', 'text-zinc-300', 'bg-zinc-900');
    });

    elementoClicado.classList.remove('border-zinc-700', 'text-zinc-300', 'bg-zinc-900');
    elementoClicado.classList.add('border-red-600', 'text-white', 'bg-red-900/20');

    estadoAgendamento.horario = horarioEscolhido;
    atualizarResumo(); 
}

function selecionarBarbeiro(botao, nome, id) {
    document.querySelectorAll('.barbeiro-btn').forEach(btn => {
        btn.classList.remove('border-red-600');
        btn.classList.add('border-zinc-700');
    });
    botao.classList.remove('border-zinc-700');
    botao.classList.add('border-red-600');

    estadoAgendamento.barbeiroNome = nome;
    estadoAgendamento.barbeiroId = id; 
    atualizarResumo();
}

function selecionarServico(botao) {
    document.querySelectorAll('.servico-btn').forEach(btn => {
        btn.classList.remove('border-red-600');
        btn.classList.add('border-zinc-700');
    });
    
    botao.classList.remove('border-zinc-700');
    botao.classList.add('border-red-600');

    estadoAgendamento.servicoNome = botao.getAttribute('data-nome');
    estadoAgendamento.servicoValor = botao.getAttribute('data-preco');
    estadoAgendamento.servicoId = botao.getAttribute('data-id'); 

    atualizarResumo();
}

function atualizarResumo() {
    const divResumo = document.getElementById("resumo");
    
    const tudoPreenchido = estadoAgendamento.barbeiroNome !== "" && 
                           estadoAgendamento.servicoNome !== "" && 
                           estadoAgendamento.dataBanco !== "" && 
                           estadoAgendamento.horario !== "";

    if (tudoPreenchido) {
        divResumo.classList.remove("hidden");
        
        document.getElementById("resumoBarbeiro").textContent = estadoAgendamento.barbeiroNome;
        document.getElementById("resumoServico").textContent = estadoAgendamento.servicoNome;
        
        const [ano, mes, dia] = estadoAgendamento.dataBanco.split('-');
        document.getElementById("resumoData").textContent = `${dia}/${mes}/${ano}`;
        document.getElementById("resumoHorario").textContent = estadoAgendamento.horario;
        
        document.getElementById("resumoValor").textContent = `R$ ${estadoAgendamento.servicoValor}`;
    } else {
        divResumo.classList.add("hidden");
    }
}

async function confirmarAgendamento() {
    const nomeCliente = document.getElementById("nomeCliente").value.trim();
    const emailCliente = document.getElementById("email").value.trim();

    if (!nomeCliente) { alert("Digite seu nome!"); return; }
    if (!emailCliente) { alert("Digite seu e-mail!"); return; }
    if (!estadoAgendamento.barbeiroNome) { alert("Selecione um barbeiro!"); return; }
    if (!estadoAgendamento.servicoNome)  { alert("Selecione um serviço!"); return; }
    if (!estadoAgendamento.dataBanco)    { alert("Selecione uma data!"); return; }
    if (!estadoAgendamento.horario)      { alert("Selecione um horário!"); return; }

    const btn = document.getElementById("btnConfirmar");
    const textoOriginal = btn.innerHTML;
    btn.innerHTML = "Processando Reserva...";
    btn.disabled = true;

    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    try {
        const resposta = await fetch('/api/processar-agendamento/', {            
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify({
                nomeCliente: nomeCliente,       
                emailCliente: emailCliente,     
                data: estadoAgendamento.dataBanco,
                horario: estadoAgendamento.horario,
                barbeiroId: estadoAgendamento.barbeiroId, 
                servicoId: estadoAgendamento.servicoId    
            })
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
            document.getElementById("modalNome").textContent = nomeCliente;
            document.getElementById("modalBarbeiro").textContent = estadoAgendamento.barbeiroNome;
            document.getElementById("modalServico").textContent = estadoAgendamento.servicoNome;
            
            const [ano, mes, dia] = estadoAgendamento.dataBanco.split('-');
            document.getElementById("modalData").textContent = `${dia}/${mes}/${ano}`;
            
            document.getElementById("modalHorario").textContent = estadoAgendamento.horario;
            document.getElementById("modalValor").textContent = `R$ ${estadoAgendamento.servicoValor}`;

            const modal = document.getElementById("modalConfirmacao");
            modal.classList.remove("hidden");
            modal.classList.add("flex");
        } else {
            alert("Erro: " + resultado.mensagem);
            btn.innerHTML = textoOriginal;
            btn.disabled = false;
        }

    } catch (erro) {
        console.error("Erro na comunicação:", erro);
        alert("Ocorreu um erro ao tentar conectar com o servidor.");
        btn.innerHTML = textoOriginal;
        btn.disabled = false;
    }
}

function fecharConfirmacao() {
    const confirmacao = document.getElementById('modalConfirmacao');
    
    confirmacao.classList.remove('flex');
    confirmacao.classList.add('hidden');
    
    window.location.reload();
}