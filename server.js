const express = require('express');
const session = require('express-session');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const ADMIN_USER = 'admin';
const ADMIN_PASS = '@Santos@';

const app = express();

/* ================= MIDDLEWARES ================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'wlsinfo123',
  resave: false,
  saveUninitialized: false
}));

app.use(express.static('public'));

/* ================= LOGIN ================= */
app.post('/api/login', (req, res) => {
  const { usuario, senha } = req.body;

  if (usuario === ADMIN_USER && senha === ADMIN_PASS) {
    req.session.admin = true;
    return res.json({ sucesso: true });
  }

  res.status(401).json({ sucesso: false });
});

app.get('/api/admin/status', (req, res) => {
  res.json({ logado: !!req.session.admin });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => res.json({ sucesso: true }));
});

function protegerAdmin(req, res, next) {
  if (req.session.admin) {
    return next();
  }
  res.status(401).json({ erro: 'Não autorizado' });
}

/* ================= PRODUTOS ================= */

/* MULTER */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

app.get('/api/produtos', (req, res) => {
  const produtos = JSON.parse(fs.readFileSync('produtos.json', 'utf-8'));
  res.json(produtos);
});

app.post('/api/produtos', upload.single('imagem'), (req, res) => {
  const produtos = JSON.parse(fs.readFileSync('produtos.json', 'utf-8'));

  produtos.push({
    nome: req.body.nome,
    descricao: req.body.descricao,
    preco: req.body.preco,
    categoria: req.body.categoria,
    imagem: req.file ? `/uploads/${req.file.filename}` : ''
  });

  fs.writeFileSync('produtos.json', JSON.stringify(produtos, null, 2));
  res.json({ sucesso: true });
});

app.put('/api/produtos/:id', upload.single('imagem'), (req, res) => {
  const id = Number(req.params.id);
  const produtos = JSON.parse(fs.readFileSync('produtos.json', 'utf-8'));

  if (!produtos[id]) {
    return res.status(404).json({ erro: 'Produto não encontrado' });
  }

  produtos[id].nome = req.body.nome;
  produtos[id].descricao = req.body.descricao;
  produtos[id].preco = req.body.preco;
  produtos[id].categoria = req.body.categoria;

  if (req.file) {
    produtos[id].imagem = `/uploads/${req.file.filename}`;
  }

  fs.writeFileSync('produtos.json', JSON.stringify(produtos, null, 2));
  res.json({ sucesso: true });
});

app.delete('/api/produtos/:id', (req, res) => {
  const id = Number(req.params.id);
  const produtos = JSON.parse(fs.readFileSync('produtos.json', 'utf-8'));

  if (!produtos[id]) {
    return res.status(404).json({ erro: 'Produto não encontrado' });
  }

  produtos.splice(id, 1);
  fs.writeFileSync('produtos.json', JSON.stringify(produtos, null, 2));
  res.json({ sucesso: true });
});

/* ================= SERVIDOR ================= */
app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
