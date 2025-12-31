const prisma = require('../prisma');

async function getAccounts(req, res) {
    try {
        const accounts = await prisma.account.findMany({});
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function createAccount(req, res) {
    const { name, type, dueDate } = req.body;
    try {
        const account = await prisma.account.create({
            data: {
                name,
                type,
                dueDate: type === 'CREDIT_CARD' ? parseInt(dueDate) : null,
            },
        });
        res.json(account);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getAccounts,
    createAccount,
};
