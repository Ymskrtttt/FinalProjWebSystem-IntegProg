// ============================================================================
// routes/userRoutes.js - Express Router for User & Account Endpoints
// ============================================================================

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Account & User Management Endpoints
router.get('/getUsers', userController.getUsers);
router.get('/getArchivedUsers', userController.getArchivedUsers);
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.put('/updateUser/:id', userController.updateUser);
router.put('/archiveUser/:id', userController.archiveUser);
router.put('/restoreUser/:id', userController.restoreUser);

module.exports = router;
