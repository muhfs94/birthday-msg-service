import { User } from '../models/user';
import { prisma } from '../database';

export const createUser = async (data: User) => {
  return await prisma.user.create({ data });
};

export const deleteUser = async (id: number) => {
  return await prisma.user.delete({ where: { id } });
};

export const updateUser = async (id: number, data: User) => {
  return await prisma.user.update({ where: { id }, data });
};

export const getUsers = async (): Promise<User[]> => {
  return await prisma.user.findMany();
};
