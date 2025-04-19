/**
 * Storage management for the Virtual Companion application
 */
const Storage = {
    /**
     * Saves data to local storage
     * @param {string} key - Storage key
     * @param {*} value - Value to save
     */
    save: function(key, value) {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
        } catch (e) {
            console.error('Error saving to storage:', e);
        }
    },
    
    /**
     * Loads data from local storage
     * @param {string} key - Storage key
     * @returns {*} Loaded value
     */
    load: function(key) {
        try {
            const serializedValue = localStorage.getItem(key);
            if (serializedValue === null) return null;
            return JSON.parse(serializedValue);
        } catch (e) {
            console.error('Error loading from storage:', e);
            return null;
        }
    },
    
    /**
     * Removes data from local storage
     * @param {string} key - Storage key
     */
    remove: function(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('Error removing from storage:', e);
        }
    },
    
    /**
     * Clears all data from local storage
     */
    clear: function() {
        try {
            localStorage.clear();
        } catch (e) {
            console.error('Error clearing storage:', e);
        }
    },
    
    /**
     * Checks if a key exists in local storage
     * @param {string} key - Storage key
     * @returns {boolean} Whether key exists
     */
    exists: function(key) {
        try {
            return localStorage.getItem(key) !== null;
        } catch (e) {
            console.error('Error checking storage:', e);
            return false;
        }
    }
};
