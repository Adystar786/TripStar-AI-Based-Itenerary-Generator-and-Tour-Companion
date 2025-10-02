from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import os
from datetime import datetime, timedelta
import logging

# Import your AI models
try:
    from model_config import TripStarAIModel
    from pro_model_config import TripStarProModel
    AI_AVAILABLE = True
    print("✅ AI models imported successfully")
except ImportError as e:
    print(f"❌ AI models not available: {e}")
    AI_AVAILABLE = False

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize AI model
if AI_AVAILABLE:
    ai_model = TripStarAIModel()
else:
    ai_model = None
    print("⚠️ Running without AI capabilities")

# In-memory storage for usage tracking (use database in production)
user_usage = {}

def get_user_usage(user_ip):
    """Get or initialize user usage data"""
    today = datetime.now().date().isoformat()
    if user_ip not in user_usage:
        user_usage[user_ip] = {
            'last_reset': today,
            'free_uses_remaining': 3
        }
    else:
        # Reset daily limit if it's a new day
        if user_usage[user_ip]['last_reset'] != today:
            user_usage[user_ip] = {
                'last_reset': today,
                'free_uses_remaining': 3
            }
    return user_usage[user_ip]

def get_client_ip():
    """Get client IP address for usage tracking"""
    if request.environ.get('HTTP_X_FORWARDED_FOR'):
        return request.environ['HTTP_X_FORWARDED_FOR'].split(',')[0]
    else:
        return request.environ.get('REMOTE_ADDR')

@app.route('/')
def index():
    """Serve the main application page"""
    user_ip = get_client_ip()
    usage_data = get_user_usage(user_ip)
    
    return render_template('index.html',
                         free_uses_remaining=usage_data['free_uses_remaining'])

@app.route('/static/<path:filename>')
def serve_static(filename):
    """Serve static files (CSS, JS)"""
    return send_from_directory('static', filename)

@app.route('/get-usage')
def get_usage():
    """Get current usage data for the user"""
    user_ip = get_client_ip()
    usage_data = get_user_usage(user_ip)
    
    return jsonify({
        'free_uses_remaining': usage_data['free_uses_remaining'],
        'last_reset': usage_data['last_reset']
    })

@app.route('/generate-itinerary', methods=['POST'])
def generate_itinerary():
    """Generate AI-powered itinerary"""
    try:
        user_ip = get_client_ip()
        usage_data = get_user_usage(user_ip)
        data = request.get_json()
        
        logger.info(f"Generating itinerary for user: {data.get('userName', 'Unknown')}")
        logger.info(f"User plan: {data.get('plan', 'free')}")
        logger.info(f"Full data received: {data}")
        
        # Check free plan usage
        if data.get('plan') == 'free':
            if usage_data['free_uses_remaining'] <= 0:
                return jsonify({
                    'success': False,
                    'error': 'Daily free limit reached. Upgrade to Pro for unlimited itineraries.'
                }), 429
            
            # Decrement free uses
            usage_data['free_uses_remaining'] -= 1
        
        # Validate required fields
        required_fields = ['userName', 'destinations', 'startDate', 'endDate', 'travelerType', 'budget']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Prepare data for AI model
        ai_input_data = {
            'user_name': data['userName'],
            'destinations': data['destinations'],
            'start_date': data['startDate'],
            'end_date': data['endDate'],
            'traveler_type': data['travelerType'],
            'budget': float(data['budget']),
            'currency_symbol': data.get('currencySymbol', '$'),
            'interests': data.get('interests', ''),
            'notes': data.get('notes', ''),
            'plan': data.get('plan', 'free'),
            'budget_friendly': data.get('budgetFriendly', False)
        }
        
        # Calculate days from dates
        start_date = datetime.strptime(data['startDate'], '%Y-%m-%d')
        end_date = datetime.strptime(data['endDate'], '%Y-%m-%d')
        ai_input_data['days'] = (end_date - start_date).days + 1
        
        print(f"🎯 Generating {ai_input_data['days']}-day itinerary with AI...")
        print(f"📊 Final AI input data - Plan: {ai_input_data['plan']}")
        
        # Use AI model if available
        if AI_AVAILABLE and ai_model and ai_model.client:
            print(f"🚀 Using AI model for {ai_input_data['plan']} plan itinerary generation")
            itinerary = ai_model.generate_itinerary(ai_input_data)
        else:
            print("⚠️ AI model not available, using template itinerary")
            # Use fallback template
            itinerary = generate_fallback_itinerary(ai_input_data)
        
        if itinerary:
            logger.info(f"Itinerary generated successfully for {data['userName']}")
            return jsonify({
                'success': True,
                'itinerary': itinerary,
                'free_uses_remaining': usage_data['free_uses_remaining']
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Failed to generate itinerary'
            }), 500
        
    except Exception as e:
        logger.error(f"Error generating itinerary: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Internal server error: {str(e)}'
        }), 500

def generate_fallback_itinerary(data):
    """Generate fallback itinerary when AI fails"""
    days = data['days']
    destinations = data['destinations']
    traveler_type = data['traveler_type']
    budget = data['budget']
    currency_symbol = data['currency_symbol']
    interests = data.get('interests', 'General sightseeing')
    
    destination_name = destinations[0] if destinations else "your destination"
    
    itinerary = {
        "days": [],
        "popularSpots": [
            {
                "name": f"{destination_name} Historic Center",
                "description": f"Explore the cultural heart of {destination_name} with stunning architecture dating back centuries."
            },
            {
                "name": "Local Food Markets", 
                "description": f"Experience authentic culinary traditions at {destination_name}'s bustling local markets."
            }
        ],
        "summary": f"This {days}-day journey through {destination_name} is designed for {traveler_type.lower()} travelers with a {currency_symbol}{budget} budget."
    }
    
    # Generate day-by-day itinerary
    for day in range(1, days + 1):
        if day == 1:
            itinerary["days"].append({
                "day": day,
                "title": f"Welcome to {destination_name}",
                "description": f"Your adventure begins with an introduction to {destination_name}'s rich cultural heritage.",
                "activities": [
                    f"Morning: Arrive in {destination_name} and check into accommodation",
                    f"Afternoon: Orientation walk through the main historical area",
                    f"Evening: Welcome dinner at a traditional restaurant"
                ],
                "tip": "Take time to absorb the local atmosphere and observe daily life patterns."
            })
        elif day == days:
            itinerary["days"].append({
                "day": day,
                "title": "Final Explorations",
                "description": "Make the most of your last hours with final explorations.",
                "activities": [
                    "Morning: Last-minute souvenir shopping at local markets",
                    "Afternoon: Revisit your favorite spot",
                    "Evening: Airport transfer and departure"
                ],
                "tip": "Pack main luggage the night before to allow time for final observations."
            })
        else:
            itinerary["days"].append({
                "day": day,
                "title": f"Day {day} Adventures",
                "description": f"Explore more of {destination_name}'s unique character and traditions.",
                "activities": [
                    "Morning: Guided exploration of cultural sites",
                    "Afternoon: Hands-on local experience",
                    "Evening: Free time to wander and dine locally"
                ],
                "tip": "Wear comfortable shoes and carry a refillable water bottle."
            })
    
    return itinerary

@app.route('/test-ai')
def test_ai():
    """Test route to verify AI model is working"""
    if not AI_AVAILABLE or not ai_model or not ai_model.client:
        return jsonify({'status': 'AI not available'})
    
    try:
        # Test with sample data
        test_data = {
            'user_name': 'Test User',
            'destinations': ['France'],
            'start_date': '2025-01-01',
            'end_date': '2025-01-03',
            'traveler_type': 'Solo',
            'budget': 2000,
            'currency_symbol': '$',
            'interests': 'Historical Sites, Food',
            'notes': 'Test itinerary',
            'plan': 'free',
            'days': 3
        }
        
        result = ai_model.generate_itinerary(test_data)
        return jsonify({
            'status': 'AI working',
            'test_result': 'Success' if result else 'Failed',
            'days_generated': len(result.get('days', [])) if result else 0
        })
        
    except Exception as e:
        return jsonify({'status': 'AI error', 'error': str(e)})

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

@app.route('/get-ai-interests', methods=['POST'])
def get_ai_interests():
    """Get AI-suggested interests based on destinations"""
    try:
        data = request.get_json()
        destinations = data.get('destinations', [])
        
        if not destinations:
            return jsonify({'interests': []})
        
        if not AI_AVAILABLE or not ai_model or not ai_model.client:
            # Fallback to static interests
            all_interests = set()
            for destination in destinations:
                interests = countryInterests.get(destination, countryInterests['default'])
                all_interests.update(interests)
            return jsonify({'interests': list(all_interests)[:12]})  # Limit to 12 interests
        
        # Use AI to generate relevant interests
        destinations_str = ', '.join(destinations)
        prompt = f"""Based on these travel destinations: {destinations_str}
        
        Suggest 12-15 most relevant travel interest categories that would appeal to various types of travelers. 
        Return ONLY a JSON array of strings, no explanations.
        
        Example: ["Historical Sites", "Local Cuisine", "Adventure Sports", "Art Museums", "Beach Activities", "Nightlife", "Shopping", "Nature & Parks", "Cultural Experiences", "Wellness & Spas", "Family Activities", "Photography Spots"]
        
        Focus on interests that are most relevant to the specific destinations mentioned."""
        
        response = ai_model.client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a travel expert. Respond with ONLY a JSON array of strings, no other text."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model=ai_model.model_name,
            temperature=0.7,
            max_tokens=500
        )
        
        response_text = response.choices[0].message.content.strip()
        
        # Parse the response
        try:
            interests = json.loads(response_text)
            if isinstance(interests, list):
                return jsonify({'interests': interests})
        except json.JSONDecodeError:
            print("Failed to parse AI interests response")
        
        # Fallback if AI fails
        all_interests = set()
        for destination in destinations:
            interests = countryInterests.get(destination, countryInterests['default'])
            all_interests.update(interests)
        return jsonify({'interests': list(all_interests)[:12]})
        
    except Exception as e:
        logger.error(f"Error getting AI interests: {str(e)}")
        # Fallback to static interests
        all_interests = set()
        for destination in destinations:
            interests = countryInterests.get(destination, countryInterests['default'])
            all_interests.update(interests)
        return jsonify({'interests': list(all_interests)[:12]})

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Resource not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)