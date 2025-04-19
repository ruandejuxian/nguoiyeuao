/**
 * Diary management for the Virtual Companion application
 */
const Diary = {
    /**
     * Diary entries
     */
    entries: [],
    
    /**
     * Initializes diary from storage
     */
    init: function() {
        // Load entries from storage
        const savedEntries = Storage.load(CONFIG.DIARY.STORAGE_KEY);
        
        if (savedEntries) {
            this.entries = savedEntries;
            this.updateUI();
        }
    },
    
    /**
     * Adds a new diary entry
     * @param {Object} entry - Entry data
     * @returns {Object} Created entry
     */
    addEntry: function(entry) {
        const newEntry = {
            id: Utils.generateId(),
            type: entry.type,
            title: entry.title,
            content: entry.content,
            timestamp: entry.timestamp || new Date().toISOString()
        };
        
        // Add to entries
        this.entries.unshift(newEntry);
        
        // Limit entries
        if (this.entries.length > CONFIG.DIARY.MAX_ENTRIES) {
            this.entries = this.entries.slice(0, CONFIG.DIARY.MAX_ENTRIES);
        }
        
        // Save to storage
        Storage.save(CONFIG.DIARY.STORAGE_KEY, this.entries);
        
        // Update UI
        this.updateUI();
        
        return newEntry;
    },
    
    /**
     * Removes a diary entry
     * @param {string} id - Entry ID
     * @returns {boolean} Success status
     */
    removeEntry: function(id) {
        const index = this.entries.findIndex(entry => entry.id === id);
        
        if (index === -1) return false;
        
        // Remove entry
        this.entries.splice(index, 1);
        
        // Save to storage
        Storage.save(CONFIG.DIARY.STORAGE_KEY, this.entries);
        
        // Update UI
        this.updateUI();
        
        return true;
    },
    
    /**
     * Updates the diary UI
     */
    updateUI: function() {
        const diaryEntries = document.getElementById('diary-entries');
        
        if (!diaryEntries) return;
        
        if (this.entries.length === 0) {
            diaryEntries.innerHTML = `
                <div class="empty-diary">
                    Chưa có bản ghi nhật ký nào. Hãy trò chuyện với nhân vật của bạn để tạo kỷ niệm!
                </div>
            `;
            return;
        }
        
        // Clear entries
        diaryEntries.innerHTML = '';
        
        // Add entries
        this.entries.forEach(entry => {
            const entryElement = document.createElement('div');
            entryElement.className = 'diary-entry';
            entryElement.innerHTML = `
                <div class="diary-date">${Utils.formatDate(entry.timestamp)}</div>
                <div class="diary-title">${entry.title}</div>
                <div class="diary-content">${entry.content}</div>
            `;
            
            diaryEntries.appendChild(entryElement);
        });
    }
};
