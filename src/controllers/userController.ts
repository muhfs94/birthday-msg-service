import { Request, Response } from 'express';
import * as userService from '../services/userService';

export const getUsers = async (_req: Request, res: Response) => {
  const users = await userService.getUsers();
  res.json(users);
};

export const createUser = async (req: Request, res: Response) => {
  const { firstName, lastName, birthday, location } = req.body;
  const data = {
    firstName,
    lastName,
    birthday: new Date(birthday),
    location,
  };
  try {
    const user = await userService.createUser(data);
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { firstName, lastName, birthday, location } = req.body;

  const data = {
    firstName,
    lastName,
    birthday: new Date(birthday),
    location,
  };
  try {
    const updatedUser = await userService.updateUser(Number(id), data);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await userService.deleteUser(Number(id));
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
