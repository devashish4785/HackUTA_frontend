import google.generativeai as genai
from flask import Flask, request, jsonify

# Initialize the Flask app
app = Flask(__name__)

# Set your API Key or use the Google Cloud authentication
genai.configure(api_key="AIzaSyC3KFEmeh79oLPw0ahrP_0MOq4eWfePKBM")  # Use your API key here
# Initialize the model
model = genai.GenerativeModel("gemini-1.5-pro")

# Function to get a response from the Gemini API
def get_gemini_response(user_message):
    try:
        # Use the Gemini API to get a response based on the user message
        prompt = user_message
        response = model.generate_content(prompt)
        print(response)
        return response.text
    except Exception as e:
        return {"error": f"Error occurred: {str(e)}"}

@app.route('/')
def home():
    return jsonify({"message": "Hello! Welcome to the Gemini-powered chatbot!"})

@app.route('/chat', methods=['POST'])
def chat():
    # Get the user message from the POST request
    user_input = request.json.get('message')
    if not user_input:
        return jsonify({"error": "Message is required"}), 400

    # Get response from Gemini API
    gemini_response = get_gemini_response(user_input)

    if "error" in gemini_response:
        return jsonify(gemini_response), 500

    return jsonify({"response": gemini_response})

if __name__ == '__main__':
    app.run(debug=True)
