import express from "express";
const router = express.Router();
import hourController from "../controllers/hourController.js";
import auth from "../auth/auth.js";

router.post("/", auth.empAuth, hourController.CreateHour);

router.get("/", auth.empAuth, hourController.GetAllHoursByLoggedinUser);

router.patch("/", auth.manAuth, hourController.ApproveLoggedHours);

router.get("/pending", auth.empAuth, hourController.GetPendingHours);

router.get("/allhours", auth.empAuth, hourController.GetAllHoursByAllUser);

router.get("/:id", auth.empAuth, hourController.GetAllHoursByUser);

router.delete("/:id", auth.manAuth, hourController.DeleteHour);

export default router;
