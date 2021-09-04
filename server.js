require('dotenv').config();
const express = require('express');
const admin = require('firebase-admin');

const app = express();

admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(Buffer.from(process.env.FIREBASE_TOKEN, 'base64').toString()))
})

/**
 *  example type request: 
 *  const request = {
 *      notification: { title: "", body: "" },
 *      deviceToken: "",
 *      data: {}
 *  }
 */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/notification', (request, response) => {
    var deviceToken = request.body.deviceToken;
    if (!deviceToken)
        return;

    const message = {
        notification: {
            title: request.body.notification.title,
            body: request.body.notification.body
        },
        token: deviceToken
    }

    admin.messaging().send(message)
        .then((response) => console.log(response))
        .catch((error) => console.log(error))

    return response.sendStatus(200);
})

const port = 5000;
app.listen(port, () => {
    console.log(`Server is listening to port ${port}`)
})