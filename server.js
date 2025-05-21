const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const FILE = './ordini.txt';

app.use(cors());
app.use(express.json());

app.post('/ordine', (req, res) => {
  const { formattato } = req.body;
  if (!formattato) return res.status(400).send('Dati mancanti');
  fs.appendFileSync(FILE, formattato + '\n');
  res.json({ ok: true });
});

app.get('/ordini/export.txt', (req, res) => {
  const data = fs.existsSync(FILE) ? fs.readFileSync(FILE, 'utf-8') : '';
  res.setHeader('Content-Type', 'text/plain');
  res.send(data);
});

app.listen(PORT, () => console.log(`Server attivo su port ${PORT}`));
