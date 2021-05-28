import React, { useState } from "react";
import { Link } from "react-router-dom";

const Join = () => {
  const ENDPOINT = "https://casual-chat-server.herokuapp.com/";
  // const ENDPOINT = "localhost:5000";

  const [user, setUser] = useState({
    name: "",
    room: "",
  });

  const handleChange = (event) => {
    setUser({
      ...user,
      [event.currentTarget.name]: event.target.value,
    });
  };

  return (
    <div>
      <h1>Join</h1>
      <div>
        <input
          name="name"
          placeholder="Name"
          type="text"
          onChange={handleChange}
        />
        <input
          name="room"
          placeholder="Room"
          type="text"
          onChange={handleChange}
        />
      </div>
      <Link
        onClick={(event) =>
          !user.name || !user.room ? event.preventDefault() : null
        }
        to={`/chat?name=${user.name}&room=${user.room}`}
      >
        <button type="submit">Enter</button>
      </Link>
    </div>
  );
};

export default Join;
