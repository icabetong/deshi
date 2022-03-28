module.exports.init = async(firestore, algolia) => {
    const assets = algolia.initIndex("assets");
    const inventories = algolia.initIndex("inventories");
    const issued = algolia.initIndex("issued");
    const types = algolia.initIndex("types");
    const departments = algolia.initIndex("departments");
    const users = algolia.initIndex("users");

    await fetchAssets(firestore, assets);
    await fetchInventories(firestore, inventories);
    await fetchIssued(firestore, issued);
    await fetchTypes(firestore, types);
    await fetchDepartments(firestore, departments);
    await fetchUsers(firestore, users);

    listenToAssets(firestore, assets);
    listenToInventories(firestore, inventories);
    listenToIssued(firestore, issued);
    listenToTypes(firestore, types);
    listenToDepartments(firestore, departments);
    listenToUsers(firestore, users);
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
  } catch (error) { console.log(error); }
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
  } catch (error) { console.log(error); }
}
const fetchIssued = async (firestore, index) => {
  try {
    const issued = await firestore.collection("issued").get();

    const transformed = [];
    issued.docs.forEach((doc) => {
      const data = doc.data();
      let issued = { ...data };

      transformed.push({ ...issued, objectID: data.issedReportId })
    })

    await index.saveObjects(transformed);
  } catch (error) { console.log(error); }
}
const fetchTypes = async (firestore, index) => {
  try {
    const categories = await firestore.collection("categories").get();

    const transformed = [];
    categories.docs.forEach((doc) => {
      const data = doc.data();

      transformed.push({ ...data, objectID: data.categoryId })
    })

    await index.saveObjects(transformed);
  } catch (error) { console.log(error); }
}
const fetchDepartments = async (firestore, index) => {
  try {
    const departments = await firestore.collection("departments").get();

    const transformed = [];
    departments.docs.forEach((doc) => {
      const data = doc.data();

      transformed.push({ ...data, objectID: data.departmentId })
    })

    await index.saveObjects(transformed);
  } catch (error) { console.log(error); }
}

const fetchUsers = async (firestore, index) => {
  try {
    const users = await firestore.collection("users").get();

    const transformed = [];
    users.docs.forEach((doc) => {
      const data = doc.data();

      transformed.push({ ...data, objectID: data.userId })
    })

    await index.saveObjects(transformed);
  } catch (error) { console.log(error); }
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
const listenToTypes = (firestore, index) => {
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
const listenToDepartments = (firestore, index) => {
  firestore.collection("departments").onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const data = change.doc.data();

      if (change.type === 'added' || change.type === 'modified')
        index.saveObject({ ...data, objectID: data.departmentId })
          .then(function() {
            onSuccess('department', change.type, data.departmentId);
          })
          .catch(function(error) {
            onError('department', change.type, data.departmentId, error);
          });

      if (change.type === 'removed')
        index.deleteObject(data.departmentId)
          .then(function() {
            onSuccess('department', change.type, data.departmentId);
          })
          .catch(function(error) {
            onError('department', change.type, data.departmentId, error);
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
