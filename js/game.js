/**
 * Game management for the Virtual Companion application
 */
const Game = {
    /**
     * Current game data
     */
    currentGame: null,
    
    /**
     * Game data storage
     */
    gameData: null,
    
    /**
     * Initializes game module
     */
    init: function() {
        console.log('Initializing game module...');
        
        // Add event listeners to game cards
        const gameCards = document.querySelectorAll('.game-card');
        
        gameCards.forEach(card => {
            const gameStartBtn = card.querySelector('.game-start-btn');
            if (gameStartBtn) {
                gameStartBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent event bubbling
                    const gameType = card.getAttribute('data-game');
                    this.startGame(gameType);
                });
            }
            
            // Also add click event to the entire card for better UX
            card.addEventListener('click', () => {
                const gameType = card.getAttribute('data-game');
                this.startGame(gameType);
            });
        });
        
        // Load saved game data
        const savedGame = Storage.load(CONFIG.GAME.STORAGE_KEY);
        if (savedGame) {
            this.gameData = savedGame;
        } else {
            this.gameData = {
                quizCompleted: 0,
                memoryCompleted: 0,
                lastPlayed: null
            };
        }
        
        console.log('Game module initialized');
    },
    
    /**
     * Starts a game
     * @param {string} gameType - Type of game to start
     */
    startGame: function(gameType) {
        console.log('Starting game:', gameType);
        
        this.currentGame = gameType;
        
        // Show game area
        const gameArea = document.getElementById('game-area');
        if (!gameArea) {
            console.error('Game area element not found');
            return;
        }
        
        gameArea.style.display = 'block';
        
        // Initialize game based on type
        switch (gameType) {
            case 'quiz':
                this.initQuizGame();
                break;
            case 'memory':
                this.initMemoryGame();
                break;
            default:
                console.error('Unknown game type:', gameType);
                return;
        }
        
        // Update last played
        this.gameData.lastPlayed = new Date().toISOString();
        Storage.save(CONFIG.GAME.STORAGE_KEY, this.gameData);
    },
    
    /**
     * Initializes quiz game
     */
    initQuizGame: function() {
        console.log('Initializing quiz game...');
        
        // Check if character exists
        if (!Character.current) {
            console.log('No character found, showing alert');
            Utils.showModal('alert-modal', {
                title: 'Không thể bắt đầu trò chơi',
                message: 'Bạn cần tạo nhân vật trước khi chơi trò chơi này.'
            });
            return;
        }
        
        // Generate questions based on character
        const questions = this.generateQuizQuestions();
        
        // Create quiz UI
        const gameArea = document.getElementById('game-area');
        gameArea.innerHTML = `
            <h3>Trắc Nghiệm: Hiểu Nhân Vật Của Bạn</h3>
            <p>Trả lời các câu hỏi để hiểu nhân vật của bạn hơn và tăng mức độ thân thiết.</p>
            <div id="quiz-container">
                <div id="quiz-progress">Câu hỏi 1/${questions.length}</div>
                <div id="quiz-question"></div>
                <div id="quiz-options"></div>
                <button id="quiz-next" class="primary-btn">Tiếp theo</button>
            </div>
        `;
        
        // Initialize quiz state
        this.quizState = {
            questions: questions,
            currentQuestion: 0,
            score: 0,
            answers: []
        };
        
        // Show first question
        this.showQuizQuestion();
        
        // Add event listener to next button
        const nextButton = document.getElementById('quiz-next');
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                this.nextQuizQuestion();
            });
        }
        
        console.log('Quiz game initialized with', questions.length, 'questions');
    },
    
    /**
     * Generates quiz questions based on character
     * @returns {Array} Array of question objects
     */
    generateQuizQuestions: function() {
        const character = Character.current;
        const questions = [];
        
        // Basic questions
        const interests = character.interests.split(',').map(interest => interest.trim());
        questions.push({
            question: `${character.name} thích làm gì trong thời gian rảnh?`,
            options: [
                interests[0] || 'Đọc sách',
                'Ngủ cả ngày',
                'Xem phim kinh dị',
                'Đi leo núi'
            ],
            correctIndex: 0
        });
        
        questions.push({
            question: `${character.name} bao nhiêu tuổi?`,
            options: [
                parseInt(character.age) - 2,
                parseInt(character.age),
                parseInt(character.age) + 3,
                parseInt(character.age) + 5
            ],
            correctIndex: 1
        });
        
        // Personality based questions
        const traits = character.personality.split(',').map(trait => trait.trim());
        
        if (traits.length > 0) {
            questions.push({
                question: `Đâu là tính cách của ${character.name}?`,
                options: [
                    traits[0] || 'Vui vẻ',
                    'Lười biếng',
                    'Hay cáu gắt',
                    'Thích kiểm soát'
                ],
                correctIndex: 0
            });
        }
        
        // Add more generic questions
        questions.push({
            question: `${character.name} thích món quà nào nhất?`,
            options: [
                'Tiền',
                'Đồ trang sức đắt tiền',
                'Một bức thư viết tay',
                'Một ngày đi chơi cùng nhau'
            ],
            correctIndex: 3
        });
        
        questions.push({
            question: `Khi buồn, ${character.name} thường làm gì?`,
            options: [
                'Khóc một mình',
                'Tâm sự với bạn',
                'Nghe nhạc',
                'Ăn đồ ngọt'
            ],
            correctIndex: 2
        });
        
        // Shuffle options for each question except the first one
        for (let i = 1; i < questions.length; i++) {
            const question = questions[i];
            const correctOption = question.options[question.correctIndex];
            
            // Shuffle options
            for (let j = question.options.length - 1; j > 0; j--) {
                const k = Math.floor(Math.random() * (j + 1));
                [question.options[j], question.options[k]] = [question.options[k], question.options[j]];
            }
            
            // Update correct index
            question.correctIndex = question.options.indexOf(correctOption);
        }
        
        return questions;
    },
    
    /**
     * Shows current quiz question
     */
    showQuizQuestion: function() {
        const state = this.quizState;
        const question = state.questions[state.currentQuestion];
        
        // Update progress
        const progressElement = document.getElementById('quiz-progress');
        if (progressElement) {
            progressElement.textContent = `Câu hỏi ${state.currentQuestion + 1}/${state.questions.length}`;
        }
        
        // Show question
        const questionElement = document.getElementById('quiz-question');
        if (questionElement) {
            questionElement.textContent = question.question;
        }
        
        // Show options
        const optionsContainer = document.getElementById('quiz-options');
        if (!optionsContainer) {
            console.error('Quiz options container not found');
            return;
        }
        
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'quiz-option';
            optionElement.textContent = option;
            optionElement.setAttribute('data-index', index);
            
            optionElement.addEventListener('click', () => {
                // Remove selected class from all options
                document.querySelectorAll('.quiz-option').forEach(el => {
                    el.classList.remove('selected');
                });
                
                // Add selected class to clicked option
                optionElement.classList.add('selected');
                
                // Enable next button
                const nextButton = document.getElementById('quiz-next');
                if (nextButton) {
                    nextButton.disabled = false;
                }
                
                // Save answer
                state.answers[state.currentQuestion] = index;
                
                // Check if correct
                if (index === question.correctIndex) {
                    state.score++;
                }
            });
            
            optionsContainer.appendChild(optionElement);
        });
        
        // Disable next button until an option is selected
        const nextButton = document.getElementById('quiz-next');
        if (nextButton) {
            nextButton.disabled = true;
        }
    },
    
    /**
     * Moves to next quiz question or shows results
     */
    nextQuizQuestion: function() {
        const state = this.quizState;
        
        // Check if an option is selected
        if (state.answers[state.currentQuestion] === undefined) {
            return;
        }
        
        // Move to next question or show results
        state.currentQuestion++;
        
        if (state.currentQuestion < state.questions.length) {
            this.showQuizQuestion();
        } else {
            this.showQuizResults();
        }
    },
    
    /**
     * Shows quiz results
     */
    showQuizResults: function() {
        const state = this.quizState;
        const gameArea = document.getElementById('game-area');
        
        if (!gameArea) {
            console.error('Game area element not found');
            return;
        }
        
        // Calculate score percentage
        const scorePercent = Math.round((state.score / state.questions.length) * 100);
        
        // Determine intimacy points based on score
        let intimacyPoints = 0;
        let message = '';
        
        if (scorePercent >= 80) {
            intimacyPoints = 5;
            message = 'Tuyệt vời! Bạn hiểu rất rõ về nhân vật của mình!';
        } else if (scorePercent >= 60) {
            intimacyPoints = 3;
            message = 'Khá tốt! Bạn hiểu khá nhiều về nhân vật của mình.';
        } else if (scorePercent >= 40) {
            intimacyPoints = 1;
            message = 'Không tệ! Bạn đã có hiểu biết cơ bản về nhân vật của mình.';
        } else {
            intimacyPoints = 0;
            message = 'Có vẻ bạn cần dành thêm thời gian để hiểu nhân vật của mình hơn.';
        }
        
        // Update intimacy
        Character.updateIntimacy(intimacyPoints);
        
        // Update game data
        this.gameData.quizCompleted++;
        Storage.save(CONFIG.GAME.STORAGE_KEY, this.gameData);
        
        // Show results
        gameArea.innerHTML = `
            <h3>Kết Quả Trắc Nghiệm</h3>
            <div class="quiz-results">
                <div class="quiz-score">
                    <div class="score-circle">
                        <span>${scorePercent}%</span>
                    </div>
                    <p>Điểm số của bạn</p>
                </div>
                <p class="quiz-message">${message}</p>
                <p>Bạn đã trả lời đúng ${state.score}/${state.questions.length} câu hỏi.</p>
                <p>Mức độ thân thiết +${intimacyPoints}</p>
                <button id="quiz-restart" class="primary-btn">Chơi Lại</button>
                <button id="quiz-close" class="secondary-btn">Đóng</button>
            </div>
        `;
        
        // Add event listeners
        const restartButton = document.getElementById('quiz-restart');
        if (restartButton) {
            restartButton.addEventListener('click', () => {
                this.startGame('quiz');
            });
        }
        
        const closeButton = document.getElementById('quiz-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                gameArea.style.display = 'none';
            });
        }
        
        // Add quiz completion to diary
        if (typeof Diary !== 'undefined' && Diary.addEntry) {
            Diary.addEntry({
                type: 'game',
                title: 'Hoàn thành trò chơi trắc nghiệm',
                content: `Bạn đã hoàn thành trò chơi trắc nghiệm với điểm số ${scorePercent}% và nhận được ${intimacyPoints} điểm thân thiết.`,
                timestamp: new Date().toISOString()
            });
        }
        
        console.log('Quiz game completed with score:', scorePercent + '%');
    },
    
    /**
     * Initializes memory game
     */
    initMemoryGame: function() {
        console.log('Initializing memory game...');
        
        // Create memory game UI
        const gameArea = document.getElementById('game-area');
        if (!gameArea) {
            console.error('Game area element not found');
            return;
        }
        
        gameArea.innerHTML = `
            <h3>Trò Chơi Trí Nhớ</h3>
            <p>Lật các thẻ bài để tìm cặp giống nhau. Hoàn thành để nhận phần thưởng.</p>
            <div class="memory-stats">
                <div class="memory-moves">Lượt: <span id="memory-moves">0</span></div>
                <div class="memory-timer">Thời gian: <span id="memory-timer">0</span>s</div>
            </div>
            <div id="memory-board" class="memory-board"></div>
            <button id="memory-restart" class="secondary-btn">Chơi Lại</button>
        `;
        
        // Add memory game styles
        this.addMemoryGameStyles();
        
        // Initialize memory game
        this.initMemoryBoard();
        
        // Add event listener to restart button
        const restartButton = document.getElementById('memory-restart');
        if (restartButton) {
            restartButton.addEventListener('click', () => {
                this.initMemoryBoard();
            });
        }
        
        console.log('Memory game initialized');
    },
    
    /**
     * Adds memory game styles
     */
    addMemoryGameStyles: function() {
        // Check if styles already exist
        if (document.getElementById('memory-game-styles')) {
            return;
        }
        
        // Create style element
        const style = document.createElement('style');
        style.id = 'memory-game-styles';
        style.textContent = `
            .memory-board {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 15px;
                margin: 20px auto;
                max-width: 500px;
            }
            
            .memory-card {
                aspect-ratio: 1;
                perspective: 1000px;
                cursor: pointer;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            
            .memory-card-inner {
                position: relative;
                width: 100%;
                height: 100%;
                transform-style: preserve-3d;
                transition: transform 0.6s;
                border-radius: 10px;
                overflow: hidden;
            }
            
            .memory-card.flipped .memory-card-inner {
                transform: rotateY(180deg);
            }
            
            .memory-card-front, .memory-card-back {
                position: absolute;
                width: 100%;
                height: 100%;
                backface-visibility: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 10px;
            }
            
            .memory-card-front {
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                color: white;
                font-size: 1.5rem;
            }
            
            .memory-card-front::after {
                content: '?';
                font-size: 2rem;
                font-weight: bold;
            }
            
            .memory-card-back {
                background-color: white;
                transform: rotateY(180deg);
                font-size: 2.5rem;
            }
            
            .memory-card.matched .memory-card-back {
                background-color: #e6f7e6;
                animation: pulse 1s;
            }
            
            @keyframes pulse {
                0% { transform: scale(1) rotateY(180deg); }
                50% { transform: scale(1.1) rotateY(180deg); }
                100% { transform: scale(1) rotateY(180deg); }
            }
            
            .memory-stats {
                display: flex;
                justify-content: space-around;
                margin: 15px 0;
                font-weight: 500;
                background-color: rgba(255, 255, 255, 0.8);
                padding: 10px;
                border-radius: 10px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
            
            .memory-moves, .memory-timer {
                font-size: 1.1rem;
            }
            
            .memory-moves span, .memory-timer span {
                font-weight: bold;
                color: var(--primary-color);
            }
            
            .quiz-option {
                padding: 15px;
                margin: 10px 0;
                background-color: #f8f8f8;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s;
                border: 2px solid transparent;
            }
            
            .quiz-option:hover {
                background-color: #f0f0f0;
                transform: translateY(-2px);
            }
            
            .quiz-option.selected {
                background-color: #e6f7e6;
                border-color: var(--primary-color);
                font-weight: 500;
            }
            
            #quiz-question {
                font-size: 1.2rem;
                font-weight: 500;
                margin: 20px 0;
                line-height: 1.5;
            }
            
            #quiz-progress {
                font-size: 0.9rem;
                color: #666;
                margin-bottom: 10px;
            }
            
            .quiz-results {
                text-align: center;
                padding: 20px;
            }
            
            .quiz-score {
                margin: 20px 0;
            }
            
            .score-circle {
                width: 120px;
                height: 120px;
                border-radius: 50%;
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
                font-weight: bold;
                margin: 0 auto 15px;
            }
            
            .quiz-message {
                font-size: 1.2rem;
                font-weight: 500;
                margin: 15px 0;
                color: var(--primary-color);
            }
        `;
        
        // Add style to document
        document.head.appendChild(style);
    },
    
    /**
     * Initializes memory game board
     */
    initMemoryBoard: function() {
        // Game state
        this.memoryState = {
            cards: [],
            flipped: [],
            matched: [],
            moves: 0,
            timer: 0,
            timerInterval: null,
            gameStarted: false,
            gameEnded: false
        };
        
        // Create cards
        const emojis = ['😀', '😍', '🎮', '🎵', '🎬', '📚', '🍕', '🌈'];
        const cards = [...emojis, ...emojis];
        
        // Shuffle cards
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
        
        this.memoryState.cards = cards;
        
        // Create board
        const board = document.getElementById('memory-board');
        if (!board) {
            console.error('Memory board element not found');
            return;
        }
        
        board.innerHTML = '';
        
        cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'memory-card';
            cardElement.setAttribute('data-index', index);
            cardElement.innerHTML = `
                <div class="memory-card-inner">
                    <div class="memory-card-front"></div>
                    <div class="memory-card-back">${card}</div>
                </div>
            `;
            
            cardElement.addEventListener('click', () => {
                this.flipCard(index);
            });
            
            board.appendChild(cardElement);
        });
        
        // Reset stats
        const movesElement = document.getElementById('memory-moves');
        if (movesElement) {
            movesElement.textContent = '0';
        }
        
        const timerElement = document.getElementById('memory-timer');
        if (timerElement) {
            timerElement.textContent = '0';
        }
        
        // Clear timer
        if (this.memoryState.timerInterval) {
            clearInterval(this.memoryState.timerInterval);
        }
        
        console.log('Memory board initialized with', cards.length, 'cards');
    },
    
    /**
     * Flips a card in memory game
     * @param {number} index - Card index
     */
    flipCard: function(index) {
        const state = this.memoryState;
        
        // Ignore if game ended or card already flipped/matched
        if (state.gameEnded || 
            state.flipped.includes(index) || 
            state.matched.includes(index)) {
            return;
        }
        
        // Start game timer on first flip
        if (!state.gameStarted) {
            state.gameStarted = true;
            this.startMemoryTimer();
        }
        
        // Ignore if two cards already flipped
        if (state.flipped.length >= 2) {
            return;
        }
        
        // Flip card
        const card = document.querySelector(`.memory-card[data-index="${index}"]`);
        if (!card) return;
        
        card.classList.add('flipped');
        state.flipped.push(index);
        
        // Check for match if two cards flipped
        if (state.flipped.length === 2) {
            state.moves++;
            
            const movesElement = document.getElementById('memory-moves');
            if (movesElement) {
                movesElement.textContent = state.moves;
            }
            
            const [index1, index2] = state.flipped;
            
            if (state.cards[index1] === state.cards[index2]) {
                // Match found
                state.matched.push(index1, index2);
                state.flipped = [];
                
                // Add matched class
                document.querySelector(`.memory-card[data-index="${index1}"]`).classList.add('matched');
                document.querySelector(`.memory-card[data-index="${index2}"]`).classList.add('matched');
                
                // Check if game completed
                if (state.matched.length === state.cards.length) {
                    this.endMemoryGame();
                }
            } else {
                // No match, flip back after delay
                setTimeout(() => {
                    document.querySelector(`.memory-card[data-index="${index1}"]`).classList.remove('flipped');
                    document.querySelector(`.memory-card[data-index="${index2}"]`).classList.remove('flipped');
                    state.flipped = [];
                }, 1000);
            }
        }
    },
    
    /**
     * Starts memory game timer
     */
    startMemoryTimer: function() {
        const state = this.memoryState;
        
        // Clear existing timer
        if (state.timerInterval) {
            clearInterval(state.timerInterval);
        }
        
        const startTime = Date.now();
        
        state.timerInterval = setInterval(() => {
            state.timer = Math.floor((Date.now() - startTime) / 1000);
            
            const timerElement = document.getElementById('memory-timer');
            if (timerElement) {
                timerElement.textContent = state.timer;
            }
        }, 1000);
    },
    
    /**
     * Ends memory game
     */
    endMemoryGame: function() {
        const state = this.memoryState;
        
        // Stop timer
        if (state.timerInterval) {
            clearInterval(state.timerInterval);
        }
        
        state.gameEnded = true;
        
        // Calculate score based on moves and time
        const baseScore = 1000;
        const movesPenalty = state.moves * 10;
        const timePenalty = state.timer * 5;
        const score = Math.max(100, baseScore - movesPenalty - timePenalty);
        
        // Determine intimacy points
        let intimacyPoints = 0;
        
        if (score >= 800) {
            intimacyPoints = 5;
        } else if (score >= 600) {
            intimacyPoints = 3;
        } else if (score >= 400) {
            intimacyPoints = 2;
        } else {
            intimacyPoints = 1;
        }
        
        // Update intimacy
        if (typeof Character !== 'undefined' && Character.updateIntimacy) {
            Character.updateIntimacy(intimacyPoints);
        }
        
        // Update game data
        this.gameData.memoryCompleted++;
        Storage.save(CONFIG.GAME.STORAGE_KEY, this.gameData);
        
        // Show results
        setTimeout(() => {
            const gameArea = document.getElementById('game-area');
            if (!gameArea) return;
            
            gameArea.innerHTML = `
                <h3>Kết Quả Trò Chơi Trí Nhớ</h3>
                <div class="memory-results">
                    <div class="memory-stats-final">
                        <div class="stat-item">
                            <span class="stat-label">Số lượt:</span>
                            <span class="stat-value">${state.moves}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Thời gian:</span>
                            <span class="stat-value">${state.timer}s</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Điểm số:</span>
                            <span class="stat-value">${score}</span>
                        </div>
                    </div>
                    <p class="memory-message">Chúc mừng! Bạn đã hoàn thành trò chơi trí nhớ.</p>
                    <p>Mức độ thân thiết +${intimacyPoints}</p>
                    <div class="memory-actions">
                        <button id="memory-restart-end" class="primary-btn">Chơi Lại</button>
                        <button id="memory-close" class="secondary-btn">Đóng</button>
                    </div>
                </div>
            `;
            
            // Add styles for results
            const style = document.createElement('style');
            style.textContent = `
                .memory-results {
                    text-align: center;
                    padding: 20px;
                }
                
                .memory-stats-final {
                    display: flex;
                    justify-content: space-around;
                    margin: 20px 0;
                    background-color: #f8f8f8;
                    padding: 15px;
                    border-radius: 10px;
                }
                
                .stat-item {
                    display: flex;
                    flex-direction: column;
                }
                
                .stat-label {
                    font-size: 0.9rem;
                    color: #666;
                }
                
                .stat-value {
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: var(--primary-color);
                }
                
                .memory-message {
                    font-size: 1.2rem;
                    font-weight: 500;
                    margin: 15px 0;
                    color: var(--primary-color);
                }
                
                .memory-actions {
                    margin-top: 20px;
                }
            `;
            
            document.head.appendChild(style);
            
            // Add event listeners
            const restartButton = document.getElementById('memory-restart-end');
            if (restartButton) {
                restartButton.addEventListener('click', () => {
                    this.startGame('memory');
                });
            }
            
            const closeButton = document.getElementById('memory-close');
            if (closeButton) {
                closeButton.addEventListener('click', () => {
                    gameArea.style.display = 'none';
                });
            }
            
            // Add memory game completion to diary
            if (typeof Diary !== 'undefined' && Diary.addEntry) {
                Diary.addEntry({
                    type: 'game',
                    title: 'Hoàn thành trò chơi trí nhớ',
                    content: `Bạn đã hoàn thành trò chơi trí nhớ với ${state.moves} lượt trong ${state.timer} giây và nhận được ${intimacyPoints} điểm thân thiết.`,
                    timestamp: new Date().toISOString()
                });
            }
            
            console.log('Memory game completed with score:', score);
        }, 1000);
    }
};
