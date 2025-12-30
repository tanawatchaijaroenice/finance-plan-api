const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const updates = [
        { name: 'Food', seq: 1 },
        { name: 'Rent', seq: 2 },
        { name: 'Monthly', seq: 3 },
        { name: 'Credit Card', seq: 4 },
        { name: 'Charge Others', seq: 5 },
        { name: 'AIA', seq: 6 },
    ];

    console.log('Starting migration...');

    for (const up of updates) {
        try {
            // Try exact match first
            const res = await prisma.category.updateMany({
                where: { name: up.name },
                data: { seqNo: up.seq }
            });
            console.log(`Updated ${up.name}: ${res.count} records`);
        } catch (e) {
            console.error(`Failed to update ${up.name}`, e);
        }
    }

    // Also try "Foof" just in case it wasn't renamed yet or user meant alias
    await prisma.category.updateMany({
        where: { name: 'Foof' },
        data: { seqNo: 1 }
    });
    console.log('Checked Foof alias.');

    console.log('Migration complete.');
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
