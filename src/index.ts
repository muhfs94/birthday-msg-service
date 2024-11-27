import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`listening on port http://localhost:${port}`);
});

// POST /user
app.post('/user', (req: Request, res: Response) => {
  const { firstName, lastName, birthday, timeZone } = req.body;
  const user = {
    id: uuidv4(),
    firstName,
    lastName,
    birthday,
    timeZone,
  };
  db.addUser(user);
  res.status(201).json(user);
});

// DELETE /user
app.delete('/user/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  db.deleteUser(id);
  res.sendStatus(204);
});

// GET /users
app.get('/users', (req: Request, res: Response) => {
  const users = db.getUsers();
  res.json(users);
});
