// health-routes.js
import { Router } from "express";
import { getHealthHTML, getHealthJSON } from "./health-controller";

const router = Router();

router.get("/", getHealthHTML);
router.get("/json", getHealthJSON);

export default router;
