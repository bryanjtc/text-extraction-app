const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require('cors')({ origin: true });

const envObj = functions.config();
admin.initializeApp();

exports.getEnv = functions.https.onRequest((req, resp) => {
  cors(req, resp, () => resp.status(200).send(envObj));
});
