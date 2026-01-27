
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Checking User table structure...");
    try {
        // MySQL query to get columns
        const columns = await prisma.$queryRaw`SHOW COLUMNS FROM User`;
        console.log("Columns in User table:", columns);
    } catch (e) {
        console.error("Error checking columns:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
