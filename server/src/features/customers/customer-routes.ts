// customer-routes.ts
import { Router } from "express";
import * as customerController from "./customer-controller";

const customerRoutes = Router();

customerRoutes.get("/", customerController.getAllCustomers);
customerRoutes.post("/", customerController.addCustomer);
customerRoutes.get("/summary", customerController.getCustomersWithMetrics);
// customerRoutes.get("/:id", customerController.getCustomerById);
// customerRoutes.get("/:id/orders",customerController.getCustomerOrders;);


export default customerRoutes;
