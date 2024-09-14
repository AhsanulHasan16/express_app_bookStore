// Needed for JWT authentication

import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import knex from '../db'

const secret = 'your_jwt_secret'

// Register a new user
export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body

  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    await knex('users').insert({ username, password: hashedPassword })
    res.status(201).json({ message: 'User registered successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Error registering user' })
  }
}

// Login and returning JWT
export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body

  try {
    const user = await knex('users').where({ username }).first()

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign({ id: user.id, username: user.username }, secret, { expiresIn: '1h' })

    res.json({ token })
  } catch (error) {
    res.status(500).json({ message: 'Error logging in user' })
  }
}
