/**
 * Game functionality for the Virtual Companion application
 */
const Game = {
    /**
     * Current game state
     */
    currentGame: null,
    
    /**
     * Initializes game module
     */
    init: function() {
        // Set up event listeners for game cards
        const guessPreferenceGame = document.getElementById('guess-preference-game');
        const memoryGame = document.getElementById('memory-game');
        
        if (guessPreferenceGame) {
            guessPreferenceGame.querySelector('.game-start-btn').addEventListener('click', () => {
                this.startGuessPreferenceGame();
            });
        }
        
        if (memoryGame) {
            memoryGame.querySelector('.game-start-btn').addEventListener('click', () => {
                this.startMemoryGame();
            });
        }
    },
    
    /**
     * Starts the Guess Preference game
     */
    startGuessPreferenceGame: function() {
        if (!Character.current) {
            Utils.showModal('alert-modal', {
                title: 'Không thể bắt đầu trò chơi',
                message: 'Bạn cần tạo nhân vật trước khi chơi game.'
            });
            return;
        }
        
        // Show game area
        const gameArea = document.getElementById('game-area');
        gameArea.style.display = 'block';
        
        // Set current game
        this.currentGame = 'guess-preference';
        
        // Generate categories and options
        const categories = [
            { name: 'Món ăn', options: ['Phở', 'Pizza', 'Sushi', 'Gà rán', 'Bánh mì'] },
            { name: 'Màu sắc', options: ['Đỏ', 'Xanh dương', 'Tím', 'Hồng', 'Đen'] },
            { name: 'Thể loại phim', options: ['Hành động', 'Tình cảm', 'Kinh dị', 'Hài', 'Khoa học viễn tưởng'] },
            { name: 'Hoạt động', options: ['Đọc sách', 'Xem phim', 'Đi dạo', 'Nấu ăn', 'Chơi game'] }
        ];
        
        // Select random category
        const category = categories[Math.floor(Math.random() * categories.length)];
        
        // Select random correct answer
        const correctIndex = Math.floor(Math.random() * category.options.length);
        const correctAnswer = category.options[correctIndex];
        
        // Build game HTML
        gameArea.innerHTML = `
            <h3>Đoán sở thích của ${Character.current.name}</h3>
            <p class="game-question">${Character.current.name} thích ${category.name.toLowerCase()} nào nhất?</p>
            <div class="game-options">
                ${category.options.map((option, index) => `
                    <button class="game-option" data-index="${index}">${option}</button>
                `).join('')}
            </div>
            <div class="game-result" style="display: none;"></div>
            <button class="game-back-btn">Quay lại</button>
        `;
        
        // Add event listeners to options
        const optionButtons = gameArea.querySelectorAll('.game-option');
        optionButtons.forEach(button => {
            button.addEventListener('click', () => {
                const selectedIndex = parseInt(button.dataset.index);
                this.checkGuessPreferenceAnswer(selectedIndex, correctIndex, category.name, correctAnswer);
            });
        });
        
        // Add event listener to back button
        gameArea.querySelector('.game-back-btn').addEventListener('click', () => {
            this.endGame();
        });
    },
    
    /**
     * Checks the answer for Guess Preference game
     * @param {number} selectedIndex - Index of selected option
     * @param {number} correctIndex - Index of correct option
     * @param {string} categoryName - Name of the category
     * @param {string} correctAnswer - Correct answer text
     */
    checkGuessPreferenceAnswer: function(selectedIndex, correctIndex, categoryName, correctAnswer) {
        const gameArea = document.getElementById('game-area');
        const resultDiv = gameArea.querySelector('.game-result');
        const optionButtons = gameArea.querySelectorAll('.game-option');
        
        // Disable all buttons
        optionButtons.forEach(button => {
            button.disabled = true;
        });
        
        // Highlight correct and selected answers
        optionButtons[correctIndex].classList.add('correct');
        if (selectedIndex !== correctIndex) {
            optionButtons[selectedIndex].classList.add('incorrect');
        }
        
        // Show result
        resultDiv.style.display = 'block';
        
        if (selectedIndex === correctIndex) {
            resultDiv.innerHTML = `
                <div class="correct-answer">
                    <h4>Chính xác!</h4>
                    <p>${Character.current.name} rất thích ${correctAnswer}!</p>
                </div>
            `;
            
            // Increase intimacy for correct answer
            Character.updateIntimacy(5);
        } else {
            resultDiv.innerHTML = `
                <div class="incorrect-answer">
                    <h4>Không chính xác!</h4>
                    <p>${Character.current.name} thích ${correctAnswer} nhất.</p>
                </div>
            `;
            
            // Small intimacy increase for playing
            Character.updateIntimacy(1);
        }
    },
    
    /**
     * Starts the Memory game
     */
    startMemoryGame: function() {
        if (!Character.current) {
            Utils.showModal('alert-modal', {
                title: 'Không thể bắt đầu trò chơi',
                message: 'Bạn cần tạo nhân vật trước khi chơi game.'
            });
            return;
        }
        
        // Show game area
        const gameArea = document.getElementById('game-area');
        gameArea.style.display = 'block';
        
        // Set current game
        this.currentGame = 'memory';
        
        // Generate questions about the character
        const questions = [
            { 
                question: `${Character.current.name} bao nhiêu tuổi?`, 
                answer: Character.current.age.toString(),
                options: this.generateAgeOptions(Character.current.age)
            },
            { 
                question: `${Character.current.name} có tính cách gì?`, 
                answer: 'personality',
                options: ['Vui vẻ, hòa đồng', 'Lạnh lùng, bí ẩn', 'Ngọt ngào, dịu dàng', 'Mạnh mẽ, quyết đoán']
            },
            { 
                question: `${Character.current.name} thích làm gì?`, 
                answer: 'interests',
                options: ['Đọc sách, nghe nhạc', 'Chơi game, xem phim', 'Du lịch, khám phá', 'Nấu ăn, làm bánh']
            }
        ];
        
        // Select random question
        const questionIndex = Math.floor(Math.random() * questions.length);
        const question = questions[questionIndex];
        
        // Determine correct answer
        let correctAnswer = question.answer;
        let correctIndex = 0;
        
        if (correctAnswer === 'personality') {
            // For personality, use the actual personality as correct answer
            correctAnswer = 'Vui vẻ, hòa đồng'; // Default
            question.options.forEach((option, index) => {
                if (Character.current.personality.includes(option.split(',')[0].toLowerCase())) {
                    correctAnswer = option;
                    correctIndex = index;
                }
            });
        } else if (correctAnswer === 'interests') {
            // For interests, use the actual interests as correct answer
            correctAnswer = 'Đọc sách, nghe nhạc'; // Default
            question.options.forEach((option, index) => {
                if (Character.current.interests.includes(option.split(',')[0].toLowerCase())) {
                    correctAnswer = option;
                    correctIndex = index;
                }
            });
        } else {
            // For age, the correct index is already set
            correctIndex = question.options.indexOf(correctAnswer);
        }
        
        // Build game HTML
        gameArea.innerHTML = `
            <h3>Trò chơi trí nhớ</h3>
            <p class="game-question">${question.question}</p>
            <div class="game-options">
                ${question.options.map((option, index) => `
                    <button class="game-option" data-index="${index}">${option}</button>
                `).join('')}
            </div>
            <div class="game-result" style="display: none;"></div>
            <button class="game-back-btn">Quay lại</button>
        `;
        
        // Add event listeners to options
        const optionButtons = gameArea.querySelectorAll('.game-option');
        optionButtons.forEach(button => {
            button.addEventListener('click', () => {
                const selectedIndex = parseInt(button.dataset.index);
                this.checkMemoryAnswer(selectedIndex, correctIndex, correctAnswer);
            });
        });
        
        // Add event listener to back button
        gameArea.querySelector('.game-back-btn').addEventListener('click', () => {
            this.endGame();
        });
    },
    
    /**
     * Generates age options for the memory game
     * @param {number} correctAge - Correct age
     * @returns {Array} Array of age options
     */
    generateAgeOptions: function(correctAge) {
        const options = [correctAge.toString()];
        
        // Generate 3 more unique options
        while (options.length < 4) {
            const randomAge = correctAge + Utils.getRandomNumber(-5, 5);
            if (randomAge > 0 && !options.includes(randomAge.toString())) {
                options.push(randomAge.toString());
            }
        }
        
        // Shuffle options
        return options.sort(() => Math.random() - 0.5);
    },
    
    /**
     * Checks the answer for Memory game
     * @param {number} selectedIndex - Index of selected option
     * @param {number} correctIndex - Index of correct option
     * @param {string} correctAnswer - Correct answer text
     */
    checkMemoryAnswer: function(selectedIndex, correctIndex, correctAnswer) {
        const gameArea = document.getElementById('game-area');
        const resultDiv = gameArea.querySelector('.game-result');
        const optionButtons = gameArea.querySelectorAll('.game-option');
        
        // Disable all buttons
        optionButtons.forEach(button => {
            button.disabled = true;
        });
        
        // Highlight correct and selected answers
        optionButtons[correctIndex].classList.add('correct');
        if (selectedIndex !== correctIndex) {
            optionButtons[selectedIndex].classList.add('incorrect');
        }
        
        // Show result
        resultDiv.style.display = 'block';
        
        if (selectedIndex === correctIndex) {
            resultDiv.innerHTML = `
                <div class="correct-answer">
                    <h4>Chính xác!</h4>
                    <p>Bạn nhớ rất rõ về ${Character.current.name}!</p>
                </div>
            `;
            
            // Increase intimacy for correct answer
            Character.updateIntimacy(5);
        } else {
            resultDiv.innerHTML = `
                <div class="incorrect-answer">
                    <h4>Không chính xác!</h4>
                    <p>Đáp án đúng là: ${correctAnswer}</p>
                </div>
            `;
            
            // Small intimacy increase for playing
            Character.updateIntimacy(1);
        }
    },
    
    /**
     * Ends the current game
     */
    endGame: function() {
        const gameArea = document.getElementById('game-area');
        gameArea.style.display = 'none';
        gameArea.innerHTML = '';
        this.currentGame = null;
    }
};
