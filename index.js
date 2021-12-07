const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { ObjectId } = require('bson');


// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.9uobc.mongodb.net/${ process.env.DB_NAME}?retryWrites=true&w=majority`;
const uri = `mongodb+srv://adminPanel:test12345@cluster0.9uobc.mongodb.net/luxuryApartment?retryWrites=true&w=majority`;


const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload());


const port = process.env.port || 4040; 


app.get('/', (req, res) => {
  res.send('Hello World!')
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log(err)
  const projectsCollection = client.db("luxuryApartment").collection("projects");
  const reviewCollection = client.db("luxuryApartment").collection("review");
  const servicesCollection = client.db("luxuryApartment").collection("services");
  const bookingsCollection = client.db("luxuryApartment").collection("bookings");
  

  app.post('/addProject', async (req, res) => {
    const name = req.body.name;
    const location = req.body.location;
    const pic = req.files.image;
    const picData = pic.data;
    const encodedPic = picData.toString('base64');
    const imageBuffer = Buffer.from(encodedPic, 'base64');
    const project = {
      name,
      location,
      image: imageBuffer
  }

  const result = await projectsCollection.insertOne(project);
  res.json(result);
  })

  app.get('/projects',(req, res) => {
    projectsCollection.find({})
    .toArray((err, documents) =>{
      res.send(documents)
    })
  })



  app.post('/addReview', async (req, res) => {
    const name = req.body.name;
    const review = req.body.review;
    const reviewInfo = {
      name, 
      review
    }
    const result = await reviewCollection.insertOne(reviewInfo);
    res.json(result)  
})

app.get('/reviews', (req, res) => {
  reviewCollection.find({})
  .toArray((err, documents)=>{
    res.send(documents)
  })
})

app.post('/addServices', async (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const price = req.body.price;
  const pic = req.files.icon;
  const picData = pic.data;
  const encodedPic = picData.toString('base64');
  const imageBuffer = Buffer.from(encodedPic, 'base64');
  const project = {
    title,
    description,
    price,
    image: imageBuffer
}

const result = await servicesCollection.insertOne(project);
res.json(result);
})

app.get('/services', (req, res) => {
  servicesCollection.find({})
  .toArray((err, documents)=>{
    res.send(documents)
  })
})

app.get('/service/:serviceId',(req, res)=>{
  servicesCollection.find({_id: ObjectId(req.params.serviceId)})
  .toArray((err, documents) => {
    console.log(err)
    console.log(documents);
    res.send(documents[0])
  })
})

app.post('/addBooking', async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const serviceName = req.body.serviceName;
  const date = req.body.date;

  const bookingInfo = {
    name, 
    email, 
    serviceName, 
    date
  }
  const result = await bookingsCollection.insertOne(bookingInfo);
  res.json(result);
})


});





app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})