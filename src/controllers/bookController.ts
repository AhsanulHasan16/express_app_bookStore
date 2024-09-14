import { Request, Response } from 'express';
import db from '../db';
import Joi from 'joi';

// Joi validation schema for books
const bookSchema = Joi.object({
  title: Joi.string().required().messages({
    'string.empty': 'Title cannot be empty',
  }),
  description: Joi.string().optional(),
  published_date: Joi.date().required().messages({
    'date.base': 'Published date must be a valid date',
  }),
  author_id: Joi.number().required().messages({
    'number.base': 'Author ID must be a valid number',
  }),
});

// Get all books WITHOUT pagination SEARCH FUNCTIONALITY implemented
export const getBooks = async (req: Request, res: Response) => {
  const { title } = req.query; // Getting title from the query parameter

  try {
    let query = db('books').select('*');  // Base query to get all books

    // If a title is in the parameter then filter the books by that title
    if (title) {
      query = query.where('title', 'like', `%${title}%`);
    }

    const books = await query;
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve books', error });
  }
};


// Get all books WITH pagination SEARCH FUNCTIONALITY implemented
export const getBooksWithPagination = async (req: Request, res: Response) => {
  const { page = 1, limit = 10, title } = req.query
  const offset = (Number(page) - 1) * Number(limit)

  try {
    let query = db('books').select('*').limit(Number(limit)).offset(offset);

    // If a title is in the parameter then filter the books by that title
    if (title) {
      query = query.where('title', 'like', `%${title}%`);     // like is for case insensitivity
    }

    const books = await query

    let totalBooksQuery = db('books').count('* as total');
    if (title) {
      totalBooksQuery = totalBooksQuery.where('title', 'like', `%${title}%`);
    }
    const totalBooks = await totalBooksQuery.first();

    res.json({ total: totalBooks?.total, books, page, limit })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books' })
  }
}


// Get a specific book by ID
export const getBookById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const book = await db('books').where({ id }).first();
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve book', error });
  }
};

// Get books by a specific author
export const getBooksByAuthor = async (req: Request, res: Response) => {
  const { author } = req.query;
  try {
    const books = await db('books').where({ author_id: author });
    if (books.length) {
      res.status(200).json(books);
    } else {
      res.status(404).json({ message: 'No books found for the specified author' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve books by author', error });
  }
};

// Create a new book
export const createBook = async (req: Request, res: Response) => {
  const { error } = bookSchema.validate(req.body); // Validate with Joi
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { title, description, published_date, author_id } = req.body;
  try {
    const [newBook] = await db('books')
      .insert({ title, description, published_date, author_id })
      .returning('*');
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create book', error });
  }
};

// Update a specific book by ID
export const updateBook = async (req: Request, res: Response) => {
  const { error } = bookSchema.validate(req.body); // Validate with Joi
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { id } = req.params;
  const { title, description, published_date, author_id } = req.body;
  try {
    const updatedRows = await db('books')
      .where({ id })
      .update({ title, description, published_date, author_id })
      .returning('*');
    if (updatedRows.length) {
      res.status(200).json(updatedRows[0]);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update book', error });
  }
};

// Delete a specific book by ID
export const deleteBook = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedRows = await db('books').where({ id }).del();
    if (deletedRows) {
      res.status(200).json({ message: 'Book deleted successfully' });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete book', error });
  }
};
