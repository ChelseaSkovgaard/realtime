const socket = io();

const connectionCount = document.getElementById('connection-count');
const results = document.getElementById('results');

$(document).ready(function() {
  $.ajax({
    type: 'GET',
    url: '/api/polls'
  }).then(function(response) {
    console.log(response[0])
    let poll = response[0]
    renderPoll(poll)
  });
});

function renderPoll(poll) {
  $('#poll-question').append(
    `<h3>${poll.question}</h3>`
  );
  poll.answers.forEach(function(answer) {
    $('#choices').append(
      `<button class=choice-buttons type=radio>${answer}</button>`
    )
  })
};


$('#choices').on('click', '.choice-buttons', function() {
  socket.send('voteCast', this.innerText);
})



socket.on('usersConnected', (count) => {
  connectionCount.innerText = 'Connected Users: ' + count;
});

socket.on('results', (message) => {
  results.innerText = message;
});
