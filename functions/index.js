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

exports.kmTracksMusic = functions.https.onRequest(main);

// post data
app.post('/save-track', async (request, response) => {
  try {
    console.log('request.-->', request.body)
    const { title, selected, url } = request.body;

    const data = {
      title, 
      musicalCategories: selected,
      url
    };

    const TracksRef = await db.collection('tracks').add(data);
    const track = await TracksRef.get();
    response.json({ id: track.id, data: track.data() });
  }
  catch (error) {
    response.status(500).send({ err: error.message });
  }
});

// get all data categorie music
app.get('/music-categories', async (request, response) => {
  try {
    const querySnapshot = await db.collection('musicalCategories').get();
    const res = [];
    querySnapshot.forEach((doc) => {
      res.push({
        id: doc.id,
        data: doc.data()
      });
    });
    response.json(res);
  }
  catch (error) {
    response.status(500).send({ err: error.message });
  }
});

app.get('/tracks', async (request, response) => {
  try {
    const querySnapshot = await db.collection('tracks').get();
    const res = [];
    querySnapshot.forEach((doc) => {
      res.push({
        id: doc.id,
        data: doc.data()
      });
    });
    response.json(res);
  }
  catch (error) {
    response.status(500).send({ err: error.message });
  }
})


// get all data
app.get('/search', async (request, response) => {
  try {
    console.log('request.-->', request.query)
    // const { cats, title } = request.query;
    // const querySnapshot = await db.collection('musicalCategories').get();
    const res = [];
    // querySnapshot.forEach((doc) => {
    //   res.push({
    //     id: doc.id,
    //     data: doc.data()
    //   });
    // });
    response.json(res);
  }
  catch (error) {
    response.status(500).send({ err: error.message });
  }
});

