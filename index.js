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
    date: Date,
    userId: String
});

const Exercise = mongoose.model("Exercise", exerciseSchema);

const userSchema = new Schema({
    username: {type: String, required: true}
});

const User = mongoose.model("User", userSchema);
//

app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

// Creates a user
app.post("/api/users", (req, res) => {
    const userRecord = new User({username: req.body.username});
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
    const description = req.body.description;
    const duration = req.body.duration;
    let date = req.body.date;
    if(!date) {
        date = (new Date()).toDateString();
    }
    else {
        date = (new Date(date)).toDateString();
    }
    User.findById(req.params._id, (err, userFound) => {
        if (err) return console.error(err);
        const exerciseRecord = new Exercise({
            username: userFound.username,
            description: description,
            duration: duration,
            date: date,
            userId: userFound.id
        });
        exerciseRecord.save((err, insertedExercise) => {
            if(err) return console.error(err);
            const result = {
              _id: insertedExercise.userId,
              username: insertedExercise.username,
              date: insertedExercise.date.toDateString(),
              duration: insertedExercise.duration,
              description: insertedExercise.description};
            console.log(result);
            res.json(result);
        });
    });
});

// Gets log of user
app.get("/api/users/:_id/logs", (req, res) => {
  console.log(req.path);
  const from = req.query.from || (new Date(0)).toDateString();
  const to = req.query.to || (new Date(Date.now())).toDateString();
  const limit = Number(req.query.limit) || 0;
  const id = req.params._id;
  console.log(`from: ${from} to: ${to} limit: ${limit} id: ${id}`);
  Exercise.find({userId: id, date: {$gte: from, $lte: to}}).limit(limit).exec((err, exerciseFound) => {
    if (err) return console.error(err);
    const count = exerciseFound.length;
    let username;
    if(count > 1) {
      username = exerciseFound[0].username;
    }
    else {
      username = exerciseFound.username;
    }
    const logs = exerciseFound.map((exercise => {
      return {
        description: exercise.description,
        duration: exercise.duration,
        date: exercise.date.toDateString()
      }
    }));
    const result = {
      _id: id,
      username: username,
      count: count,
      log: logs};
    console.log(result);
    res.json(result)
  });
});
