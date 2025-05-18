let currentQuestion = 0;
let score = 0;

const quizDiv = document.getElementById('quiz');
const scoreDiv = document.getElementById('score');
const nextBtn = document.getElementById('next-btn');

function showQuestion() {
  nextBtn.style.display = "none";
  scoreDiv.textContent = `Score: ${score} / ${currentQuestion}`;
  const q = questions[currentQuestion];
  let html = `<div class="question">${q.question}</div>`;

  if (q.type === "mc") {
    html += '<ul class="options">';
    q.options.forEach((opt, idx) => {
      html += `<li><button class="option-btn" data-idx="${idx}">${opt}</button></li>`;
    });
    html += '</ul>';
  } else if (q.type === "tf") {
    html += `
      <button class="option-btn" data-tf="true">True</button>
      <button class="option-btn" data-tf="false">False</button>
    `;
  } else if (q.type === "oe") {
    html += `
      <input type="text" id="oe-answer" placeholder="Your answer" style="width:90%;padding:8px;">
      <button id="submit-oe">Submit</button>
    `;
  }

  quizDiv.innerHTML = html;

  // Add event listeners
  if (q.type === "mc") {
    document.querySelectorAll('.option-btn').forEach(btn => {
      btn.onclick = function() {
        handleMCAnswer(parseInt(this.dataset.idx), this);
      };
    });
  } else if (q.type === "tf") {
    document.querySelectorAll('.option-btn').forEach(btn => {
      btn.onclick = function() {
        handleTFAnswer(this.dataset.tf === "true", this);
      };
    });
  } else if (q.type === "oe") {
    document.getElementById('submit-oe').onclick = function() {
      handleOEAnswer();
    };
  }
}

function handleMCAnswer(selectedIdx, btn) {
  const q = questions[currentQuestion];
  document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
  btn.classList.add('selected');
  if (selectedIdx === q.answer) {
    btn.classList.add('correct');
    score++;
    scoreDiv.textContent = `Correct! Score: ${score} / ${currentQuestion + 1}`;
  } else {
    btn.classList.add('incorrect');
    document.querySelectorAll('.option-btn')[q.answer].classList.add('correct');
    let correctText = `<span style='color:#00ff66;'>${q.options[q.answer]}</span>`;
    let explanation = q.explanation ? `<br><span style='font-size:1rem;color:#0ff;'>Explanation: ${q.explanation}</span>` : '';
    scoreDiv.innerHTML = `Incorrect.<br>Correct answer: <b>${correctText}</b>. Score: ${score} / ${currentQuestion + 1}${explanation}`;
  }
  nextBtn.style.display = "inline-block";
}

function handleTFAnswer(selected, btn) {
  const q = questions[currentQuestion];
  document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
  btn.classList.add('selected');
  if (selected === q.answer) {
    btn.classList.add('correct');
    score++;
    scoreDiv.textContent = `Correct! Score: ${score} / ${currentQuestion + 1}`;
  } else {
    btn.classList.add('incorrect');
    let correctText = `<span style='color:#00ff66;'>${q.answer ? 'True' : 'False'}</span>`;
    let explanation = q.explanation ? `<br><span style='font-size:1rem;color:#0ff;'>Explanation: ${q.explanation}</span>` : '';
    scoreDiv.innerHTML = `Incorrect.<br>Correct answer: <b>${correctText}</b>. Score: ${score} / ${currentQuestion + 1}${explanation}`;
  }
  nextBtn.style.display = "inline-block";
}

function handleOEAnswer() {
  const q = questions[currentQuestion];
  const userAns = document.getElementById('oe-answer').value.trim().toLowerCase();
  const correctAns = q.answer.toLowerCase();
  let correct = false;
  // For open-ended, check if all keywords are present
  if (correctAns.split(',').every(word => userAns.includes(word.trim()))) {
    correct = true;
  }
  document.getElementById('oe-answer').disabled = true;
  document.getElementById('submit-oe').disabled = true;
  if (correct) {
    score++;
    scoreDiv.textContent = `Correct! Score: ${score} / ${currentQuestion + 1}`;
  } else {
    scoreDiv.textContent = `Incorrect.<br>Correct answer: <b><span style='color:#00ff66;'>${q.answer}</span></b>. Score: ${score} / ${currentQuestion + 1}`;
  }
  nextBtn.style.display = "inline-block";
}

nextBtn.onclick = function() {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    quizDiv.innerHTML = `<h2>Quiz Complete!</h2><p>Your final score: ${score} / ${questions.length}</p>`;
    nextBtn.style.display = "none";
    scoreDiv.textContent = "";
  }
};

window.onload = showQuestion;
