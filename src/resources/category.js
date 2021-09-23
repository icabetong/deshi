
module.exports.update = async (admin, request, response) => {
    const firestore = admin.firestore();
    /**
     * We first need to verify the credebility of the request
     * by authenticating the token from the request body.
     */
    if (!request.body.token)
        return response.status(401).send({ reason: "empty-auth-token" });
    else if (!request.body.category) 
        return response.status(412).send({ reason: "empty-category" });

    try {
        const decodedToken = await admin.auth().verifyIdToken(request.body.token);
        console.log(decodedToken);

        const batch = firestore.batch();
        const category = request.body.category;

        batch.set(firestore.collection("categories")
            .doc(category.categoryId), category);

        const minimizedCategory = {
            categoryId: category.categoryId,
            categoryName: category.categoryName
        }
        
        const assets = await firestore.collection("assets")
            .where("category.categoryId", "==", category.categoryId)
            .get();
        assets.docs.forEach((doc) => {
            batch.update(doc.ref, "category", minimizedCategory);
        })

        const assignments = await firestore.collection("assignments")
            .where("asset.category.categoryId", "==", category.categoryId)
            .get();
        assignments.docs.forEach((doc) => {
            batch.update(doc.ref, "asset.category", minimizedCategory);
        })

        const requests = await firestore.collection("requests")
            .where("asset.category.categoryId", "==", category.categoryId)
            .get();
        requests.docs.forEach((doc) => {
            batch.update(doc.ref, "asset.category", minimizedCategory);
        })

        await batch.commit();

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