const express = require('express')
var bodyParser = require('body-parser')
var ObjectID = require('mongodb').ObjectID

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

app.get('/getnearby',(req,res)=>{

//   db.collection("hazards").find(
//     {
//       location:
//         { $near :
//            {
//              $geometry: { type: "Point",  coordinates: [ req.body.latitude, req.body.longitude ] },
//              $minDistance: 1000,
             
//            }
//         }
//     }
//  ).then((elements)=>{
//    elements.forEach(()=>{
     
//    })

//  })


})
app.post('/postpanic',(req,res)=>{
  db.collection("panics").createIndex({ "location": "2dsphere" });

  db.collection("panics").insertOne({
    "location": {
      "type": "Point",
      "coordinates": [req.body.latitude, req.body.longitude]
    },
    "uid": req.body.uid,
    "timestamp": req.body.timestamp

  }).then(()=>{
res.send({
  "message":"success"
})
  }).catch(()=>{
    res.status(404).send({
      "message":"Failure"
    })
  })

})
app.get('/getpanic',(req,res)=>{
  db.collection("panics").find({}).toArray().then((elements)=>{
res.send(elements);
  })

})
app.post('/updatepanic',(req,res)=>{
  db.collection("panics").updateOne({"uid":req.body.uid}, { $set: { "location": {
    "type": "Point",
    "coordinates": [req.body.latitude, req.body.longitude]
  },
  
  "timestamp": req.body.timestamp} }).then(()=>{
    res.send({
      "message":"success"
    })
  }).catch(()=>{
    res.send({
      "message":"failure"
    })
  })
})
app.post('/updatelocation',(req,res)=>{

  db.collection("users").updateOne({"_id": new ObjectID(req.body.uid)},{$set:{
    "location": {
      "type": "Point",
      "coordinates": [req.body.latitude, req.body.longitude]
    }



  }}).then(()=>{
    res.send({
      "message":"success"
    })
  })
})




  app.post('/login', (req, res) => {
    db.collection("users").find(req.body).toArray().then((element) => {
      if (element.length != 0)
        res.send(element[0]);
      else
        res.status(404).send(
          {
            "message": "Not Found"
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
  app.post('/getnearbypolice', (req, res) => {


    db.collection("locations").find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: req.body.coordinates
          },

        }
      },
      type: "police"
    }).toArray().then((element) => {
      res.send(element);
    })
  })

  app.post('/postjerk', (req, res) => {
    db.collection("jerks").createIndex({ "location": "2dsphere" });
    db.collection("jerks").find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [req.body.latitude, req.body.longitude]
          },
          $maxDistance: 50,
          $minDistance: 0
        }
      }
    }).toArray().then((element) => {
      console.log(element);
      if (element.length === 0) {
        db.collection("jerks").insertOne({
          "location": {
            "type": "Point",
            "coordinates": [req.body.latitude, req.body.longitude]
          },
          "value": req.body.value,
          "timestamp": req.body.timestamp

        }).then(() => {
          res.send({
            "message": "success"
          })
        })
      }
      else
        res.send({
          "message": "Already Present"
        })

    })

  })
  app.get('/getjerkdata', (req, res) => {
    db.collection("jerks").find({}).toArray().then((x) => {
      res.send(x);
    })
  })

  app.post('/posthazard', (req, res) => {
    db.collection("hazards").createIndex({ "location": "2dsphere" });
    db.collection("hazards").find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [req.body.latitude, req.body.longitude]
          },
          $maxDistance: 50,
          $minDistance: 0
        }
      }
    }).toArray().then((x) => {
      if (x.length === 0) {
        db.collection("hazards").insertOne({
          "type": req.body.type, "location": {
            "type": "Point",
            "coordinates": [req.body.latitude, req.body.longitude]
          }, "uid": req.body.uid, "details": req.body.details, "timestamp": req.body.timestamp
        }).then(() => {
          res.send({
            "message": "success"
          })

        }).catch(() => {

        })
      }
      else {

        res.send({
          "message": "Already Present"
        })
      }


    })

  })
  app.get('/gethazarddata', (req, res) => {
    db.collection("hazards").find({},{coordinates:0}).toArray().then((x) => {
      res.send(x);
    })
  })
  app.post('/posthistory', (req, res) => {
    console.log("in history");

 db.collection("history").createIndex({ "location": "2dsphere" });
    db.collection("history").find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [req.body.latitude, req.body.longitude]
          },
          $maxDistance: 50,
          $minDistance: 0
        }
      }
    }).toArray().then((x) => {
      
var c=new Date();
var ct=c.getTime();

      if (x.length === 0) {
        db.collection("history").insertOne({
          "type": req.body.type, "location": {
            "type": "Point",
            "coordinates": [req.body.latitude, req.body.longitude]
          }, "uid": req.body.uid, "details": req.body.details, "timestamp": req.body.timestamp
        }).then(() => {
          res.send({
            "message": "success"
          })

        }).catch(() => {

        })
      }
      else if(x[0].type!==req.body.type || ct-x[0].timestamp>=86400000){
        db.collection("history").insertOne({
          "type": req.body.type, "location": {
            "type": "Point",
            "coordinates": [req.body.latitude, req.body.longitude]
          }, "uid": req.body.uid, "details": req.body.details, "timestamp": req.body.timestamp
        }).then(() => {
          res.send({
            "message": "success"
          })

        }).catch(() => {

        })
      }
      else{
        res.send({
          "message":"Already Present"
        })
      }


    })

  })

  app.post('/findhazardandscore', function (req, res, next) {
    var coordinates = req.body
   // console.log(coordinates);
    var array = []

    var promise = new Promise((resolve, reject) => {
      resolve(
        coordinates.forEach((element) => {
          array.push([element.latitude, element.longitude])
        })

      )
    })
  promise.then(()=>{
    req.coordinates=array
    next()
  })
  
  
  
  }, (req, res) => {
    const meter=0.00001;
    var countjerks=0;
    var counthistory=0;
    var finalhazardarray=[];
    // console.log("negro",req.coordinates);
     var f=req.coordinates;
     function calcIsInsideThickLineSegment(line1, line2, pnt, lineThickness) {
      var L2 = (((line2.x - line1.x) * (line2.x - line1.x)) + ((line2.y - line1.y) * (line2.y - line1.y)));
      if (L2 == 0) return false;
      var r = (((pnt.x - line1.x) * (line2.x - line1.x)) + ((pnt.y - line1.y) * (line2.y - line1.y))) / L2;
    
      //Assume line thickness is circular
      if (r < 0) {
        //Outside line1
        return (Math.sqrt(((line1.x - pnt.x) * (line1.x - pnt.x)) + ((line1.y - pnt.y) * (line1.y - pnt.y))) <= lineThickness);
      } else if ((0 <= r) && (r <= 1)) {
        //On the line segment
        var s = (((line1.y - pnt.y) * (line2.x - line1.x)) - ((line1.x - pnt.x) * (line2.y - line1.y))) / L2;
        return (Math.abs(s) * Math.sqrt(L2) <= lineThickness);
      } else {
        //Outside line2
        return (Math.sqrt(((line2.x - pnt.x) * (line2.x - pnt.x)) + ((line2.y - pnt.y) * (line2.y - pnt.y))) <= lineThickness);
      }
    }
  
    var jerkpromise=new Promise((resolve,reject)=>{
     resolve( db.collection("jerks").find({}).toArray().then((alljerks)=>{
        //console.log("in here",alljerks);
        //console.log("fi",f);
         
       for (var i=0;i<f.length-1;i++){
         var d=f[i]
         var e=f[i+1]
         var pL1={"x":d[0],"y":d[1]}
         var pL2={"x":e[0],"y":e[1]}
       //  console.log("nk",d,e,pL1,pL2);
         
         for(var j=0;j<alljerks.length;j++){
           var point=alljerks[j].location.coordinates;
           var pN={"x":point[0],"y":point[1]}
           if( calcIsInsideThickLineSegment(pL1,pL2,pN,20*meter)==true)
           countjerks++;
          
   
         }
        
       }
       
       
      
      }))

    })
  var historypromise=new Promise((resolve,reject)=>{
   resolve( 
     db.collection("history").find({}).toArray().then((allhistory)=>{
      //console.log("in here",alljerks);
      //console.log("fi",f);
    
     for (var i=0;i<f.length-1;i++){
       var d=f[i]
       var e=f[i+1]
       var pL1={"x":d[0],"y":d[1]}
       var pL2={"x":e[0],"y":e[1]}
     //  console.log("nk",d,e,pL1,pL2);
       
       for(var j=0;j<allhistory.length;j++){
         var point=allhistory[j].location.coordinates;
         var pN={"x":point[0],"y":point[1]}
         if( calcIsInsideThickLineSegment(pL1,pL2,pN,20*meter)==true){
          if(allhistory[j].type==="Accident")
          counthistory=counthistory+10;
          else if(allhistory[j].type==="Theft")
          counthistory=counthistory+5;
         }
      
        
  
       }
      
     }
    
    
    })
    )
      

  })
  var hazardpromise=new Promise((resolve,reject)=>{
    resolve(   db.collection("hazards").find({}).toArray().then((allhazards)=>{
      //console.log("in here",alljerks);
      //console.log("fi",f);
    
     for (var i=0;i<f.length-1;i++){
       var d=f[i]
       var e=f[i+1]
       var pL1={"x":d[0],"y":d[1]}
       var pL2={"x":e[0],"y":e[1]}
     //  console.log("nk",d,e,pL1,pL2);
       
       for(var j=0;j<allhazards.length;j++){
         var point=allhazards[j].location.coordinates;
         var pN={"x":point[0],"y":point[1]}
         if( calcIsInsideThickLineSegment(pL1,pL2,pN,20*meter)==true){
       finalhazardarray.push(allhazards[j]);
         }
      
        
  
       }
      
     }
    
    
    }))

  })

  jerkpromise.then(()=>{
    historypromise.then(()=>{
     hazardpromise.then(()=>{
       console.log({
        "score":counthistory,
        "jerk":countjerks,
        "hazards":finalhazardarray

      });
       res.send({
         "score":counthistory+countjerks,
         "hazards":finalhazardarray

       })
     })

    })
  })
   

   
  })
  

  app.get('/', (req, res) => res.sendfile('public/index.html'))

  app.listen(PORT, () => console.log(`Listening on ${PORT}`))

});
