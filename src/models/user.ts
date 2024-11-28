export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  birthday: Date;
  location: string;
  createdAt?: Date;
}
