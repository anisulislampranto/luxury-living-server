const express = require('express');
const app = express();
const cors = require('cors');

const port = process.env.port || 4040; 



app.use(cors());
app.use(express.json());



app.get('/', (req, res) => {
  res.send('Hello Peter!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})