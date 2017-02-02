const socket = io();

const connectionCount = document.getElementById('connection-count');
const results = document.getElementById('results');
const voteDiv = document.querySelector('.votes')
const votesCounter = {}

$(document).ready(function() {
  $.ajax({
    type: 'GET',
    url: '/api/polls'
  }).then(function(response) {
    let poll = response[0]
    renderPoll(poll)
    renderResults(poll)
  });
});

function renderPoll(poll) {
  $('#poll-question').append(
    `<h3>${poll.question}</h3>`
  );
  poll.answers.forEach(function(answer) {
    $('#choices').append(
      `<button class=choice-buttons type=radio>${answer}</button>`
    );
  });
}

function renderResults(poll) {
  poll.answers.forEach(function(answer) {
    $('#results').append(
      `<p><span class=results>${answer} : </span><span class=count>0</span></p>`
    )
  })
}


$('#choices').on('click', '.choice-buttons', function() {
  socket.send('voteCast', this.innerText);
});

socket.on('usersConnected', (count) => {
  connectionCount.innerText = 'Connected Users: ' + count;
});

socket.on('results', (message) => {
  results.innerText = message;
});

socket.on('votes', (votes) => {
  $('.votes-container').append()
  let voteCounts = (Object.values(Object.assign(votesCounter, votes)))
  .reduce(function(allVotes, vote){
    if (vote in allVotes) {
      allVotes[vote]++;
    } else {
      allVotes[vote] = 1;
    }
    return allVotes;
  }, {});
console.log(voteCounts);
});
