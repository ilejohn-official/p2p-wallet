import express from "express";
import jwt from "jsonwebtoken";
import {loginSchema} from "../validations/validationSchema";
import { Request, Response } from "express";
import { UserService} from "../services/UserService";
import envVariables from "../config";
import {getErrorMessage, verifyPassword} from "../utils";
import { authenticateUser } from "../middlewares";
import { CustomRequest, UserHidden } from "../global/types";

const router = express.Router();
const { appKey } = envVariables;

/**
 * 
 * Login
 */
router.post("/login", async (request:Request, response:Response): Promise<void> => {
    const email = request.body.email;
    const password = request.body.password;

    try {

      let { error } = loginSchema.validate(request.body, { allowUnknown: true, abortEarly: false });

      if (error) {
        throw error;
      }

      const user = await (new UserService).getUserByEmail(email) as UserHidden;

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
          { expiresIn: 120*60 }, // expires in 120 minutes
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

router.post("/logout", authenticateUser, (request:CustomRequest, response:Response): void => {
    request.user = undefined;

    response.status(200).json({
        status: 'success',
        message: 'Clear token from Api request header',
    });
});

export default router;
