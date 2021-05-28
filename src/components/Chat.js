import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import queryString from "query-string";
import io from "socket.io-client";

let socket;

const Chat = ({ location }) => {
  // const ENDPOINT = "https://casual-chat-server.herokuapp.com/";
  const ENDPOINT = "localhost:5000";

  const [user, setUser] = useState({
    name: "",
    room: "",
  });
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    socket = io(ENDPOINT);
    setUser({
      name,
      room,
    });

    socket.emit("join", { name, room }, (error) => {
      if (error) {
        alert(error);
      }
    });
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });

    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, []);

  const handleMessage = (event) => {
    setMessage(event.target.value);
  };

  const sendMessage = (event) => {
    event.preventDefault();
    if (message) socket.emit("sendMessage", message, () => setMessage(""));
    console.log(users);
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
      <a href="/">
        <button>Leave</button>
      </a>
      <ul>
        {users.map((x) => {
          return <li key={x.id}>{x.name}</li>;
        })}
      </ul>
    </div>
  );
};

export default Chat;
