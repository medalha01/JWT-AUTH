import { PrismaClient } from 'prisma/prisma/client';

export class UserEntity extends PrismaClient {
  constructor() {
    super();
  }
}

export class User extends UserEntity {
  id: string;
  username: string;
  password: string;
  $on: any;
  $connect: any;
  $disconnect: any;
  $use: any;
  // Add any other missing properties from UserEntity
}
