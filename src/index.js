import './styles/style.css';

const leaderboardAPIUrl = 'https://us-central1-js-capstone-backend.cloudfunctions.net/api/';
const gameId = 'B7cRJLrPYG6BThBwFVzP';

// Function to refresh scores for the current game
const refreshScores = async () => {
  if (!gameId) {
    return;
  }

  try {
    const response = await fetch(`${leaderboardAPIUrl}games/${gameId}/scores`);

    if (!response.ok) {
      throw new Error('Failed to retrieve scores.');
    }

    const scores = await response.json();

    // Update the score list on the page with the new scores
    const scoreList = document.querySelector('.score-board');
    scoreList.innerHTML = ''; // Clear the existing scores

    scores.result.forEach((score) => {
      const listItem = document.createElement('li');
      listItem.classList.add('score-board-content');
      listItem.textContent = `${score.user}: ${score.score}`;
      scoreList.appendChild(listItem);
    });
  } catch (error) {
    throw new Error(`Error refreshing scores: ${error}`);
  }
};

// Function to submit a new score for the current game
const submitScore = async (user, score) => {
  if (!gameId) {
    return;
  }

  try {
    const response = await fetch(`${leaderboardAPIUrl}games/${gameId}/scores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user, score }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit the score.');
    }

    // Refresh the scores after successfully submitting a score
    refreshScores();
  } catch (error) {
    throw new Error(`Error refreshing scores: ${error}`);
  }
};

// Event listeners for the "Refresh" and "Submit" buttons
document.querySelector('.btn').addEventListener('click', refreshScores);

document.querySelector('.submit').addEventListener('click', (event) => {
  event.preventDefault();
  const name = document.querySelector('#name').value;
  const score = parseInt(document.querySelector('#form-score').value, 10);
  if (name && !Number.isNaN(score)) {
    submitScore(name, score);
  }
});

refreshScores();
