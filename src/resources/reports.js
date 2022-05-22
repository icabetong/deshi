module.exports.updateInventoryItems = async (admin, index, request, response) => {
  if (!request.body.token)
    return response.status(401).send({ reason: "empty-auth-token" });
  else if (!request.body.id)
    return response.status(412).send({ reason: 'empty-no-objectid' })
  else if (!request.body.inventoryItems)
    return response.status(412).send({ reason: "empty-items" })

  try {
    const decodedToken = await admin.auth().verifyIdToken(request.body.token);
    console.log(decodedToken);

    await index.partialUpdateObject({
      inventoryItems: request.body.inventoryItems,
      objectID: request.body.id,
    });
    return response.sendStatus(200);
  } catch (error) {
    console.log(error);

    switch(error.code) {
      case 'auth/invalid-credential':
        return response.status(401).send({ reason: "invalid-credentials" })
      default:
        return response.status(500).send({ reason: 'general-error' })
    }
  }
}

module.exports.updateIssuedItems = async (admin, index, request, response) => {
  if (!request.body.token)
    return response.status(401).send({ reason: "empty-auth-token" });
  else if (!request.body.id)
    return response.status(412).send({ reason: 'empty-no-objectid' });
  else if (!request.body.issuedItems)
    return response.status(412).send({ reason: "empty-items" });

  try {
    const decodedToken = await admin.auth().verifyIdToken(request.body.token);
    console.log(decodedToken);

    await index.partialUpdateObject({
      issuedItems: request.body.issuedItems,
      objectID: request.body.id,
    });
    return response.sendStatus(200);
  } catch (error) {
    console.log(error);

    switch(error.code) {
      case 'auth/invalid-credential':
        return response.status(401).send({ reason: "invalid-credentials" })
      default:
        return response.status(500).send({ reason: 'general-error' })
    }
  }
}

module.exports.updateStockCardEntries = async (admin, index, request, response) => {
  if (!request.body.token)
    return response.status(401).send({ reason: "empty-auth-token" });
  else if (!request.body.id)
    return response.status(412).send({ reason: 'empty-no-objectid' });
  else if (!request.body.entries)
    return response.status(412).send({ reason: "empty-entries" });

  try {
    const decodedToken = await admin.auth().verifyIdToken(request.body.token);
    console.log(decodedToken);

    await index.partialUpdateObject({
      entries: request.body.entries,
      objectID: request.body.id,
    });
    return response.sendStatus(200);
  } catch (error) {
    console.log(error);

    switch(error.code) {
      case 'auth/invalid-credential':
        return response.status(401).send({ reason: "invalid-credentials" })
      default:
        return response.status(500).send({ reason: 'general-error' })
    }
  }
}