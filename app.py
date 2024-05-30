from flask import Flask, render_template, request, jsonify
import openai

app = Flask(__name__, static_folder='.', static_url_path='')

# Set your OpenAI API key here
openai.api_key = 'api key'

try:
    with open(r'information.txt', 'r', encoding='utf-8') as file:
        lines = file.readlines()
        openai.api_key = lines[0].strip()  # First line is the API key
        system_prompt = lines[1].strip()  # Second line is the system prompt
except Exception as e:
    print(f"Error reading the file: {e}")
    openai.api_key = None
    system_prompt = None

# Define a route to render the HTML page
@app.route('/')
def index():
    return app.send_static_file('index.html')

# Define a route to fetch data from the OpenAI API
@app.route('/chat', methods=['POST'])
def chat():
    # Get the prompt from the request
    data = request.json
    user_input = data.get('message', "")
    print("Received user input:", user_input)
    # Make a request to the OpenAI API
    try:
        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
           messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_input},
            ]
        )
        response = completion.choices[0].message['content']
        return jsonify({'message': response})
    except Exception as e:
        # Return an error message if the request failed
        print("Error occurred:", str(e))
        return jsonify({'message': "No response from OpenAI due to an error."})

if __name__ == '__main__':
    # Run the Flask app
    app.run(debug=True)
