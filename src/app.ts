import express from 'express'
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes';
import authorRoutes from './routes/authorRoutes';
import bookRoutes from './routes/bookRoutes';
import viewRoutes from './routes/viewRoutes'
import './db';

import { authenticateToken } from './middleware/authMiddleware';

dotenv.config();

const app = express()

app.use(bodyParser.json());

app.use('/auth', authRoutes)
app.use('/authors', authenticateToken, authorRoutes);
app.use('/books', authenticateToken, bookRoutes);
app.use('/views', viewRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
