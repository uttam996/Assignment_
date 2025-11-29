import { Router } from "express";
import { requestRouter } from "./request.routes";
import { authRouter } from "./auth.routes";
import { userRouter } from "./user,auth";

const router = Router();

router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/requests", requestRouter);


export default router;