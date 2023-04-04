const {
        addNewPickup,
        getPickups,
        confirmPickup
    } = require('../controllers/pickupController');
const { verifyTokenAndAuthorization } = require('../models/verification');
const router = require('express').Router();


router.post('/newPickup', verifyTokenAndAuthorization, addNewPickup)
router.get('/pickLocations', verifyTokenAndAuthorization, getPickups)
router.post('/confirmCode', verifyTokenAndAuthorization, confirmPickup)

module.exports = router
