import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './routes.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api', routes);

app.listen(port, () => {
  console.log(`API ready on http://localhost:${port}`);
});
