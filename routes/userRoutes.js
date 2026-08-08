const express = require('express');
const router = express.Router();
const { getUserController, updateUserController
    , updateUserPassword, deleteUserController
 } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/getUser', authMiddleware, getUserController);

router.put('/updateUser', authMiddleware, updateUserController);

router.put('/updatePassword', authMiddleware, updateUserPassword);

router.delete('/deleteUser/:id', authMiddleware, deleteUserController);

module.exports = router;