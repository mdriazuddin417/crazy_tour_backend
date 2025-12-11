import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserControllers } from "./user.controller";
import { Role } from "./user.interface";
import { createUserZodSchema } from "./user.validation";

const router = Router()



router.post("/register",
    validateRequest(createUserZodSchema),
    UserControllers.createUser)
router.get("/all-users", checkAuth(Role.ADMIN), UserControllers.getAllUsers)
router.get("/me", checkAuth(...Object.values(Role)), UserControllers.getMe)
router.get("/:id", UserControllers.getSingleUser)
router.patch("/:id", UserControllers.updateUser)
export const UserRoutes = router