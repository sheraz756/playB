const express = require('express');
const { createBdo, deleteBdo, getBdoList } = require('../controller/BdoController');
const router = express.Router();


router.post('/Bdo',createBdo),
router.get('/getBdo',getBdoList),
router.delete('/:id',deleteBdo)


module.exports = router;