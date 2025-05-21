const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const FILE = './ordini.txt';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Aggiungi ordine
app.post('/ordine', (req, res) => {
  const { formattato } = req.body;
  if (!formattato) return res.status(400).send('Dati mancanti');
  fs.appendFileSync(FILE, formattato + '\n');
  res.json({ ok: true });
});

// ✅ Ottieni tutti gli ordini
app.get('/ordini/export.txt', (req, res) => {
  const data = fs.existsSync(FILE) ? fs.readFileSync(FILE, 'utf-8') : '';
  res.setHeader('Content-Type', 'text/plain');
  res.send(data);
});

// ✅ Cancella una riga di ordine
app.delete('/ordini/delete/:index', (req, res) => {
  const index = parseInt(req.params.index);
  if (!fs.existsSync(FILE)) return res.status(404).send('File non trovato');

  const righe = fs.readFileSync(FILE, 'utf-8').split('\n').filter(r => r.trim() !== '');
  if (index < 0 || index >= righe.length) return res.status(400).send('Indice non valido');

  righe.splice(index, 1);
  fs.writeFileSync(FILE, righe.join('\n') + '\n');
  res.json({ ok: true });
});

// ✅ Cancella tutto
app.delete('/ordini/reset', (req, res) => {
  if (fs.existsSync(FILE)) fs.unlinkSync(FILE);
  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`Server attivo su port ${PORT}`));
