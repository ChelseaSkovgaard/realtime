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


app.use(express.static(path.join(__dirname, '/public')))

app.get('/', (request, response) => {
  response.sendfile(__dirname + '/public/index.html')
})

app.get('/poll', (request, response) => {
  response.sendfile(__dirname + '/public/poll.html')

})

app.get('/api/polls', (request, response) => {
  response.send(app.locals)
  console.log(app.locals)
});

app.post('/api/polls', (request, response) => {
  app.locals.polls.push(request.body)
  response.send(app.locals.polls)
  console.log(app.locals.polls);
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
