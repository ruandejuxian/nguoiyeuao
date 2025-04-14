// Mini-game functionality for Virtual Lover App

// Game types
const GAME_TYPES = {
    GUESS_PREFERENCE: 'guess-preference',
    TRIVIA: 'trivia'
};

// Current game state
let currentGame = null;
let gameScore = 0;
let gameQuestions = [];
let currentQuestionIndex = 0;

// Initialize mini-games
function initMiniGames() {
    // Add event listeners to game cards
    document.getElementById('guess-preference-game').addEventListener('click', () => {
        startGame(GAME_TYPES.GUESS_PREFERENCE);
    });
    
    document.getElementById('trivia-game').addEventListener('click', () => {
        startGame(GAME_TYPES.TRIVIA);
    });
}

// Start a game
function startGame(gameType) {
    // Check if character exists
    if (!currentCharacter) {
        alert('Vui lòng tạo nhân vật trước khi chơi mini-game!');
        return;
    }
    
    // Reset game state
    currentGame = gameType;
    gameScore = 0;
    gameQuestions = [];
    currentQuestionIndex = 0;
    
    // Generate questions based on game type
    if (gameType === GAME_TYPES.GUESS_PREFERENCE) {
        generateGuessPreferenceQuestions();
    } else if (gameType === GAME_TYPES.TRIVIA) {
        generateTriviaQuestions();
    }
    
    // Show game area
    const gameArea = document.getElementById('game-area');
    gameArea.style.display = 'block';
    
    // Show first question
    showQuestion();
}

// Generate questions for Guess Preference game
function generateGuessPreferenceQuestions() {
    // Categories for preferences
    const categories = [
        'món ăn', 'đồ uống', 'màu sắc', 'thể loại phim', 
        'thể loại âm nhạc', 'mùa trong năm', 'thời tiết', 
        'địa điểm du lịch', 'môn thể thao', 'sở thích'
    ];
    
    // Generate 5 random questions
    for (let i = 0; i < 5; i++) {
        // Select random category
        const category = categories[Math.floor(Math.random() * categories.length)];
        
        // Generate options
        const options = generateOptionsForCategory(category);
        
        // Select correct answer
        const correctIndex = Math.floor(Math.random() * options.length);
        
        // Create question
        gameQuestions.push({
            question: `${currentCharacter.name} thích ${category} nào nhất?`,
            options: options,
            correctIndex: correctIndex
        });
    }
}

// Generate options for a category
function generateOptionsForCategory(category) {
    let options = [];
    
    switch (category) {
        case 'món ăn':
            options = ['Phở', 'Bánh mì', 'Pizza', 'Sushi', 'Mì Ý'];
            break;
        case 'đồ uống':
            options = ['Trà sữa', 'Cà phê', 'Nước ép', 'Soda', 'Sinh tố'];
            break;
        case 'màu sắc':
            options = ['Đỏ', 'Xanh dương', 'Tím', 'Hồng', 'Đen'];
            break;
        case 'thể loại phim':
            options = ['Hành động', 'Tình cảm', 'Kinh dị', 'Hài', 'Khoa học viễn tưởng'];
            break;
        case 'thể loại âm nhạc':
            options = ['Pop', 'Rock', 'R&B', 'EDM', 'Ballad'];
            break;
        case 'mùa trong năm':
            options = ['Xuân', 'Hạ', 'Thu', 'Đông'];
            break;
        case 'thời tiết':
            options = ['Nắng ấm', 'Mưa nhẹ', 'Tuyết rơi', 'Gió mát', 'Sương mù'];
            break;
        case 'địa điểm du lịch':
            options = ['Biển', 'Núi', 'Thành phố', 'Làng quê', 'Rừng'];
            break;
        case 'môn thể thao':
            options = ['Bóng đá', 'Bơi lội', 'Yoga', 'Chạy bộ', 'Đạp xe'];
            break;
        case 'sở thích':
            options = ['Đọc sách', 'Nấu ăn', 'Chơi game', 'Vẽ tranh', 'Du lịch'];
            break;
        default:
            options = ['Lựa chọn A', 'Lựa chọn B', 'Lựa chọn C', 'Lựa chọn D'];
    }
    
    return options;
}

// Generate questions for Trivia game
function generateTriviaQuestions() {
    // Create questions based on character info
    gameQuestions = [
        {
            question: `${currentCharacter.name} tên đầy đủ là gì?`,
            options: [
                currentCharacter.name,
                currentCharacter.name + ' Nguyễn',
                currentCharacter.name + ' Trần',
                currentCharacter.name + ' Lê'
            ],
            correctIndex: 0
        },
        {
            question: `${currentCharacter.name} có tính cách như thế nào?`,
            options: [
                'Hướng nội và trầm tính',
                'Hướng ngoại và năng động',
                currentCharacter.personality,
                'Bí ẩn và khó đoán'
            ],
            correctIndex: 2
        },
        {
            question: `${currentCharacter.name} thích gì?`,
            options: [
                'Thể thao và nấu ăn',
                currentCharacter.interests,
                'Đọc sách và du lịch',
                'Chơi game và xem phim'
            ],
            correctIndex: 1
        }
    ];
    
    // Add more generic questions
    gameQuestions.push({
        question: `Bạn và ${currentCharacter.name} quen nhau bao lâu rồi?`,
        options: [
            'Mới vài ngày',
            'Khoảng một tuần',
            'Vài tháng',
            'Đã lâu rồi'
        ],
        correctIndex: intimacyLevel >= 50 ? 3 : (intimacyLevel >= 30 ? 2 : (intimacyLevel >= 10 ? 1 : 0))
    });
    
    gameQuestions.push({
        question: `Mức độ thân thiết giữa bạn và ${currentCharacter.name} là gì?`,
        options: [
            'Mới quen',
            'Bạn bè',
            'Bạn thân',
            'Người yêu',
            'Tri kỷ'
        ],
        correctIndex: intimacyLevel >= 80 ? 4 : (intimacyLevel >= 50 ? 3 : (intimacyLevel >= 30 ? 2 : (intimacyLevel >= 10 ? 1 : 0)))
    });
}

// Show current question
function showQuestion() {
    if (currentQuestionIndex >= gameQuestions.length) {
        // Game over, show results
        showGameResults();
        return;
    }
    
    const question = gameQuestions[currentQuestionIndex];
    const gameArea = document.getElementById('game-area');
    
    let optionsHTML = '';
    question.options.forEach((option, index) => {
        optionsHTML += `
            <div class="game-option" onclick="selectAnswer(${index})">
                <span class="option-letter">${String.fromCharCode(65 + index)}</span>
                <span class="option-text">${option}</span>
            </div>
        `;
    });
    
    gameArea.innerHTML = `
        <div class="game-question">
            <h3>${question.question}</h3>
            <div class="game-progress">Câu hỏi ${currentQuestionIndex + 1}/${gameQuestions.length}</div>
            <div class="game-score">Điểm: ${gameScore}</div>
        </div>
        <div class="game-options">
            ${optionsHTML}
        </div>
    `;
}

// Handle answer selection
function selectAnswer(index) {
    const question = gameQuestions[currentQuestionIndex];
    const isCorrect = index === question.correctIndex;
    
    // Update score
    if (isCorrect) {
        gameScore += 10;
    }
    
    // Show result
    const gameArea = document.getElementById('game-area');
    const options = gameArea.querySelectorAll('.game-option');
    
    // Highlight correct and incorrect answers
    options.forEach((option, i) => {
        if (i === question.correctIndex) {
            option.classList.add('correct-option');
        } else if (i === index && !isCorrect) {
            option.classList.add('incorrect-option');
        }
    });
    
    // Show feedback
    const feedback = document.createElement('div');
    feedback.className = 'game-feedback';
    feedback.innerHTML = isCorrect ? 
        `<p class="correct-feedback">Đúng rồi! +10 điểm</p>` : 
        `<p class="incorrect-feedback">Sai rồi! Đáp án đúng là ${String.fromCharCode(65 + question.correctIndex)}</p>`;
    
    gameArea.appendChild(feedback);
    
    // Move to next question after delay
    setTimeout(() => {
        currentQuestionIndex++;
        showQuestion();
    }, 2000);
}

// Show game results
function showGameResults() {
    const gameArea = document.getElementById('game-area');
    
    // Calculate percentage
    const percentage = Math.round((gameScore / (gameQuestions.length * 10)) * 100);
    
    // Determine result message
    let resultMessage = '';
    if (percentage >= 80) {
        resultMessage = `Tuyệt vời! Bạn hiểu rất rõ về ${currentCharacter.name}!`;
        // Increase intimacy for good performance
        intimacyLevel += 5;
        saveToLocalStorage();
        updateIntimacyDisplay();
    } else if (percentage >= 60) {
        resultMessage = `Khá tốt! Bạn hiểu khá nhiều về ${currentCharacter.name}!`;
        // Small intimacy increase
        intimacyLevel += 2;
        saveToLocalStorage();
        updateIntimacyDisplay();
    } else if (percentage >= 40) {
        resultMessage = `Không tệ! Bạn có thể hiểu ${currentCharacter.name} hơn nữa!`;
        // Tiny intimacy increase
        intimacyLevel += 1;
        saveToLocalStorage();
        updateIntimacyDisplay();
    } else {
        resultMessage = `Bạn cần tìm hiểu thêm về ${currentCharacter.name}!`;
    }
    
    // Show results
    gameArea.innerHTML = `
        <div class="game-results">
            <h3>Kết quả</h3>
            <div class="result-score">Điểm: ${gameScore}/${gameQuestions.length * 10}</div>
            <div class="result-percentage">${percentage}%</div>
            <div class="result-message">${resultMessage}</div>
            <button class="btn btn-game" onclick="closeGame()">Đóng</button>
            <button class="btn btn-game" onclick="startGame(currentGame)">Chơi lại</button>
        </div>
    `;
    
    // Add character message based on result
    let characterMessage = '';
    if (percentage >= 80) {
        characterMessage = `Wow, bạn hiểu mình quá rõ! Mình thật sự rất vui! ❤️`;
    } else if (percentage >= 60) {
        characterMessage = `Bạn hiểu mình khá rõ đấy! Cảm ơn vì đã quan tâm đến mình! 😊`;
    } else if (percentage >= 40) {
        characterMessage = `Không tệ đâu! Chúng ta có thể tìm hiểu nhau nhiều hơn nữa! 😉`;
    } else {
        characterMessage = `Không sao đâu! Chúng ta còn nhiều thời gian để hiểu nhau hơn mà! 😊`;
    }
    
    // Add message to chat
    setTimeout(() => {
        addCharacterMessage(characterMessage);
    }, 1000);
}

// Close game
function closeGame() {
    document.getElementById('game-area').style.display = 'none';
}

// Initialize mini-games on page load
document.addEventListener('DOMContentLoaded', function() {
    initMiniGames();
    
    // Add selectAnswer function to window for onclick access
    window.selectAnswer = selectAnswer;
    window.closeGame = closeGame;
});
