// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// Import the Injectable decorator from the NestJS library
@Injectable()
// Create a class called PrismaService that extends the PrismaClient class and implements the OnModuleInit and OnModuleDestroy interfaces
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  // Define an asynchronous method called onModuleInit which is called when the module is initialized
  async onModuleInit() {
    // Try to establish a connection to the database using the $connect method provided by PrismaClient
    try {
      await this.$connect();
    } catch (error) {
      // If an error occurs during the connection attempt, handle the error, e.g. log it or throw a custom exception
    }
  }

  // Define an asynchronous method called onModuleDestroy which is called when the module is being destroyed
  async onModuleDestroy() {
    // Try to disconnect from the database using the $disconnect method provided by PrismaClient
    try {
      await this.$disconnect();
    } catch (error) {
      // If an error occurs during the disconnection attempt, handle the error, e.g. log it or throw a custom exception
    }
  }
}
