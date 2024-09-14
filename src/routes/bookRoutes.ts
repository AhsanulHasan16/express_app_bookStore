import express from 'express';
import { 
  getBooks, 
  getBookById, 
  createBook, 
  updateBook, 
  deleteBook, 
  getBooksByAuthor 
} from '../controllers/bookController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/books', getBooks);

router.get('/books/:id', getBookById);

router.get('/books', getBooksByAuthor);

// JWT Authentication

router.post('/books', authenticateToken, createBook);

router.put('/books/:id', authenticateToken, updateBook);

router.delete('/books/:id', authenticateToken, deleteBook);

export default router;
