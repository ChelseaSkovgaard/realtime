$('.question-form').on('submit', function(e) {
  (e).preventDefault();
  var question = $('#question-input').val()
  var answers = Array.from($('.answer-inputs')).map((m) => m.value)
  $.ajax({
    type: 'POST',
    url: '/api/polls',
    data: {
      question: question,
      answers: answers
    }
  }).then(function(response) {
    $('.question-container').append(
      `<div class="question">
        ${question}
      </div>
      <a href="/poll.html"> Link </a>
      `
    )
  });
});
