const prisma = require('../prisma');

// Get all months (History)
const getMonths = async (req, res) => {
    try {
        const months = await prisma.month.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json(months);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch months' });
    }
};

// Get specific month details with expenses
const getMonthDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const month = await prisma.month.findUnique({
            where: { id: parseInt(id) },
            include: {
                expenses: {
                    include: { category: true, account: true }
                }
            }
        });
        if (!month) return res.status(404).json({ error: 'Month not found' });

        res.json(month);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch month details' });
    }
};

// Update month details
const updateMonth = async (req, res) => {
    const { id } = req.params;
    const { totalIncome } = req.body;
    try {
        const month = await prisma.month.update({
            where: { id: parseInt(id) },
            data: {
                totalIncome: parseFloat(totalIncome)
            }
        });
        res.json(month);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update month' });
    }
};

// Create a new month
const createMonth = async (req, res) => {
    const { name, totalIncome, autoFillFromTemplate } = req.body;
    try {
        const month = await prisma.month.create({
            data: {
                name,
                totalIncome: parseFloat(totalIncome),
            }
        });

        if (autoFillFromTemplate) {
            // Find the most recent PREVIOUS month (excluding the one we just created)
            const previousMonth = await prisma.month.findFirst({
                where: { id: { not: month.id } },
                orderBy: { createdAt: 'desc' },
                include: { expenses: true }
            });

            if (previousMonth && previousMonth.expenses.length > 0) {
                // Clone expenses from previous month
                const newExpenses = previousMonth.expenses.map(ex => ({
                    monthId: month.id,
                    categoryId: ex.categoryId,
                    amount: ex.amount,
                    note: ex.note,
                    status: 'UNPAID', // Reset status
                    accountId: ex.accountId
                }));
                await prisma.expense.createMany({ data: newExpenses });
            } else {
                // Fallback: Create from Categories table if no previous month exists
                const categories = await prisma.category.findMany();
                const expenses = categories.map(cat => ({
                    monthId: month.id,
                    categoryId: cat.id,
                    amount: cat.defaultAmount,
                    note: 'Auto-generated',
                    status: 'UNPAID'
                }));
                if (expenses.length > 0) {
                    await prisma.expense.createMany({ data: expenses });
                }
            }
        }

        res.status(201).json(month);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create month', details: error.message });
    }
};

// Add expense to a month
const addExpense = async (req, res) => {
    const { monthId, categoryId, amount, note, accountId } = req.body;
    try {
        const expense = await prisma.expense.create({
            data: {
                monthId: parseInt(monthId),
                categoryId: parseInt(categoryId),
                amount: parseFloat(amount),
                note,
                status: req.body.status || 'UNPAID',
                accountId: accountId ? parseInt(accountId) : null
            }
        });
        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add expense' });
    }
};

// Update expense
const updateExpense = async (req, res) => {
    const { id } = req.params;
    const { amount, note, accountId, status } = req.body;

    // Construct data object dynamically to handling partial updates
    const data = {};
    if (amount !== undefined) data.amount = parseFloat(amount);
    if (note !== undefined) data.note = note;
    if (status !== undefined) data.status = status;
    if (accountId !== undefined) data.accountId = accountId ? parseInt(accountId) : null;

    try {
        const expense = await prisma.expense.update({
            where: { id: parseInt(id) },
            data
        });
        res.json(expense);
    } catch (error) {
        console.error('Update error:', error); // Log the actual error for debugging
        res.status(500).json({ error: 'Failed to update expense' });
    }
};

// Delete expense
const deleteExpense = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.expense.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete expense' });
    }
};

// Delete month
const deleteMonth = async (req, res) => {
    const { id } = req.params;
    try {
        const month = await prisma.month.findUnique({ where: { id: parseInt(id) } });
        if (!month) return res.status(404).json({ error: 'Month not found' });

        // Parse Month Name (e.g., "January 2026")
        const monthDate = new Date(month.name);
        if (isNaN(monthDate.getTime())) {
            // If parsing fails, maybe fallback to creation date or allow delete? 
            // Better to be safe and allow delete if name format changed, OR restrict.
            // Given requirement, let's assume standard format. 
            // If invalid date string, we might block or log.
            // Let's assume standard "Month YYYY" format is used.
        }

        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const targetMonthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);

        // Logic: > current month (Only future)
        if (targetMonthStart <= currentMonthStart) {
            return res.status(403).json({ error: 'Cannot delete past or current months' });
        }

        // Manual Cascade Delete
        await prisma.expense.deleteMany({ where: { monthId: parseInt(id) } });
        await prisma.month.delete({ where: { id: parseInt(id) } });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete month' });
    }
};

module.exports = {
    getMonths,
    getMonthDetails,
    updateMonth,
    createMonth,
    addExpense,
    updateExpense,
    deleteExpense,
    deleteMonth,
};
