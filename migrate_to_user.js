const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    const username = 'tanaway';
    const password = 'password123'; // Default password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 1. Ensure user 'tanaway' exists
    let user = await prisma.user.findUnique({
        where: { username }
    });

    if (!user) {
        console.log(`Creating user '${username}'...`);
        user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
            },
        });
        console.log(`User '${username}' created with ID: ${user.id}`);
    } else {
        console.log(`User '${username}' already exists with ID: ${user.id}`);
    }

    // 2. Update existing records to belong to this user
    console.log('Migrating data...');

    // Update Months
    const monthsUpdate = await prisma.month.updateMany({
        where: { userId: null },
        data: { userId: user.id }
    });
    console.log(`Updated ${monthsUpdate.count} months.`);

    // Update Categories
    const categoriesUpdate = await prisma.category.updateMany({
        where: { userId: null },
        data: { userId: user.id }
    });
    console.log(`Updated ${categoriesUpdate.count} categories.`);

    // Update Accounts
    const accountsUpdate = await prisma.account.updateMany({
        where: { userId: null },
        data: { userId: user.id }
    });
    console.log(`Updated ${accountsUpdate.count} accounts.`);

    console.log('Data migration complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
