const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const username = 'admin';

    // 1. Find user 'admin'
    const user = await prisma.user.findUnique({
        where: { username }
    });

    if (!user) {
        console.log(`User '${username}' not found.`);
        return;
    }

    // 2. Check if categories exist
    const count = await prisma.category.count({
        where: { userId: user.id }
    });

    if (count > 0) {
        console.log(`User '${username}' already has ${count} categories. Skipping.`);
        return;
    }

    // 3. Create Default Categories
    console.log(`Adding default categories to '${username}'...`);
    const defaultCategories = [
        { name: 'Salary', type: 'INCOME', defaultAmount: 0, seqNo: 1 },
        { name: 'Food', type: 'EXPENSE', defaultAmount: 0, seqNo: 2 },
        { name: 'Travel', type: 'EXPENSE', defaultAmount: 0, seqNo: 3 },
        { name: 'Utilities', type: 'EXPENSE', defaultAmount: 0, seqNo: 4 },
        { name: 'Housing', type: 'EXPENSE', defaultAmount: 0, seqNo: 5 },
        { name: 'Entertainment', type: 'EXPENSE', defaultAmount: 0, seqNo: 6 },
        { name: 'Shopping', type: 'EXPENSE', defaultAmount: 0, seqNo: 7 },
        { name: 'Medical', type: 'EXPENSE', defaultAmount: 0, seqNo: 8 },
        { name: 'Other', type: 'EXPENSE', defaultAmount: 0, seqNo: 99 },
    ];

    const categoriesData = defaultCategories.map(cat => ({
        ...cat,
        userId: user.id
    }));

    await prisma.category.createMany({
        data: categoriesData
    });

    console.log('Default categories added successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
