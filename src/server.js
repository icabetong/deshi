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
    
    if (!request.body.token && !request.body.userId && !request.body.email)
        return response.sendStatus(401);

    /**
     * We first need to verify the credebility of the request
     * by authenticating the token from the request body.
     */

    try {
        let decodedToken = await admin.auth().verifyIdToken(request.body.token)
        console.log(decodedToken);

        const userDoc = await admin.firestore().collection("users")
            .doc(decodedToken.uid).get();
        if (!userDoc.exists)
            return response.sendStatus(401);
        
        const user = userDoc.data();
        if (utils.hasPermission(user.permissions, 16)) {
            const newUser = {
                userId: request.body.userId,
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
                password: "password"
            })
        }
    } catch (error) {
        console.log(error);
        response.sendStatus(500);
    }
})

app.post('/send-notification', (request, response) => {
    /**
     * We first need to verify the credebility of the request
     * by authenticating the token from the request body.
     */
    if (!request.body.token)
        return response.sendStatus(401);

    return admin.auth().verifyIdToken(request.body.token)
        .then((decodedToken) => {
            console.log(decodedToken);

            const deviceToken = request.body.deviceToken;
            if (!deviceToken)
                return response.sendStatus(412);
        
            const message = {
                notification: {
                    title: request.body.notification.title,
                    body: request.body.notification.body
                },
                token: deviceToken
            }
        
            return admin.messaging().send(message)
                .then((firebaseResponse) => {
                    console.log(`Response: ${firebaseResponse}`)
                    
                    return response.sendStatus(200);
                }).catch((error) => {
                    console.log(`Error: ${error}`)
        
                    return response.sendStatus(500);
                })
        }).catch((error) => {
            console.log(`Error: ${error}`);
            
            return response.sendStatus(500);
        })
})

const port = 5000;
app.listen(process.env.port || port, () => {
    console.log(`Server is listening to port ${port}`)
})