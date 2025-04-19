/**
 * Storage management for the Virtual Companion application
 */
const Storage = {
    /**
     * Saves data to local storage
     * @param {string} key - Storage key
     * @param {*} data - Data to save
     * @returns {boolean} Success status
     */
    save: function(key, data) {
        try {
            const serialized = JSON.stringify(data);
            localStorage.setItem(key, serialized);
            return true;
        } catch (error) {
            console.error('Error saving to storage:', error);
            return false;
        }
    },
    
    /**
     * Loads data from local storage
     * @param {string} key - Storage key
     * @returns {*} Loaded data or null if not found
     */
    load: function(key) {
        try {
            const serialized = localStorage.getItem(key);
            if (serialized === null) return null;
            return JSON.parse(serialized);
        } catch (error) {
            console.error('Error loading from storage:', error);
            return null;
        }
    },
    
    /**
     * Removes data from local storage
     * @param {string} key - Storage key
     * @returns {boolean} Success status
     */
    remove: function(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from storage:', error);
            return false;
        }
    },
    
    /**
     * Clears all data from local storage
     * @returns {boolean} Success status
     */
    clear: function() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing storage:', error);
            return false;
        }
    }
};
