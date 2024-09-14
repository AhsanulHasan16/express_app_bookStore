import express from 'express'
import { getAllAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor } from '../controllers/authorController'
import { authenticateToken } from '../middleware/authMiddleware'

const router = express.Router()

router.get('/', getAllAuthors)

router.get('/:id', getAuthorById)

// JWT Authentication
router.post('/', authenticateToken, createAuthor)

router.put('/:id', authenticateToken, updateAuthor)

router.delete('/:id', authenticateToken, deleteAuthor)

export default router
