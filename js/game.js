/**
 * Game management for the Virtual Companion application
 */
const Game = {
    /**
     * Current game data
     */
    currentGame: null,
    
    /**
     * Initializes game module
     */
    init: function() {
        // Add event listeners to game cards
        const gameCards = document.querySelectorAll('.game-card');
        
        gameCards.forEach(card => {
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
    },
    
    /**
     * Starts a game
     * @param {string} gameType - Type of game to start
     */
    startGame: function(gameType) {
        this.currentGame = gameType;
        
        // Show game area
        const gameArea = document.getElementById('game-area');
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
        if (!Character.current) {
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
        document.getElementById('quiz-next').addEventListener('click', () => {
            this.nextQuizQuestion();
        });
    },
    
    /**
     * Generates quiz questions based on character
     * @returns {Array} Array of question objects
     */
    generateQuizQuestions: function() {
        const character = Character.current;
        const questions = [];
        
        // Basic questions
        questions.push({
            question: `${character.name} thích làm gì trong thời gian rảnh?`,
            options: [
                character.interests.split(',')[0].trim(),
                'Ngủ cả ngày',
                'Xem phim kinh dị',
                'Đi leo núi'
            ],
            correctIndex: 0
        });
        
        questions.push({
            question: `${character.name} bao nhiêu tuổi?`,
            options: [
                character.age - 2,
                character.age,
                character.age + 3,
                character.age + 5
            ],
            correctIndex: 1
        });
        
        // Personality based questions
        const traits = character.personality.split(',').map(trait => trait.trim());
        
        if (traits.length > 0) {
            questions.push({
                question: `Đâu là tính cách của ${character.name}?`,
                options: [
                    traits[0],
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
        document.getElementById('quiz-progress').textContent = `Câu hỏi ${state.currentQuestion + 1}/${state.questions.length}`;
        
        // Show question
        document.getElementById('quiz-question').textContent = question.question;
        
        // Show options
        const optionsContainer = document.getElementById('quiz-options');
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
                document.getElementById('quiz-next').disabled = false;
                
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
        document.getElementById('quiz-next').disabled = true;
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
        document.getElementById('quiz-restart').addEventListener('click', () => {
            this.startGame('quiz');
        });
        
        document.getElementById('quiz-close').addEventListener('click', () => {
            gameArea.style.display = 'none';
        });
        
        // Add quiz completion to diary
        Diary.addEntry({
            type: 'game',
            title: 'Hoàn thành trò chơi trắc nghiệm',
            content: `Bạn đã hoàn thành trò chơi trắc nghiệm với điểm số ${scorePercent}% và nhận được ${intimacyPoints} điểm thân thiết.`,
            timestamp: new Date().toISOString()
        });
    },
    
    /**
     * Initializes memory game
     */
    initMemoryGame: function() {
        // Create memory game UI
        const gameArea = document.getElementById('game-area');
        gameArea.innerHTML = `
            <h3>Trò Chơi Trí Nhớ</h3>
            <p>Lật các thẻ bài để tìm cặp giống nhau. Hoàn thành để nhận phần thưởng.</p>
            <div class="memory-stats">
                <div class="memory-moves">Lượt: <span id="memory-moves">0</span></div>
                <div class="memory-timer">Thời gian: <span id="memory-timer">0</span>s</div>
            </div>
            <div id="memory-board"></div>
            <button id="memory-restart" class="secondary-btn">Chơi Lại</button>
        `;
        
        // Initialize memory game
        this.initMemoryBoard();
        
        // Add event listener to restart button
        document.getElementById('memory-restart').addEventListener('click', () => {
            this.initMemoryBoard();
        });
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
        document.getElementById('memory-moves').textContent = '0';
        document.getElementById('memory-timer').textContent = '0';
        
        // Clear timer
        if (this.memoryState.timerInterval) {
            clearInterval(this.memoryState.timerInterval);
        }
        
        // Add memory game styles
        const style = document.createElement('style');
        style.textContent = `
            #memory-board {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 10px;
                margin: 20px 0;
            }
            
            .memory-card {
                aspect-ratio: 1;
                perspective: 1000px;
                cursor: pointer;
            }
            
            .memory-card-inner {
                position: relative;
                width: 100%;
                height: 100%;
                transform-style: preserve-3d;
                transition: transform 0.5s;
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
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            
            .memory-card-front {
                background-color: var(--primary-color);
            }
            
            .memory-card-back {
                background-color: white;
                transform: rotateY(180deg);
                font-size: 2rem;
            }
            
            .memory-stats {
                display: flex;
                justify-content: space-between;
                margin-bottom: 15px;
                font-weight: 500;
            }
            
            .memory-card.matched .memory-card-back {
                background-color: #e6f7e6;
            }
        `;
        document.head.appendChild(style);
    },
    
    /**
     * Flips a card in memory game
     * @param {number} index - Card index
     */
    flipCard: function(index) {
        const state = this.memoryState;
        
        // Ignore if game ended or card is already flipped or matched
        if (state.gameEnded || state.flipped.includes(index) || state.matched.includes(index)) {
            return;
        }
        
        // Start game on first flip
        if (!state.gameStarted) {
            state.gameStarted = true;
            state.timerInterval = setInterval(() => {
                state.timer++;
                document.getElementById('memory-timer').textContent = state.timer;
            }, 1000);
        }
        
        // Flip card
        const card = document.querySelector(`.memory-card[data-index="${index}"]`);
        card.classList.add('flipped');
        state.flipped.push(index);
        
        // Check for match if two cards are flipped
        if (state.flipped.length === 2) {
            state.moves++;
            document.getElementById('memory-moves').textContent = state.moves;
            
            const [index1, index2] = state.flipped;
            
            if (state.cards[index1] === state.cards[index2]) {
                // Match found
                state.matched.push(index1, index2);
                state.flipped = [];
                
                // Add matched class
                document.querySelector(`.memory-card[data-index="${index1}"]`).classList.add('matched');
                document.querySelector(`.memory-card[data-index="${index2}"]`).classList.add('matched');
                
                // Check if all cards are matched
                if (state.matched.length === state.cards.length) {
                    this.endMemoryGame();
                }
            } else {
                // No match
                setTimeout(() => {
                    document.querySelector(`.memory-card[data-index="${index1}"]`).classList.remove('flipped');
                    document.querySelector(`.memory-card[data-index="${index2}"]`).classList.remove('flipped');
                    state.flipped = [];
                }, 1000);
            }
        }
    },
    
    /**
     * Ends memory game
     */
    endMemoryGame: function() {
        const state = this.memoryState;
        
        // Stop timer
        clearInterval(state.timerInterval);
        state.gameEnded = true;
        
        // Calculate score based on moves and time
        const maxMoves = state.cards.length * 2;
        const maxTime = 120;
        
        const moveScore = Math.max(0, 100 - Math.floor((state.moves / maxMoves) * 100));
        const timeScore = Math.max(0, 100 - Math.floor((state.timer / maxTime) * 100));
        
        const totalScore = Math.floor((moveScore + timeScore) / 2);
        
        // Determine intimacy points based on score
        let intimacyPoints = 0;
        
        if (totalScore >= 80) {
            intimacyPoints = 5;
        } else if (totalScore >= 60) {
            intimacyPoints = 3;
        } else if (totalScore >= 40) {
            intimacyPoints = 1;
        }
        
        // Update intimacy if character exists
        if (Character.current) {
            Character.updateIntimacy(intimacyPoints);
        }
        
        // Update game data
        this.gameData.memoryCompleted++;
        Storage.save(CONFIG.GAME.STORAGE_KEY, this.gameData);
        
        // Show results
        setTimeout(() => {
            Utils.showModal('alert-modal', {
                title: 'Chúc mừng!',
                message: `Bạn đã hoàn thành trò chơi trí nhớ với ${state.moves} lượt trong ${state.timer} giây! Điểm số: ${totalScore}/100. ${Character.current ? `Mức độ thân thiết +${intimacyPoints}` : ''}`
            });
            
            // Add to diary if character exists
            if (Character.current) {
                Diary.addEntry({
                    type: 'game',
                    title: 'Hoàn thành trò chơi trí nhớ',
                    content: `Bạn đã hoàn thành trò chơi trí nhớ với ${state.moves} lượt trong ${state.timer} giây và nhận được ${intimacyPoints} điểm thân thiết.`,
                    timestamp: new Date().toISOString()
                });
            }
        }, 500);
    }
};
