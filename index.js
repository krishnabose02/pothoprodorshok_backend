var express = require('express')
var bodyParser = require('body-parser')

var app = express()


app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())
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

            res.send(element);
        })
    })
    app.post('/getnearby', (req, res) => {

        db.collection("locations").find ({
            location: {
               $near: {
                 $geometry: {
                    type: "Point" ,
                    coordinates: req.body.coordinates
                 },
                 $maxDistance: req.body.radius,
                 $minDistance: 0
               }
             }
          }).toArray().then((element)=>{
              res.send(element);
          })
    })

    app.get('/', (req, res) => {
        res.sendfile('public/index.html');
    })

    app.listen('5000', () => {
        console.log("Server is up at 5000");
    })



});
