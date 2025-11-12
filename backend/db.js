// db.js
const { PrismaClient } = require('@prisma/client');

// Create a single Prisma client instance to avoid multiple connections
const prisma = new PrismaClient();

module.exports = prisma;
