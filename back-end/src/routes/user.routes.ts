import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const router = Router();
const userController = new UserController();

router.post("/register", (req, res, next) => userController.register(req, res, next));
router.get("/", (req, res, next) => userController.list(req, res, next));

export default router;