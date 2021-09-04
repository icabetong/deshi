require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

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

app.post('/notification', (request, response) => {
    /**
     * We first need to verify the credebility of the request
     * by authenticating the tokenf from the request body.
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