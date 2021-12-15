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
  console.log('database Error',err)
  const projectsCollection = client.db("luxuryApartment").collection("projects");
  const reviewCollection = client.db("luxuryApartment").collection("review");
  const servicesCollection = client.db("luxuryApartment").collection("services");
  const bookingsCollection = client.db("luxuryApartment").collection("bookings");
  const adminsCollection = client.db("luxuryApartment").collection("admin");
  const confirmedOrdersCollection = client.db("luxuryApartment").collection("confirmedOrders");
  const conpletedOrdersCollection = client.db("luxuryApartment").collection("completedOrders");
  
  // add project to DB 
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
  // get project from DB
  app.get('/projects',(req, res) => {
    projectsCollection.find({})
    .toArray((err, documents) =>{
      res.send(documents)
    })
  })

  // add client review to DB 
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

// get Client reviews from DB
app.get('/reviews', (req, res) => {
  reviewCollection.find({})
  .toArray((err, documents)=>{
    res.send(documents)
  })
})

// add service to DB
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

// get existing services from DB 
app.get('/services', (req, res) => {
  servicesCollection.find({})
  .toArray((err, documents)=>{
    res.send(documents)
  })
})
// get single service by id from DB
app.get('/service/:serviceId',(req, res)=>{
  servicesCollection.find({_id: ObjectId(req.params.serviceId)})
  .toArray((err, documents) => {
    res.send(documents);
  })
})

// delete single service from DB by id
app.delete('/deleteService/:id', (req, res)=> {
  servicesCollection.deleteOne({_id: ObjectId(req.params.id)})
  .then((err, results)=> {
    // console.log('delete method error', err);
    res.send(results)
  })
})
// update service  
app.patch('/updateService/:id', (req, res)=>{
  servicesCollection.updateOne({_id: ObjectId(req.params.id)},
  {
    $set: {title: req.body.title, description: req.body.description, price: req.body.price, image: req.body.icon}
  }).then(result=> {
    // console.log(result);
  })

})

// add Booking info to DB
app.post('/addBooking', async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const serviceName = req.body.serviceName;
  const servicePrice = req.body.servicePrice;
  const date = req.body.date;
  const pic = req.body.icon;

  const bookingInfo = {
    name, 
    email, 
    serviceName, 
    servicePrice,
    date,
    image: pic
  }
  const result = await bookingsCollection.insertOne(bookingInfo);
  res.json(result);
})
// get bookings from DB 
app.get('/bookings', (req, res) => {
  bookingsCollection.find({})
  .toArray((err, documents) =>{
    res.send(documents);
  })
})

// get single bookings info by id from DB
app.get('/booking/:id', (req, res) => {
  bookingsCollection.find({_id: ObjectId(req.params.id)})
  .toArray((err, document) =>{
    res.send(document);
  })
})


// add Admin info to DB
app.post('/addAdmin', async(req, res)=> {
  const adminEmail = req.body.adminEmail;
  const adminName = req.body.adminName;
  const adminInfo = {
    adminEmail, 
    adminName
  }
  const result = await adminsCollection.insertOne(adminInfo);
  res.json(result);

})
// get Admin info from DB
app.get('/adminPanel', (req, res)=> {
  adminsCollection.find({})
  .toArray((err, documents)=>{
    res.send(documents)
  }) 
})

// add confirmed order to DB 
app.post('/addConfirmedOrder', async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const servicePrice = req.body.servicePrice;
  const serviceName = req.body.serviceName;
  const date = req.body.date;
  const id = req.body.id;

  const confirmedOrderData = {
    name, 
    email, 
    serviceName,
    servicePrice,
    date,
    id
  }
  const result = await confirmedOrdersCollection.insertOne(confirmedOrderData);
  res.json(result);
})
// delete/Move Confirmed Orders by ID from ordersList DB folder
app.delete('/deleteConfirmedOrder/:id', (req, res) =>{
  console.log(req.params.id);
  bookingsCollection.deleteOne({id: ObjectId(req.params.id)})
  .then((err, result) => {
    res.send(result);
  })
  
})


// add completed order to Db
app.post('/addCompletedOrder', async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const servicePrice = req.body.servicePrice;
  const serviceName = req.body.serviceName;
  const date = req.body.date;
  const id = req.body.id;

  const completedOrderData = {
    name, 
    email, 
    serviceName,
    servicePrice,
    date,
    id
  }

  const result = await conpletedOrdersCollection.insertOne(completedOrderData);
  res.json(result);
})
/////////////////////////////////////////////////////////////
// delete/Move Completed Orders by ID from ordersList DB folder
app.delete('/deleteCompletedOrder/:id', (req, res) => {
  bookingsCollection.deleteOne({id: ObjectId(req.params.id)})
  .then((err, result) => {
    res.send(result);
  })
})



// get Confirmed orders from DB
app.get('/confirmedOrders', (req, res) =>{
  confirmedOrdersCollection.find({})
  .toArray((err, documents) =>{
    res.send(documents);
  })
})

//get Completed Orders from DB
app.get('/completedOrders', (req,res)=>{
  conpletedOrdersCollection.find({})
  .toArray((err, documents)=>{
    res.send(documents);
  })
})




});





app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})