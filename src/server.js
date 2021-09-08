require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const user = require('./resources/user');
const notification = require('./resources/notification');

const app = express();

admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(Buffer.from(process.env.FIREBASE_TOKEN, 'base64').toString()))
})

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * HTTP Status Codes Reference:
 * 
 * 200 - OK
 * 201 - Created
 * 401 - Unauthorized
 * 403 - Forbidden
 * 412 - Precondition Failed
 * 422 - Unprocessable Entity
 * 500 - General Server Error
 */

app.post('/create-user', async (request, response) => {
    return user.create(admin, request, response);
});

app.patch('modify-user', async (request, response) => {
    return user.modify(admin, request, response);
});

app.delete('/remove-user', async (request, response) => {
    return user.delete(admin, request, response);
})

app.post('/send-notification', async (request, response) => {
    return notification.send(admin, request, response);
})

const port = 5000;
app.listen(process.env.PORT || port, () => {
    console.log(`Server is listening to port ${process.env.PORT || port}`)
})