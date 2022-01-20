var admin = require("firebase-admin");
exports.deleteIMG = async (IMG) => {
    const bucket = admin.storage().bucket();
    bucket.deleteFiles({ prefix: IMG })
}