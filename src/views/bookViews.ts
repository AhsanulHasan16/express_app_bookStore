import { Request, Response } from 'express'
import knex from '../db'

// Detailed view of a book with author information
export const getBookWithAuthor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const book = await knex('books').where({ id }).first()

    if (!book) {
      return res.status(404).json({ message: 'Book not found' })
    }

    const author = await knex('authors').where('id', book.author_id).first()

    res.json({ ...book, author })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching book details' })
  }
}
