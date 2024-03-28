import React, { useEffect, useState } from "react";

const App = () => {
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState("This is response area");

  const handleClick = async (e) => {
    e.preventDefault();
    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer <API_KEY>",
      },
      body: JSON.stringify({
        messages: [{ role: "system", content: inputValue }],
        model: "gpt-3.5-turbo", // specify the model here
        max_tokens: 4000,
      }),
    })
      .then((response) => response.json())
      .then(async (data) => {
        setResult(data.choices[0].message.content);
        let [tab] = await chrome.tabs.query({ active: true });
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          args: [result],
          func: (result) => {
            console.log();
          },
        });

        document.getElementById("userInput").value = "";
      })
      .catch((error) => console.log(error));
  };
  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <form>
      <input
        type="text"
        id="userInput"
        value={inputValue}
        onChange={handleChange}
        placeholder="Enter your input"
      />
      <button onClick={(e) => handleClick(e)}>Send</button>
      <div id="responseArea">{result}</div>
    </form>
  );
};

export default App;
