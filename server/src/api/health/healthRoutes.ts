// testRoutes.js
import { Router } from "express";
import { getHealthHTML, getHealthJSON } from "./healthController";

const router = Router();

router.get("/", getHealthHTML);
router.get("/json", getHealthJSON);

export default router;
