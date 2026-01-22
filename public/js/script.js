async function carregarProdutos() {
    const resp = await fetch('/api/produtos');
    const produtos = await resp.json();
  
    const lista = document.getElementById('lista-produtos');
    lista.innerHTML = '';
  
    produtos.forEach(p => {
      const card = document.createElement('div');
      card.classList.add('card');
  
      card.innerHTML = `
        <img src="${p.imagem}" alt="${p.nome}">
        <h3>${p.nome}</h3>
        <p>${p.descricao}</p>
        <strong>${p.preco}</strong>
      `;
  
      lista.appendChild(card);
    });
    lista.innerHTML += `
    <div class="produto">
      <h4>${p.nome}</h4>
      <button onclick="excluirProduto(${index})">Excluir</button>
    </div>
  `;
  }

  // ================= ANIMAÇÃO AO ENTRAR NA TELA =================
const elementos = document.querySelectorAll('.animar');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('ativo');
    }
  });
}, {
  threshold: 0.2
});

elementos.forEach(el => observer.observe(el));

  // carrega produtos ao abrir a página
  carregarProdutos();
  