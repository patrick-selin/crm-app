// testRoutes.js
import { Router } from "express";
import { getTestItems, addTestItem } from "./test-controller";
const router = Router();

router.get("/", getTestItems);
router.post("/", addTestItem);

export default router;
