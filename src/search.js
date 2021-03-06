module.exports.init = async(firestore, algolia) => {
    // const assets = algolia.initIndex("assets");
    // const inventories = algolia.initIndex("inventories");
    // const issued = algolia.initIndex("issued");
    // const cards = algolia.initIndex("cards");
    // const categories = algolia.initIndex("categories");
    // const users = algolia.initIndex("users");

    // await fetchAssets(firestore, assets);
    // await fetchInventories(firestore, inventories);
    // await fetchIssued(firestore, issued);
    // await fetchCards(firestore, cards);
    // await fetchCategories(firestore, categories);
    // await fetchUsers(firestore, users);

    // listenToAssets(firestore, assets);
    // listenToInventories(firestore, inventories);
    // listenToIssued(firestore, issued);
    // listenToCards(firestore, cards);
    // listenToCategories(firestore, categories);
    // listenToUsers(firestore, users);
}

const fetchAssets = async (firestore, index) => {
  try {
    const assets = await firestore.collection("assets").get();

    const transformed = [];
    assets.docs.forEach((doc) => {
      const data = doc.data();

      transformed.push({ ...data, objectID: data.stockNumber })
    })

    await index.saveObjects(transformed);
  } catch (error) { console.log(`assets: ${error}`); }
}
const fetchInventories = async (firestore, index) => {
  try {
    const inventories = await firestore.collection("inventories").get();

    const transformed = [];
    inventories.docs.forEach((doc) => {
      const data = doc.data();
      let inventory = { ...data };

      transformed.push({ ...inventory, objectID: data.inventoryReportId })
    })

    await index.saveObjects(transformed);
  } catch (error) { console.log(`inventories: ${error}`); }
}
const fetchIssued = async (firestore, index) => {
  try {
    const cards = await firestore.collection("issued").get();

    const transformed = [];
    cards.docs.forEach((doc) => {
      const data = doc.data();
      let issue = { ...data };

      transformed.push({ ...issue, objectID: data.issuedReportId })
    })

    await index.saveObjects(transformed);
  } catch (error) { console.log(`issued: ${error}`); }
}
const fetchCards = async (firestore, index) => {
  try {
    const issued = await firestore.collection("cards").get();

    const transformed = [];
    issued.docs.forEach((doc) => {
      const data = doc.data();
      let card = { ...data };

      transformed.push({ ...card, objectID: data.stockCardId })
    })

    await index.saveObjects(transformed);
  } catch (error) { console.log(`stockCard: ${error}`); }
}
const fetchCategories = async (firestore, index) => {
  try {
    const categories = await firestore.collection("categories").get();

    const transformed = [];
    categories.docs.forEach((doc) => {
      const data = doc.data();

      transformed.push({ ...data, objectID: data.categoryId })
    })

    await index.saveObjects(transformed);
  } catch (error) { console.log(`categories: ${error}`); }
}

const fetchUsers = async (firestore, index) => {
  // try {
  //   const users = await firestore.collection("users").get();

  //   const transformed = [];
  //   users.docs.forEach((doc) => {
  //     const data = doc.data();

  //     transformed.push({ ...data, objectID: data.userId })
  //   })

  //   await index.saveObjects(transformed);
  // } catch (error) { console.log(`users: ${error}`); }
}

const listenToAssets = (firestore, index) => {
  firestore.collection("assets").onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const data = change.doc.data();

      if (change.type === 'added' || change.type === 'modified')
        index.saveObject({ ...data, objectID: data.stockNumber })
          .then(function() {
            onSuccess('assets', change.type, data.stockNumber);
          })
          .catch(function(error) {
            onError('assets', change.type, data.stockNumber, error);
          });

      if (change.type === 'removed')
        index.deleteObject(data.stockNumber)
          .then(function() {
            onSuccess('assets', change.type, data.stockNumber);
          })
          .catch(function(error) {
            onError('assets', change.type, data.stockNumber, error);
          });
    })
  })
}
const listenToInventories = (firestore, index) => {
  firestore.collection("inventories").onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const data = change.doc.data();

      if (change.type === 'added' || change.type === 'modified')
        index.saveObject({ ...data, objectID: data.inventoryReportId })
          .then(function() {
            onSuccess('inventories', change.type, data.inventoryReportId);
          })
          .catch(function(error) {
            onError('inventories', change.type, data.inventoryReportId, error);
          });

      if (change.type === 'removed')
        index.deleteObject(data.inventoryReportId)
          .then(function() {
            onSuccess('inventories', change.type, data.inventoryReportId);
          })
          .catch(function(error) {
            onError('inventories', change.type, data.inventoryReportId, error);
          })
    })
  })
}
const listenToIssued = (firestore, index) => {
  firestore.collection("issued").onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const data = change.doc.data();

      if (change.type === 'added' || change.type === 'modified')
        index.saveObject({ ...data, objectID: data.issuedReportId })
          .then(function() {
            onSuccess('issued', change.type, data.issuedReportId);
          })
          .catch(function(error) {
            onError('issued', change.type, data.issuedReportId, error);
          });

      if (change.type === 'removed')
        index.deleteObject(data.issuedReportId)
          .then(function() {
            onSuccess('issued', change.type, data.issuedReportId);
          })
          .catch(function(error) {
            onError('issued', change.type, data.issuedReportId, error);
          })
    })
  })
}
const listenToCards = (firestore, index) => {
  firestore.collection("cards").onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const data = change.doc.data();

      if (change.type === 'added' || change.type === 'modified')
        index.saveObject({ ...data, objectID: data.stockCardId })
          .then(function() {
            onSuccess('cards', change.type, data.stockCardId);
          })
          .catch(function(error) {
            onError('cards', change.type, data.stockCardId, error);
          });

      if (change.type === 'removed')
        index.deleteObject(data.stockCardId)
          .then(function() {
            onSuccess('cards', change.type, data.stockCardId);
          })
          .catch(function(error) {
            onError('cards', change.type, data.stockCardId, error);
          })
    })
  })
}
const listenToCategories = (firestore, index) => {
  firestore.collection("categories").onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const data = change.doc.data();

      if (change.type === 'added' || change.type === 'modified')
        index.saveObject({ ...data, objectID: data.categoryId })
          .then(function() {
            onSuccess('categories', change.type, data.categoryId);
          })
          .catch(function(error) {
            onError('categories', change.type, data.categoryId, error);
          });

      if (change.type === 'removed')
        index.deleteObject(data.categoryId)
          .then(function() {
            onSuccess('categories', change.type, data.categoryId);
          })
          .catch(function(error) {
            onError('categories', change.type, data.categoryId, error);
          });
    })
  })
}
const listenToUsers = (firestore, index) => {
  firestore.collection("users").onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const data = change.doc.data();

      if (change.type === 'added' || change.type === 'modified')
        index.saveObject({ ...data, objectID: data.userId })
          .then(function() {
            onSuccess('users', change.type, data.userId);
          })
          .catch(function(error) {
            onError('users', change.type, data.userId, error);
          });

      if (change.type === 'removed')
        index.deleteObject(data.userId)
          .then(function() {
            onSuccess('users', change.type, data.userId);
          })
          .catch(function(error) {
            onError('users', change.type, data.userId, error);
          })
    })
  })
}

function onSuccess(name, action, id) { console.log(`${name}: ${action}: ${id}`); }
function onError(name, action, id, error) { console.log(`${name}: ${action}: ${id} - ${error}`); }
