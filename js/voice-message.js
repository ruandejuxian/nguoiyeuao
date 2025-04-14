/**
 * Voice message functionality for the Virtual Companion application
 */
const VoiceMessage = {
    /**
     * Media recorder instance
     */
    mediaRecorder: null,
    
    /**
     * Audio chunks
     */
    audioChunks: [],
    
    /**
     * Whether recording is in progress
     */
    isRecording: false,
    
    /**
     * Maximum recording duration in milliseconds
     */
    maxRecordingDuration: 60000, // 60 seconds
    
    /**
     * Recording timer
     */
    recordingTimer: null,
    
    /**
     * Recording start time
     */
    recordingStartTime: null,
    
    /**
     * Initializes voice message functionality
     */
    init: function() {
        // Add voice message button to chat input toolbar
        this.addVoiceMessageButton();
        
        // Add recording indicator
        this.createRecordingIndicator();
        
        console.log('Voice message functionality initialized');
    },
    
    /**
     * Adds voice message button to chat input toolbar
     */
    addVoiceMessageButton: function() {
        const toolbar = document.querySelector('.chat-input-toolbar');
        if (!toolbar) return;
        
        // Create voice message button
        const voiceButton = document.createElement('button');
        voiceButton.className = 'toolbar-button voice-button';
        voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';
        voiceButton.title = 'Ghi âm tin nhắn thoại';
        voiceButton.addEventListener('click', this.toggleRecording.bind(this));
        
        // Add button to toolbar after emoji button
        const emojiButton = toolbar.querySelector('.emoji-button');
        if (emojiButton) {
            toolbar.insertBefore(voiceButton, emojiButton.nextSibling);
        } else {
            toolbar.appendChild(voiceButton);
        }
    },
    
    /**
     * Creates recording indicator
     */
    createRecordingIndicator: function() {
        // Create recording indicator
        const recordingIndicator = document.createElement('div');
        recordingIndicator.className = 'recording-indicator';
        recordingIndicator.id = 'recording-indicator';
        
        // Create recording time
        const recordingTime = document.createElement('div');
        recordingTime.className = 'recording-time';
        recordingTime.id = 'recording-time';
        recordingTime.textContent = '00:00';
        recordingIndicator.appendChild(recordingTime);
        
        // Create recording actions
        const recordingActions = document.createElement('div');
        recordingActions.className = 'recording-actions';
        
        // Create cancel button
        const cancelButton = document.createElement('button');
        cancelButton.className = 'recording-action cancel';
        cancelButton.innerHTML = '<i class="fas fa-times"></i>';
        cancelButton.title = 'Hủy ghi âm';
        cancelButton.addEventListener('click', this.cancelRecording.bind(this));
        recordingActions.appendChild(cancelButton);
        
        // Create send button
        const sendButton = document.createElement('button');
        sendButton.className = 'recording-action send';
        sendButton.innerHTML = '<i class="fas fa-paper-plane"></i>';
        sendButton.title = 'Gửi tin nhắn thoại';
        sendButton.addEventListener('click', this.stopRecording.bind(this));
        recordingActions.appendChild(sendButton);
        
        recordingIndicator.appendChild(recordingActions);
        
        // Add recording indicator to chat container
        const chatContainer = document.querySelector('.chat-container');
        if (chatContainer) {
            chatContainer.appendChild(recordingIndicator);
        }
        
        // Add recording indicator styles
        this.addRecordingStyles();
    },
    
    /**
     * Adds recording styles
     */
    addRecordingStyles: function() {
        const style = document.createElement('style');
        style.textContent = `
            .recording-indicator {
                position: absolute;
                bottom: 70px;
                left: 0;
                right: 0;
                background-color: var(--primary-color);
                color: white;
                padding: 10px 20px;
                display: none;
                align-items: center;
                justify-content: space-between;
                z-index: 100;
            }
            
            .recording-indicator.active {
                display: flex;
            }
            
            .recording-time {
                font-size: 1.2rem;
                font-weight: 500;
                display: flex;
                align-items: center;
            }
            
            .recording-time::before {
                content: '';
                display: inline-block;
                width: 10px;
                height: 10px;
                background-color: red;
                border-radius: 50%;
                margin-right: 10px;
                animation: pulse 1s infinite;
            }
            
            @keyframes pulse {
                0% {
                    opacity: 1;
                }
                50% {
                    opacity: 0.5;
                }
                100% {
                    opacity: 1;
                }
            }
            
            .recording-actions {
                display: flex;
                gap: 15px;
            }
            
            .recording-action {
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 5px;
                border-radius: 50%;
                width: 36px;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background-color 0.2s ease;
            }
            
            .recording-action:hover {
                background-color: rgba(255, 255, 255, 0.2);
            }
            
            .recording-action.cancel {
                background-color: rgba(255, 255, 255, 0.1);
            }
            
            .recording-action.send {
                background-color: var(--accent-color);
                color: var(--text-color);
            }
            
            .message-audio {
                display: flex;
                align-items: center;
                background-color: rgba(0, 0, 0, 0.05);
                padding: 10px;
                border-radius: var(--radius);
                margin-top: 5px;
            }
            
            .message-audio-icon {
                font-size: 1.5rem;
                margin-right: 10px;
                color: var(--primary-color);
            }
            
            .message-audio-player {
                flex: 1;
                height: 36px;
            }
            
            .voice-button.recording {
                color: var(--primary-color);
                animation: pulse 1s infinite;
            }
        `;
        
        document.head.appendChild(style);
    },
    
    /**
     * Toggles recording
     */
    toggleRecording: function() {
        if (this.isRecording) {
            this.stopRecording();
        } else {
            this.startRecording();
        }
    },
    
    /**
     * Starts recording
     */
    startRecording: async function() {
        try {
            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            // Create media recorder
            this.mediaRecorder = new MediaRecorder(stream);
            
            // Clear audio chunks
            this.audioChunks = [];
            
            // Add data handler
            this.mediaRecorder.addEventListener('dataavailable', (event) => {
                this.audioChunks.push(event.data);
            });
            
            // Start recording
            this.mediaRecorder.start();
            this.isRecording = true;
            
            // Update UI
            this.updateRecordingUI(true);
            
            // Start timer
            this.recordingStartTime = Date.now();
            this.updateRecordingTime();
            this.recordingTimer = setInterval(() => {
                this.updateRecordingTime();
                
                // Check if max duration reached
                if (Date.now() - this.recordingStartTime >= this.maxRecordingDuration) {
                    this.stopRecording();
                }
            }, 1000);
            
            console.log('Recording started');
        } catch (error) {
            console.error('Error starting recording:', error);
            
            // Show error message
            Utils.showModal('alert-modal', {
                title: 'Lỗi ghi âm',
                message: 'Không thể truy cập microphone. Vui lòng kiểm tra quyền truy cập và thử lại.'
            });
        }
    },
    
    /**
     * Stops recording
     */
    stopRecording: function() {
        if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') return;
        
        // Stop recording
        this.mediaRecorder.stop();
        this.isRecording = false;
        
        // Update UI
        this.updateRecordingUI(false);
        
        // Stop timer
        clearInterval(this.recordingTimer);
        
        // Process recording
        this.mediaRecorder.addEventListener('stop', () => {
            // Create audio blob
            const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
            
            // Send audio message
            this.sendAudioMessage(audioBlob);
            
            // Stop all tracks
            this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
            
            console.log('Recording stopped');
        });
    },
    
    /**
     * Cancels recording
     */
    cancelRecording: function() {
        if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') return;
        
        // Stop recording
        this.mediaRecorder.stop();
        this.isRecording = false;
        
        // Update UI
        this.updateRecordingUI(false);
        
        // Stop timer
        clearInterval(this.recordingTimer);
        
        // Stop all tracks
        this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
        
        console.log('Recording cancelled');
    },
    
    /**
     * Updates recording UI
     * @param {boolean} isRecording - Whether recording is in progress
     */
    updateRecordingUI: function(isRecording) {
        // Update recording indicator
        const recordingIndicator = document.getElementById('recording-indicator');
        if (recordingIndicator) {
            if (isRecording) {
                recordingIndicator.classList.add('active');
            } else {
                recordingIndicator.classList.remove('active');
            }
        }
        
        // Update voice button
        const voiceButton = document.querySelector('.voice-button');
        if (voiceButton) {
            if (isRecording) {
                voiceButton.classList.add('recording');
                voiceButton.innerHTML = '<i class="fas fa-microphone-slash"></i>';
                voiceButton.title = 'Dừng ghi âm';
            } else {
                voiceButton.classList.remove('recording');
                voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';
                voiceButton.title = 'Ghi âm tin nhắn thoại';
            }
        }
    },
    
    /**
     * Updates recording time
     */
    updateRecordingTime: function() {
        const recordingTime = document.getElementById('recording-time');
        if (!recordingTime || !this.recordingStartTime) return;
        
        // Calculate elapsed time
        const elapsedTime = Date.now() - this.recordingStartTime;
        const seconds = Math.floor((elapsedTime / 1000) % 60);
        const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
        
        // Format time
        const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update time display
        recordingTime.textContent = formattedTime;
    },
    
    /**
     * Sends audio message
     * @param {Blob} audioBlob - Audio blob
     */
    sendAudioMessage: function(audioBlob) {
        // Create audio URL
        const audioURL = URL.createObjectURL(audioBlob);
        
        // Create message with audio player
        const message = `
            <div class="message-audio">
                <div class="message-audio-icon"><i class="fas fa-volume-up"></i></div>
                <audio class="message-audio-player" controls>
                    <source src="${audioURL}" type="audio/webm">
                    Trình duyệt của bạn không hỗ trợ phát âm thanh.
                </audio>
            </div>
        `;
        
        // Send message
        Chat.addMessage('user', message);
        
        // Trigger AI response
        Chat.sendMessage('Tôi đã gửi một tin nhắn thoại cho bạn.');
    }
};

// Add global reference
window.VoiceMessage = VoiceMessage;
