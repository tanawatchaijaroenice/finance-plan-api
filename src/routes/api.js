const express = require('express');
const router = express.Router();
const monthsController = require('../controllers/monthsController');
const categoriesController = require('../controllers/categoriesController');
const accountsController = require('../controllers/accounts');

// Month routes
router.get('/months', monthsController.getMonths);
router.get('/months/:id', monthsController.getMonthDetails);
router.post('/months', monthsController.createMonth);
router.put('/months/:id', monthsController.updateMonth);
router.delete('/months/:id', monthsController.deleteMonth);

// Expense routes
router.post('/expenses', monthsController.addExpense);
router.put('/expenses/:id', monthsController.updateExpense);
router.delete('/expenses/:id', monthsController.deleteExpense);

// Category routes
router.get('/categories', categoriesController.getCategories);
router.post('/categories', categoriesController.createCategory);

// Account routes
router.get('/accounts', accountsController.getAccounts);
router.post('/accounts', accountsController.createAccount);

module.exports = router;
