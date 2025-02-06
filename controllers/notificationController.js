import admin from "firebase-admin";
import fs from "fs"
import path from "path";
import pathUtil from "../utils/pathUtil.js"
const __dirname = pathUtil(import.meta.url).__dirname;
const serviceAccount = JSON.parse(fs.readFileSync(path.join(__dirname, "../serviceAccount.json"), 'utf-8'));
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

        const token = doc.data()?.fcmToken;
        console.log(token);


        if (!token) {
            errorCreator("token not found", HttpStatus.NOT_FOUND);
            return;
        }

        const message = notificationMessageCreator(title, token, body, data)

        const firebaseResponse = await admin.messaging().send(message);

        // Optional: Log notification in Firestore
        await admin.firestore().collection(collection).doc(uid).collection('notifications').add({
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

export const bulkNotification = async (req, res, next) => {
    try {
        const { ids, title, body, data, collection } = req.body;
        console.log(req.body);

        if (!ids || !ids.length || !title || !collection) {
            errorCreator("uid , title  and collection are required", HttpStatus.BAD_REQUEST);
            return;
        }
        const validIds = [...(new Set(ids.filter(id => id)))]

        const tokens = await Promise.all(
            validIds.map(async (id) => {
                const userDoc = await admin.firestore()
                    .collection(collection)
                    .doc(id)
                    .get();
                return userDoc.data()?.fcmToken;
            })
        );

        const validTokens = tokens.filter(token => token)
        console.log(validTokens)

        if (!validTokens.length) {
            errorCreator("all tokens are invalid", HttpStatus.NOT_FOUND);
            return;
        }

        const messages = validTokens.map(token => notificationMessageCreator(title, token, body, data));

        const firebaseResponse = await admin.messaging().sendEach(messages)

        

        // Optional: Log notification in Firestore

        validIds.forEach(async (id) => {
            await admin.firestore().collection(collection).doc(id).collection('notifications').add({
                uid: id,
                title: title,
                body: body || {},
                sentTo: collection,
                sentAt: admin.firestore.FieldValue.serverTimestamp(),
                status: 'sent'
            });
        });

        res.status(HttpStatus.OK).json({
            success: true,
            messageId: firebaseResponse
        });
    } catch (err) {
        next(err)
    }
}





/*
 const { userIds, title, body, data } = req.body;

        const tokens = await Promise.all(
            userIds.map(async (userId) => {
                const userDoc = await admin.firestore()
                    .collection('users')
                    .doc(userId)
                    .get();
                return userDoc.data()?.fcmToken;
            })
        );

        const validTokens = tokens.filter(token => token);

        if (validTokens.length === 0) {
            return res.status(404).json({ error: 'No valid tokens found' });
        }

        const messages = validTokens.map(token => ({
            notification: {
                title: title || 'StayScape Notification',
                body: body || 'You have a new notification'
            },
            token: token,
            data: data || {}
        }));

        const response = await admin.messaging().sendAll(messages);

*/