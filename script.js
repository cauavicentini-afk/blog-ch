// Identificador único do post atual (caso decida criar mais posts no futuro)
const POST_ID = "post-1";

// Carregar dados iniciais ao abrir a página
document.addEventListener("DOMContentLoaded", () => {
    carregarReacoes();
    carregarComentarios();

    // Ouvinte do formulário de comentários
    document.getElementById("comment-form").addEventListener("submit", adicionarComentario);
});

// === LÓGICA DE CURTIDAS E DESCURTIDAS ===
function interagir(tipo) {
    let reacoes = JSON.parse(localStorage.getItem(`${POST_ID}-reacoes`)) || { likes: 0, dislikes: 0 };

    if (tipo === 'like') {
        reacoes.likes++;
    } else if (tipo === 'dislike') {
        reacoes.dislikes++;
    }

    // Salva no LocalStorage
    localStorage.setItem(`${POST_ID}-reacoes`, JSON.stringify(reacoes));
    
    // Atualiza a tela
    atualizarTelaReacoes(reacoes);
}

function carregarReacoes() {
    let reacoes = JSON.parse(localStorage.getItem(`${POST_ID}-reacoes`)) || { likes: 0, dislikes: 0 };
    atualizarTelaReacoes(reacoes);
}

function atualizarTelaReacoes(reacoes) {
    document.getElementById("like-count").innerText = reacoes.likes;
    document.getElementById("dislike-count").innerText = reacoes.dislikes;
}


// === LÓGICA DE COMENTÁRIOS ===
function adicionarComentario(e) {
    e.preventDefault(); // Impede a página de recarregar

    const nomeInput = document.getElementById("comment-name");
    const textoInput = document.getElementById("comment-text");

    const novoComentario = {
        id: Date.now(),
        nome: nomeInput.value,
        texto: textoInput.value,
        data: new Date().toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    // Pega os comentários existentes ou cria um array vazio
    let comentarios = JSON.parse(localStorage.getItem(`${POST_ID}-comentarios`)) || [];
    comentarios.push(novoComentario);

    // Salva de volta no LocalStorage
    localStorage.setItem(`${POST_ID}-comentarios`, JSON.stringify(comentarios));

    // Limpa os campos do formulário
    nomeInput.value = "";
    textoInput.value = "";

    // Renderiza novamente a lista
    renderizarComentarios(comentarios);
}

function carregarComentarios() {
    let comentarios = JSON.parse(localStorage.getItem(`${POST_ID}-comentarios`)) || [];
    renderizarComentarios(comentarios);
}

function renderizarComentarios(comentarios) {
    const listaComentarios = document.getElementById("comments-list");
    listaComentarios.innerHTML = ""; // Limpa a lista antes de desenhar

    if (comentarios.length === 0) {
        listaComentarios.innerHTML = `<p style="color: #9ca3af; font-style: italic;">Seja o primeiro a comentar!</p>`;
        return;
    }

    // Renderiza do mais novo para o mais antigo
    comentarios.reverse().forEach(comentario => {
        const card = document.createElement("div");
        card.classList.add("comment-card");

        card.innerHTML = `
            <div class="comment-header">
                <span class="comment-author"><i class="fa-regular fa-user"></i> ${comentario.nome}</span>
                <span>${comentario.data}</span>
            </div>
            <p class="comment-body">${comentario.texto}</p>
        `;

        listaComentarios.appendChild(card);
    });
}
