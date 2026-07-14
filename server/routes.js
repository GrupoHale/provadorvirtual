import express from 'express';
import { initSchema, query } from './db.js';
import { createAdmin, validateAdmin } from './auth.js';
import { mapFormToPiece } from './utils/normalizePiece.js';

const router = express.Router();

router.get('/health', async (_req, res) => {
  try {
    await initSchema();
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    const auth = await validateAdmin(username, password);
    if (!auth) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    res.json(auth);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/admin/create', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: 'Informe username e password' });
    }
    const admin = await createAdmin(username, password);
    res.status(201).json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/roupas', async (_req, res) => {
  try {
    await initSchema();
    const result = await query('SELECT id, nome, categoria, descricao, imagem, tamanhos FROM roupas ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/roupas', async (req, res) => {
  try {
    await initSchema();
    const payload = mapFormToPiece(req.body);
    const result = await query(
      'INSERT INTO roupas (nome, categoria, descricao, imagem, tamanhos) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [payload.nome, payload.categoria, payload.descricao, payload.imagem, JSON.stringify(payload.tamanhos)]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/roupas/:id', async (req, res) => {
  try {
    await initSchema();
    const result = await query('DELETE FROM roupas WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Roupa não encontrada' });
    }
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
