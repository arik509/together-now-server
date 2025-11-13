require('dotenv').config();
const express = require('express');
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 3000;


var admin = require("firebase-admin");

var serviceAccount = require("./together-now-firebase-adminsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


app.use(cors());
app.use(express.json());


const logger = (req,res,next) => {
  console.log('Logging Info');
  next();
}

const verifyFireBaseToken = async(req,res,next) => {
  console.log('In the middleware', req.headers.authorization)
  if(!req.headers.authorization){
    return res.status(401).send({message: "Unauthorized access"})
  }
  const token = req.headers.authorization.split(' ')[1]
  if(!token){
    return res.status(401).send({message: "Unauthorized access"});
  }

  try{
    const userInfo = await admin.auth().verifyIdToken(token)
    req.token_email = userInfo.email;
    console.log(userInfo); 
    next()
  }
  catch{
    return res.status(401).send({message: "Unauthorized access"});
  }
}



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gagl2gk.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });



app.get('/', (req, res) => {
  res.send('Together Now Server is Running!')
})

async function run() {
    try {
      await client.connect();

      const db = client.db("together-now-db");
      const eventsCollection = db.collection('events');
      const participantsCollection = db.collection('participants');

      
      app.get("/events",logger,verifyFireBaseToken, async (req, res) => {
        try {
          console.log(req.query);
          const email = req.query.email;
          const query = {};
          
          if (email) {
            if(email !== req.token_email){
              return res.status(403).send({message: "Forbidden Access"}) 
            }
            query.creatorEmail = email;
          }
    
          const cursor = eventsCollection.find(query);
          const result = await cursor.toArray();
          res.send(result);
        } catch (error) {
          res.status(500).send({ message: "Failed to fetch events", error });
        }
      });

      
      app.get("/upcoming-events", async (req, res) => {
        try {
          const currentDate = new Date().toISOString();
          const { eventType, search } = req.query;
          
          
          const query = {
            eventDate: { $gte: currentDate }
          };
          
          
          if (eventType && eventType !== "All") {
            query.eventType = eventType;
          }
          
          
          if (search && search.trim() !== "") {
            query.$or = [
              { title: { $regex: search, $options: "i" } },
              { description: { $regex: search, $options: "i" } },
              { location: { $regex: search, $options: "i" } }
            ];
          }
          
          const cursor = eventsCollection.find(query).sort({ eventDate: 1 });
          const result = await cursor.toArray();
          res.send(result);
        } catch (error) {
          res.status(500).send({ message: "Failed to fetch upcoming events", error });
        }
      });

      
      app.get("/events/:id", async (req, res) => {
        try {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const result = await eventsCollection.findOne(query);
          
          if (!result) {
            return res.status(404).send({ message: "Event not found" });
          }
          
          res.send(result);
        } catch (error) {
          res.status(500).send({ message: "Failed to fetch event", error });
        }
      });

      
      app.post("/events", async (req, res) => {
        try {
          const newEvent = req.body;
          newEvent.createdAt = new Date().toISOString();
          
          const result = await eventsCollection.insertOne(newEvent);
          res.send(result);
        } catch (error) {
          res.status(500).send({ message: "Failed to create event", error });
        }
      });

     
      app.put("/events/:id", async (req, res) => {
        try {
          const id = req.params.id;
          const filter = { _id: new ObjectId(id) };
          const updatedEvent = req.body;
          
          const updateEventDoc = {
            $set: {
              title: updatedEvent.title,
              description: updatedEvent.description,
              eventType: updatedEvent.eventType,
              thumbnail: updatedEvent.thumbnail,
              location: updatedEvent.location,
              eventDate: updatedEvent.eventDate,
              updatedAt: new Date().toISOString()
            }
          };
          
          const result = await eventsCollection.updateOne(filter, updateEventDoc);
          res.send(result);
        } catch (error) {
          res.status(500).send({ message: "Failed to update event", error });
        }
      });

      
      app.delete("/events/:id", async (req, res) => {
        try {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const result = await eventsCollection.deleteOne(query);
          
          
          await participantsCollection.deleteMany({ eventId: id });
          
          res.send(result);
        } catch (error) {
          res.status(500).send({ message: "Failed to delete event", error });
        }
      });

     
      app.post("/participants", async (req, res) => {
        try {
          const participantData = req.body;
          
          const existingParticipant = await participantsCollection.findOne({
            eventId: participantData.eventId,
            userEmail: participantData.userEmail
          });
          
          if (existingParticipant) {
            return res.status(400).send({ message: "Already joined this event" });
          }
          
          participantData.joinedAt = new Date().toISOString();
          const result = await participantsCollection.insertOne(participantData);
          res.send(result);
        } catch (error) {
          res.status(500).send({ message: "Failed to join event", error });
        }
      });

      
      app.get("/participants/check", async (req, res) => {
        try {
          const { eventId, userEmail } = req.query;
          
          if (!eventId || !userEmail) {
            return res.status(400).send({ message: "eventId and userEmail are required" });
          }
          
          const participant = await participantsCollection.findOne({
            eventId: eventId,
            userEmail: userEmail
          });
          
          res.send({ hasJoined: !!participant });
        } catch (error) {
          res.status(500).send({ message: "Failed to check participation", error });
        }
      });

      
      app.get("/participants/user/:email", async (req, res) => {
        try {
          const email = req.params.email;
          const cursor = participantsCollection.find({ userEmail: email });
          const result = await cursor.toArray();
          res.send(result);
        } catch (error) {
          res.status(500).send({ message: "Failed to fetch joined events", error });
        }
      });

      
      app.get("/participants/event/:eventId", async (req, res) => {
        try {
          const eventId = req.params.eventId;
          const cursor = participantsCollection.find({ eventId: eventId });
          const result = await cursor.toArray();
          res.send(result);
        } catch (error) {
          res.status(500).send({ message: "Failed to fetch participants", error });
        }
      });

      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      
    }
  }
  run().catch(console.dir);

app.listen(port, () => {
  console.log(`Together Now Server is listening on port ${port}`)
})