
module.exports.update = async (admin, request, response) => {
  const firestore = admin.firestore();
  /**
   * We first need to verify the credebility of the request
   * by authenticating the token from the request body.
   */
  if (!request.body.token)
    return response.status(401).send({ reason: "empty-auth-token" });
  else if (!request.body.department)
    return response.status(412).send({ reason: "empty-department" });

  try {
    const decodedToken = await admin.auth().verifyIdToken(request.body.token);
    console.log(decodedToken);

    const batch = firestore.batch();
    const department = request.body.department;

    batch.set(firestore.collection("departments")
      .doc(department.departmentId), department);

    if (department.manager) {
      batch.update(firestore.collection("users")
        .doc(department.manager.userId), "department", {
        departmentId: department.departmentId,
        name: department.name
      })
    }

    await batch.commit();
    return response.sendStatus(200);

  } catch (error) {
    console.log(error);

    switch (error.code) {
      case 'auth/invalid-credential':
        return response.status(401).send({ reason: "invalid-credentials" });

      case 'permission-denied':
        return response.status(403).send({ reason: "not-enough-permissions" });

      default: return response.status(500).send({ reason: "general-error" });
    }
  }
}