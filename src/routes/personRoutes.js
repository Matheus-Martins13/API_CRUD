const router = require('express').Router();
const personController = require('../controllers/personController');

// create
router.post('/', personController.create);

// read
router.get('/', personController.read);
router.get('/:id', personController.readById);

//update
router.patch('/:id', personController.update);

//delete
router.delete('/:id', personController.delete);

module.exports = router;
