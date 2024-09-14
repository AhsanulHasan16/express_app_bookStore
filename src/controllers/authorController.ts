import { Request, Response } from 'express';
import knex from '../db';
import Joi from 'joi';

// Joi validation schema for authors
const authorSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Name cannot be empty',
  }),
  bio: Joi.string().optional(),
  birthdate: Joi.date().required().messages({
    'date.base': 'Birthdate must be a valid date',
  }),
});

// Get all authors WITHOUT pagination SEARCH FUNCTIONALITY implemented
export const getAllAuthors = async (req: Request, res: Response) => {
  const { name } = req.query;

  try {
    let query = knex('authors').select('*');

    if (name) {
      query = query.where('name', 'like', `%${name}%`); 
    }

    const authors = await query;
    res.json(authors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching authors' });
  }
};

// Get all authors WITH pagination SEARCH FUNCTIONALITY implemented
export const getAllAuthorsWithPagination = async (req: Request, res: Response) => {
  const { page = 1, limit = 10, name } = req.query
  const offset = (Number(page) - 1) * Number(limit)

  try {
    let query = knex('authors').select('*');

    if (name) {
      query = query.where('name', 'like', `%${name}%`);
    }

    const authors = await query.limit(Number(limit)).offset(offset);

    const totalAuthorsQuery = knex('authors').count('* as total');

    if (name) {
      totalAuthorsQuery.where('name', 'like', `%${name}%`);
    }

    const totalAuthors = await totalAuthorsQuery.first();
    
    res.json({ total: totalAuthors?.total, authors, page, limit })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching authors' })
  }
}


// Get an author by ID
export const getAuthorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const author = await knex('authors').where({ id }).first();
    if (author) res.json(author);
    else res.status(404).json({ message: 'Author not found' });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching author' });
  }
};

// Create a new author
export const createAuthor = async (req: Request, res: Response) => {
  try {
    const { error } = authorSchema.validate(req.body); // Validate with Joi
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { name, bio, birthdate } = req.body;
    const [id] = await knex('authors').insert({ name, bio, birthdate });
    res.status(201).json({ id, name, bio, birthdate });
  } catch (error) {
    res.status(500).json({ message: 'Error creating author' });
  }
};

// Update an author
export const updateAuthor = async (req: Request, res: Response) => {
  try {
    const { error } = authorSchema.validate(req.body); // Validate with Joi
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { id } = req.params;
    const { name, bio, birthdate } = req.body;
    const updated = await knex('authors').where({ id }).update({ name, bio, birthdate });
    if (updated) res.json({ message: 'Author updated' });
    else res.status(404).json({ message: 'Author not found' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating author' });
  }
};

// Delete an author
export const deleteAuthor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await knex('authors').where({ id }).del();
    if (deleted) res.json({ message: 'Author deleted' });
    else res.status(404).json({ message: 'Author not found' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting author' });
  }
};
