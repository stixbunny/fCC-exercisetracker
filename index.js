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

const Exercise = mongoose.model("Exercise", exerciseSchema);

const userSchema = new Schema({
    username: {type: String, required: true}
});

const User = mongoose.model("User", userSchema);

const logSubSchema = new Schema({
    description: String,
    duration: Number,
    date: Date
});

const LogSub = mongoose.model("LogSub", logSubSchema);

const logSchema = new Schema({
    username: {type: String, required: true},
    count: 1,
    log: [ logSubSchema ]
});

const Log = mongoose.model("Log", logSchema);
//

app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));
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
    User.find({}, (err, usersFound) => {
        if(err) return console.error(err);
        let users = [];
        usersFound.map( user => { users.push(user) });
        res.json(users);
    });
});

// Creates a Excersise
app.post("/api/users/:_id/exercises", (req, res) => {
    const description = req.query.description;
    const duration = req.query.duration;
    let date = req.query.date;
    if(!date) {
        date = (new Date()).toDateString();
    }
    else {
        date = (new Date(date)).toDateString();
    }
    User.findById(_id, (err, userFound) => {
        if (err) return console.error(err);
        const exerciseRecord = new Exercise({
            username: userFound.username,
            description: description,
            duration: duration,
            date: date
        });
        exerciseRecord.save((err, insertedExercise) => {
            if(err) return console.error(err);
            res.json({...userFound, ...insertedExercise});
        });
    });
    
});

// Gets log of user
app.get("/api/users/:_id/logs", (req, res) => {

});
