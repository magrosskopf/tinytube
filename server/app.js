const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var cors = require('cors')
const keys = require('./key.json');


const url = "https://www.googleapis.com/youtube/v3/subscriptions";

const authurl = "https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.readonly&access_type=offline&include_granted_scopes=true&state=state_parameter_passthrough_value&redirect_uri=http%3A%2F%2Flocalhost%2Foauth2callback&response_type=code&client_id=";




const {google} = require('googleapis');
const path = require('path');
const {authenticate} = require('@google-cloud/local-auth');

// initialize the Youtube API library
const youtube = google.youtube('v3');

// a very simple example of getting data from a playlist
async function runSample() {
  const auth = await authenticate({
    keyfilePath: path.join(__dirname, './client_secret_707923546471-8n9824nk8gsuuo0lueaqd301khumq0pu.apps.googleusercontent.com.json'),
    scopes: ['https://www.googleapis.com/auth/youtube'],
  });
  google.options({auth});

  // the first query will return data with an etag
  const res = await getPlaylistData(null);
  const etag = res.data.etag;
  console.log(`etag: ${etag}`);

  // the second query will (likely) return no data, and an HTTP 304
  // since the If-None-Match header was set with a matching eTag
  const res2 = await getPlaylistData(etag);
  console.log(res2.status);
}

runSample();
/*
const userRoutes = require('./api/routes/user');


mongoose.connect("mongodb://localhost:27017").then(result => {
    console.log("connected");
}


);
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Alllow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
        return res.status(200).json({});
    }
    next();
});

app.use('/users', userRoutes);

*/
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;
