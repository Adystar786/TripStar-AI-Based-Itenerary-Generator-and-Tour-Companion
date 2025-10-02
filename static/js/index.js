// Global variables
let currentPlan = 'free';
let freeUsesRemaining = 3;
let currentSlide = 0;
let slideInterval;

// Country and currency data
const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", 
    "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", 
    "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", 
    "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", 
    "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", 
    "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", 
    "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", 
    "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", 
    "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", 
    "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kosovo", "Kuwait", "Kyrgyzstan", 
    "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", 
    "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", 
    "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", 
    "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", 
    "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", 
    "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", 
    "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", 
    "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", 
    "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", 
    "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", 
    "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", 
    "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥" },
    { code: "CAD", name: "Canadian Dollar", symbol: "CA$" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$" },
    { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
    { code: "INR", name: "Indian Rupee", symbol: "₹" },
    { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
    { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$" },
    { code: "KRW", name: "South Korean Won", symbol: "₩" },
    { code: "SEK", name: "Swedish Krona", symbol: "kr" },
    { code: "NOK", name: "Norwegian Krone", symbol: "kr" },
    { code: "DKK", name: "Danish Krone", symbol: "kr" },
    { code: "RUB", name: "Russian Ruble", symbol: "₽" },
    { code: "BRL", name: "Brazilian Real", symbol: "R$" },
    { code: "MXN", name: "Mexican Peso", symbol: "MX$" },
    { code: "TRY", name: "Turkish Lira", symbol: "₺" },
    { code: "ZAR", name: "South African Rand", symbol: "R" },
    { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
    { code: "SAR", name: "Saudi Riyal", symbol: "﷼" },
    { code: "THB", name: "Thai Baht", symbol: "฿" },
    { code: "MYR", name: "Malaysian Ringgit", symbol: "RM" },
    { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp" },
    { code: "PHP", name: "Philippine Peso", symbol: "₱" },
    { code: "VND", name: "Vietnamese Dong", symbol: "₫" },
    { code: "EGP", name: "Egyptian Pound", symbol: "E£" },
    { code: "PKR", name: "Pakistani Rupee", symbol: "₨" },
    { code: "BDT", name: "Bangladeshi Taka", symbol: "৳" }
];

// Enhanced country interests mapping
const countryInterests = {
    "France": ["Wine Tasting", "Art Museums", "Historical Sites", "Gourmet Food", "Shopping", "Romantic Getaways", "Eiffel Tower", "Louvre Museum", "French Riviera", "Provence Lavender Fields", "Normandy D-Day Beaches", "Loire Valley Castles"],
    "Italy": ["Historical Sites", "Art Museums", "Wine Tasting", "Cooking Classes", "Beach Relaxation", "Shopping", "Colosseum", "Venice Canals", "Tuscany Countryside", "Vatican City", "Amalfi Coast", "Italian Lakes"],
    "Japan": ["Temples & Shrines", "Anime & Manga", "Sushi Making", "Hot Springs", "Cherry Blossoms", "Shopping", "Mount Fuji", "Tokyo Nightlife", "Traditional Gardens", "Bullet Train Experience", "Kyoto Geisha Districts", "Osaka Street Food"],
    "USA": ["National Parks", "Theme Parks", "Shopping", "Beach Activities", "City Tours", "Food Tours", "Route 66 Road Trip", "New York Broadway", "Las Vegas Entertainment", "Grand Canyon", "California Coast", "Historical Landmarks"],
    "Spain": ["Flamenco Shows", "Beach Relaxation", "Historical Sites", "Tapas Tours", "Shopping", "Nightlife", "Sagrada Familia", "Alhambra Palace", "Ibiza Clubs", "Madrid Art Museums", "Barcelona Architecture", "Andalusian Culture"],
    "Thailand": ["Temples", "Beach Activities", "Elephant Sanctuaries", "Street Food", "Island Hopping", "Shopping", "Buddhist Temples", "Thai Massage", "Floating Markets", "Full Moon Parties", "Jungle Trekking", "Muay Thai"],
    "India": ["Historical Monuments", "Yoga & Meditation", "Spiritual Sites", "Local Markets", "Wildlife Safaris", "Food Tours", "Taj Mahal", "Himalayan Trekking", "Kerala Backwaters", "Rajasthan Palaces", "Varanasi Ghats", "Goa Beaches"],
    "Australia": ["Beach Activities", "Wildlife Viewing", "Wine Tasting", "Outdoor Adventures", "City Tours", "Great Barrier Reef", "Sydney Opera House", "Outback Exploration", "Surfing Lessons", "Koala Sanctuaries", "Gold Coast Theme Parks", "Indigenous Culture"],
    "Greece": ["Historical Sites", "Island Hopping", "Beach Relaxation", "Greek Cuisine", "Sunset Views", "Shopping", "Acropolis", "Santorini Sunsets", "Mykonos Nightlife", "Ancient Ruins", "Mediterranean Cooking", "Olive Oil Tasting"],
    "Germany": ["Historical Sites", "Beer Tasting", "Castle Tours", "Christmas Markets", "City Tours", "Museums", "Neuschwanstein Castle", "Berlin Wall", "Oktoberfest", "Black Forest", "Romantic Road", "River Cruises"],
    "default": ["Historical Sites", "Local Cuisine", "Shopping", "Nature & Parks", "Cultural Experiences", "Adventure Activities", "Photography", "Wellness & Spas", "Nightlife", "Family Activities", "Art & Museums", "Beach Relaxation"]
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadUsageData();
});

async function loadUsageData() {
    try {
        const response = await fetch('/get-usage');
        const data = await response.json();
        freeUsesRemaining = data.free_uses_remaining;
        updateUsageCounter();
    } catch (error) {
        console.error('Failed to load usage data:', error);
    }
}

function initializeApp() {
    // Initialize form elements
    initializeDestinationSearch();
    initializeCurrencySearch();
    initializeTravelerType();
    initializePlanSelection();
    updateUsageCounter();
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('start-date').min = today;
    document.getElementById('end-date').min = today;
    
    // Add event listeners
    document.getElementById('start-date').addEventListener('change', updateEndDateMin);
    document.getElementById('itinerary-form').addEventListener('submit', handleFormSubmit);
    document.getElementById('regenerate-btn').addEventListener('click', resetForm);
    document.getElementById('download-btn').addEventListener('click', downloadPDF);
    document.getElementById('share-btn').addEventListener('click', shareViaWhatsApp);
    
    // Initialize date validation
    updateEndDateMin();
    
    // Set default values for better UX
    setDefaultValues();
}

function setDefaultValues() {
    // Set default traveler type
    const defaultTravelerBtn = document.querySelector('.traveler-type .option-btn[data-value="Solo"]');
    if (defaultTravelerBtn) {
        defaultTravelerBtn.click();
    }
    
    // Set default plan
    const defaultPlanBtn = document.querySelector('.traveler-type .option-btn[data-value="free"]');
    if (defaultPlanBtn) {
        defaultPlanBtn.click();
    }
    
    // Set default currency (USD)
    setTimeout(() => {
        const currencySearch = document.getElementById('currency-search');
        const currencyHidden = document.getElementById('currency');
        const currencySymbol = document.getElementById('currency-symbol');
        
        if (currencySearch && !currencySearch.value) {
            const usdCurrency = currencies.find(c => c.code === 'USD');
            if (usdCurrency) {
                currencySearch.value = `${usdCurrency.name} (${usdCurrency.code})`;
                currencyHidden.value = usdCurrency.code;
                currencySymbol.value = usdCurrency.symbol;
            }
        }
    }, 100);
}

// Searchable dropdown functionality
function initializeDestinationSearch() {
    const container = document.getElementById('destinations-container');
    
    // Add event listener for adding new destinations
    document.getElementById('add-destination').addEventListener('click', function() {
        addDestinationField();
    });
    
    // Initialize first destination field
    initializeDestinationField(container.children[0]);
}

function initializeDestinationField(destinationItem) {
    const searchInput = destinationItem.querySelector('.destination-search');
    const dropdown = destinationItem.querySelector('.dropdown-options');
    const hiddenInput = destinationItem.querySelector('.destination-value');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filteredCountries = countries.filter(country => 
            country.toLowerCase().includes(searchTerm)
        );
        
        updateDropdown(dropdown, filteredCountries, function(selectedCountry) {
            searchInput.value = selectedCountry;
            hiddenInput.value = selectedCountry;
            dropdown.style.display = 'none';
            updateInterests();
        });
    });
    
    searchInput.addEventListener('focus', function() {
        if (this.value === '') {
            updateDropdown(dropdown, countries.slice(0, 10), function(selectedCountry) {
                searchInput.value = selectedCountry;
                hiddenInput.value = selectedCountry;
                dropdown.style.display = 'none';
                updateInterests();
            });
        }
    });
    
    document.addEventListener('click', function(e) {
        if (!destinationItem.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });
}

function addDestinationField() {
    const container = document.getElementById('destinations-container');
    const destinationCount = container.children.length;
    
    if (destinationCount >= 5) {
        alert('Maximum 5 destinations allowed');
        return;
    }
    
    const newDestination = document.createElement('div');
    newDestination.className = 'destination-item';
    newDestination.innerHTML = `
        <div class="searchable-select">
            <input type="text" class="search-input destination-search" placeholder="Type to search countries...">
            <div class="dropdown-options" id="destination-options-${destinationCount}"></div>
        </div>
        <input type="hidden" class="destination-value">
        <button type="button" class="remove-destination">✕</button>
    `;
    
    container.appendChild(newDestination);
    
    // Initialize the new field
    initializeDestinationField(newDestination);
    
    // Add remove functionality
    newDestination.querySelector('.remove-destination').addEventListener('click', function() {
        if (container.children.length > 1) {
            container.removeChild(newDestination);
            updateInterests();
        }
    });
}

function initializeCurrencySearch() {
    const searchInput = document.getElementById('currency-search');
    const dropdown = document.getElementById('currency-options');
    const hiddenInput = document.getElementById('currency');
    const symbolInput = document.getElementById('currency-symbol');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filteredCurrencies = currencies.filter(currency => 
            currency.name.toLowerCase().includes(searchTerm) || 
            currency.code.toLowerCase().includes(searchTerm)
        );
        
        updateCurrencyDropdown(dropdown, filteredCurrencies, function(selectedCurrency) {
            searchInput.value = `${selectedCurrency.name} (${selectedCurrency.code})`;
            hiddenInput.value = selectedCurrency.code;
            symbolInput.value = selectedCurrency.symbol;
            dropdown.style.display = 'none';
        });
    });
    
    searchInput.addEventListener('focus', function() {
        if (this.value === '') {
            updateCurrencyDropdown(dropdown, currencies.slice(0, 10), function(selectedCurrency) {
                searchInput.value = `${selectedCurrency.name} (${selectedCurrency.code})`;
                hiddenInput.value = selectedCurrency.code;
                symbolInput.value = selectedCurrency.symbol;
                dropdown.style.display = 'none';
            });
        }
    });
    
    document.addEventListener('click', function(e) {
        if (!searchInput.parentElement.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });
}

function updateDropdown(dropdown, items, onSelect) {
    dropdown.innerHTML = '';
    
    if (items.length === 0) {
        dropdown.style.display = 'none';
        return;
    }
    
    items.forEach(item => {
        const option = document.createElement('div');
        option.className = 'dropdown-option';
        option.textContent = item;
        option.addEventListener('click', function() {
            onSelect(item);
        });
        dropdown.appendChild(option);
    });
    
    dropdown.style.display = 'block';
}

function updateCurrencyDropdown(dropdown, items, onSelect) {
    dropdown.innerHTML = '';
    
    if (items.length === 0) {
        dropdown.style.display = 'none';
        return;
    }
    
    items.forEach(item => {
        const option = document.createElement('div');
        option.className = 'dropdown-option';
        option.textContent = `${item.name} (${item.code}) - ${item.symbol}`;
        option.addEventListener('click', function() {
            onSelect(item);
        });
        dropdown.appendChild(option);
    });
    
    dropdown.style.display = 'block';
}

// Traveler type selection
function initializeTravelerType() {
    const travelerTypeBtns = document.querySelectorAll('.traveler-type .option-btn');
    
    travelerTypeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            travelerTypeBtns.forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            document.getElementById('traveler-type').value = this.getAttribute('data-value');
        });
    });
}

// Plan selection
function initializePlanSelection() {
    const planBtns = document.querySelectorAll('.traveler-type .option-btn[data-value]');
    
    planBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const selectedPlan = this.getAttribute('data-value');
            
            // Update plan selection
            planBtns.forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            document.getElementById('user-plan').value = selectedPlan;
            currentPlan = selectedPlan;
            
            // Show/hide budget friendly option
            const budgetSection = document.getElementById('budget-friendly-section');
            if (selectedPlan === 'pro') {
                budgetSection.style.display = 'block';
            } else {
                budgetSection.style.display = 'none';
                document.getElementById('budget-friendly').checked = false;
            }
            
            updateUsageCounter();
        });
    });
}

function updateUsageCounter() {
    const usageCounter = document.getElementById('usage-counter');
    const freeUsesSpan = document.getElementById('free-uses-remaining');
    
    if (currentPlan === 'free') {
        freeUsesSpan.textContent = freeUsesRemaining;
        usageCounter.style.display = 'block';
    } else {
        usageCounter.style.display = 'none';
    }
}

// Update interests based on selected destinations
async function updateInterests() {
    const interestsContainer = document.getElementById('interests-container');
    const destinations = Array.from(document.querySelectorAll('.destination-value'))
        .map(input => input.value)
        .filter(value => value);
    
    let availableInterests = new Set();
    
    // If we have destinations, try to get AI-suggested interests
    if (destinations.length > 0) {
        try {
            const aiInterests = await getAIInterests(destinations);
            aiInterests.forEach(interest => availableInterests.add(interest));
        } catch (error) {
            console.log('Using fallback interests:', error);
            // Fallback to static interests if AI fails
            destinations.forEach(destination => {
                const interests = countryInterests[destination] || countryInterests.default;
                interests.forEach(interest => availableInterests.add(interest));
            });
        }
    } else {
        // If no destinations selected, show default interests
        countryInterests.default.forEach(interest => availableInterests.add(interest));
    }
    
    interestsContainer.innerHTML = '';
    Array.from(availableInterests).forEach(interest => {
        const option = document.createElement('div');
        option.className = 'checkbox-option';
        option.innerHTML = `
            <input type="checkbox" value="${interest}">
            <span>${interest}</span>
        `;
        
        option.addEventListener('click', function() {
            this.classList.toggle('selected');
            const checkbox = this.querySelector('input');
            checkbox.checked = !checkbox.checked;
            updateSelectedInterests();
        });
        
        interestsContainer.appendChild(option);
    });
}

// Get AI-suggested interests based on destinations
async function getAIInterests(destinations) {
    try {
        const response = await fetch('/get-ai-interests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                destinations: destinations
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to get AI interests');
        }
        
        const data = await response.json();
        return data.interests || [];
    } catch (error) {
        console.error('Error getting AI interests:', error);
        throw error; // Re-throw to trigger fallback
    }
}
function updateSelectedInterests() {
    const selectedInterests = Array.from(document.querySelectorAll('.checkbox-option.selected'))
        .map(option => option.querySelector('input').value);
    
    document.getElementById('interests').value = selectedInterests.join(', ');
}

// Date validation
function updateEndDateMin() {
    const startDate = document.getElementById('start-date').value;
    if (startDate) {
        document.getElementById('end-date').min = startDate;
    }
}

// Form submission handler - UPDATED TO USE BACKEND API
async function handleFormSubmit(e) {
    e.preventDefault();
    
    console.log('Form submission started...');
    
    // Check free plan usage
    if (currentPlan === 'free' && freeUsesRemaining <= 0) {
        alert('You have reached your daily limit of 3 free itineraries. Please upgrade to Pro for unlimited access.');
        return;
    }
    
    // Validate form
    if (!validateForm()) {
        return;
    }
    
    // Show loading section
    document.getElementById('form-section').style.display = 'none';
    document.getElementById('loading-section').style.display = 'block';
    document.getElementById('result-section').style.display = 'none';
    
    try {
        // Get form data and send to backend
        const formData = getFormData();
        console.log('Sending form data to backend:', formData);
        
        const response = await fetch('/generate-itinerary', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || `Server error: ${response.status}`);
        }
        
        if (result.success) {
            // Update usage counter
            freeUsesRemaining = result.free_uses_remaining;
            updateUsageCounter();
            
            // Display the AI-generated itinerary
            displayItinerary(result.itinerary, formData);
        } else {
            throw new Error(result.error || 'Failed to generate itinerary');
        }
        
    } catch (error) {
        console.error('Error generating itinerary:', error);
        alert('Failed to generate itinerary: ' + error.message);
        // Show form again on error
        document.getElementById('loading-section').style.display = 'none';
        document.getElementById('form-section').style.display = 'block';
    }
}

// IMPROVED FORM VALIDATION
function validateForm() {
    console.log('Starting form validation...');
    
    // Check user name
    const userName = document.getElementById('user-name');
    if (!userName.value.trim()) {
        alert('Please enter your name');
        userName.focus();
        return false;
    }
    
    // Check destinations
    const destinations = Array.from(document.querySelectorAll('.destination-value'))
        .map(input => input.value)
        .filter(value => value);
    
    if (destinations.length === 0) {
        alert('Please select at least one destination');
        return false;
    }
    
    // Check dates
    const startDate = document.getElementById('start-date');
    const endDate = document.getElementById('end-date');
    
    if (!startDate.value) {
        alert('Please select a start date');
        startDate.focus();
        return false;
    }
    
    if (!endDate.value) {
        alert('Please select an end date');
        endDate.focus();
        return false;
    }
    
    // Check date validity
    const start = new Date(startDate.value);
    const end = new Date(endDate.value);
    
    if (end <= start) {
        alert('End date must be after start date');
        return false;
    }
    
    // Check traveler type
    const travelerType = document.getElementById('traveler-type');
    if (!travelerType.value) {
        alert('Please select a traveler type');
        return false;
    }
    
    // Check currency
    const currency = document.getElementById('currency');
    if (!currency.value) {
        alert('Please select a currency');
        return false;
    }
    
    // Check budget amount
    const budgetAmount = document.getElementById('budget-amount');
    if (!budgetAmount.value || budgetAmount.value <= 0) {
        alert('Please enter a valid budget amount');
        budgetAmount.focus();
        return false;
    }
    
    console.log('Form validation passed!');
    return true;
}

function getFormData() {
    const destinations = Array.from(document.querySelectorAll('.destination-value'))
        .map(input => input.value)
        .filter(value => value);
    
    const interests = Array.from(document.querySelectorAll('.checkbox-option.selected'))
        .map(option => option.querySelector('input').value);
    
    return {
        userName: document.getElementById('user-name').value,
        plan: document.getElementById('user-plan').value,
        budgetFriendly: document.getElementById('budget-friendly').checked,
        destinations: destinations,
        startDate: document.getElementById('start-date').value,
        endDate: document.getElementById('end-date').value,
        travelerType: document.getElementById('traveler-type').value,
        interests: interests.join(', '),
        currency: document.getElementById('currency').value,
        currencySymbol: document.getElementById('currency-symbol').value,
        budget: parseFloat(document.getElementById('budget-amount').value),
        notes: document.getElementById('notes').value
    };
}

function displayItinerary(itinerary, formData) {
    // Hide loading, show results
    document.getElementById('loading-section').style.display = 'none';
    document.getElementById('result-section').style.display = 'block';
    
    // Update result title
    document.getElementById('result-title').textContent = 
        `Your ${formData.destinations.join(' & ')} Itinerary`;
    
    // Generate itinerary HTML
    const itineraryHTML = createItineraryHTML(itinerary, formData);
    document.getElementById('itinerary-container').innerHTML = itineraryHTML;
    
    // Generate popular spots
    generatePopularSpots(itinerary.popularSpots || []);
    
    // Generate trip summary
    generateTripSummary(itinerary, formData);
    
    // Show/hide WhatsApp share button based on plan
    document.getElementById('share-btn').style.display = 
        currentPlan === 'pro' ? 'flex' : 'none';
}

function createItineraryHTML(itinerary, formData) {
    let itineraryHTML = '';
    
    if (itinerary.days && Array.isArray(itinerary.days)) {
        itinerary.days.forEach(day => {
            const currentDate = new Date(formData.startDate);
            currentDate.setDate(currentDate.getDate() + (day.day - 1));
            
            itineraryHTML += `
                <div class="day-card">
                    <div class="day-header">
                        📅 Day ${day.day} - ${currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </div>
                    <div class="day-content">
                        <h3>${day.title || `Day ${day.day} in ${formData.destinations[0]}`}</h3>
                        <p><strong>Overview:</strong> ${day.description || 'Explore and enjoy your journey.'}</p>
                        ${createActivitiesHTML(day.activities, formData.plan)}
                        <div class="pro-section">
                            <h4>💡 Travel Tip</h4>
                            <p>${day.tip || 'Enjoy your day and stay hydrated!'}</p>
                        </div>
                        ${formData.plan === 'pro' ? `
                            <div class="pro-details">
                                ${day.transportation ? `<p><strong>Transportation:</strong> ${day.transportation}</p>` : ''}
                                ${day.accommodation ? `<p><strong>Accommodation:</strong> ${day.accommodation}</p>` : ''}
                                ${day.dining ? `<p><strong>Dining:</strong> ${day.dining}</p>` : ''}
                                ${day.dailyBudget ? `<p><strong>Daily Budget:</strong> ${day.dailyBudget}</p>` : ''}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        });
    } else {
        // Fallback if no days data
        itineraryHTML = '<p>No itinerary data available. Please try again.</p>';
    }
    
    return itineraryHTML;
}

function createActivitiesHTML(activities, plan) {
    if (!activities || !Array.isArray(activities)) {
        return '<p>No activities planned for this day.</p>';
    }
    
    if (plan === 'pro' && activities[0] && typeof activities[0] === 'object') {
        // Pro format with activity objects
        let activitiesHTML = '<div class="pro-activities"><h4>Daily Activities:</h4>';
        activities.forEach(activity => {
            activitiesHTML += `
                <div class="pro-activity-item">
                    <div class="activity-time">${activity.time || 'All day'}</div>
                    <div class="activity-desc">${activity.description || activity}</div>
                    ${activity.cost ? `<div class="activity-meta">💰 ${activity.cost}</div>` : ''}
                    ${activity.duration ? `<div class="activity-meta">⏱️ ${activity.duration}</div>` : ''}
                    ${activity.bookingLink && activity.bookingLink !== '#' ? 
                        `<a href="${activity.bookingLink}" class="booking-link-small" target="_blank">Book Now</a>` : ''}
                    ${activity.moneySavingTip ? `
                        <div class="money-saving-tip-small">
                            💡 ${activity.moneySavingTip}
                        </div>
                    ` : ''}
                </div>
            `;
        });
        activitiesHTML += '</div>';
        return activitiesHTML;
    } else {
        // Free format with string arrays
        let activitiesHTML = '<div class="activities-section"><h4>Daily Activities:</h4><ul class="activities-list">';
        activities.forEach(activity => {
            if (typeof activity === 'string') {
                activitiesHTML += `<li class="activity-item">${activity}</li>`;
            }
        });
        activitiesHTML += '</ul></div>';
        return activitiesHTML;
    }
}

function generatePopularSpots(popularSpots) {
    const spotsGrid = document.getElementById('spots-grid');
    spotsGrid.innerHTML = '';
    
    if (popularSpots && Array.isArray(popularSpots)) {
        popularSpots.forEach(spot => {
            const spotCard = document.createElement('div');
            spotCard.className = `spot-card ${currentPlan === 'pro' ? 'pro-spot' : ''}`;
            spotCard.innerHTML = `
                <h4>${spot.name}</h4>
                <p>${spot.description}</p>
                ${currentPlan === 'pro' && spot.bookingLink && spot.bookingLink !== '#' ? 
                    `<a href="${spot.bookingLink}" class="booking-link" target="_blank">Book Tickets</a>` : 
                    '<p style="color: #ffd700;">⭐ Upgrade to Pro for booking links</p>'}
                ${spot.moneySavingTip ? `
                    <div class="money-saving-tip">
                        💡 ${spot.moneySavingTip}
                    </div>
                ` : ''}
            `;
            spotsGrid.appendChild(spotCard);
        });
    } else {
        spotsGrid.innerHTML = '<p>No popular spots information available.</p>';
    }
    
    // Add slideshow for pro users if we have multiple spots
    if (currentPlan === 'pro' && popularSpots && popularSpots.length > 1) {
        addSlideshow(popularSpots);
    }
}

function addSlideshow(popularSpots) {
    const popularSpotsSection = document.getElementById('popular-spots');
    
    // Remove existing slideshow if any
    const existingSlideshow = document.querySelector('.slideshow-container');
    if (existingSlideshow) {
        existingSlideshow.remove();
    }
    
    const slideshowHTML = `
        <div class="slideshow-container">
            <div class="slideshow" id="slideshow">
                ${popularSpots.map((spot, index) => `
                    <div class="slide ${index === 0 ? 'active' : ''}">
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); height: 100%; display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem; border-radius: 16px; padding: 2rem; text-align: center;">
                            🏞️ ${spot.name}
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="slideshow-controls">
                <button class="slideshow-btn" onclick="prevSlide()">◀</button>
                <div class="slideshow-dots" id="slideshow-dots">
                    ${popularSpots.map((_, index) => `
                        <div class="dot ${index === 0 ? 'active' : ''}" onclick="goToSlide(${index})"></div>
                    `).join('')}
                </div>
                <button class="slideshow-btn" onclick="nextSlide()">▶</button>
            </div>
        </div>
    `;
    
    const spotsGrid = document.getElementById('spots-grid');
    popularSpotsSection.insertBefore(createElementFromHTML(slideshowHTML), spotsGrid);
    
    // Start slideshow
    startSlideshow();
}

function createElementFromHTML(htmlString) {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}

function startSlideshow() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
}

function nextSlide() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slideshow-dots .dot');
    
    if (slides.length === 0) return;
    
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    currentSlide = (currentSlide + 1) % slides.length;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function prevSlide() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slideshow-dots .dot');
    
    if (slides.length === 0) return;
    
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slideshow-dots .dot');
    
    if (slides.length === 0) return;
    
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    currentSlide = index;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function generateTripSummary(itinerary, formData) {
    const summaryText = document.getElementById('summary-text');
    
    if (itinerary.summary) {
        summaryText.textContent = itinerary.summary;
    } else {
        // Fallback summary
        const startDate = new Date(formData.startDate);
        const endDate = new Date(formData.endDate);
        const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        
        summaryText.textContent = `This ${duration}-day ${formData.travelerType.toLowerCase()} trip to ${formData.destinations.join(' and ')} is perfectly crafted for your interests in ${formData.interests}. With a budget of ${formData.currencySymbol}${formData.budget.toLocaleString()}, you'll experience the best of local culture, cuisine, and attractions. ${formData.notes ? `Special notes: ${formData.notes}` : ''}`;
    }
}

// PDF Download functionality
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Get user data and itinerary
    const userName = document.getElementById('user-name').value || 'Traveler';
    const destinations = Array.from(document.querySelectorAll('.destination-value'))
        .map(input => input.value)
        .filter(value => value);
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const travelerType = document.getElementById('traveler-type').value;
    const budget = document.getElementById('budget-amount').value;
    const currencySymbol = document.getElementById('currency-symbol').value;
    
    // Set PDF properties
    doc.setProperties({
        title: `TripStar Itinerary - ${destinations.join(', ')}`,
        subject: 'AI-Generated Travel Itinerary',
        author: 'TripStar AI',
        keywords: 'travel, itinerary, ai, planning',
        creator: 'TripStar AI'
    });
    
    let yPosition = 20;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const contentWidth = pageWidth - (2 * margin);
    
    // Add header with logo and title
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, pageWidth, 50, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('TripStar AI', margin, 30);
    
    doc.setFontSize(16);
    doc.text('AI-Powered Travel Itinerary', margin, 40);
    
    yPosition = 70;
    
    // Add trip overview
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Trip Overview', margin, yPosition);
    yPosition += 15;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    const overviewLines = [
        `Traveler: ${userName}`,
        `Destinations: ${destinations.join(', ')}`,
        `Dates: ${startDate} to ${endDate}`,
        `Traveler Type: ${travelerType}`,
        `Budget: ${currencySymbol}${parseFloat(budget).toLocaleString()}`,
        `Plan: ${currentPlan === 'pro' ? 'Pro' : 'Free'}`
    ];
    
    overviewLines.forEach(line => {
        if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
        }
        doc.text(line, margin, yPosition);
        yPosition += 7;
    });
    
    yPosition += 10;
    
    // Add popular spots
    if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
    }
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Popular Spots & Attractions', margin, yPosition);
    yPosition += 10;
    
    const spotCards = document.querySelectorAll('.spot-card');
    spotCards.forEach((card, index) => {
        if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
        }
        
        const spotName = card.querySelector('h4')?.textContent || `Spot ${index + 1}`;
        const spotDesc = card.querySelector('p')?.textContent || 'No description available.';
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`📍 ${spotName}`, margin, yPosition);
        yPosition += 6;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        // Split description into multiple lines
        const descLines = doc.splitTextToSize(spotDesc, contentWidth);
        descLines.forEach(line => {
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }
            doc.text(line, margin, yPosition);
            yPosition += 5;
        });
        
        yPosition += 8;
    });
    
    // Add daily itinerary
    const dayCards = document.querySelectorAll('.day-card');
    dayCards.forEach((dayCard, dayIndex) => {
        if (yPosition > 50) {
            doc.addPage();
            yPosition = 20;
        }
        
        const dayHeader = dayCard.querySelector('.day-header')?.textContent || `Day ${dayIndex + 1}`;
        const dayTitle = dayCard.querySelector('h3')?.textContent || `Day ${dayIndex + 1} Activities`;
        const dayDesc = dayCard.querySelector('p')?.textContent || 'Daily activities and exploration.';
        
        // Day header
        doc.setFillColor(52, 152, 219);
        doc.rect(margin, yPosition, contentWidth, 10, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(dayHeader, margin + 5, yPosition + 7);
        yPosition += 15;
        
        // Day title and description
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(dayTitle, margin, yPosition);
        yPosition += 8;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        const descLines = doc.splitTextToSize(dayDesc, contentWidth);
        descLines.forEach(line => {
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }
            doc.text(line, margin, yPosition);
            yPosition += 5;
        });
        
        yPosition += 5;
        
        // Activities
        const activityItems = dayCard.querySelectorAll('.activity-item, .pro-activity-item');
        activityItems.forEach((activity, activityIndex) => {
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }
            
            let activityText = activity.textContent;
            if (activity.classList.contains('pro-activity-item')) {
                const time = activity.querySelector('.activity-time')?.textContent;
                const desc = activity.querySelector('.activity-desc')?.textContent;
                activityText = `${time} - ${desc}`;
            }
            
            doc.setFontSize(9);
            doc.text(`• ${activityText}`, margin + 5, yPosition);
            yPosition += 5;
        });
        
        yPosition += 10;
        
        // Travel tip
        const tipElement = dayCard.querySelector('.pro-section p, .tip-section p');
        if (tipElement) {
            if (yPosition > 260) {
                doc.addPage();
                yPosition = 20;
            }
            
            doc.setFillColor(241, 196, 15);
            doc.rect(margin, yPosition, contentWidth, 8, 'F');
            
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.text('💡 Travel Tip:', margin + 5, yPosition + 6);
            
            yPosition += 12;
            doc.setFont('helvetica', 'normal');
            
            const tipLines = doc.splitTextToSize(tipElement.textContent, contentWidth - 10);
            tipLines.forEach(line => {
                if (yPosition > 270) {
                    doc.addPage();
                    yPosition = 20;
                }
                doc.text(line, margin + 5, yPosition);
                yPosition += 5;
            });
            
            yPosition += 10;
        }
    });
    
    // Add watermark for free users
    if (currentPlan === 'free') {
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(40);
            doc.setTextColor(200, 200, 200);
            doc.setFont('helvetica', 'bold');
            doc.text('FREE VERSION', 30, 150, { angle: 45 });
        }
    }
    
    // Add footer with page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 20, 290);
        doc.text('Generated by TripStar AI', margin, 290);
    }
    
    // Save the PDF
    doc.save(`tripstar-itinerary-${destinations[0] || 'trip'}.pdf`);
}
// WhatsApp Share functionality
function shareViaWhatsApp() {
    if (currentPlan === 'free') {
        alert('WhatsApp sharing is available for Pro users only. Upgrade to share your itinerary.');
        return;
    }
    
    const itineraryText = `Check out my TripStar AI itinerary for ${Array.from(document.querySelectorAll('.destination-value')).map(input => input.value).join(', ')}!`;
    const encodedText = encodeURIComponent(itineraryText);
    const whatsappUrl = `https://wa.me/?text=${encodedText}`;
    
    window.open(whatsappUrl, '_blank');
}

// Reset form for new itinerary
function resetForm() {
    document.getElementById('result-section').style.display = 'none';
    document.getElementById('form-section').style.display = 'block';
    
    // Reset form fields
    document.getElementById('itinerary-form').reset();
    
    // Reset destination fields to just one
    const destinationsContainer = document.getElementById('destinations-container');
    while (destinationsContainer.children.length > 1) {
        destinationsContainer.removeChild(destinationsContainer.lastChild);
    }
    
    // Reset traveler type and plan selection
    document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
    document.querySelector('.traveler-type .option-btn[data-value="Solo"]').classList.add('selected');
    document.querySelector('.traveler-type .option-btn[data-value="free"]').classList.add('selected');
    document.getElementById('traveler-type').value = 'Solo';
    document.getElementById('user-plan').value = 'free';
    
    // Reset budget friendly section
    document.getElementById('budget-friendly-section').style.display = 'none';
    document.getElementById('budget-friendly').checked = false;
    
    // Update interests
    updateInterests();
    
    // Reload usage data
    loadUsageData();
    
    // Reset current plan
    currentPlan = 'free';
    
    // Set default values again
    setDefaultValues();
}

// Plan selection function for pricing section
function selectPlan(plan) {
    const planBtns = document.querySelectorAll('.traveler-type .option-btn[data-value]');
    const targetBtn = Array.from(planBtns).find(btn => btn.getAttribute('data-value') === plan);
    
    if (targetBtn) {
        targetBtn.click();
    }
    
    // Scroll to form section
    document.getElementById('form-section').scrollIntoView({ behavior: 'smooth' });
}

// Make functions globally available for HTML onclick handlers
window.selectPlan = selectPlan;
window.prevSlide = prevSlide;
window.nextSlide = nextSlide;
window.goToSlide = goToSlide;