import { Router } from "express";

import helloWord from "./HelloWorld";

const router = Router();

router.use("/test", helloWord);

export default router;
