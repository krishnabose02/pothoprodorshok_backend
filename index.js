const express = require('express')
var bodyParser = require('body-parser')

const path = require('path')
const PORT = process.env.PORT || 5000
const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// app.set('views', path.join(__dirname, 'views'))
// app.set('view engine', 'ejs')

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://ankan:4x7SpgR0F2aNnvg8@cluster0-qp6co.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  var db = client.db("test");

  if (err)
    console.log("error is ", err)

  app.get('/getallhazards', (req, res) => {
    db.collection("locations").find({}).toArray().then((element) => {
      res.send(element);
    });
  })

  app.post('/posthazard', (req, res) => {
    db.collection("locations").insertOne(req.body).then((element) => {
      res.status(200).send({
        "message": "Posted"
      })
    }).catch((error) => {
      res.status(404).send(error)
    })
  })

  app.post('/getnearby', (req, res) => {
    db.collection("locations").find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: req.body.coordinates
          },
          $maxDistance: req.body.radius,
          $minDistance: 0
        }
      }
    }).toArray().then((element) => {
      res.send(element);
    })
  })
  app.post('/login', (req, res) => {
    db.collection("users").find(req.body).toArray().then((element) => {
      if(element.length!=0)
      res.send(element);
      else
      res.status(404).send(
        {
          "message":"Not Found"
        }
      )
    }).catch((error) => {
      res.status(400).send(error);

    });

  })
  app.post('/postuser', (req, res) => {

    db.collection("users").insertOne(req.body).then((element) => {
      res.send(element);

    }).catch((error) => {
      res.send(error);
    })
  })

  app.get('/', (req, res) => res.sendfile('public/index.html'))

  app.listen(PORT, () => console.log(`Listening on ${PORT}`))

});
