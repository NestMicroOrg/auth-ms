import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

prisma.$connect()
  .then(() => console.log('Database connection established'))
  .catch((err) => console.error('Database connection failed', err));

export { prisma };