import admin from "firebase-admin";
import fs from "fs"
import path from "path";
import pathUtil from "../utils/pathUtil.js"
const __dirname = pathUtil(import.meta.url).__dirname;
const serviceAccount = JSON.parse(fs.readFileSync(path.join(__dirname, "../AfnanServiceAccount.json"), 'utf-8'));
import errorCreator from "../utils/error.js";
import HttpStatus from "../utils/statusCodes.js";
import notificationMessageCreator from "../utils/notificationMessageCreator.js";

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://stayscape-resort-booking-app.firebaseio.com'
});

export const singleNotification = async (req, res, next) => {
    try {
        const { uid, title, body, data, collection } = req.body;
        console.log(req.body);

        if (!uid || !title || !collection) {
            errorCreator("uid , title  and collection are required", HttpStatus.BAD_REQUEST);
            return;
        }

        const doc = await admin.firestore()
            .collection(collection)
            .doc(uid)
            .get();

        // const token = "fblzuHJdRHCHqFQh1iiG9B:APA91bEtVVFxacSwWVS5HxkbMlW9x0exvVG1__SPnIP_JNgUJxmnx1uLpwT38IFrVpo3hDPMHd5jAqW4o5D3f9Zr4HvJLYyAM_GdckbqY2NjWox6YXDY97s";
        const token = doc.data()?.fcmToken;
        console.log(token);


        if (!token) {
            errorCreator("token not found", HttpStatus.NOT_FOUND);
            return;
        }

        const message = notificationMessageCreator(title, token, body, data)

        const firebaseResponse = await admin.messaging().send(message);

        // Optional: Log notification in Firestore
        await admin.firestore().collection('notifications').add({
            uid: uid,
            title: title,
            body: body || {},
            sentTo: collection,
            sentAt: admin.firestore.FieldValue.serverTimestamp(),
            status: 'sent'
        });

        res.status(HttpStatus.OK).json({
            success: true,
            messageId: firebaseResponse
        });
    } catch (err) {
        next(err)
    }
}