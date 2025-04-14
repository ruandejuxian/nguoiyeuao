/**
 * Theme customization functionality for the Virtual Companion application
 */
const ThemeCustomizer = {
    /**
     * Available themes
     */
    themes: [
        {
            name: 'Mặc định',
            primaryColor: '#ff6b6b',
            secondaryColor: '#4ecdc4',
            accentColor: '#ffe66d',
            bgColor: '#f9f9f9',
            cardBg: '#ffffff'
        },
        {
            name: 'Màn đêm',
            primaryColor: '#6b5b95',
            secondaryColor: '#574b7c',
            accentColor: '#feb236',
            bgColor: '#2c2c2c',
            cardBg: '#3c3c3c'
        },
        {
            name: 'Biển xanh',
            primaryColor: '#3498db',
            secondaryColor: '#2980b9',
            accentColor: '#f1c40f',
            bgColor: '#ecf0f1',
            cardBg: '#ffffff'
        },
        {
            name: 'Hồng phấn',
            primaryColor: '#ff85a2',
            secondaryColor: '#ff7096',
            accentColor: '#ffd5e5',
            bgColor: '#fff0f5',
            cardBg: '#ffffff'
        },
        {
            name: 'Rừng xanh',
            primaryColor: '#27ae60',
            secondaryColor: '#2ecc71',
            accentColor: '#f39c12',
            bgColor: '#f4f9f4',
            cardBg: '#ffffff'
        }
    ],
    
    /**
     * Current theme
     */
    currentTheme: 0,
    
    /**
     * Initializes theme customizer
     */
    init: function() {
        // Load saved theme
        this.loadSavedTheme();
        
        // Add theme selector to settings
        this.addThemeSelector();
        
        console.log('Theme customizer initialized');
    },
    
    /**
     * Loads saved theme
     */
    loadSavedTheme: function() {
        const savedTheme = localStorage.getItem('virtual_companion_theme');
        
        if (savedTheme !== null) {
            this.currentTheme = parseInt(savedTheme);
            this.applyTheme(this.currentTheme);
        }
    },
    
    /**
     * Adds theme selector to settings
     */
    addThemeSelector: function() {
        // Find settings container
        const settingsContainer = document.querySelector('#settings-tab .settings-container');
        if (!settingsContainer) return;
        
        // Create theme section
        const themeSection = document.createElement('div');
        themeSection.className = 'settings-section';
        
        // Create section header
        const sectionHeader = document.createElement('h3');
        sectionHeader.textContent = 'Tùy chỉnh giao diện';
        themeSection.appendChild(sectionHeader);
        
        // Create theme selector
        const themeSelector = document.createElement('div');
        themeSelector.className = 'theme-selector';
        
        // Add themes
        this.themes.forEach((theme, index) => {
            const themeOption = document.createElement('div');
            themeOption.className = `theme-option ${index === this.currentTheme ? 'active' : ''}`;
            themeOption.setAttribute('data-theme', index);
            
            // Create theme preview
            const themePreview = document.createElement('div');
            themePreview.className = 'theme-preview';
            themePreview.style.backgroundColor = theme.bgColor;
            
            // Add color samples
            const primaryColor = document.createElement('div');
            primaryColor.className = 'color-sample primary';
            primaryColor.style.backgroundColor = theme.primaryColor;
            themePreview.appendChild(primaryColor);
            
            const secondaryColor = document.createElement('div');
            secondaryColor.className = 'color-sample secondary';
            secondaryColor.style.backgroundColor = theme.secondaryColor;
            themePreview.appendChild(secondaryColor);
            
            const accentColor = document.createElement('div');
            accentColor.className = 'color-sample accent';
            accentColor.style.backgroundColor = theme.accentColor;
            themePreview.appendChild(accentColor);
            
            themeOption.appendChild(themePreview);
            
            // Add theme name
            const themeName = document.createElement('div');
            themeName.className = 'theme-name';
            themeName.textContent = theme.name;
            themeOption.appendChild(themeName);
            
            // Add click event
            themeOption.addEventListener('click', () => {
                this.setTheme(index);
            });
            
            themeSelector.appendChild(themeOption);
        });
        
        themeSection.appendChild(themeSelector);
        
        // Add custom theme option
        const customThemeSection = document.createElement('div');
        customThemeSection.className = 'custom-theme-section';
        
        const customThemeHeader = document.createElement('h4');
        customThemeHeader.textContent = 'Tùy chỉnh màu sắc';
        customThemeSection.appendChild(customThemeHeader);
        
        // Primary color picker
        const primaryColorGroup = document.createElement('div');
        primaryColorGroup.className = 'color-picker-group';
        
        const primaryColorLabel = document.createElement('label');
        primaryColorLabel.textContent = 'Màu chính:';
        primaryColorLabel.setAttribute('for', 'primary-color-picker');
        primaryColorGroup.appendChild(primaryColorLabel);
        
        const primaryColorPicker = document.createElement('input');
        primaryColorPicker.type = 'color';
        primaryColorPicker.id = 'primary-color-picker';
        primaryColorPicker.value = this.themes[this.currentTheme].primaryColor;
        primaryColorPicker.addEventListener('change', (e) => {
            document.documentElement.style.setProperty('--primary-color', e.target.value);
            document.documentElement.style.setProperty('--primary-dark', this.adjustColor(e.target.value, -15));
            this.saveCustomTheme();
        });
        primaryColorGroup.appendChild(primaryColorPicker);
        
        customThemeSection.appendChild(primaryColorGroup);
        
        // Secondary color picker
        const secondaryColorGroup = document.createElement('div');
        secondaryColorGroup.className = 'color-picker-group';
        
        const secondaryColorLabel = document.createElement('label');
        secondaryColorLabel.textContent = 'Màu phụ:';
        secondaryColorLabel.setAttribute('for', 'secondary-color-picker');
        secondaryColorGroup.appendChild(secondaryColorLabel);
        
        const secondaryColorPicker = document.createElement('input');
        secondaryColorPicker.type = 'color';
        secondaryColorPicker.id = 'secondary-color-picker';
        secondaryColorPicker.value = this.themes[this.currentTheme].secondaryColor;
        secondaryColorPicker.addEventListener('change', (e) => {
            document.documentElement.style.setProperty('--secondary-color', e.target.value);
            this.saveCustomTheme();
        });
        secondaryColorGroup.appendChild(secondaryColorPicker);
        
        customThemeSection.appendChild(secondaryColorGroup);
        
        // Accent color picker
        const accentColorGroup = document.createElement('div');
        accentColorGroup.className = 'color-picker-group';
        
        const accentColorLabel = document.createElement('label');
        accentColorLabel.textContent = 'Màu nhấn:';
        accentColorLabel.setAttribute('for', 'accent-color-picker');
        accentColorGroup.appendChild(accentColorLabel);
        
        const accentColorPicker = document.createElement('input');
        accentColorPicker.type = 'color';
        accentColorPicker.id = 'accent-color-picker';
        accentColorPicker.value = this.themes[this.currentTheme].accentColor;
        accentColorPicker.addEventListener('change', (e) => {
            document.documentElement.style.setProperty('--accent-color', e.target.value);
            this.saveCustomTheme();
        });
        accentColorGroup.appendChild(accentColorPicker);
        
        customThemeSection.appendChild(accentColorGroup);
        
        // Reset button
        const resetButton = document.createElement('button');
        resetButton.className = 'reset-theme-button';
        resetButton.textContent = 'Khôi phục mặc định';
        resetButton.addEventListener('click', () => {
            this.setTheme(0);
        });
        
        customThemeSection.appendChild(resetButton);
        
        themeSection.appendChild(customThemeSection);
        
        // Add theme section to settings
        settingsContainer.appendChild(themeSection);
        
        // Add CSS for theme selector
        this.addThemeStyles();
    },
    
    /**
     * Sets the theme
     * @param {number} index - Theme index
     */
    setTheme: function(index) {
        // Update active theme
        const themeOptions = document.querySelectorAll('.theme-option');
        themeOptions.forEach((option, i) => {
            if (i === index) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
        
        // Apply theme
        this.currentTheme = index;
        this.applyTheme(index);
        
        // Save theme
        localStorage.setItem('virtual_companion_theme', index);
        
        // Update color pickers
        const primaryColorPicker = document.getElementById('primary-color-picker');
        const secondaryColorPicker = document.getElementById('secondary-color-picker');
        const accentColorPicker = document.getElementById('accent-color-picker');
        
        if (primaryColorPicker) primaryColorPicker.value = this.themes[index].primaryColor;
        if (secondaryColorPicker) secondaryColorPicker.value = this.themes[index].secondaryColor;
        if (accentColorPicker) accentColorPicker.value = this.themes[index].accentColor;
    },
    
    /**
     * Applies the theme
     * @param {number} index - Theme index
     */
    applyTheme: function(index) {
        const theme = this.themes[index];
        
        // Set CSS variables
        document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
        document.documentElement.style.setProperty('--primary-dark', this.adjustColor(theme.primaryColor, -15));
        document.documentElement.style.setProperty('--secondary-color', theme.secondaryColor);
        document.documentElement.style.setProperty('--accent-color', theme.accentColor);
        document.documentElement.style.setProperty('--bg-color', theme.bgColor);
        document.documentElement.style.setProperty('--card-bg', theme.cardBg);
        
        // Set text colors based on background
        if (this.isLightColor(theme.bgColor)) {
            document.documentElement.style.setProperty('--text-color', '#333');
            document.documentElement.style.setProperty('--text-light', '#666');
        } else {
            document.documentElement.style.setProperty('--text-color', '#f0f0f0');
            document.documentElement.style.setProperty('--text-light', '#cccccc');
        }
        
        // Set border color based on background
        if (this.isLightColor(theme.bgColor)) {
            document.documentElement.style.setProperty('--border-color', '#e0e0e0');
        } else {
            document.documentElement.style.setProperty('--border-color', '#555555');
        }
    },
    
    /**
     * Saves custom theme
     */
    saveCustomTheme: function() {
        // Create custom theme
        const customTheme = {
            name: 'Tùy chỉnh',
            primaryColor: document.documentElement.style.getPropertyValue('--primary-color') || this.themes[this.currentTheme].primaryColor,
            secondaryColor: document.documentElement.style.getPropertyValue('--secondary-color') || this.themes[this.currentTheme].secondaryColor,
            accentColor: document.documentElement.style.getPropertyValue('--accent-color') || this.themes[this.currentTheme].accentColor,
            bgColor: document.documentElement.style.getPropertyValue('--bg-color') || this.themes[this.currentTheme].bgColor,
            cardBg: document.documentElement.style.getPropertyValue('--card-bg') || this.themes[this.currentTheme].cardBg
        };
        
        // Save custom theme
        localStorage.setItem('virtual_companion_custom_theme', JSON.stringify(customTheme));
    },
    
    /**
     * Adds theme styles
     */
    addThemeStyles: function() {
        const style = document.createElement('style');
        style.textContent = `
            .theme-selector {
                display: flex;
                flex-wrap: wrap;
                gap: 15px;
                margin-bottom: 20px;
            }
            
            .theme-option {
                width: 80px;
                cursor: pointer;
                border-radius: var(--radius);
                overflow: hidden;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                transition: transform 0.2s ease, box-shadow 0.2s ease;
            }
            
            .theme-option:hover {
                transform: translateY(-3px);
                box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
            }
            
            .theme-option.active {
                box-shadow: 0 0 0 2px var(--primary-color), 0 5px 10px rgba(0, 0, 0, 0.15);
            }
            
            .theme-preview {
                height: 60px;
                padding: 10px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }
            
            .color-sample {
                height: 10px;
                border-radius: 5px;
            }
            
            .theme-name {
                padding: 8px 5px;
                text-align: center;
                font-size: 0.8rem;
                background-color: var(--card-bg);
                color: var(--text-color);
            }
            
            .custom-theme-section {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid var(--border-color);
            }
            
            .color-picker-group {
                display: flex;
                align-items: center;
                margin-bottom: 10px;
            }
            
            .color-picker-group label {
                flex: 1;
                margin-right: 10px;
            }
            
            .color-picker-group input[type="color"] {
                width: 40px;
                height: 40px;
                border: none;
                border-radius: var(--radius);
                cursor: pointer;
            }
            
            .reset-theme-button {
                background-color: var(--bg-color);
                border: 1px solid var(--border-color);
                color: var(--text-color);
                padding: 8px 15px;
                border-radius: var(--radius);
                cursor: pointer;
                margin-top: 10px;
                transition: background-color 0.2s ease;
            }
            
            .reset-theme-button:hover {
                background-color: var(--border-color);
            }
        `;
        
        document.head.appendChild(style);
    },
    
    /**
     * Adjusts a color by a percentage
     * @param {string} color - Hex color
     * @param {number} percent - Percentage to adjust
     * @returns {string} Adjusted color
     */
    adjustColor: function(color, percent) {
        let R = parseInt(color.substring(1, 3), 16);
        let G = parseInt(color.substring(3, 5), 16);
        let B = parseInt(color.substring(5, 7), 16);

        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);

        R = (R < 255) ? R : 255;
        G = (G < 255) ? G : 255;
        B = (B < 255) ? B : 255;

        R = (R > 0) ? R : 0;
        G = (G > 0) ? G : 0;
        B = (B > 0) ? B : 0;

        const RR = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16));
        const GG = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16));
        const BB = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16));

        return "#" + RR + GG + BB;
    },
    
    /**
     * Checks if a color is light
     * @param {string} color - Hex color
     * @returns {boolean} Whether the color is light
     */
    isLightColor: function(color) {
        const r = parseInt(color.substring(1, 3), 16);
        const g = parseInt(color.substring(3, 5), 16);
        const b = parseInt(color.substring(5, 7), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 128;
    }
};
