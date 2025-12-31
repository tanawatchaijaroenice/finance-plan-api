const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    const username = 'admin';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findUnique({
        where: { username }
    });

    if (!existingUser) {
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
            },
        });
        console.log(`User created: ${user.username}`);
    } else {
        console.log(`User ${username} already exists`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
