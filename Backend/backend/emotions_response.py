import google.generativeai as genai


genai.configure(api_key="AIzaSyCATbVa5uQ4MKXVq5mK9Feb4wFiyJEh7Cc")  # Use your API key here
# Initialize the model
model = genai.GenerativeModel("gemini-1.5-pro")

start=True
initial_condition="i am an suffering from some mental condition. i need you to interact with me and call me a nick name you like i may be any person on earth. Always keeps responses short to 3 lines most."

def modify_prompt_for_emotion(user_message):
    """
    Detects emotion, assigns a background color, and modifies the prompt.
    """
    emotion_prompts = {
        "sad": "I am feeling sad. Respond with empathy and kindness.",
        "depressed": "I am feeling down and hopeless. Provide comforting words.",
        "happy": "I am feeling happy. Engage with enthusiasm and positivity.",
        "angry": "I am angry. Acknowledge frustration and provide a calming response.",
        "anxious": "I am anxious. Offer supportive and reassuring words.",
        "neutral": "I have a general query. Respond in a helpful and informative manner."
    }

    # Keywords associated with each emotion
    emotions = {
        "sad": ["sad", "down", "unhappy", "miserable", "heartbroken"],
        "depressed": ["depressed", "hopeless", "worthless", "numb"],
        "happy": ["happy", "joy", "excited", "glad", "great"],
        "angry": ["angry", "mad", "frustrated", "furious", "irritated"],
        "anxious": ["anxious", "nervous", "worried", "stressed", "overthinking"]
    }

    # Colors assigned to each emotion
    emotion_colors = {
        "sad": "#3498db",        # Blue
        "depressed": "#2c3e50",  # Dark Blue/Gray
        "happy": "#f1c40f",      # Yellow
        "angry": "#e74c3c",      # Red
        "anxious": "#9b59b6",    # Purple
        "neutral": "#FFFFFF"     # white
    }

    detected_emotion = "neutral"

    # Detect emotion in user input
    for emotion, keywords in emotions.items():
        if any(word in user_message.lower() for word in keywords):
            detected_emotion = emotion
            break

    # Get the corresponding color and modified prompt
    modified_prompt = emotion_prompts[detected_emotion]
    background_color = emotion_colors[detected_emotion]

    return detected_emotion, modified_prompt, background_color



# Function to get a response from the Gemini API
def get_gemini_response(user_message):
    global start
    if start:
        start = False
        response = model.generate_content(initial_condition)
        return {"response": response.text, "background_color": "#FFFFFF"}  # Default white

    try:
        # Detect emotion, modify prompt, and get background color
        emotion, em_msg, background_color = modify_prompt_for_emotion(user_message=user_message)

        # Construct the prompt for Gemini
        if emotion != "neutral":
            prompt = f"{user_message} {em_msg} Please keep the message short (max 3 lines)."
        else:
            prompt = f"{user_message} Enquire about me as a request. Please keep the message short (max 3 lines)."

        # Get response from Gemini
        response = model.generate_content(prompt)

        # Check if the background color is NOT white
        
        return {"response": response.text, "background_color": background_color}
        

    except Exception as e:
        return {"error": f"Error occurred: {str(e)}"}
