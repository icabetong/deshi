require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const algoliasearch = require('algoliasearch');

const search = require('./search');
const asset = require('./resources/asset');
const category = require('./resources/category');
const user = require('./resources/user');
const reports = require('./resources/reports');

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
app.patch('/inventory-items', async (request, response) => {
  const index = algolia.initIndex("inventories");
  reports.updateInventoryItems(admin, index, request, response);
});
app.patch('/issued-items', async (request, response) => {
  const index = algolia.initIndex("issued");
  reports.updateIssuedItems(admin, index, request, response);
})
app.patch('/stock-card-entries', async (request, response) => {
  const index = algolia.initIndex("cards")
  reports.updateStockCardEntries(admin, index, request, response)
})

// Asset Requests
app.patch('/update-asset', async (request, response) => {
  return asset.update(admin, request, response);
});
// Category Requests
app.patch('/update-category', async (request, response) => {
  return category.update(admin, request, response);
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
