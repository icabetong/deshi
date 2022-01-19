module.exports.init = async(firestore, algolia) => {
    const assets = algolia.initIndex("assets");
    const assignments = algolia.initIndex("assignments");
    const categories = algolia.initIndex("categories");
    const departments = algolia.initIndex("departments");
    const requests = algolia.initIndex("requests");
    const users = algolia.initIndex("users");

    await fetchAssets(firestore, assets);
    await fetchAssignments(firestore, assignments);
    await fetchCategories(firestore, categories);
    await fetchDepartments(firestore, departments);
    await fetchRequests(firestore, requests);
    await fetchUsers(firestore, users);

    listenToAssets(firestore, assets);
    listenToAssignments(firestore, assignments);
    listenToCategories(firestore, categories);
    listenToDepartments(firestore, departments);
    listenToRequests(firestore, requests);
    listenToUsers(firestore, users);
}

const fetchAssets = async (firestore, index) => {
  try {
    const assets = await firestore.collection("assets").get();

    const transformed = [];
    assets.docs.forEach((doc) => {
      const data = doc.data();

      transformed.push({ ...data, objectID: data.assetId })
    })

    await index.saveObjects(transformed);
  } catch (error) { console.log(error); }
}
const fetchAssignments = async (firestore, index) => {
  try {
    const assignments = await firestore.collection("assignments").get();

    const transformed = [];
    assignments.docs.forEach((doc) => {
      const data = doc.data();
      let assignment = { ...data };

      transformed.push({ ...assignment, objectID: data.assignmentId })
    })

    await index.saveObjects(transformed);
  } catch (error) { console.log(error); }
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
const fetchRequests = async (firestore, index) => {
  try {
    const requests = await firestore.collection("requests").get();

    const transformed = [];
    requests.docs.forEach((doc) => {
      const data = doc.data();

      transformed.push({ ...data, objectID: data.requestId })
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

  } catch (error) { console.log(error); }
}

const listenToAssets = (firestore, index) => {
  firestore.collection("assets").onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const data = change.doc.data();

      if (change.type === 'added' || change.type === 'modified')
        index.saveObject({ ...data, objectID: data.assetId })
          .then(onPromiseHandled)
          .catch(onPromiseRejected);

      if (change.type === 'removed')
        index.deleteObject(data.assetId)
          .then(onPromiseHandled)
          .catch(onPromiseRejected);
    })
  })
}
const listenToAssignments = (firestore, index) => {
  firestore.collection("assignments").onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const data = change.doc.data();

      if (change.type === 'added' || change.type === 'modified')
        index.saveObject({ ...data, objectID: data.assignmentId })
          .then(onPromiseHandled)
          .catch(onPromiseRejected);

      if (change.type === 'removed')
        index.deleteObject(data.assignmentId)
          .then(onPromiseHandled)
          .catch(onPromiseRejected)
    })
  })
}
const listenToCategories = (firestore, index) => {
  firestore.collection("categories").onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const data = change.doc.data();

      if (change.type === 'added' || change.type === 'modified')
        index.saveObject({ ...data, objectID: data.categoryId })
          .then(onPromiseHandled)
          .catch(onPromiseRejected);

      if (change.type === 'removed')
        index.deleteObject(data.categoryId)
          .then(onPromiseHandled)
          .catch(onPromiseRejected)
    })
  })
}
const listenToDepartments = (firestore, index) => {
  firestore.collection("departments").onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const data = change.doc.data();

      if (change.type === 'added' || change.type === 'modified')
        index.saveObject({ ...data, objectID: data.departmentId })
          .then(onPromiseHandled)
          .catch(onPromiseRejected);

      if (change.type === 'removed')
        index.deleteObject(data.departmentId)
          .then(onPromiseHandled)
          .catch(onPromiseRejected)
    })
  })
}
const listenToRequests = (firestore, index) => {
  firestore.collection("requests").onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const data = change.doc.data();

      if (change.type === 'added' || change.type === 'modified')
        index.saveObject({ ...data, objectID: data.requestId })
          .then(onPromiseHandled)
          .catch(onPromiseRejected);

      if (change.type === 'removed')
        index.deleteObject(data.requestId)
          .then(onPromiseHandled)
          .catch(onPromiseRejected)
    })
  })
}
const listenToUsers = (firestore, index) => {
  firestore.collection("users").onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const data = change.doc.data();

      if (change.type === 'added' || change.type === 'modified')
        index.saveObject({ ...data, objectID: data.userId })
          .then(onPromiseHandled)
          .catch(onPromiseRejected);

      if (change.type === 'removed')
        index.deleteObject(data.userId)
          .then(onPromiseHandled)
          .catch(onPromiseRejected)
    })
  })
}

function onPromiseHandled() { console.log("Operation Successfull"); }
function onPromiseRejected(error) { console.log(error); }
