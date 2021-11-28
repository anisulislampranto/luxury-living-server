const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.9uobc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload());


const port = process.env.port || 4040; 


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const projectsCollection = client.db("luxuryApartment").collection("projects");
  

  app.get('/projects', (req, res) => {
    projectsCollection.find({})
    .toArray((err, documents) =>{
      res.send(documents)
    })
  })

  app.post('/addReview', (req, res) => {
      const reviewData = req.body;
      console.log(reviewData);
  })

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


  console.log(project)
  const result = await projectsCollection.insertOne(project);
  res.json(result);
  console.log(result)
  })


});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})