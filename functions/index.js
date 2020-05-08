const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

admin.initializeApp(functions.config().firebase);

const db = admin.firestore(); // cloudFireStore Db
const app = express(); // Handle intern API
const main = express(); // Expose API

main.use(cors());
main.use('/api/v1', app);
main.use(bodyParser.json());

exports.kmUploadTracksMusic = functions.https.onRequest(main);

// post data
app.post('/save-track', async (request, response) => {
  try {
    console.log('request.-->', request.body)
    const { title, selected } = request.body;

    const data = {
      title, 
      musicalCategories: selected
    };

    const TracksRef = await db.collection('tracks').add(data);
    const track = await TracksRef.get();
    response.json({ id: track.id, data: track.data() });
  }
  catch (error) {
    response.status(500).send({ err: error.message });
  }
});