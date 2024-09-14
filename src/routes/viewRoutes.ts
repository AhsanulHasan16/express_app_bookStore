import express from 'express'
import { getAuthorsWithBooks, getAuthorDetailsWithBooks } from '../views/authorViews'
import { getBookWithAuthor } from '../views/bookViews'

const router = express.Router()

router.get('/authors', getAuthorsWithBooks)     // List all authors with books
router.get('/authors/:id', getAuthorDetailsWithBooks)    // Get author details and books
router.get('/books/:id', getBookWithAuthor)     // Get book details with author

export default router
