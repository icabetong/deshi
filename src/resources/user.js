require('dotenv').config();
const nodemailer = require('nodemailer');
const utils = require('../utils');

module.exports.create = async (admin, request, response) => {
    /**
     *  Check if the post request has a token
     *  return an Unauthorized status if there isn't any
     */
    if (!request.body.token)
        return response.status(401).send({ reason: "empty-auth-token" })
    else if (!request.body.email)
    // If there is not an email in the post request
    // return a Precondition Failed status.
        return response.status(412).send({ reason: "empty-email" });

    try {
        /**
         * We first need to verify the credebility of the request
         * by authenticating the token from the request body.
         */
        let decodedToken = await admin.auth().verifyIdToken(request.body.token)
        console.log(decodedToken);

        const userDoc = await admin.firestore().collection("users")
            .doc(decodedToken.uid).get();
        if (!userDoc.exists)
            return response.status(401).send({ reason: "invalid-uid" });
        
        const user = userDoc.data();
        if (utils.hasPermission(user.permissions, 16)) {
            const newUser = {
                userId: utils.newUserId(),
                email: request.body.email,
                firstName: request.body.firstName,
                lastName: request.body.lastName,
                permissions: request.body.permissions,
                position: request.body.position,
                department: request.body.department
            }
            
            const password = utils.randomPassword();
            await admin.auth().createUser({
                uid: newUser.userId,
                email: newUser.email,
                password: password
            });
            await admin.firestore().collection("users")
                .doc(newUser.userId).set(newUser);

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.MAIL_EMAIL_SOURCE,
                    pass: process.env.MAIL_EMAIL_PASSWORD
                }
            })

            const mail = {
                from: process.env.MAIL_EMAIL_SOURCE,
                to: newUser.email,
                subject: "Your New Ludendorff Account",
                html: `Use this password for your account: <strong>${password}</strong>`
            }

            await transporter.sendMail(mail);
            console.log("Email sent: " + mail.to);

        } else return response.status(403).send({ reason: "not-enough-permissions" });

    } catch (error) {
        console.log(error.code);
        switch(error.code) {
            case 'auth/invalid-credential': 
                return response.status(401).send({ reason: "invalid-credentials" });

            case 'auth/email-already-in-use':
            case 'auth/email-already-exists':
                return response.status(422).send({ reason: "email-already-exists" });

            case 'auth/uid-already-exists':
                return response.status(422).send({ reason: "uid-already-exists" });

            case 'auth/invalid-email':
                return response.status(400).send({ reason: "invalid-email" });

            case 'auth/invalid-password':
                return response.status(400).send({ reason: "invalid-password" });

            case 'auth/user-not-found':
                return response.status(404).send({ reason: "user-not-found" });

            case 'permission-denied':
                return response.status(403).send({ reason: "not-enough-permissions" });

            default: 
                return response.status(500).send({ reason: "general-error" });
        }
    }
}

module.exports.modify = async(admin, request, response) => {
    /**
     *  Check if the post request has a token
     *  return an Unauthorized status if there isn't any
     */
     if (!request.body.token)
        return response.status(401).send({ reason: "empty-auth-token" })
    else if (!request.body.email)
    // If there is not an email in the post request
    // return a Precondition Failed status.
        return response.status(412).send({ reason: "empty-email" });

    try {
        const decodedToken = await admin.auth().verifyIdToken(request.body.token);
        console.log(decodedToken);

        const userDoc = await admin.firestore().collection("users")
            .doc(decodedToken.uid).get();
        if (!userDoc.exists)
            return response.status(401).send({ reason: "invalid-uid" });

        const user = userDoc.data();
        if (utils.hasPermission(user.permissions, 16)) {
            await admin.auth().updateUser(request.body.userId, {
                disabled: request.body.disabled
            })
            await admin.firestore().collection("users")
                .doc(request.body.userId).update({
                    disabled: request.body.disabled
                })

            return response.sendStatus(200);

        } else return response.status(403).send({ reason: "not-enough-permissions" });

    } catch (error) {
        console.log(error);
        switch(error.code) {
            case 'auth/invalid-credential': 
                return response.status(401).send({ reason: "invalid-credentials" });

            case 'auth/user-not-found':
                return response.status(404).send({ reason: "user-not-found" });

            case 'permission-denied':
                return response.status(403).send({ reason: "not-enough-permissions" });

            default: return response.status(500).send({ reason: "general-error" });
        }
    }
}

module.exports.delete = async (admin, request, response) => {
    /**
     *  Check if the post request has a token
     *  return an Unauthorized status if there isn't any
     */
     if (!request.body.token)
        return response.status(401).send({ reason: "empty-auth-token" })
    else if (!request.body.userId)
    // If there is not an userId in the post request
    // return a Precondition Failed status.
        return response.status(412).send({ reason: "empty-user-id" });

    try {
        const decodedToken = await admin.auth().verifyIdToken(request.body.token);

        console.log(decodedToken);
        const userDoc = await admin.firestore().collection("users")
            .doc(decodedToken.uid).get();
        if (!userDoc.exists)
            return response.status(401).send({ reason: "invalid-uid" });

        const user = userDoc.data();
        if (utils.hasPermission(user.permissions, 16)) {
            await admin.auth().deleteUser(request.body.userId);
            await admin.firestore().collection("users").doc(request.body.userId)
                .delete();

            return response.sendStatus(200);
        } else return response.status(403).send({ reason: "not-enough-permissions" });

    } catch (error) {
        console.log(error);
        switch(error.code) {
            case 'auth/invalid-credential': 
                return response.status(401).send({ reason: "invalid-credentials" });

            case 'auth/user-not-found':
                return response.status(404).send({ reason: "user-not-found" });

            case 'permission-denied':
                return response.status(403).send({ reason: "not-enough-permissions" });

            default: return response.status(500).send({ reason: "general-error" });
        }
    }
}

module.exports.update = async (admin, request, response) => {
    const firestore = admin.firestore();
    /**
     * We first need to verify the credebility of the request
     * by authenticating the token from the request body.
     */
    if (!request.body.token)
        return response.status(401).send({ reason: "empty-auth-token" });
    else if (!request.body.user) 
        return response.status(412).send({ reason: "empty-user" });

    try {
        const decodedToken = await admin.auth().verifyIdToken(request.body.token);
        console.log(decodedToken);

        const batch = firestore.batch();
        const user = request.body.user;

        batch.update(firestore.collection("users")
            .doc(user.userId), user);

        if (user.department) {
            const departments = await firestore.collection("departments")
                .where("manager.userId", "==", user.userId)
                .get();

            departments.docs.forEach((doc) => {
                if (doc.data().departmentId !== user.department.departmentId) {
                    batch.update(doc.ref, "manager", undefined);
                }
            });
        }

        const minimizedUser = {
            userId: user.userId,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            imageUrl: user.imageUrl,
            position: user.position,
            deviceToken: user.deviceToken 
        }

        const assignment = await firestore.collection("assignments")
            .where("user.userId", "==", user.userId)
            .get();
        assignment.docs.forEach((doc) => {
            batch.update(doc.ref, "user", minimizedUser);
        })

        const petitionedRequests = await firestore.collection("requests")
            .where("petitioner.userId", "==", user.userId)
            .get();
        petitionedRequests.docs.forEach((doc) => {
            batch.update(doc.ref, "petitioner", minimizedUser);
        })
        
        const endorsedRequests = await firestore.collection("requests")
            .where("endorser.userId", "==", user.userId)
            .get()
        endorsedRequests.docs.forEach((doc) => {
            batch.update(doc.ref, "endorser", minimizedUser);
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