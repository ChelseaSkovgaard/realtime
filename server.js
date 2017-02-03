'use strict'
const http = require('http')
const express = require('express');
const app = express();
const path = require('path');
const environment = process.env.NODE_ENV || 'development';

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Real Time';

app.locals.polls = [];
app.locals.answers = [[], [], [], []];
app.locals.votes = {}

const votes = {}
const voteCount = {}

app.use(express.static(path.join(__dirname, '/public')));

const port = process.env.PORT || 3000;
const server = http.createServer(app)
  .listen(port, () => {
    console.log(`Listening on port ${port}.`)
  });

const socketIo = require('socket.io');
const io = socketIo(server);

app.get('/', (request, response) => {
  response.sendfile(__dirname + '/public/index.html')
})

app.get('/poll', (request, response) => {
  response.sendfile(__dirname + '/public/poll.html')
})

app.get('/api/polls', (request, response) => {
  response.send(app.locals.polls)
});

app.post('/api/polls', (request, response) => {
  app.locals.polls = []
  app.locals.polls.push(request.body);
  response.send(app.locals.polls);
});

io.on('connection', (socket) => {
  io.sockets.emit('votes', app.locals.answers)
  io.sockets.emit('usersConnected', io.engine.clientsCount);

  socket.on('message', (channel, message) => {
    if(channel === 'voteCast') {
      app.locals.answers = app.locals.answers.map((answer) => {
        return answer.filter((vote) => {
          return vote !== message.photoUrl
        })
      })
      app.locals.answers[message.id].push(message.photoUrl)
      let votes = app.locals.answers[message.id]
      io.sockets.emit('votes', app.locals.answers);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user has disconnected.', io.engine.clientsCount);
    io.sockets.emit('usersConnected', io.engine.clientsCount);
  });
});

// for(let i = 0; i < app.locals.answers.length; i++) {
//   for(let j = 0; j < app.locals.answers[i].length; j++) {
//     if (app.locals.answers[i][j] === message.photoUrl) {
//       let index = app.locals.answers[i][j].indexOf(message.photoUrl)
//         delete app.locals.answers[i][ index ]
//     }
//   }
// }

module.exports = app;
