'use client';
import { useState, useRef } from "react";

export default function Home() {
  const [userQuery, setUserQuery] = useState("");
  const [message, setMessage] = useState("Ready");
  const [response, setResponse] = useState("");
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const do_reset = () => {
    setFiles([]);
    setResponse("");
    setMessage("Ready");
    setUserQuery("");
    fileInputRef.current.value = "";
  }

  const do_submission = async (event) => {
    event.preventDefault();
    const mini = 3;

    if (!files || files.length < mini) {
      setMessage(`Please add ${mini - files.length} more files (don't worry we've the uplooaded files saved)`);
      return
    };
    
    setMessage("Loading...");
    setResponse("");

    const results = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("user_query", userQuery)

      const res = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.response == "") {
        data.response = "-Nothing-";
      }
      results.push({ name: file.name, text: data.response });
    }

    setResponse(results);
    setFiles([]);
  }

  return (
    <div>
      <main>
        <h1>PDF based chat-bot:</h1>
        <form style={{
          display: "flex",
          flexDirection: "column",
          width: "300px",
        }}>
          <input
            style={{
            width: "300px",
            height: "30px",
            margin: "5px",
            }}
            placeholder="Query Please"
            value={userQuery}
            onChange={(e) => {
              const value = e.target.value;
              setUserQuery(value)
              console.log(value)
            }}/>
          <input
            style={{
            width: "300px",
            height: "30px",
            margin: "5px",
            }}
            ref={fileInputRef}
            type="file"
            multiple
            onChange={(e) =>
              setFiles((prev) => [...prev, ...Array.from(e.target.files)])
            }
          />
          <button
            style={{
            width: "300px",
            height: "30px",
            margin: "5px",
            }}
            onClick={do_submission}
          >Submit</button>
        </form>
        <button
        type="button"
          style={{
          width: "300px",
          height: "30px",
          margin: "5px",
          }}
          onClick={do_reset}
        >Reset</button>
        <hr />
        <div>
          {!Array.isArray(response) || response.length === 0 ? (
              message
            ) : (
              response.map((item, index) => (
                <div key={index}>
                  <h4>{item.name}</h4>
                  {item.text}
                </div>
              ))
            )}
        </div>
      </main>
    </div>
  );
}
