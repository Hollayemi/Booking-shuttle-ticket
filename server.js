require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
// const connectDB = require('./db')
// connectDB()

const auth = require('./Routes/auth');
const pickups = require('./Routes/pickups')

const app = express();
app.use(cors());
app.use(express.json());

app.use('/aau_shuttle', auth);
app.use('/aau_shuttle', pickups);

mongoose.connect(process.env.LOCAL_MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() =>{
    console.log('database connected ')
}).catch((err) => {
    console.log(err);
    process.exit(1)
})

app.listen(process.env.PORT || 3030, () => {
    console.log(`server running at port ${process.env.PORT}`);
});

