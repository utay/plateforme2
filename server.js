const express = require('express');
const mongoose = require('mongoose');

let mongoUrl = process.env.MONGO_URL ? process.env.MONGO_URL : 'localhost';
mongoose.connect(`mongodb://${mongoUrl}/clicks`);

const Clicks = mongoose.model('Clicks', { nb: Number });

const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

async function getClicks() {
  return Clicks.findOne().exec();
}

app.get('/', async function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  const clicks = await getClicks();
  if (!clicks) {
    res.send(JSON.stringify({ nb: 0 }));
  } else {
    res.send(JSON.stringify({ nb: clicks.nb }));
  }
});

app.get('/increment', async function(req, res) {
  const clicks = await getClicks();
  console.log(clicks)
  if (!clicks) {
    const c = new Clicks({ nb: 1 });
    c.save();
  } else {
    clicks.nb++;
    clicks.save();
  }
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ success: true }));
});

app.listen(8080, function() {
  console.log('Listening on port 8080...')
});
