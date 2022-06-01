import express from "express";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { UserService} from "../services/UserService";
import envVariables from "../config";
import {getErrorMessage, verifyPassword, validateEmail} from "../utils";
import { authenticateUser } from "../middlewares";
import {CustomRequest} from "../middlewares";

const router = express.Router();
const { appKey } = envVariables;

/**
 * 
 * Login
 */
router.post("/login", async (request:Request, response:Response) => {
    const email = request.body.email;
    const password = request.body.password;

    try {

     if (!validateEmail(email)) {
      throw new Error('Email not valid'); 
     }

     const user = await UserService.getUserByEmail(email);

     if(!user) {
        throw new Error('User with record not found');
     }

     const verifiedPassword = await verifyPassword(password, user.password);
     if (!verifiedPassword) {
        throw new Error('Password not valid');
     }

     const token = jwt.sign(
        {
          ...user
        },
        appKey,
        { expiresIn: 30*60 }, // expires in 30 minutes
    );

    response.status(200).json({
        status: 'success',
        message: 'User logged in successfully. Add token to Api request header as bearer Token to visit logged in routes',
        data: {user, token}
    });
        
    } catch (error) {

        response.status(400).json({status: 'error', message: getErrorMessage(error)});
    }

});

 /**
 * Logout
 * 
 */

router.post("/logout", authenticateUser, (request:CustomRequest, response:Response) => {
    const user = request.user;

    request.user = undefined;

    response.status(200).json({
        status: 'success',
        message: 'Clear token from Api request header',
    });
});

export default router;

