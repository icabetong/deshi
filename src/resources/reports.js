module.exports.updateInventoryItems = async (admin, index, request, response) => {
  if (!request.body.token)
    return response.status(401).send({ reason: "empty-auth-token" });
  else if (!request.body.id)
    return response.status(412).send({ reason: 'empty-no-objectid' })
  else if (!request.body.items)
    return response.status(412).send({ reason: "empty-items" })

  try {
    const decodedToken = await admin.auth().verifyIdToken(request.body.token);
    console.log(decodedToken);

    await index.partialUpdateObject({
      items: request.body.items,
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