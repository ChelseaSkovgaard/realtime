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
    console.log(response);
    let poll = response[0]
    renderPoll(poll);
  });
});

function renderPoll(poll) {
  $('#poll-question').append(
    `<h3>
      ${poll.question}
    </h3>`
  );
  for (var i = 0; i< 4; i++) {
    $('#choices').append(
      `<button class=choice-buttons type=radio id=${i}>
        ${poll.answers[i]}
       </button>`
    );
    $('.votes-container').append(
      `<p>
        <span class=results>${poll.answers[i]} : </span>
        <span id=vote${i} class=count></span>
        <span id=count${i}>0</span>
      </p>`
    );
  }
  }

$('#choices').on('click', '.choice-buttons', function() {
  let id =  $(this).attr('id');
  let vote = {
    photoUrl: localStorage.getItem('photo'),
    id: id
  };
  socket.send('voteCast', vote );
});

socket.on('usersConnected', (count) => {
  connectionCount.innerText = 'Connected Users: ' + count;
});

socket.on('votes', (votes) => {
  votes.forEach(function(results, i){
    $(`#vote${i}`).empty();
    $(`#count${i}`).empty();
    $(`#count${i}`).append(`<span> ${votes[i].length} </span>`);
    results.forEach(function(url) {
      $(`#vote${i}`).append(`<img src=${url} ></img>`);
    });
  });
});
