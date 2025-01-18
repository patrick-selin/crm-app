// testRoutes.js
import { Router } from "../../$node_modules/@types/express/index.js";
import { getTestItems, addTestItem } from "../controllers/testController";
const router = Router();

router.get("/test", getTestItems);
router.post("/test", addTestItem);

export default router;
