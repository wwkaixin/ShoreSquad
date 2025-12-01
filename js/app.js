/* ===================================
   ShoreSquad - JavaScript Application
   =================================== */

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

/* ===================================
   App Initialization
   =================================== */
function initializeApp() {
    console.log('🌊 ShoreSquad initializing...');
    
    // Initialize all modules
    initNavigation();
    initEventListeners();
    loadEvents();
    loadCrewStats();
    initWeather();
    
    console.log('✅ ShoreSquad ready!');
}

/* ===================================
   Navigation
   =================================== */
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking nav links
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/* ===================================
   Event Listeners
   =================================== */
function initEventListeners() {
    // Join Cleanup Button
    const joinBtn = document.getElementById('joinBtn');
    if (joinBtn) {
        joinBtn.addEventListener('click', () => {
            scrollToSection('#events');
        });
    }
    
    // Create Event Button
    const createBtn = document.getElementById('createBtn');
    if (createBtn) {
        createBtn.addEventListener('click', () => {
            showNotification('Event creation coming soon! 🎉', 'info');
        });
    }
    
    // Search events with debouncing
    const searchInput = document.getElementById('searchEvents');
    if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            filterEvents(e.target.value);
        }, 300));
    }
    
    // Filter by location
    const filterLocation = document.getElementById('filterLocation');
    if (filterLocation) {
        filterLocation.addEventListener('change', (e) => {
            filterByLocation(e.target.value);
        });
    }
}

/* ===================================
   Events Management
   =================================== */
function loadEvents() {
    const eventsGrid = document.getElementById('eventsGrid');
    if (!eventsGrid) return;
    
    // Simulate loading events (in production, this would fetch from an API)
    setTimeout(() => {
        const events = getMockEvents();
        renderEvents(events);
    }, 1000);
}

function getMockEvents() {
    return [
        {
            id: 1,
            title: 'Pasir Ris Beach Cleanup',
            date: '2025-12-05',
            time: '09:00',
            location: 'Pasir Ris Beach, Singapore',
            participants: 24,
            weather: '⛈️ Thundery Showers, 33°C'
        },
        {
            id: 2,
            title: 'East Coast Park Clean Squad',
            date: '2025-12-08',
            time: '10:00',
            location: 'East Coast Park, Singapore',
            participants: 18,
            weather: '⛈️ Thundery Showers, 33°C'
        },
        {
            id: 3,
            title: 'Sentosa Beach Mission',
            date: '2025-12-10',
            time: '06:30',
            location: 'Sentosa Island, Singapore',
            participants: 32,
            weather: '⛈️ Thundery Showers, 34°C'
        },
        {
            id: 4,
            title: 'Changi Beach Cleanup',
            date: '2025-12-12',
            time: '08:00',
            location: 'Changi Beach, Singapore',
            participants: 15,
            weather: '🌤️ Partly Cloudy, 32°C'
        }
    ];
}

function renderEvents(events) {
    const eventsGrid = document.getElementById('eventsGrid');
    if (!eventsGrid) return;
    
    if (events.length === 0) {
        eventsGrid.innerHTML = '<p class="loading">No events found</p>';
        return;
    }
    
    eventsGrid.innerHTML = events.map(event => `
        <article class="event-card" role="listitem">
            <div class="event-header">
                <h3 class="event-title">${event.title}</h3>
                <span class="event-weather">${event.weather}</span>
            </div>
            <div class="event-details">
                <p class="event-date">📅 ${formatDate(event.date)} at ${event.time}</p>
                <p class="event-location">📍 ${event.location}</p>
                <p class="event-participants">👥 ${event.participants} people going</p>
            </div>
            <button class="btn btn-primary event-join-btn" 
                    data-event-id="${event.id}"
                    aria-label="Join ${event.title}">
                Join Cleanup
            </button>
        </article>
    `).join('');
    
    // Add styles for event cards
    addEventCardStyles();
    
    // Add event listeners to join buttons
    document.querySelectorAll('.event-join-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const eventId = e.target.dataset.eventId;
            joinEvent(eventId);
        });
    });
}

function addEventCardStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .event-card {
            background: white;
            padding: 1.5rem;
            border-radius: 12px;
            box-shadow: 0 2px 10px var(--shadow);
            transition: var(--transition);
        }
        .event-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 20px var(--shadow);
        }
        .event-header {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 1rem;
        }
        .event-title {
            font-size: 1.25rem;
            color: var(--neutral-dark);
        }
        .event-weather {
            font-size: 0.9rem;
        }
        .event-details {
            margin-bottom: 1.5rem;
        }
        .event-details p {
            margin: 0.5rem 0;
            color: #666;
        }
        .event-join-btn {
            width: 100%;
        }
    `;
    if (!document.querySelector('#event-card-styles')) {
        style.id = 'event-card-styles';
        document.head.appendChild(style);
    }
}

function joinEvent(eventId) {
    showNotification(`Joined event! See you there! 🏖️`, 'success');
    // Update crew stats
    updateCrewStats();
}

function filterEvents(searchTerm) {
    console.log('Filtering events:', searchTerm);
    // Implementation would filter displayed events
}

function filterByLocation(location) {
    console.log('Filtering by location:', location);
    // Implementation would filter by location
}

/* ===================================
   Crew Stats
   =================================== */
function loadCrewStats() {
    // Load from localStorage or default values
    const stats = getCrewStatsFromStorage();
    updateCrewStatsDisplay(stats);
}

function getCrewStatsFromStorage() {
    const stored = localStorage.getItem('shoreSquadStats');
    if (stored) {
        return JSON.parse(stored);
    }
    return {
        cleanupCount: 0,
        trashCollected: 0,
        crewSize: 1
    };
}

function updateCrewStatsDisplay(stats) {
    const cleanupCount = document.getElementById('cleanupCount');
    const trashCollected = document.getElementById('trashCollected');
    const crewSize = document.getElementById('crewSize');
    
    if (cleanupCount) animateCounter(cleanupCount, stats.cleanupCount);
    if (trashCollected) animateCounter(trashCollected, stats.trashCollected);
    if (crewSize) animateCounter(crewSize, stats.crewSize);
}

function updateCrewStats() {
    const stats = getCrewStatsFromStorage();
    stats.cleanupCount += 1;
    stats.trashCollected += Math.floor(Math.random() * 10) + 5; // Simulate collected trash
    
    localStorage.setItem('shoreSquadStats', JSON.stringify(stats));
    updateCrewStatsDisplay(stats);
}

function animateCounter(element, target) {
    const duration = 1000;
    const start = parseInt(element.textContent) || 0;
    const increment = (target - start) / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

/* ===================================
   Weather Widget - NEA API Integration
   =================================== */
function initWeather() {
    const weatherWidget = document.getElementById('weatherWidget');
    if (!weatherWidget) return;
    
    // Fetch real weather data from NEA API
    fetchNEAWeather();
}

async function fetchNEAWeather() {
    const weatherInfo = document.querySelector('.weather-info');
    if (!weatherInfo) return;
    
    try {
        // Fetch 4-day weather forecast from NEA
        const forecastResponse = await fetch('https://api-open.data.gov.sg/v2/real-time/api/four-day-outlook');
        const forecastData = await forecastResponse.json();
        
        console.log('Weather data:', forecastData); // Debug logging
        
        // Fetch current weather readings
        const currentResponse = await fetch('https://api-open.data.gov.sg/v2/real-time/api/air-temperature');
        const currentData = await currentResponse.json();
        
        console.log('Temperature data:', currentData); // Debug logging
        
        // Get temperature from available stations
        const temperature = getCurrentTemperature(currentData);
        
        renderWeatherForecast(forecastData, temperature);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        weatherInfo.innerHTML = '<p class="error">Unable to load weather data. Check console for details.</p>';
    }
}

function getCurrentTemperature(data) {
    if (!data || !data.data || !data.data.records || data.data.records.length === 0) {
        return 28; // Default fallback
    }
    
    const records = data.data.records;
    
    // Try to find Pasir Ris station (S109), otherwise use first available
    const pasirRisStation = records.find(r => 
        r.stationId === 'S109' || (r.stationId && r.stationId.toLowerCase().includes('pasir'))
    );
    
    if (pasirRisStation && pasirRisStation.value) {
        return Math.round(pasirRisStation.value);
    }
    
    // Use first available reading
    return records[0]?.value ? Math.round(records[0].value) : 28;
}

function renderWeatherForecast(forecastData, currentTemp) {
    const weatherInfo = document.querySelector('.weather-info');
    if (!weatherInfo) return;
    
    const data = forecastData.data;
    if (!data || !data.records || data.records.length === 0) {
        weatherInfo.innerHTML = '<p class="error">No forecast data available</p>';
        return;
    }
    
    const forecasts = data.records[0].forecasts || [];
    
    weatherInfo.innerHTML = `
        <div class="weather-current">
            <span class="weather-icon" aria-hidden="true">🌤️</span>
            <span class="weather-temp">${currentTemp}°C</span>
        </div>
        <p class="weather-condition">Current Temperature</p>
        
        <div class="forecast-divider"></div>
        <h4 class="forecast-title">4-Day Forecast</h4>
        
        <div class="forecast-days">
            ${forecasts.slice(0, 4).map(day => {
                const dayName = day.day;
                const icon = getWeatherIcon(day.forecast.text);
                
                return `
                    <div class="forecast-day">
                        <div class="forecast-day-name">${dayName}</div>
                        <div class="forecast-icon">${icon}</div>
                        <div class="forecast-temp">
                            <span class="temp-high">${day.temperature.high}°</span>
                            <span class="temp-low">${day.temperature.low}°</span>
                        </div>
                        <div class="forecast-description">${day.forecast.summary}</div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
    
    addWeatherStyles();
}

function getWeatherIcon(forecast) {
    if (!forecast) return '☀️';
    const condition = forecast.toLowerCase();
    
    if (condition.includes('thunder') || condition.includes('storm')) return '⛈️';
    if (condition.includes('heavy rain')) return '🌧️';
    if (condition.includes('showers') || condition.includes('rain')) return '🌦️';
    if (condition.includes('cloudy')) return '☁️';
    if (condition.includes('partly cloudy') || condition.includes('fair')) return '⛅';
    if (condition.includes('hazy')) return '🌫️';
    if (condition.includes('windy')) return '💨';
    return '☀️'; // Default sunny
}

function renderWeather(data) {
    const weatherInfo = document.querySelector('.weather-info');
    if (!weatherInfo) return;
    
    weatherInfo.innerHTML = `
        <div class="weather-current">
            <span class="weather-icon" aria-hidden="true">${data.icon}</span>
            <span class="weather-temp">${data.temp}°C</span>
        </div>
        <p class="weather-condition">${data.condition}</p>
        <div class="weather-details">
            <p>💨 Wind: ${data.windSpeed} km/h</p>
            <p>☀️ UV Index: ${data.uvIndex}</p>
        </div>
    `;
    
    addWeatherStyles();
}

function addWeatherStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .weather-current {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            margin: 1rem 0;
        }
        .weather-icon {
            font-size: 3rem;
        }
        .weather-temp {
            font-size: 2.5rem;
            font-weight: 700;
            color: var(--primary-blue);
        }
        .weather-condition {
            text-align: center;
            font-size: 1rem;
            margin-bottom: 0.5rem;
            color: #666;
        }
        .forecast-divider {
            height: 1px;
            background: #ddd;
            margin: 1rem 0;
        }
        .forecast-title {
            font-size: 1.1rem;
            margin-bottom: 1rem;
            color: var(--neutral-dark);
            text-align: center;
        }
        .forecast-days {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        .forecast-day {
            display: grid;
            grid-template-columns: 3fr 2fr 3fr;
            gap: 0.5rem;
            align-items: center;
            padding: 0.75rem;
            background: rgba(0, 168, 232, 0.05);
            border-radius: 8px;
            transition: var(--transition);
        }
        .forecast-day:hover {
            background: rgba(0, 168, 232, 0.1);
        }
        .forecast-day-name {
            font-weight: 600;
            color: var(--neutral-dark);
        }
        .forecast-icon {
            font-size: 1.5rem;
            text-align: center;
        }
        .forecast-temp {
            display: flex;
            gap: 0.5rem;
            justify-content: flex-end;
            font-weight: 600;
        }
        .temp-high {
            color: var(--alert-coral);
        }
        .temp-low {
            color: var(--primary-blue);
        }
        .forecast-description {
            grid-column: 1 / -1;
            font-size: 0.85rem;
            color: #666;
            text-align: center;
        }
        .weather-info .error {
            color: var(--alert-coral);
            text-align: center;
            padding: 1rem;
        }
    `;
    if (!document.querySelector('#weather-styles')) {
        style.id = 'weather-styles';
        document.head.appendChild(style);
    }
}

/* ===================================
   Utility Functions
   =================================== */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function scrollToSection(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Add styles if not already added
    addNotificationStyles();
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function addNotificationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            background: white;
            box-shadow: 0 5px 20px var(--shadow);
            z-index: 9999;
            opacity: 0;
            transform: translateX(400px);
            transition: all 0.3s ease;
            max-width: 300px;
        }
        .notification.show {
            opacity: 1;
            transform: translateX(0);
        }
        .notification-success {
            border-left: 4px solid var(--accent-green);
        }
        .notification-info {
            border-left: 4px solid var(--primary-blue);
        }
        .notification-error {
            border-left: 4px solid var(--alert-coral);
        }
    `;
    if (!document.querySelector('#notification-styles')) {
        style.id = 'notification-styles';
        document.head.appendChild(style);
    }
}

/* ===================================
   Service Worker Registration (PWA)
   =================================== */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment when service worker is implemented
        // navigator.serviceWorker.register('/sw.js')
        //     .then(reg => console.log('Service Worker registered'))
        //     .catch(err => console.log('Service Worker registration failed'));
    });
}
