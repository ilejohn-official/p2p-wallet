import express from "express";
import controller from "../controllers/UserController";
import validateCreateUser from "../validations/user/validateCreateUser";

const router = express.Router();
const {create} = controller;

router.post("/", validateCreateUser, create);

export default router;
