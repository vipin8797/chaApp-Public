import express from "express";
import { checkAuth, login, signup, updateProfile } from "../controllers/userController.js";
const userRouter = express.Router({mergeParams:true});
import {protectRoute} from "../middleware/auth.js";

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.put("/update-profile", protectRoute, updateProfile);
userRouter.get("/check", protectRoute, checkAuth);



export default userRouter;


