import express from "express";
import controller from "../controllers/UserController";
import validateCreateUser from "../validations/user/validateCreateUser";

const router = express.Router();
const {create, allUsers} = controller;

router.post("/", validateCreateUser, create);
router.get("/", allUsers);

export default router;
