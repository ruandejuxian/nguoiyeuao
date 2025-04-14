// Diary functionality for Virtual Lover App

// Initialize diary system
function initDiarySystem() {
    // Load diary entries from localStorage
    loadDiaryEntries();
    
    // Display diary entries
    displayDiaryEntries();
}

// Load diary entries from localStorage
function loadDiaryEntries() {
    const savedDiaryEntries = localStorage.getItem('virtualLover_diaryEntries');
    if (savedDiaryEntries) {
        diaryEntries = JSON.parse(savedDiaryEntries);
    } else {
        diaryEntries = [];
    }
}

// Add entry to diary
function addToDiary(message, title) {
    // Skip if no character
    if (!currentCharacter) return;
    
    // Create diary entry
    const entry = {
        id: Date.now(),
        date: new Date().toISOString(),
        title: title || 'Khoảnh khắc đáng nhớ',
        content: message
    };
    
    // Add to diary entries
    diaryEntries.push(entry);
    
    // Limit to 50 entries
    if (diaryEntries.length > 50) {
        diaryEntries.shift();
    }
    
    // Save to localStorage
    localStorage.setItem('virtualLover_diaryEntries', JSON.stringify(diaryEntries));
    
    // Update diary display if on diary tab
    if (currentTab === 'diary') {
        displayDiaryEntries();
    }
}

// Display diary entries
function displayDiaryEntries() {
    const diaryEntriesContainer = document.getElementById('diary-entries');
    
    if (diaryEntries.length === 0) {
        diaryEntriesContainer.innerHTML = `
            <div class="empty-diary">
                <p>Chưa có kỷ niệm nào được lưu lại.</p>
                <p>Hãy trò chuyện nhiều hơn để tạo kỷ niệm đáng nhớ!</p>
            </div>
        `;
        return;
    }
    
    // Sort entries by date (newest first)
    const sortedEntries = [...diaryEntries].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
    
    // Clear container
    diaryEntriesContainer.innerHTML = '';
    
    // Add entries
    sortedEntries.forEach(entry => {
        const entryElement = document.createElement('div');
        entryElement.className = 'diary-entry';
        entryElement.dataset.id = entry.id;
        
        const date = new Date(entry.date);
        const formattedDate = date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        entryElement.innerHTML = `
            <div class="diary-date">${formattedDate}</div>
            <div class="diary-title">${entry.title}</div>
            <div class="diary-content">${entry.content}</div>
            <div class="diary-actions">
                <button class="diary-delete-btn" onclick="deleteDiaryEntry(${entry.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        diaryEntriesContainer.appendChild(entryElement);
    });
}

// Delete diary entry
function deleteDiaryEntry(id) {
    // Confirm deletion
    if (!confirm('Bạn có chắc chắn muốn xóa kỷ niệm này?')) {
        return;
    }
    
    // Find entry index
    const entryIndex = diaryEntries.findIndex(entry => entry.id === id);
    
    if (entryIndex !== -1) {
        // Remove entry
        diaryEntries.splice(entryIndex, 1);
        
        // Save to localStorage
        localStorage.setItem('virtualLover_diaryEntries', JSON.stringify(diaryEntries));
        
        // Update display
        displayDiaryEntries();
    }
}

// Check if message should be added to diary
function checkMessageForDiary(message, sender) {
    // Skip if no character
    if (!currentCharacter) return;
    
    // Convert to lowercase for easier matching
    const lowerMessage = message.toLowerCase();
    
    // Keywords that indicate special moments
    const specialKeywords = [
        'yêu', 'thương', 'nhớ', 'mãi mãi', 'hạnh phúc', 'kỷ niệm', 
        'đặc biệt', 'quan trọng', 'không quên', 'đáng nhớ'
    ];
    
    // Check for special keywords
    for (const keyword of specialKeywords) {
        if (lowerMessage.includes(keyword)) {
            // Add to diary
            const title = sender === 'user' ? 
                `Bạn đã nói điều đặc biệt` : 
                `${currentCharacter.name} đã nói điều đặc biệt`;
            
            addToDiary(message, title);
            break;
        }
    }
    
    // Check for first message of the day
    const today = new Date().toDateString();
    const lastMessageDate = localStorage.getItem('virtualLover_lastMessageDate');
    
    if (lastMessageDate !== today) {
        if (sender === 'user') {
            addToDiary(message, 'Tin nhắn đầu tiên trong ngày');
        }
        localStorage.setItem('virtualLover_lastMessageDate', today);
    }
    
    // Check for milestone messages
    const messageCount = chatHistory.length;
    if (messageCount % 50 === 0 && messageCount > 0) {
        addToDiary(message, `Tin nhắn thứ ${messageCount}`);
    }
}

// Add manual diary entry
function addManualDiaryEntry() {
    // Create modal for entry input
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Thêm kỷ niệm mới</h2>
            <form id="diary-form">
                <div class="form-group">
                    <label for="diary-title">Tiêu đề:</label>
                    <input type="text" id="diary-title" placeholder="Nhập tiêu đề kỷ niệm" required>
                </div>
                <div class="form-group">
                    <label for="diary-content">Nội dung:</label>
                    <textarea id="diary-content" placeholder="Mô tả kỷ niệm của bạn" required></textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn" onclick="closeModal()">Hủy</button>
                    <button type="submit" class="btn btn-primary">Lưu</button>
                </div>
            </form>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.style.display = 'flex';
    }, 10);
    
    // Handle form submission
    document.getElementById('diary-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('diary-title').value.trim();
        const content = document.getElementById('diary-content').value.trim();
        
        if (title && content) {
            addToDiary(content, title);
            closeModal();
        }
    });
}

// Close modal
function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.style.display = 'none';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Add diary entry button to diary tab
function addDiaryEntryButton() {
    const diaryContainer = document.querySelector('.diary-container');
    
    if (diaryContainer) {
        const addButton = document.createElement('button');
        addButton.className = 'btn btn-primary add-diary-btn';
        addButton.innerHTML = '<i class="fas fa-plus"></i> Thêm kỷ niệm';
        addButton.addEventListener('click', addManualDiaryEntry);
        
        diaryContainer.insertBefore(addButton, diaryContainer.firstChild.nextSibling);
    }
}

// Export diary entries
function exportDiaryEntries() {
    if (diaryEntries.length === 0) {
        alert('Chưa có kỷ niệm nào để xuất!');
        return;
    }
    
    // Format diary entries as text
    let diaryText = `# Nhật ký tình yêu với ${currentCharacter?.name || 'Người yêu ảo'}\n\n`;
    
    // Sort entries by date (newest first)
    const sortedEntries = [...diaryEntries].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
    
    sortedEntries.forEach(entry => {
        const date = new Date(entry.date);
        const formattedDate = date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        diaryText += `## ${entry.title}\n`;
        diaryText += `*${formattedDate}*\n\n`;
        diaryText += `${entry.content}\n\n`;
        diaryText += `---\n\n`;
    });
    
    // Create download link
    const blob = new Blob([diaryText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nhat-ky-tinh-yeu-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    
    // Clean up
    URL.revokeObjectURL(url);
}

// Add export button to diary tab
function addExportDiaryButton() {
    const diaryContainer = document.querySelector('.diary-container');
    
    if (diaryContainer) {
        const exportButton = document.createElement('button');
        exportButton.className = 'btn export-diary-btn';
        exportButton.innerHTML = '<i class="fas fa-download"></i> Xuất nhật ký';
        exportButton.addEventListener('click', exportDiaryEntries);
        
        // Add after add button
        const addButton = document.querySelector('.add-diary-btn');
        if (addButton) {
            addButton.parentNode.insertBefore(exportButton, addButton.nextSibling);
        } else {
            diaryContainer.insertBefore(exportButton, diaryContainer.firstChild.nextSibling);
        }
    }
}

// Initialize diary system on page load
document.addEventListener('DOMContentLoaded', function() {
    initDiarySystem();
    
    // Add buttons after a short delay to ensure container exists
    setTimeout(() => {
        addDiaryEntryButton();
        addExportDiaryButton();
    }, 500);
    
    // Add functions to window for onclick access
    window.deleteDiaryEntry = deleteDiaryEntry;
    window.closeModal = closeModal;
});
