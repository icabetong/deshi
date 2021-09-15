const utils = require("../utils");

module.exports.send = async (admin, request, response) => {
    /**
     * We first need to verify the credebility of the request
     * by authenticating the token from the request body.
     */
     if (!request.body.token)
        return response.sendStatus(401);
    else if (!request.body.deviceToken)
        return response.sendStatus(412);

    try {
        const token = await admin.auth().verifyIdToken(request.body.token);
        console.log(token);

        const message = {
            notification: {
                title: request.body.title,
                body: request.body.body,
            },
            android: {
                notification: {
                    title_loc_key: request.body.title,
                    body_loc_key: request.body.body
                }
            },
            data: {
                sender: request.body.extras.sender,
                target: request.body.extras.target
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
                extras: {
                    sender: request.extras.sender,
                    target: request.extras.target
                }
            })

        return response.sendStatus(200);

    } catch (error) {
        console.log(error);
        return response.sendStatus(500);
    }
}