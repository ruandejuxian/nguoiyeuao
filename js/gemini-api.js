// Gemini API integration for Virtual Lover App

// Gemini API endpoint
const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// Function to call Gemini API
async function callGeminiAPI(prompt, apiKey) {
    if (!apiKey) {
        console.error('Gemini API key not provided');
        return null;
    }
    
    try {
        const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024
                }
            })
        });
        
        const data = await response.json();
        
        if (data.error) {
            console.error('Gemini API error:', data.error);
            return null;
        }
        
        if (data.candidates && data.candidates.length > 0 && 
            data.candidates[0].content && 
            data.candidates[0].content.parts && 
            data.candidates[0].content.parts.length > 0) {
            return data.candidates[0].content.parts[0].text;
        } else {
            console.error('Unexpected Gemini API response format:', data);
            return null;
        }
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        return null;
    }
}

// Function to get character response using Gemini API
async function getGeminiResponse(prompt, apiKey) {
    // Call Gemini API
    const response = await callGeminiAPI(prompt, apiKey);
    
    if (!response) {
        return "Xin lỗi, mình đang gặp vấn đề kết nối. Bạn có thể thử lại sau không?";
    }
    
    return response;
}

// Replace mock response with actual Gemini API call
// This function will replace the mockGeminiResponse in chat.js when API key is provided
async function realGeminiResponse(prompt) {
    // Hide typing indicator
    hideTypingIndicator();
    
    // Call Gemini API
    const response = await getGeminiResponse(prompt, geminiApiKey);
    
    // Add character message to chat
    addCharacterMessage(response);
}

// Function to analyze emotion in text
function analyzeEmotion(text) {
    // Convert to lowercase for easier matching
    const lowerText = text.toLowerCase();
    
    // Define emotion keywords
    const emotions = {
        happy: ['vui', 'cười', 'hạnh phúc', 'thích', 'yêu', 'tuyệt vời', 'tốt', 'thú vị', 'haha', 'hihi', '😊', '😄', '😁', '😆', '😂', '🤣', '😍', '🥰', '❤️'],
        excited: ['phấn khích', 'thích thú', 'háo hức', 'mong chờ', 'wow', 'tuyệt', 'không thể tin', 'thật sự', 'quá đỉnh', '😲', '😮', '🤩', '✨', '🎉'],
        sad: ['buồn', 'khóc', 'thất vọng', 'tiếc', 'nhớ', 'cô đơn', 'chán', 'huhu', '😢', '😭', '😔', '😞', '😟', '🥺', '💔'],
        angry: ['giận', 'tức', 'khó chịu', 'bực', 'phiền', 'ghét', 'đáng ghét', 'khùng', '😠', '😡', '🤬', '😤'],
        shy: ['ngại', 'xấu hổ', 'mắc cỡ', 'e thẹn', 'đỏ mặt', 'hihi', '😳', '😊', '🙈']
    };
    
    // Check for each emotion
    let dominantEmotion = 'neutral';
    let maxCount = 0;
    
    for (const [emotion, keywords] of Object.entries(emotions)) {
        let count = 0;
        for (const keyword of keywords) {
            if (lowerText.includes(keyword)) {
                count++;
            }
        }
        
        if (count > maxCount) {
            maxCount = count;
            dominantEmotion = emotion;
        }
    }
    
    return dominantEmotion;
}

// Function to update avatar based on emotion
function updateAvatarEmotion(message) {
    const emotion = analyzeEmotion(message);
    const avatar = document.getElementById('avatar-img');
    
    // Remove all emotion classes
    avatar.classList.remove('avatar-happy', 'avatar-excited', 'avatar-sad', 'avatar-angry', 'avatar-shy');
    
    // Add appropriate emotion class
    switch (emotion) {
        case 'happy':
            avatar.classList.add('avatar-happy');
            break;
        case 'excited':
            avatar.classList.add('avatar-excited');
            break;
        case 'sad':
            avatar.classList.add('avatar-sad');
            break;
        case 'angry':
            avatar.classList.add('avatar-angry');
            break;
        case 'shy':
            avatar.classList.add('avatar-shy');
            break;
        default:
            // No emotion class for neutral
            break;
    }
}

// Function to validate Gemini API key
async function validateGeminiAPIKey(apiKey) {
    if (!apiKey) return false;
    
    try {
        // Simple test prompt
        const testPrompt = "Hello, please respond with 'API key is valid'";
        
        const response = await callGeminiAPI(testPrompt, apiKey);
        
        // Check if response contains validation text
        return response && response.includes('valid');
    } catch (error) {
        console.error('Error validating Gemini API key:', error);
        return false;
    }
}
