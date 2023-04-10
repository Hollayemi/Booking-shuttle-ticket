const {
        addNewPickup,
        getPickups,
        getPickup,
        confirmPickup
    } = require('../controllers/pickupController');

const { verifyTokenAndAuthorization } = require('../models/verification');
const { getPaymentUrl } = require('../services/paystack');
const router = require('express').Router();


router.post('/payment-url', getPaymentUrl)
router.post('/newPickup', verifyTokenAndAuthorization, addNewPickup)
router.get('/get-pickup/:id', verifyTokenAndAuthorization, getPickup)
router.get('/pickLocations', verifyTokenAndAuthorization, getPickups)
router.post('/confirmCode', verifyTokenAndAuthorization, confirmPickup)

module.exports = router
