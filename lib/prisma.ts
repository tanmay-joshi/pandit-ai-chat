import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Handle connection cleanup
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

// Add this to your schema.prisma:
// generator client {
//   provider = "prisma-client-js"
//   previewFeatures = ["noPreparedStatements"]
// } 