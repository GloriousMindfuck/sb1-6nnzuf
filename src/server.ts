import express from 'express';
import { json } from 'express';
import { login, validate } from './api/auth';

const app = express();
app.use(json());

// Auth routes
app.post('/auth/login', async (req, res) => {
  const response = await login(new Request('http://localhost/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body)
  }));
  
  const data = await response.json();
  res.status(response.status).json(data);
});

app.get('/auth/validate', async (req, res) => {
  const response = await validate(new Request('http://localhost/auth/validate', {
    headers: req.headers as HeadersInit
  }));
  
  const data = await response.json();
  res.status(response.status).json(data);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});