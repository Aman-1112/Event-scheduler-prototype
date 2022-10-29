const { getAllUsers } = require('../Controllers/userController');
const { Signup, Login, updateUser } = require('../Controllers/authController');

const express = require('express');
const userRouter = express.Router();

userRouter.post('/signup',Signup)
userRouter.post('/login',Login)

userRouter.route('/')
.get(getAllUsers)

userRouter.route('/:id')
.patch(updateUser)

module.exports = userRouter;
