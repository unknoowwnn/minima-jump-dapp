// Global variables
let gravity = 0.5;
let velocity = 0;
let isJumping = false;
let score = 0;
let obstacleInterval;
let moveSpeed = 5; // Speed at which minima moves horizontally

// Function to start the game
function startGame() {
    const minima = document.getElementById('minima');
    minima.style.bottom = '0px';
    minima.style.left = '250px'; // Initial horizontal position

    // Handle key press events for jumping and moving
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space' && !isJumping) {
            isJumping = true;
            velocity = 10; // Initial jump velocity
        } else if (event.code === 'ArrowLeft') {
            // Move minima left
            let leftPos = parseFloat(minima.style.left);
            if (leftPos > 0) {
                minima.style.left = `${leftPos - moveSpeed}px`;
            }
        } else if (event.code === 'ArrowRight') {
            // Move minima right
            let leftPos = parseFloat(minima.style.left);
            if (leftPos < (gameContainer.clientWidth - minima.clientWidth)) {
                minima.style.left = `${leftPos + moveSpeed}px`;
            }
        }
    });

    // Main game loop
    function gameLoop() {
        // Apply gravity
        if (isJumping) {
            velocity -= gravity; // Gravity reduces upward velocity
            minima.style.bottom = `${parseFloat(minima.style.bottom) + velocity}px`;

            // Check if minima has landed
            if (parseFloat(minima.style.bottom) <= 0) {
                minima.style.bottom = '0px'; // Correct bottom position
                isJumping = false;
                velocity = 0; // Reset velocity upon landing
            }
        }

        // Check for collisions
        checkCollision();

        // Update score
        updateScore();

        // Continue game loop
        requestAnimationFrame(gameLoop);
    }

    // Create obstacles periodically
    obstacleInterval = setInterval(createObstacle, 2000);

    // Start the game loop
    gameLoop();
}

// Function to create obstacles
function createObstacle() {
    const obstacle = document.createElement('div');
    obstacle.className = 'obstacle';
    obstacle.style.position = 'absolute';
    obstacle.style.width = '30px'; // Smaller width
    obstacle.style.height = '30px'; // Smaller height
    obstacle.style.backgroundColor = 'blue';
    obstacle.style.left = '600px'; // Start position (off-screen)
    obstacle.style.bottom = '0px'; // Bottom position
    document.getElementById('game-container').appendChild(obstacle);

    // Move obstacle
    let obstaclePosition = 600; // Start position (off-screen)
    const interval = setInterval(() => {
        obstaclePosition -= 5; // Speed of obstacle
        obstacle.style.left = `${obstaclePosition}px`;

        // Remove obstacle when it's off-screen
        if (obstaclePosition < -30) { // Adjusted for new obstacle size
            clearInterval(interval);
            obstacle.remove();
        }
    }, 20);
}

// Function to check for collisions
function checkCollision() {
    const minima = document.getElementById('minima');
    const obstacles = document.querySelectorAll('.obstacle');

    obstacles.forEach(obstacle => {
        const minRect = minima.getBoundingClientRect();
        const obsRect = obstacle.getBoundingClientRect();

        if (
            minRect.left < obsRect.right &&
            minRect.right > obsRect.left &&
            minRect.top < obsRect.bottom &&
            minRect.bottom > obsRect.top
        ) {
            handleGameOver();
        }
    });
}

// Function to handle game over
function handleGameOver() {
    alert('Game Over!');
    clearInterval(obstacleInterval);
    document.getElementById('minima').style.bottom = '0px'; // Reset position
    document.getElementById('minima').style.left = '250px'; // Reset horizontal position
    // Optionally, reset score and other game elements here
}

// Function to update the score
function updateScore() {
    document.getElementById('score').innerText = `Score: ${score}`;
}

// Function to handle login
function login() {
    const ethAddress = document.getElementById('eth-address').value;
    if (ethAddress.length === 42) {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('game-container').style.display = 'block';
        startGame();
    } else {
        alert('Invalid Minima address. It must be 42 characters long.');
    }
}

// Initialize game
window.onload = function() {
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('game-container').style.display = 'none';
}
