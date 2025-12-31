const prisma = require('../prisma');

const getCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { seqNo: 'asc' }
        });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
};

const createCategory = async (req, res) => {
    const { name, defaultAmount, type } = req.body;
    try {
        const category = await prisma.category.create({
            data: {
                name,
                defaultAmount: parseFloat(defaultAmount || 0),
                type: type || 'EXPENSE'

            }
        });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create category' });
    }
};


module.exports = {
    getCategories,
    createCategory,
};
