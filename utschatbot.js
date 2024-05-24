// Define the tryIt function in the global scope
function tryIt() {
    showChatBotInterface(); // Call function to display the chat interface
}

function showChatBotInterface() {
    document.querySelector(".document-image").style.display = "none";
    document.querySelector(".try-it-button").style.display = "none";
    document.querySelector(".chat-container").style.display = "block";
}

document.addEventListener('DOMContentLoaded', function () {
    const sendButton = document.getElementById('send-button');
    const userInputField = document.getElementById('user-input');

    sendButton.addEventListener('click', function() {
        sendMessage();
    });

    userInputField.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});

function sendMessage() {
    const userInputField = document.getElementById('user-input');
    const userInput = userInputField.value;
    if (userInput.trim() === "") {
        return; // Don't send empty messages
    }

    appendUserMessage(userInput);
    userInputField.value = '';

    fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userInput })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            appendBotMessage(data.message);
        } else {
            appendBotMessage("No response, try again.");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        appendBotMessage("Failed to get a response.");
    });
}

function appendUserMessage(message) {
    const chatBox = document.getElementById("chat-box");
    const userMessageDiv = document.createElement("div");
    userMessageDiv.className = "user-message";
    userMessageDiv.textContent = message;
    chatBox.appendChild(userMessageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function appendBotMessage(message) {
    const chatBox = document.getElementById("chat-box");
    const botMessageDiv = document.createElement("div");
    botMessageDiv.className = "bot-message";
    botMessageDiv.textContent = message;
    chatBox.appendChild(botMessageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}
