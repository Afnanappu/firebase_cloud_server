import { Router } from "express";
import { singleNotification } from "../controllers/notificationController.js";

const router = Router()

router.post('/single',singleNotification)


export default router;