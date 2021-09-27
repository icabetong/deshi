
module.exports.update = async (admin, request, response) => {
    const firestore = admin.firestore();

    if (!request.body.token)
        return response.status(401).send({ reason: "empty-auth-token" });
    if (!request.body.assignment)
        return response.status(412).send({ reason: "empty-assignment" });

    try {
        const decodedToken = await admin.auth().verifyIdToken(request.body.token);
        console.log(decodedToken);

        const batch = firestore.batch();
        batch.set(firestore.collection("assignments")
            .doc(assignment.assignmentId), assignment);

        if (request.body.previousAssetId &&
            request.body.previousAssetId !== assignment.asset.assignmentId) {

            batch.update(firestore.collection("assets")
                .doc(request.body.previousAssetId), "status", "IDLE")
            
            batch.update(firestore.collection("assets")
                .doc(assignment.asset.assetId), "status", "OPERATIONAL");
        }

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