import express from 'express';
import { validate } from '../middleware/validate';
import { createUserSchema, updateUserSchema } from '../validation/userValidation';
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from '../controllers/userController';

const router = express.Router();

// GET
router.get('/all', getUsers);

// POST
router.post('/', validate(createUserSchema), createUser);

// PUT
router.put('/:id', validate(updateUserSchema), updateUser);

// DELETE
router.delete('/:id', deleteUser);

export default router;
