export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  savedBooks: string[];
  createdAt: Date;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  savedBooks: string[];
  createdAt: Date;
}
