const router = require('express').Router();
const auth = require('../controllers/accountController');

const {createAccount, accountLogin} = auth

router.post('/createAccount', createAccount);
router.post('/signin', accountLogin);

module.exports = router;
