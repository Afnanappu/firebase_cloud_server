import sendMailService from "../service/mailerService.js";
import errorCreator from "../utils/error.js";
import HttpStatus from "../utils/statusCodes.js";

export const sendMail = async (req, res, next) => {
    try {
        const { to, subject, text,html } = req.body;

        if (!to || !subject || !text) {
            errorCreator("to , subject and text are required", HttpStatus.BAD_REQUEST);
            return;
        }

        const info = await sendMailService(to, subject, text,html);
        res.json({ success: true, info })
    } catch (err) {
        next(err)
    }
}