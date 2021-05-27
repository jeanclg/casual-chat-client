import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";

let socket;

const Chat = ({ location }) => {
  const ENDPOINT = "https://casual-chat-server.herokuapp.com/";

  const [user, setUser] = useState({
    name: "",
    room: "",
  });
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    socket = io(ENDPOINT);
    setUser({
      name,
      room,
    });
    socket.emit("join", { name, room }, () => {});

    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });
  }, [messages]);

  const handleMessage = (event) => {
    setMessage(event.target.value);
  };

  const sendMessage = (event) => {
    event.preventDefault();
    if (message) socket.emit("sendMessage", message, () => setMessage(""));
  };

  return (
    <div>
      <h1>Chat</h1>
      <ul>
        {messages.map((x, i) => {
          return <li key={i}>{`${x.user}: ${x.text}`}</li>;
        })}
      </ul>
      <input
        value={message}
        onChange={handleMessage}
        onKeyPress={(event) =>
          event.key === "Enter" ? sendMessage(event) : null
        }
      />
    </div>
  );
};

export default Chat;
