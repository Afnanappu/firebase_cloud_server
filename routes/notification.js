import { Router } from "express";
import { singleNotification, bulkNotification } from "../controllers/notificationController.js";

const router = Router()

router.post('/single', singleNotification)
router.post('/bulk', bulkNotification)


export default router;