const prisma = require('./prisma');

async function main() {
    const categories = [
        { name: 'Rent', defaultAmount: 5000 },
        { name: 'Food', defaultAmount: 6000 },
        { name: 'Savings', defaultAmount: 5000 },
        { name: 'Utilities', defaultAmount: 2000 },
        { name: 'Transportation', defaultAmount: 3000 },
        { name: 'Entertainment', defaultAmount: 2000 },
        { name: 'Others', defaultAmount: 1000 },
        { name: 'Credit Card', defaultAmount: 0 },
    ];

    for (const cat of categories) {
        await prisma.category.upsert({
            where: { id: 0 }, // This is a hack because we don't have unique name yet, but for simplicity let's just create if not empty
            update: {},
            create: cat,
        }).catch(async () => {
            // Fallback if upsert fails on id=0 (which it will for auto-inc).
            // Check by name
            const existing = await prisma.category.findFirst({ where: { name: cat.name } });
            if (!existing) {
                await prisma.category.create({ data: cat });
            }
        });
    }

    const accounts = [
        { name: 'Main Checking', type: 'CASH' },
        { name: 'Savings', type: 'SAVINGS' },
        { name: 'Krungsri Now', type: 'CREDIT_CARD' },
        { name: 'Krungsri First Choice', type: 'CREDIT_CARD' },
        { name: 'KTC', type: 'CREDIT_CARD' },
        { name: 'Kbank Xpress Cash', type: 'CREDIT_CARD' },
    ];

    for (const acc of accounts) {
        await prisma.account.upsert({
            where: { name: acc.name },
            update: {},
            create: acc,
        });
    }

    console.log('Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
