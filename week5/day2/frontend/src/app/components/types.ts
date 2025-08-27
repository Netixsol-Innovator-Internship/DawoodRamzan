// src/components/types.ts

export interface User {
  _id: string;
  username: string;
  email?: string;
  followers?: string[];
}

export interface PublicUser {
  _id: string;
  username: string;
  followers: string[];
}

export interface Comment {
  _id: string;
  author: User | PublicUser | null;
  content: string;
  createdAt: string;
  likes?: string[];
  // replies can be either populated Comment objects or simple id strings
  replies?: (Comment | string)[];
}
