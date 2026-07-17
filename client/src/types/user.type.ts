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

export interface PendingRequestUser extends Pick<
  User,
  "firstName" | "lastName" | "about" | "skills" | "photoURL" | "age" | "_id"
> {
  requestId: string;
  gender: string;
  toUserId: string;
}
