require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const algoliasearch = require('algoliasearch');

const search = require('./search');
const asset = require('./resources/asset');
const assignment = require('./resources/assignment');
const category = require('./resources/category');
const department = require('./resources/department');
const notification = require('./resources/notification');
const user = require('./resources/user');

const app = express();
const algolia = algoliasearch(
  process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_KEY
);

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

search.init(admin.firestore(), algolia);


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

// Asset Requests
app.patch('/update-asset', async (request, response) => {
  return asset.update(admin, request, response);
});

// Assignment Requests
app.patch('/update-assignment', async (request, response) => {
  return assignment.update(admin, request, response);
});

// Category Requests
app.patch('/update-category', async (request, response) => {
  return category.update(admin, request, response);
});

// Department Requests
app.patch('/update-department', async (request, response) => {
  return department.update(admin, request, response);
});

// User Requests
app.post('/create-user', async (request, response) => {
  return user.create(admin, request, response);
});
app.patch('modify-user', async (request, response) => {
  return user.modify(admin, request, response);
});
app.delete('/remove-user', async (request, response) => {
  return user.delete(admin, request, response);
});

// Notification Requests
app.post('/send-notification', async (request, response) => {
  return notification.send(admin, request, response);
});

// Search
app.get('/search-assets', async ({ body }, response) => {
  const { requests } = body;

  const results = await algolia.search(requests)
  return response.status(200).send(results)
});

const port = 5000;
app.listen(process.env.PORT || port, () => {
  console.log(`Server is listening to port ${process.env.PORT || port}`)
})