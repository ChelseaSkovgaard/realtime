$(document).ready(function() {
  $.ajax({
    type: 'GET',
    url: '/api/polls'
  }).then(function(response) {
    let poll = response.polls[0]
  });
}

renderPoll(poll) {

  $('.poll-container').append(
    `
    <div>
      <h3>${poll.question}</h3>
      
    </div>
    `
  );
}
