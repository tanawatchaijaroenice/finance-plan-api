const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const category = await prisma.category.create({
        data: {
            name: 'Salary',
            type: 'INCOME',
            defaultAmount: 50000
        }
    });
    console.log('Created Income Category:', category);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
