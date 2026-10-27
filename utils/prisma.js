// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export default prisma;

// utils/prisma.js
import { PrismaClient } from '../src/generated/client/index.js';

const prisma = new PrismaClient();

export default prisma;