import { Request, Response } from 'express'
import knex from '../db'

// List authors with their books
export const getAuthorsWithBooks = async (req: Request, res: Response) => {
  try {
    const authors = await knex('authors').select('*')

    const authorBooks = await Promise.all(
      authors.map(async (author) => {
        const books = await knex('books').where('author_id', author.id)
        return { ...author, books }
      })
    )

    res.json(authorBooks)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching authors and books' })
  }
}

// Detailed view of an author with their books
export const getAuthorDetailsWithBooks = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const author = await knex('authors').where({ id }).first()

    if (!author) {
      return res.status(404).json({ message: 'Author not found' })
    }

    const books = await knex('books').where('author_id', id)

    res.json({ ...author, books })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching author details' })
  }
}
