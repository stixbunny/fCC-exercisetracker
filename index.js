const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose');
require('dotenv').config()

// MongoDB setup
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
    username: {type: String, required: true},
    description: String,
    duration: Number,
    date: Date
});

const userSchema = new Schema({
    username: {type: String, required: true}
});

const logSubSchema = new Schema({
    description: String,
    duration: Number,
    date: Date
});

const logSchema = new Schema({
    username: {type: String, required: true},
    count: 1,
    log: [ logSubSchema ]
});
//

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

// Creates a user
app.post("/api/users", (req, res) => {
    const userRecord = new userSchema({username: req.body.username});
    userRecord.save((err, savedUser) => {
        if (err) return console.error(err);
        res.json({username: savedUser.username, _id: savedUser.id});
    });
});

// Gets list of users
app.get("/api/users", (req, res) => {

});

// Creates a Excersise
app.post("/api/users/:_id/exercises", (req, res) => {

});

// Gets log of user
app.get("/api/users/:_id/logs", (req, res) => {

});
