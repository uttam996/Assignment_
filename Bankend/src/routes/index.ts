import { Router } from "express";
import { userRouter } from "./user.routes";
import { requestRouter } from "./request.routes";

const router = Router();

router.use("/users", userRouter);
router.use("/requests", requestRouter);


export default router;