const express = require('express');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const userInfo = require('./routes/userInfo')

app.use('/', userInfo)

app.listen(PORT, ()=>{
    console.log(`app listening on port ${PORT}`)
})

