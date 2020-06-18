const express = require('express');
const router = express.Router();
const {userById} = require('../controllers/authController');

const { list, create, remove, categoryById } = require('../controllers/categoryController');

router.get('/categories', list);
router.post('/create/:userId', create);
router.delete('/:categoryId/', remove)

router.param('categoryId', categoryById);
router.param('userId', userById);

module.exports = router;