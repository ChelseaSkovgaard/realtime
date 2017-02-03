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

app.locals.votes = {};

// const votes = {}
const voteCount = {
}

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
  console.log( request.body.answers.reduce(function(acc, i){
    return acc[i] = []
  }, {}))
  
  app.locals.votes = request.body.answers.reduce(function(acc, i){
    return acc[i] = []
  }, {})
  response.send(app.locals.votes)
});

io.on('connection', (socket) => {
  console.log('A user has connected.', io.engine.clientsCount);

  io.sockets.emit('usersConnected', io.engine.clientsCount);

  socket.emit('statusMessage', 'You have connected.');

  socket.on('message', (channel, message) => {
    if(channel === 'voteCast') {
      votes[socket.id] = message;
      io.sockets.emit('votes', votes);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user has disconnected.', io.engine.clientsCount);
    delete votes[socket.id];
    io.sockets.emit('usersConnected', io.engine.clientsCount);
  });
});



module.exports = app;
