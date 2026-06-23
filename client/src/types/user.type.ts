export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  emailId: string;
  password: string;
  about: string;
  skills: string[];
  photoURL: string;
  age: number;
}

export interface PendingRequestUser {
  requestId: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  about: string;
  skills: string[];
  photoURL: string;
  toUserId: string;
}
