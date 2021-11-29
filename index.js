const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.9uobc.mongodb.net/${ process.env.DB_NAME}?retryWrites=true&w=majority`;


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


});





app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})