import { User } from './models/user';

const users: User[] = [];

export const db = {
  addUser: (user: User) => users.push(user),
  deleteUser: (id: string) => {
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) users.splice(index, 1);
  },
  getUsers: () => users
}
