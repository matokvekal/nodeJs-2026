import { useState, useEffect } from "react";
import io from "socket.io-client";

function App() {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [messages, setMessages] = useState([]);
  const [item, setItem] = useState("");
  const [myItems, setMyItems] = useState([]);

  useEffect(() => {
    const newSocket = io.connect("http://localhost:5000");
    setSocket(newSocket);
    return () => newSocket && newSocket.close();
  }, []);

  const handleSetName = () => {
    if (socket && name) {
      socket.emit("set_name", name);
    } else {
      alert("Please enter your name before setting it!");
    }
  };

  useEffect(() => {
    if (!socket) return;

    const messageHandler = (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    };

    const messageBroadcastHandler = (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    };

    const addItemHandler = (data) => {
      const receivedItem = data.item;
      const displayItem = `${receivedItem} (from: Server)`;
      setMyItems((prevItems) => [...prevItems, displayItem]);
    };

    socket.on("message", messageHandler);
    socket.on("message-broadcast", messageBroadcastHandler);
    socket.on("addItem", addItemHandler);

    // Cleanup the event listeners
    return () => {
      socket.off("message", messageHandler);
      socket.off("message-broadcast", messageBroadcastHandler);
      socket.off("addItem", addItemHandler);
    };
  }, [socket]);

  const handleSendMessage = () => {
    if (socket && name) {
      socket.emit("message", `${name}: ${message}`);
      setMessage("");
    } else {
      alert("Please enter your name before sending a message!");
    }
  };

  const handleDisconnect = () => {
    if (socket) {
      socket.emit("manual_disconnect");
      socket.disconnect();
      alert("Disconnected from server");
    }
  };

  const handleAddItem = () => {
    if (socket && item) {
      socket.emit("addItems", item);
      setItem("");
    } else {
      alert("Please enter an item to add!");
    }
  };

  return (
    <div>
      <h2>Socket.io Client</h2>
      <button onClick={handleDisconnect}>Disconnect</button>
      <div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name..."
        />
        <button onClick={handleSetName}>Set Name</button>
      </div>

      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
      <div>
        <input
          type="text"
          value={item}
          onChange={(e) => setItem(e.target.value)}
          placeholder="Type an item to add..."
        />
        <button onClick={handleAddItem}>Add Item</button>
      </div>
      <div>
        <h3>Messages:</h3>
        <ul>
          {messages.map((msg, idx) => (
            <li key={idx}>{msg}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>My Items:</h3>
        <ul>
          {myItems.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
