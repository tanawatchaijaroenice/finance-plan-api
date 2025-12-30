const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Create or Update a Credit Card Account
    const account = await prisma.account.upsert({
        where: { name: 'Citibank Rewards' },
        update: { type: 'CREDIT_CARD', dueDate: 25 },
        create: {
            name: 'Citibank Rewards',
            type: 'CREDIT_CARD',
            dueDate: 25
        }
    });

    console.log('Updated/Created Account:', account);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
