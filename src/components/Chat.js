import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import queryString from "query-string";
import io from "socket.io-client";
import ScrollToBottom from "react-scroll-to-bottom";
import { css } from "@emotion/css";

let socket;

const Chat = ({ location }) => {
  const ENDPOINT = "https://casual-chat-server.herokuapp.com/";
  // const ENDPOINT = "localhost:5000";

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

  const ROOT_CSS = css({
    height: 500,
    width: 400,
    backgroundColor: "white",
    color: "#212529",
    padding: "15px",
  });

  return (
    <div className="bg-dark text-white">
      <div className="container">
        <div className="d-flex vh-100 justify-content-center align-items-center">
          <div>
            <h2
              className="form-control fs-4 btn-primary text-center"
              style={{ borderRadius: "0", margin: "0" }}
            >{`${user.name}⠀⠀⠀⠀${user.room}`}</h2>
            <ScrollToBottom className={ROOT_CSS}>
              {messages.map((x, i) => {
                if (x.user === user.name) {
                  return (
                    <p className="text-end" key={i}>
                      <strong>{x.user}</strong>
                      {`: ${x.text}`}
                    </p>
                  );
                } else {
                  return (
                    <p className="text-start" key={i}>
                      <strong>{x.user}</strong>
                      {`: ${x.text}`}
                    </p>
                  );
                }
              })}
            </ScrollToBottom>
            <div className="input-group mb-3">
              <input
                className="form-control"
                value={message}
                onChange={handleMessage}
                onKeyPress={(event) =>
                  event.key === "Enter" ? sendMessage(event) : null
                }
                style={{ borderRadius: "0" }}
              />
              <button
                className="btn btn-primary"
                onClick={(event) => sendMessage(event)}
                style={{ borderRadius: "0" }}
              >
                Send
              </button>
            </div>
            <a href="/">
              <button className="btn btn-danger">Leave</button>
            </a>
          </div>
          <ul>
            {users.map((x) => {
              return <li key={x.id}>{x.name}</li>;
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Chat;
