const { firestore } = require("firebase-admin");
const utils = require("../utils");

module.exports.send = async (admin, request, response) => {
    /**
     * We first need to verify the credebility of the request
     * by authenticating the token from the request body.
     */
    if (!request.body.token)
        return response.sendStatus(401);
    else if (!request.body.deviceToken)
        return response.sendStatus(200);

    try {
        const token = await admin.auth().verifyIdToken(request.body.token);
        console.log(token);

        const message = {
            data: {
                title: request.body.title,
                body: request.body.body,
                sender: request.body.extras.sender,
                target: request.body.extras.target,
                payload: request.body.payload,
            },
            token: request.body.deviceToken
        }

        await admin.messaging().send(message);

        const id = utils.newId();
        await admin.firestore().collection("notifications")
            .doc(id)
            .set({
                notificationId: id,
                title: request.body.title,
                body: request.body.body,
                payload: request.body.payload,
                senderId: request.body.senderId,
                receiverId: request.body.receiverId,
                timestamp: firestore.Timestamp.now(),
                extras: {
                    sender: request.body.extras.sender,
                    target: request.body.extras.target
                }
            })

        return response.sendStatus(200);

    } catch (error) {
        console.log(error);

        switch(error.code) {
            case 'messaging/registration-token-not-registered':
                return response.status(200).send({ reason: "messaging/registration-token-not-registered" })
            default:
                return response.sendStatus(500);
        }
    }
}
