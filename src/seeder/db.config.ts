require('dotenv').config();
import { PrismaClient } from '@prisma/client';

export const mySeeder = new PrismaClient();