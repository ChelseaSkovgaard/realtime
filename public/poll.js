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
    // renderResults(poll);
  });
});

function renderPoll(poll) {
  $('#poll-question').append(
    `<h3>${poll.question}</h3>`
  );
  for (var i = 0; i< 4; i++) {
    $('#choices').append(
      `<button class=choice-buttons type=radio id=${i}>${poll.answers[i]}</button>`
    )
    $('.votes-container').append(
      `<p><span class=results>${poll.answers[i]} : </span><span id=vote${i} class=count></span></p>`
    )
  }
  }


// function assignChoiceObject(poll) {
//     poll.answers.forEach(function(answer){
//       let vote = new Object(answer);
//       return Object.assign(votesCounter, votesCounter[answer], answer = 0);
//   });
// }

// function renderResults(poll) {
//   poll.answers.forEach(function(answer) {
//     $('#results').append(
//       `<p><span class=results>${answer} : </span><span class=count>0</span></p>`
//     );
//   });
// }

$('#choices').on('click', '.choice-buttons', function() {
  let id =  $(this).attr('id')
  let vote = {
    photoUrl: localStorage.getItem('photo'),
    id: id
  };
  socket.send('voteCast', vote );
});

socket.on('usersConnected', (count) => {
  connectionCount.innerText = 'Connected Users: ' + count;
});

// socket.on('results', (message) => {
//   results.innerText = message;
// });

socket.on('votes', (votes) => {
  votes.forEach(function(userArray, i){
    $(`#vote${i}`).empty();
  userArray.forEach(function(url) {
      $(`#vote${i}`).append(`<img src=${url} ></img>`)
    });
  });
});

  // $('.votes-container').append();


//   let voteCounts = (Object.values(Object.assign(votesCounter, votes)))
//   .reduce(function(allVotes, vote){
//     if (vote in allVotes) {
//       allVotes[vote]++;
//     } else {
//       allVotes[vote] = 1;
//     }
//     return allVotes;
//   }, {});
//   renderVotes(voteCounts);
// });


// function renderVotes(votes) {
//   $('#results').empty();
//   let answers = Object.keys(votes)
//
//   answers.forEach(function(count) {
//     console.log(answers);
//     $('#results').append(
//       `<p>${count} : <span class=count>${votes[count]}</span></p>`
//     );
//   });
//   console.log(answers);
// }
