const form = document.getElementById('login-form');
const msg = document.getElementById('msg');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const usuario = document.getElementById('usuario').value;
  const senha = document.getElementById('senha').value;

  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario, senha })
  });

  if (res.ok) {
    localStorage.setItem('adminLogado', 'true');
    window.location.href = 'admin.html';
  } else {
    msg.textContent = 'Usuário ou senha inválidos';
  }
});
