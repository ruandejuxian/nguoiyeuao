/**
 * Diary functionality for the Virtual Companion application
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
        // Try to load diary entries from storage
        const savedEntries = Storage.load(CONFIG.DIARY.STORAGE_KEY);
        
        if (savedEntries && Array.isArray(savedEntries)) {
            this.entries = savedEntries;
            this.renderEntries();
            return true;
        }
        
        this.entries = [];
        return false;
    },
    
    /**
     * Adds a new diary entry
     * @param {Object} entry - Diary entry data
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
        this.entries.push(newEntry);
        
        // Sort entries by timestamp (newest first)
        this.entries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        // Save to storage
        Storage.save(CONFIG.DIARY.STORAGE_KEY, this.entries);
        
        // Render entries
        this.renderEntries();
        
        return newEntry;
    },
    
    /**
     * Removes a diary entry
     * @param {string} entryId - ID of entry to remove
     * @returns {boolean} Success status
     */
    removeEntry: function(entryId) {
        const initialLength = this.entries.length;
        this.entries = this.entries.filter(entry => entry.id !== entryId);
        
        if (this.entries.length < initialLength) {
            // Save to storage
            Storage.save(CONFIG.DIARY.STORAGE_KEY, this.entries);
            
            // Render entries
            this.renderEntries();
            
            return true;
        }
        
        return false;
    },
    
    /**
     * Clears all diary entries
     * @returns {boolean} Success status
     */
    clearEntries: function() {
        this.entries = [];
        Storage.remove(CONFIG.DIARY.STORAGE_KEY);
        this.renderEntries();
        return true;
    },
    
    /**
     * Renders all diary entries
     */
    renderEntries: function() {
        const diaryEntries = document.getElementById('diary-entries');
        
        if (this.entries.length === 0) {
            diaryEntries.innerHTML = `
                <div class="empty-diary">
                    <p>Chưa có kỷ niệm nào được lưu lại.</p>
                    <p>Hãy trò chuyện nhiều hơn với nhân vật của bạn!</p>
                </div>
            `;
            return;
        }
        
        // Clear existing entries
        diaryEntries.innerHTML = '';
        
        // Render each entry
        this.entries.forEach(entry => {
            const entryElement = document.createElement('div');
            entryElement.classList.add('diary-entry');
            entryElement.dataset.id = entry.id;
            
            // Format timestamp
            const timestamp = new Date(entry.timestamp);
            const formattedDate = Utils.formatDate(timestamp);
            
            entryElement.innerHTML = `
                <div class="diary-date">${formattedDate}</div>
                <h3 class="diary-title">${entry.title}</h3>
                <p class="diary-content">${entry.content}</p>
            `;
            
            diaryEntries.appendChild(entryElement);
        });
    }
};
