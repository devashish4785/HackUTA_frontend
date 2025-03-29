
from flask import Flask, request, jsonify,render_template
import os
from flask_cors import CORS
import requests
import emotions_response as er

# Initialize the Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
# Set your API Key or use the Google Cloud authentication




@app.route('/', methods=['GET', 'POST'])
def home():
    user_input = ""
    if request.method == 'POST':
        user_input = request.form.get('user_input')  # Get the input from the form
        
        # Here, you can send the input to the backend for further processing if needed
        gemini_response = er.get_gemini_response(user_input)  # Getting response from Gemini API
        
        return render_template('index.html', user_input=user_input, gemini_response=gemini_response)  # Pass input and response to template

    return render_template('index.html', user_input=user_input, gemini_response=None)



@app.route('/chat', methods=['POST'])
def chat():
    # Get the user message from the POST request
    user_input = request.json.get('message')
    if not user_input:
        return jsonify({"error": "Message is required"}), 400

    # Get response from Gemini API
    gemini_response = er.get_gemini_response(user_input)

    if "error" in gemini_response:
        return jsonify(gemini_response), 500

    # Check if background color is present in the response
    if "background_color" in gemini_response:
        return jsonify({
            "response": gemini_response["response"],
            "background_color": gemini_response["background_color"]
        })
    
    # If no background color, return normal response
    return jsonify({"response": gemini_response["response"]})

if __name__ == '__main__':
    port = os.getenv("PORT", 5000)
    app.run(debug=True, host="0.0.0.0", port=port)
    app.run(debug=True)
