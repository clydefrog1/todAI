import express from 'express';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'todAI API is running' });
});

// Routes
app.use('/api/tasks', taskRoutes);

// Error handling middleware
app.use(errorHandler);

export default app;
