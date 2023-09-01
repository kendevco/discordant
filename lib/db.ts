import { PrismaClient } from "@prisma/client";

declare global {
    var prisma: PrismaClient | undefined;
};

// globalThis is not affected by hot reloading 
// so it will keep the value of prisma even after a file change
// this is useful for development
export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;


