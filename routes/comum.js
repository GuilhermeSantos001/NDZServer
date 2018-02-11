var express = require('express');
var router = express.Router();

// Define a rota não existente
router.use('*', (req, res) => {
    res.status(404).send('404 - Not Found!!!');
});

module.exports = router;