
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
                title_loc_key: request.body.title,
                body_loc_key: request.body.body,
            },
            data: {
                sender: request.body.extras.sender,
                target: request.body.extras.target
            },
            token: deviceToken
        }

        await admin.messaging().send(message)
        return response.sendStatus(200);

    } catch (error) {
        console.log(error);
        return response.sendStatus(500);
    }
}