import express from 'express';
import cors from 'cors';
import { ENV } from '../../backend.config';
import { PrismaClient } from '@prisma/client';
import { errorHandler } from './middleware/error-handler';
import { authMiddleware } from './middleware/auth';

const prisma = new PrismaClient();
const app = express();

// Middlewares
app.use(express.json());
app.use(cors({
  origin: ENV.CORS_ORIGIN,
  credentials: true,
}));

// Rotas públicas
app.use('/api/auth', require('./routes/auth'));

// Middleware de autenticação
app.use('/api', authMiddleware);

// Rotas protegidas
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/integrations', require('./routes/integrations'));

// Middleware de tratamento de erros
app.use(errorHandler);

const PORT = ENV.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
}); 