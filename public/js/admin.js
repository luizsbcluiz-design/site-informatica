let produtoParaExcluir = null;
let produtoEditando = null;

document.addEventListener('DOMContentLoaded', () => {
  verificarLogin();
});

/* ===============================
   VERIFICAR LOGIN
================================ */
function verificarLogin() {
  fetch('/api/admin/status', { credentials: 'include' })
    .then(res => res.json())
    .then(data => {
      if (!data.logado) {
        // NÃO está logado → volta para login
        window.location.href = '/login.html';
      } else {
        // Está logado → carrega painel
        iniciarAdmin();
      }
    });
}

/* ===============================
   INICIAR ADMIN
================================ */
function iniciarAdmin() {
  carregarProdutos();

  const form = document.getElementById('form-produto');
  if (form) {
    form.addEventListener('submit', salvarProduto);
  }

  const btnCancelar = document.getElementById('btn-cancelar');
  const btnConfirmar = document.getElementById('btn-confirmar');

  if (btnCancelar) btnCancelar.onclick = fecharModal;
  if (btnConfirmar) btnConfirmar.onclick = confirmarExclusao;
}

/* ===============================
   CARREGAR PRODUTOS
================================ */
function carregarProdutos() {
  fetch('/api/produtos', { credentials: 'include' })
    .then(res => res.json())
    .then(produtos => {
      const lista = document.getElementById('lista-produtos');
      if (!lista) return;

      lista.innerHTML = '';

      produtos.forEach((p, i) => {
        lista.innerHTML += `
          <div class="produto">
            ${p.imagem ? `<img src="${p.imagem}" width="120"><br>` : ''}
            <h3>${p.nome}</h3>
            <p>${p.descricao}</p>
            <p>R$ ${p.preco}</p>

            <button onclick="editarProduto(${i})">Editar</button>
            <button onclick="abrirModal(${i})">Excluir</button>
            <hr>
          </div>
        `;
      });
    });
}

/* ===============================
   EDITAR
================================ */
function editarProduto(id) {
  produtoEditando = id;

  fetch('/api/produtos')
    .then(res => res.json())
    .then(produtos => {
      const p = produtos[id];
      if (!p) return;

      document.querySelector('[name=nome]').value = p.nome;
      document.querySelector('[name=descricao]').value = p.descricao;
      document.querySelector('[name=preco]').value = p.preco;
      document.querySelector('[name=categoria]').value = p.categoria;

      document.querySelector('#form-produto button').textContent =
        'Salvar Alterações';
    });
}

/* ===============================
   SALVAR (POST / PUT)
================================ */
async function salvarProduto(e) {
  e.preventDefault();

  const formData = new FormData(e.target);

  let url = '/api/produtos';
  let method = 'POST';

  if (produtoEditando !== null) {
    url = `/api/produtos/${produtoEditando}`;
    method = 'PUT';
  }

  await fetch(url, {
    method,
    body: formData,
    credentials: 'include'
  });

  e.target.reset();
  produtoEditando = null;
  document.querySelector('#form-produto button').textContent = 'Cadastrar';

  carregarProdutos();
}

/* ===============================
   MODAL
================================ */
function abrirModal(id) {
  produtoParaExcluir = id;
  document.getElementById('modal-excluir').style.display = 'flex';
}

function fecharModal() {
  document.getElementById('modal-excluir').style.display = 'none';
  produtoParaExcluir = null;
}

function confirmarExclusao() {
  if (produtoParaExcluir === null) return;

  fetch(`/api/produtos/${produtoParaExcluir}`, {
    method: 'DELETE',
    credentials: 'include'
  }).then(() => {
    fecharModal();
    carregarProdutos();
  });
}

/* ===============================
   LOGOUT
================================ */
function logout() {
  fetch('/api/logout', {
    method: 'POST',
    credentials: 'include'
  }).then(() => {
    window.location.href = '/login.html';
  });
}
