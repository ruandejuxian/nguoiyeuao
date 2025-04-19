/**
 * Voice messaging functionality for the Virtual Companion application
 */
const VoiceMessaging = {
    /**
     * Media recorder instance
     */
    mediaRecorder: null,
    
    /**
     * Audio chunks for recording
     */
    audioChunks: [],
    
    /**
     * Recording start time
     */
    recordingStartTime: 0,
    
    /**
     * Recording timer interval
     */
    recordingInterval: null,
    
    /**
     * Audio blob after recording
     */
    audioBlob: null,
    
    /**
     * Audio URL after recording
     */
    audioUrl: null,
    
    /**
     * Initializes voice messaging
     */
    init: function() {
        console.log('Initializing voice messaging...');
        
        // Get DOM elements
        const voiceButton = document.getElementById('voice-button');
        const voiceRecordingModal = document.getElementById('voice-recording-modal');
        const stopRecordingBtn = document.getElementById('stop-recording');
        const cancelRecordingBtn = document.getElementById('cancel-recording');
        const sendRecordingBtn = document.getElementById('send-recording');
        const recordingTime = document.querySelector('.recording-time');
        
        if (!voiceButton || !voiceRecordingModal || !stopRecordingBtn || 
            !cancelRecordingBtn || !sendRecordingBtn || !recordingTime) {
            console.error('Voice recording elements not found');
            return;
        }
        
        // Start recording on button click
        voiceButton.addEventListener('click', this.startRecording.bind(this));
        
        // Stop recording
        stopRecordingBtn.addEventListener('click', this.stopRecording.bind(this));
        
        // Cancel recording
        cancelRecordingBtn.addEventListener('click', this.cancelRecording.bind(this));
        
        // Send recording
        sendRecordingBtn.addEventListener('click', this.sendRecording.bind(this));
        
        console.log('Voice messaging initialized');
    },
    
    /**
     * Starts voice recording
     */
    startRecording: async function() {
        console.log('Starting voice recording...');
        
        try {
            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            // Reset audio chunks
            this.audioChunks = [];
            
            // Create media recorder
            this.mediaRecorder = new MediaRecorder(stream);
            
            // Handle data available event
            this.mediaRecorder.addEventListener('dataavailable', (e) => {
                this.audioChunks.push(e.data);
            });
            
            // Handle recording stop event
            this.mediaRecorder.addEventListener('stop', () => {
                // Create audio blob
                this.audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
                this.audioUrl = URL.createObjectURL(this.audioBlob);
                
                // Enable send button
                document.getElementById('send-recording').disabled = false;
                
                console.log('Recording stopped, audio blob created');
            });
            
            // Start recording
            this.mediaRecorder.start();
            
            // Show recording modal
            document.getElementById('voice-recording-modal').style.display = 'flex';
            
            // Start recording timer
            this.recordingStartTime = Date.now();
            this.startRecordingTimer();
            
            console.log('Recording started');
        } catch (error) {
            console.error('Error starting voice recording:', error);
            
            Utils.showModal('alert-modal', {
                title: 'Không thể ghi âm',
                message: 'Không thể truy cập microphone. Vui lòng kiểm tra quyền truy cập và thử lại.'
            });
        }
    },
    
    /**
     * Starts recording timer
     */
    startRecordingTimer: function() {
        const recordingTime = document.querySelector('.recording-time');
        
        if (!recordingTime) return;
        
        // Clear existing interval
        if (this.recordingInterval) {
            clearInterval(this.recordingInterval);
        }
        
        // Update timer every second
        this.recordingInterval = setInterval(() => {
            const elapsedTime = Math.floor((Date.now() - this.recordingStartTime) / 1000);
            const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, '0');
            const seconds = (elapsedTime % 60).toString().padStart(2, '0');
            
            recordingTime.textContent = `${minutes}:${seconds}`;
            
            // Limit recording to 2 minutes
            if (elapsedTime >= 120) {
                this.stopRecording();
            }
        }, 1000);
    },
    
    /**
     * Stops voice recording
     */
    stopRecording: function() {
        console.log('Stopping voice recording...');
        
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            // Stop recording
            this.mediaRecorder.stop();
            
            // Stop all tracks
            this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
            
            // Stop recording timer
            if (this.recordingInterval) {
                clearInterval(this.recordingInterval);
                this.recordingInterval = null;
            }
            
            console.log('Recording stopped');
        }
    },
    
    /**
     * Cancels voice recording
     */
    cancelRecording: function() {
        console.log('Canceling voice recording...');
        
        // Stop recording if active
        this.stopRecording();
        
        // Hide modal
        document.getElementById('voice-recording-modal').style.display = 'none';
        
        // Reset recording time
        document.querySelector('.recording-time').textContent = '00:00';
        
        // Disable send button
        document.getElementById('send-recording').disabled = true;
        
        // Clear audio data
        this.audioBlob = null;
        this.audioUrl = null;
        
        console.log('Recording canceled');
    },
    
    /**
     * Sends voice recording
     */
    sendRecording: function() {
        console.log('Sending voice recording...');
        
        if (!this.audioBlob || !this.audioUrl) {
            console.error('No audio recording to send');
            return;
        }
        
        // Create audio element for message
        const audioElement = document.createElement('audio');
        audioElement.src = this.audioUrl;
        audioElement.controls = true;
        
        // Add audio message to chat
        Chat.addMessage('user', this.audioUrl, 'audio');
        
        // Hide modal
        document.getElementById('voice-recording-modal').style.display = 'none';
        
        // Reset recording time
        document.querySelector('.recording-time').textContent = '00:00';
        
        // Disable send button
        document.getElementById('send-recording').disabled = true;
        
        // Clear audio data
        this.audioBlob = null;
        this.audioUrl = null;
        
        console.log('Voice message sent');
        
        // Generate AI response
        setTimeout(() => {
            Chat.showTypingIndicator();
            
            // Random delay to simulate thinking
            const responseDelay = Utils.getRandomNumber(1500, 3000);
            
            setTimeout(() => {
                Chat.hideTypingIndicator();
                Chat.addCompanionMessage('Tôi đã nhận được tin nhắn thoại của bạn. Thật tuyệt khi được nghe giọng nói của bạn!');
            }, responseDelay);
        }, 500);
    },
    
    /**
     * Plays a voice message
     * @param {string} audioUrl - URL of the audio to play
     * @param {HTMLElement} playButton - Play button element
     */
    playVoiceMessage: function(audioUrl, playButton) {
        if (!audioUrl || !playButton) return;
        
        const audio = new Audio(audioUrl);
        
        // Play audio
        audio.play();
        
        // Update button icon
        playButton.innerHTML = '<i class="fas fa-pause"></i>';
        
        // Handle audio ended event
        audio.addEventListener('ended', () => {
            playButton.innerHTML = '<i class="fas fa-play"></i>';
        });
        
        // Handle pause event
        audio.addEventListener('pause', () => {
            playButton.innerHTML = '<i class="fas fa-play"></i>';
        });
        
        // Store audio element in button for pause functionality
        playButton.audio = audio;
        
        // Add click event to pause
        playButton.onclick = () => {
            if (audio.paused) {
                audio.play();
                playButton.innerHTML = '<i class="fas fa-pause"></i>';
            } else {
                audio.pause();
                playButton.innerHTML = '<i class="fas fa-play"></i>';
            }
        };
    }
};
