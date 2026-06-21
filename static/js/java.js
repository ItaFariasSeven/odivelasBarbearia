let indiceAtual = 0

function abrirModal() {
  const modal = document.getElementById("modalAvaliacao")

  modal.classList.remove("hidden")
  modal.classList.add("flex")
}

function fecharModal() {
  const modal = document.getElementById("modalAvaliacao")

  modal.classList.remove("flex")
  modal.classList.add("hidden")
}

function avaliar(nota) {
  const estrelas = document.querySelectorAll(".estrela")

  estrelas.forEach((estrela, index) => {
    if (index < nota) {
      estrela.classList.remove("text-zinc-700")
      estrela.classList.add("text-yellow-500")
    } else {
      estrela.classList.remove("text-yellow-500")
      estrela.classList.add("text-zinc-700")
    }
  })
}

function pegarAvaliacoes() {
  return typeof avaliacoesDoBanco !== 'undefined' ? avaliacoesDoBanco : [];
}


async function enviarAvaliacao(event) {
  event.preventDefault();

  const formulario = event.target; 
  
  const urlDoDjango = formulario.action; 

  const nomeInput = document.getElementById("nomeCliente");
  const comentarioInput = document.getElementById("comentarioCliente");
  
  const nome = nomeInput.value.trim();
  const comentario = comentarioInput.value.trim();
  const nota = document.querySelectorAll(".estrela.text-yellow-500").length;

  const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

  if (nome === "" || comentario === "" || nota === 0) {
    alert("Preencha todos os campos!");
    return;
  }

  try {
    const resposta = await fetch(urlDoDjango, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken 
      },
      body: JSON.stringify({
        nome: nome,
        nota: nota,
        comentario: comentario
      })
    });

    if (resposta.ok) {
      alert("Avaliação enviada com sucesso!");
      nomeInput.value = "";
      comentarioInput.value = "";
      fecharModal();
      window.location.reload();
    } else {
      alert("Erro ao salvar avaliação no servidor.");
    }

  } catch (erro) {
    console.error("Erro na comunicação com o banco:", erro);
  }
}

function mostrarAvaliacoesNoModal() {
  const lista = document.getElementById("listaAvaliacoes")

  if (!lista) return

  const avaliacoes = pegarAvaliacoes()

  lista.innerHTML = ""

  if (avaliacoes.length === 0) {
    lista.innerHTML = `
      <div class="bg-black border border-zinc-800 rounded-xl p-4">
        <p class="text-zinc-400 text-sm">
          Nenhuma avaliação ainda.
        </p>
      </div>
    `

    return
  }

  avaliacoes.forEach((avaliacao) => {
    const card = document.createElement("div")

    card.className =
      "bg-black border border-zinc-800 border-l-4 border-red-600 rounded-xl p-4"

    card.innerHTML = `
      <div class="flex items-center justify-between mb-2">
        <h4 class="text-white font-bold uppercase">
          ${avaliacao.nome}
        </h4>

        <span class="text-yellow-500 text-lg">
          ${"★".repeat(avaliacao.nota)}${"☆".repeat(5 - avaliacao.nota)}
        </span>
      </div>

      <p class="text-zinc-400 text-sm leading-relaxed">
        ${avaliacao.comentario}
      </p>
    `

    lista.appendChild(card)
  })
}

function atualizarCarrossel() {
  const avaliacoes = pegarAvaliacoes()

  const nome = document.getElementById("carouselNome")
  const comentario = document.getElementById("carouselComentario")
  const estrelas = document.getElementById("carouselEstrelas")

  if (!nome || !comentario || !estrelas) return

  if (avaliacoes.length === 0) {
    nome.textContent = "Nenhuma avaliação ainda"
    comentario.textContent = "Seja o primeiro cliente a avaliar a Odivelas Barbearia."
    estrelas.textContent = "☆☆☆☆☆"

    atualizarIndicadores()
    return
  }

  if (indiceAtual >= avaliacoes.length) {
    indiceAtual = 0
  }

  const avaliacao = avaliacoes[indiceAtual]

  nome.textContent = avaliacao.nome
  comentario.textContent = avaliacao.comentario
  estrelas.textContent =
    "★".repeat(avaliacao.nota) + "☆".repeat(5 - avaliacao.nota)

  atualizarIndicadores()
}

function atualizarIndicadores() {
  const container = document.getElementById("carouselIndicadores")

  if (!container) return

  const avaliacoes = pegarAvaliacoes()

  container.innerHTML = ""

  if (avaliacoes.length === 0) {
    const dot = document.createElement("div")
    dot.className = "w-6 h-2 bg-red-600 rounded-full"
    container.appendChild(dot)
    return
  }

  avaliacoes.forEach((_, index) => {
    const dot = document.createElement("button")

    dot.onclick = () => {
      indiceAtual = index
      atualizarCarrossel()
    }

    dot.className =
      index === indiceAtual
        ? "w-6 h-2 bg-red-600 rounded-full transition-all duration-300"
        : "w-2 h-2 bg-zinc-700 rounded-full transition-all duration-300"

    container.appendChild(dot)
  })
}

function proximaAvaliacao() {
  const avaliacoes = pegarAvaliacoes()

  if (avaliacoes.length === 0) return

  indiceAtual++

  if (indiceAtual >= avaliacoes.length) {
    indiceAtual = 0
  }

  atualizarCarrossel()
}

function voltarAvaliacao() {
  const avaliacoes = pegarAvaliacoes()

  if (avaliacoes.length === 0) return

  indiceAtual--

  if (indiceAtual < 0) {
    indiceAtual = avaliacoes.length - 1
  }

  atualizarCarrossel()
}

setInterval(() => {
  proximaAvaliacao()
}, 5000)

document.addEventListener("DOMContentLoaded", () => {
  atualizarCarrossel()
  mostrarAvaliacoesNoModal()
})