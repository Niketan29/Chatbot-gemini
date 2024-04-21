import { GoogleGenerativeAI } from "@google/generative-ai";

import md  from 'markdown-it';

// Initialize the model

const genAI = new GoogleGenerativeAI(`${import.meta.env.VITE_API_KEY}`);

const model = genAI.getGenerativeModel({ model: "gemini-pro" });

async function getResponse(prompt) {
  const message = await model.generateContent(prompt)
  const response = await message.response
  const text = response.text();

  console.log(text);

  return text;


}

//User chats
export const userbox = (data) => {
  return `
  <!-- user chat -->
        <div class="userchat">
          <img src="user.jpg" alt="user icon">
          <p id="user-chat">${data}</p>
        </div>
        `;
};


//AI chats
export const aibox = (data)=>{
  return `
  <!-- AI chat -->
  <div class="aichat">
    <pre id="ai-chat">${data}</pre>
    <img src="chatbot.jpg" alt="user icon">

  </div>
  `
}




async function handleevent(event) {
  event.preventDefault();

  let userMessage = document.getElementById("prompt");

  const chatArea = document.getElementById("chat-container");
  var prompt = userMessage.value.trim();
  if (prompt === "") {
    return;
  }
  chatArea.innerHTML+= userbox(prompt);
  userMessage.value ="";

  const aiResult = await getResponse(prompt);
  let md_text = md().render(aiResult)
  chatArea.innerHTML+= aibox(md_text);
}

const chatForm = document.getElementById("chat-form");
chatForm.addEventListener("submit",handleevent);

chatForm.addEventListener("keyup",(event)=>{
  if(event.keyCode === 13) handleevent(event);
})