/**
 * Weather widget functionality for the Virtual Companion application
 */
const WeatherWidget = {
    /**
     * API key for OpenWeatherMap
     */
    apiKey: '3b9b1b5c3e4f5a6b7c8d9e0f1a2b3c4d',
    
    /**
     * User's location
     */
    userLocation: null,
    
    /**
     * Weather data
     */
    weatherData: null,
    
    /**
     * Initializes weather widget
     */
    init: function() {
        // Add weather widget to sidebar
        this.addWeatherWidget();
        
        // Get user's location
        this.getUserLocation();
        
        console.log('Weather widget initialized');
    },
    
    /**
     * Adds weather widget to sidebar
     */
    addWeatherWidget: function() {
        // Find sidebar
        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) return;
        
        // Create weather widget
        const weatherWidget = document.createElement('div');
        weatherWidget.className = 'weather-widget';
        weatherWidget.id = 'weather-widget';
        
        // Create weather content
        weatherWidget.innerHTML = `
            <div class="weather-header">
                <h3>Thời Tiết</h3>
                <button class="weather-refresh" title="Làm mới"><i class="fas fa-sync-alt"></i></button>
            </div>
            <div class="weather-content">
                <div class="weather-loading">
                    <i class="fas fa-spinner fa-spin"></i>
                    <span>Đang tải...</span>
                </div>
                <div class="weather-error" style="display: none;">
                    <i class="fas fa-exclamation-circle"></i>
                    <span>Không thể tải dữ liệu thời tiết</span>
                </div>
                <div class="weather-data" style="display: none;">
                    <div class="weather-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span id="weather-location-text">--</span>
                    </div>
                    <div class="weather-main">
                        <div class="weather-icon">
                            <img id="weather-icon-img" src="" alt="Weather">
                        </div>
                        <div class="weather-temp">
                            <span id="weather-temp-value">--</span>°C
                        </div>
                    </div>
                    <div class="weather-description" id="weather-description">--</div>
                    <div class="weather-details">
                        <div class="weather-detail">
                            <i class="fas fa-tint"></i>
                            <span id="weather-humidity">--</span>%
                        </div>
                        <div class="weather-detail">
                            <i class="fas fa-wind"></i>
                            <span id="weather-wind">--</span> km/h
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add weather widget to sidebar before connection status
        const connectionStatus = sidebar.querySelector('.connection-status');
        if (connectionStatus) {
            sidebar.insertBefore(weatherWidget, connectionStatus);
        } else {
            sidebar.appendChild(weatherWidget);
        }
        
        // Add refresh button event listener
        const refreshButton = weatherWidget.querySelector('.weather-refresh');
        if (refreshButton) {
            refreshButton.addEventListener('click', () => {
                this.getWeatherData();
            });
        }
        
        // Add weather widget styles
        this.addWeatherStyles();
    },
    
    /**
     * Adds weather styles
     */
    addWeatherStyles: function() {
        const style = document.createElement('style');
        style.textContent = `
            .weather-widget {
                margin-top: auto;
                background-color: rgba(255, 255, 255, 0.1);
                border-radius: var(--radius);
                padding: 15px;
                margin-bottom: 15px;
            }
            
            .weather-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }
            
            .weather-header h3 {
                margin: 0;
                font-size: 1rem;
                font-weight: 500;
            }
            
            .weather-refresh {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 5px;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background-color 0.2s ease;
            }
            
            .weather-refresh:hover {
                background-color: rgba(255, 255, 255, 0.2);
            }
            
            .weather-loading, .weather-error {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 15px 0;
                color: rgba(255, 255, 255, 0.8);
                text-align: center;
            }
            
            .weather-loading i, .weather-error i {
                font-size: 1.5rem;
                margin-bottom: 10px;
            }
            
            .weather-location {
                display: flex;
                align-items: center;
                margin-bottom: 10px;
                font-size: 0.9rem;
            }
            
            .weather-location i {
                margin-right: 5px;
            }
            
            .weather-main {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 10px;
            }
            
            .weather-icon img {
                width: 50px;
                height: 50px;
            }
            
            .weather-temp {
                font-size: 1.8rem;
                font-weight: 700;
            }
            
            .weather-description {
                text-align: center;
                margin-bottom: 10px;
                font-size: 0.9rem;
                text-transform: capitalize;
            }
            
            .weather-details {
                display: flex;
                justify-content: space-between;
            }
            
            .weather-detail {
                display: flex;
                align-items: center;
                font-size: 0.8rem;
            }
            
            .weather-detail i {
                margin-right: 5px;
            }
        `;
        
        document.head.appendChild(style);
    },
    
    /**
     * Gets user's location
     */
    getUserLocation: function() {
        // Check if geolocation is supported
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                // Success callback
                (position) => {
                    this.userLocation = {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    };
                    
                    // Get weather data
                    this.getWeatherData();
                },
                // Error callback
                (error) => {
                    console.error('Error getting user location:', error);
                    
                    // Use default location (Hanoi, Vietnam)
                    this.userLocation = {
                        lat: 21.0285,
                        lon: 105.8542
                    };
                    
                    // Get weather data
                    this.getWeatherData();
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser');
            
            // Use default location (Hanoi, Vietnam)
            this.userLocation = {
                lat: 21.0285,
                lon: 105.8542
            };
            
            // Get weather data
            this.getWeatherData();
        }
    },
    
    /**
     * Gets weather data
     */
    getWeatherData: async function() {
        // Check if user location is available
        if (!this.userLocation) return;
        
        // Show loading
        this.showWeatherLoading();
        
        try {
            // Fetch weather data
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${this.userLocation.lat}&lon=${this.userLocation.lon}&units=metric&lang=vi&appid=${this.apiKey}`);
            
            // Check if response is ok
            if (!response.ok) {
                throw new Error('Failed to fetch weather data');
            }
            
            // Parse response
            const data = await response.json();
            
            // Store weather data
            this.weatherData = data;
            
            // Update weather widget
            this.updateWeatherWidget();
        } catch (error) {
            console.error('Error fetching weather data:', error);
            
            // Show error
            this.showWeatherError();
        }
    },
    
    /**
     * Shows weather loading
     */
    showWeatherLoading: function() {
        const weatherWidget = document.getElementById('weather-widget');
        if (!weatherWidget) return;
        
        const loading = weatherWidget.querySelector('.weather-loading');
        const error = weatherWidget.querySelector('.weather-error');
        const data = weatherWidget.querySelector('.weather-data');
        
        if (loading) loading.style.display = 'flex';
        if (error) error.style.display = 'none';
        if (data) data.style.display = 'none';
    },
    
    /**
     * Shows weather error
     */
    showWeatherError: function() {
        const weatherWidget = document.getElementById('weather-widget');
        if (!weatherWidget) return;
        
        const loading = weatherWidget.querySelector('.weather-loading');
        const error = weatherWidget.querySelector('.weather-error');
        const data = weatherWidget.querySelector('.weather-data');
        
        if (loading) loading.style.display = 'none';
        if (error) error.style.display = 'flex';
        if (data) data.style.display = 'none';
    },
    
    /**
     * Updates weather widget
     */
    updateWeatherWidget: function() {
        // Check if weather data is available
        if (!this.weatherData) return;
        
        const weatherWidget = document.getElementById('weather-widget');
        if (!weatherWidget) return;
        
        // Get weather elements
        const loading = weatherWidget.querySelector('.weather-loading');
        const error = weatherWidget.querySelector('.weather-error');
        const data = weatherWidget.querySelector('.weather-data');
        const locationText = weatherWidget.querySelector('#weather-location-text');
        const iconImg = weatherWidget.querySelector('#weather-icon-img');
        const tempValue = weatherWidget.querySelector('#weather-temp-value');
        const description = weatherWidget.querySelector('#weather-description');
        const humidity = weatherWidget.querySelector('#weather-humidity');
        const wind = weatherWidget.querySelector('#weather-wind');
        
        // Hide loading and error, show data
        if (loading) loading.style.display = 'none';
        if (error) error.style.display = 'none';
        if (data) data.style.display = 'block';
        
        // Update location
        if (locationText) locationText.textContent = this.weatherData.name;
        
        // Update icon
        if (iconImg) {
            iconImg.src = `https://openweathermap.org/img/wn/${this.weatherData.weather[0].icon}@2x.png`;
            iconImg.alt = this.weatherData.weather[0].description;
        }
        
        // Update temperature
        if (tempValue) tempValue.textContent = Math.round(this.weatherData.main.temp);
        
        // Update description
        if (description) description.textContent = this.weatherData.weather[0].description;
        
        // Update humidity
        if (humidity) humidity.textContent = this.weatherData.main.humidity;
        
        // Update wind
        if (wind) wind.textContent = Math.round(this.weatherData.wind.speed * 3.6); // Convert m/s to km/h
    }
};

// Add global reference
window.WeatherWidget = WeatherWidget;
