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

  



 
  app.post('/login', (req, res) => {
    db.collection("users").find(req.body).toArray().then((element) => {
      if(element.length!=0)
      res.send(element[0]);
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
  app.post('/getnearbypolice',(req,res)=>{


    db.collection("locations").find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: req.body.coordinates
          },
        
        }
      },
      type:"police"
    }).toArray().then((element) => {
      res.send(element);
    })
  })

  app.post('/postjerk',(req,res)=>{
    db.collection("jerks").createIndex({"location":"2dsphere"});
    db.collection("jerks").find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [req.body.latitude,req.body.longitude]
          },
          $maxDistance: 50,
          $minDistance: 0
        }
      }
    }).toArray().then((element) => {
      console.log(element);
     if(element.length===0){
      db.collection("jerks").insertOne({
        "location" : {
          "type" : "Point",
          "coordinates" : [req.body.latitude,req.body.longitude]
        },
        "value":req.body.value,
        "timestamp":req.body.timestamp
  
       }).then(()=>{
         res.send({
           "message":"success"
         })
       })
     }
     else
     res.send({
       "message":"Already Present"
     })
     
    })

  })
  app.get('/getjerkdata',(req,res)=>{
    db.collection("jerks").find({}).toArray().then((x)=>{
res.send(x);
    })
  })

  app.post('/posthazard',(req,res)=>{
    db.collection("hazards").createIndex({"location":"2dsphere"});
     db.collection("hazards").find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [req.body.latitude,req.body.longitude]
          },
          $maxDistance: 50,
          $minDistance: 0
        }
      }
    }).toArray().then((x)=>{
      if(x.length===0){
        db.collection("hazards").insertOne({"type":req.body.type, "location" : {
          "type" : "Point",
          "coordinates" : [req.body.latitude,req.body.longitude]
        },"uid":req.body.uid,"details":req.body.details,"timestamp":req.body.timestamp}).then(()=>{
          res.send({
            "message":"success"
          })

        }).catch(()=>{
    
        })
      }
      else{
      
        res.send({
          "message":"Already Present"
        })
      }
     

    })
   
  })
  app.get('/gethazarddata',(req,res)=>{
    db.collection("hazards").find({}).toArray().then((x)=>{
res.send(x);
    })
  })
  app.post('/post history',(req,res)=>{

  })
  app.post('/find hazards',(req,res)=>{

  })

  app.get('/', (req, res) => res.sendfile('public/index.html'))

  app.listen(PORT, () => console.log(`Listening on ${PORT}`))

});
