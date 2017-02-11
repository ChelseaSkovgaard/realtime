$('.question-form').on('submit', function(e) {
  (e).preventDefault();

  var question = $('#question-input').val();

  var answers = Array.from($('.answer-inputs')).map((m) => m.value);

  var id = Date.now();

  $.ajax({
    type: 'POST',
    url: '/api/polls',
    data: {
      id: id,
      question: question,
      answers: answers
    }
  })

  .then(function(response) {
    $('.question-container').append(
      `
      <div class="question">
        ${question}
      </div>
      <a href="/poll.html">
        Link
      </a>
      `
    );
  });
});
