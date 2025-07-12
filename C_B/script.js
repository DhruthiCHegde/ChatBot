

const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// Replace this with your actual OpenRouter API key
const OPENROUTER_API_KEY = "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";

async function sendMessageToModel(message) {
  const url = "https://openrouter.ai/api/v1/chat/completions ";

  if (!message.trim()) {
    return "Please enter a question.";
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost", // Optional: your site URL
        "X-Title": "My Chatbot" // Optional: your app name
      },
      body: JSON.stringify({
        model: "mistralai/mistral-small-3.2-24b-instruct:free", // ← New model
        messages: [
          { role: "user", content: message }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API Error:", errorText);
      return `⚠️ Server error: ${errorText}`;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "No response from model.";
  } catch (error) {
    console.error("Error fetching response:", error);
    return "⚠️ An error occurred while fetching the response.";
  }
}

function addMessage(text, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${sender}-message`;
  msgDiv.textContent = text;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function showTypingIndicator() {
  const typingDiv = document.createElement("div");
  typingDiv.id = "typing";
  typingDiv.className = "message bot-message typing-indicator";
  typingDiv.innerHTML = `<span></span><span></span><span></span>`;
  chatBox.appendChild(typingDiv);
}

function removeTypingIndicator() {
  const typing = document.getElementById("typing");
  if (typing) typing.remove();
}

// Send message on button click
sendBtn.addEventListener("click", async () => {
  const userText = input.value.trim();
  if (!userText) return;

  addMessage(userText, "user");
  input.value = "";
  showTypingIndicator();

  const reply = await sendMessageToModel(userText);
  removeTypingIndicator();
  addMessage(reply, "bot");
});

// Send message on Enter key press
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendBtn.click();
  }
});


// const chatBox = document.getElementById("chat-box");
// const input = document.getElementById("user-input");
// const sendBtn = document.getElementById("send-btn");

// // Replace this with your actual OpenRouter API key
// const OPENROUTER_API_KEY = "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";

// async function sendMessageToModel(message) {
//   const url = "https://openrouter.ai/api/v1/chat/completions ";

//   if (!message.trim()) {
//     return "Please enter a question.";
//   }

//   try {
//     const response = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
//         "HTTP-Referer": "http://localhost",
//         "X-Title": "My Chatbot"
//       },
//       body: JSON.stringify({
//         model: "mistralai/mistral-small-3.2-24b-instruct:free",
//         messages: [
//           {
//             role: "user",
//             content: `Answer the following query in clear, structured paragraphs without any markdown formatting like ### or **. Use simple text with line breaks for readability:\n\n${message}`
//           }
//         ]
//       })
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error("OpenRouter API Error:", errorText);
//       return `⚠️ Server error: ${errorText}`;
//     }

//     const data = await response.json();
//     let reply = data.choices?.[0]?.message?.content || "No response from model.";

//     // Clean up the response: remove markdown and format nicely
//     return cleanAndFormatResponse(reply);
//   } catch (error) {
//     console.error("Error fetching response:", error);
//     return "⚠️ An error occurred while fetching the response.";
//   }
// }

// function cleanAndFormatResponse(text) {
//   // Replace **text** with plain text
//   text = text.replace(/\*\*(.*?)\*\*/g, "$1");

//   // Replace ### headings with empty string
//   text = text.replace(/###/g, "");

//   // Replace bullets (- or *) with clean lines
//   text = text.replace(/^[\-\*]\s*/gm, "");

//   // Trim whitespace and normalize spaces
//   text = text.trim().replace(/\s+/g, " ");

//   // Add line breaks after sentences or key sections (optional)
//   text = text.replace(/(\.|\?|!)\s+/g, "$1\n\n");

//   return text;
// }

// function addMessage(text, sender) {
//   const msgDiv = document.createElement("div");
//   msgDiv.className = `message ${sender}-message`;
//   msgDiv.textContent = text;
//   chatBox.appendChild(msgDiv);
//   chatBox.scrollTop = chatBox.scrollHeight;
// }

// function showTypingIndicator() {
//   const typingDiv = document.createElement("div");
//   typingDiv.id = "typing";
//   typingDiv.className = "message bot-message typing-indicator";
//   typingDiv.innerHTML = `<span></span><span></span><span></span>`;
//   chatBox.appendChild(typingDiv);
// }

// function removeTypingIndicator() {
//   const typing = document.getElementById("typing");
//   if (typing) typing.remove();
// }

// let isCooldown = false;

// sendBtn.addEventListener("click", async () => {
//   if (isCooldown) {
//     addMessage("Please wait a moment before sending another message.", "bot");
//     return;
//   }

//   const userText = input.value.trim();
//   if (!userText) return;

//   addMessage(userText, "user");
//   input.value = "";
//   showTypingIndicator();

//   isCooldown = true;
//   const reply = await sendMessageToModel(userText);
//   removeTypingIndicator();
//   addMessage(reply, "bot");

//   setTimeout(() => {
//     isCooldown = false;
//   }, 60000); // 60-second cooldown to avoid rate limits
// });

// input.addEventListener("keypress", (e) => {
//   if (e.key === "Enter") {
//     sendBtn.click();
//   }
// });