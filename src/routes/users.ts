import express from "express";
import controller from "../controllers/UserController";
import validateCreateUser from "../validations/user/validateCreateUser";
import { authenticateUser } from "../middlewares";

const router = express.Router();
const {create, allUsers} = controller;

router.post("/", validateCreateUser, create);
router.use(authenticateUser);
router.get("/", allUsers);

export default router;
