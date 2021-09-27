
module.exports.update = async(admin, request, response) => {
    const firestore = admin.firestore();
    /**
     * We first need to verify the credebility of the request
     * by authenticating the token from the request body.
     */
    if (!request.body.token)
        return response.status(401).send({ reason: "empty-auth-token" });
    else if (!request.body.asset) 
        return response.status(412).send({ reason: "empty-asset" });

    try {
        const decodedToken = await admin.auth().verifyIdToken(request.body.token);
        console.log(decodedToken);

        const batch = firestore.batch();
        const asset = request.body.asset;
        
        batch.set(firestore.collection("assets").doc(asset.assetId), asset);
        
        if (request.body.categoryId) {
            batch.update(firestore.collection("categories")
                .doc(request.body.categoryId), "count", firestore.FieldValue.increment(-1));
        }
        if (asset.category.categoryId) {
            batch.update(firestore.collection("categories")
                .doc(asset.category.categoryId), "count", firestore.FieldValue.increment(1));
        }

        const minimizedAsset = {
            assetId: asset.assetId,
            assetName: asset.assetName,
            status: asset.status,
            category: asset.category,
        };

        const assignments = await firestore.collection("assignments")
            .where("asset.assetId", "==", asset.assetId)
            .get()
        assignments.docs.forEach((doc) => {
            batch.update(doc.ref, "asset", minimizedAsset);
        })

        const requests = await firestore.collection("requests")
            .where("asset.assetId", "==", asset.assetId)
            .get()
        requests.docs.forEach((doc) => {
            batch.update(doc.ref, "asset", minimizedAsset);
        })

        await batch.commit();
        return response.sendStatus(200);

    } catch (error) {
        console.log(error);

        switch(error.code) {
            case 'auth/invalid-credential': 
                return response.status(401).send({ reason: "invalid-credentials" });

            case 'permission-denied':
                return response.status(403).send({ reason: "not-enough-permissions" });

            default: return response.status(500).send({ reason: "general-error" });
        }
    }
}