/**
 * Storage management for the Virtual Companion application
 */
const Storage = {
    /**
     * Saves data to localStorage
     * @param {string} key - Storage key
     * @param {any} data - Data to save
     * @returns {boolean} Success status
     */
    save: function(key, data) {
        try {
            const serializedData = JSON.stringify(data);
            localStorage.setItem(key, serializedData);
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },
    
    /**
     * Loads data from localStorage
     * @param {string} key - Storage key
     * @returns {any} Retrieved data or null if not found
     */
    load: function(key) {
        try {
            const serializedData = localStorage.getItem(key);
            if (serializedData === null) {
                return null;
            }
            return JSON.parse(serializedData);
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return null;
        }
    },
    
    /**
     * Removes data from localStorage
     * @param {string} key - Storage key
     * @returns {boolean} Success status
     */
    remove: function(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    },
    
    /**
     * Checks if data exists in localStorage
     * @param {string} key - Storage key
     * @returns {boolean} True if data exists
     */
    exists: function(key) {
        return localStorage.getItem(key) !== null;
    },
    
    /**
     * Clears all application data from localStorage
     * @returns {boolean} Success status
     */
    clearAll: function() {
        try {
            // Only clear keys related to our application
            const keysToRemove = [
                CONFIG.CHARACTER.STORAGE_KEY,
                CONFIG.CHAT.STORAGE_KEY,
                CONFIG.DIARY.STORAGE_KEY,
                CONFIG.API.STORAGE_KEYS.API_KEY
            ];
            
            keysToRemove.forEach(key => localStorage.removeItem(key));
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }
};
