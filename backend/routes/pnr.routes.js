
const express = require('express');
const router = express.Router();
const { getPnrStatus } = require('../controllers/pnr.controller');

router.get('/:pnr', getPnrStatus);

module.exports = router;
