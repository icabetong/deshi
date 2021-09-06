require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const utils = require('./utils');

const app = express();

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200
}
admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(Buffer.from(process.env.FIREBASE_TOKEN, 'base64').toString()))
})

/**
 *  example type request: 
 *  const request = {
 *      token: "",
 *      notification: { title: "", body: "" },
 *      deviceToken: "",
 *      data: {}
 *  }
 */

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/create-user', async (request, response) => {
    /**
     *  Check if the post request has a token
     *  return an Unauthorized status if there isn't any
     */
    if (!request.body.token)
        return response.sendStatus(401);
    else if (!request.body.email)
    // If there is not an email in the post request
    // return a Precondition Failed status.
        return response.sendStatus(412);

    try {
         /**
         * We first need to verify the credebility of the request
         * by authenticating the token from the request body.
         */
        let decodedToken = await admin.auth().verifyIdToken(request.body.token)
        console.log(decodedToken);

        const userDoc = await admin.firestore().collection("users")
            .doc(decodedToken.uid).get();
        if (!userDoc.exists)
            return response.sendStatus(401);
        
        const user = userDoc.data();
        if (utils.hasPermission(user.permissions, 16)) {
            const newUser = {
                userId: utils.newUserId(),
                email: request.body.email,
                firstName: request.body.firstName,
                lastName: request.body.lastName,
                permissions: request.body.permissions,
                position: request.body.position,
                department: request.body.department
            }
            
            await admin.firestore().collection("users")
                .doc(newUser.userId).set(newUser);
            await admin.auth().createUser({
                uid: newUser.userId,
                email: newUser.email,
                password: utils.randomPassword()
            })
        }
    } catch (error) {
        console.log(error);
        response.sendStatus(500);
    }
});

app.post('modify-user', async (request, response) => {
    if (!request.body.token)
        return response.sendStatus(401);
    else if (!request.body.userId || !request.body.disabled)
        return response.sendStatus(412);

    try {
        const decodedToken = await admin.auth().verifyIdToken(request.body.token);
        console.log(decodedToken);

        const userDoc = await admin.firestore().collection("users")
            .doc(decodedToken.uid).get();
        if (!userDoc.exists)
            return response.sendStatus(401);

        const user = userDoc.data();
        if (utils.hasPermission(user.permissions, 16)) {
            await admin.auth().updateUser(request.body.userId, {
                disabled: request.body.disabled
            })
            await admin.firestore().collection("users")
                .doc(request.body.userId).update({
                    disabled: request.body.disabled
                })
        } else response.sendStatus(401);
    } catch (error) {
        console.log(error);
        return response.sendStatus(error);
    }
});

app.post('/remove-user', async (request, response) => {
    if (!request.body.token)
        return response.sendStatus(401);
    else if (!request.body.userId)
        return response.sendStatus(412);

    try {
        const decodedToken = await admin.auth().verifyIdToken(request.body.token);

        console.log(decodedToken);
        const userDoc = await admin.firestore().collection("users")
            .doc(decodedToken.uid).get();
        if (!userDoc.exists)
            return response.sendStatus(401);

        const user = userDoc.data();
        if (utils.hasPermission(user.permissions, 16)) {
            await admin.auth().deleteUser(request.body.userId);
            await admin.firestore().collection("users").doc(request.body.userId)
                .delete();

            return response.sendStatus(200);
        } else return response.sendStatus(401);

    } catch (error) {
        console.log(error);
        return response.sendStatus(500);
    }
})

app.post('/send-notification', async (request, response) => {
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
                title: request.body.notification.title,
                body: request.body.notification.body
            },
            token: deviceToken
        }

        await admin.messaging().send(message)
        return response.sendStatus(200);

    } catch (error) {
        console.log(error);
        return response.sendStatus(500);
    }
})

const port = 5000;
app.listen(process.env.PORT || port, () => {
    console.log(`Server is listening to port ${process.env.PORT || port}`)
})