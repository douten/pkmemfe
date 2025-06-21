import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

import useActionCable from "./hooks/useActionCable";
import useChannel from "./hooks/useChannel";

// const ws = new WebSocket("ws://192.168.86.230:3000/cable");

interface Message {
  body: string;
  id: number;
  created_at: string;
  updated_at: string;
  guid?: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [guid, setGuid] = useState<string>(uuidv4());

  const { actionCable } = useActionCable(`ws://192.168.86.230:3000/cable`);
  const { subscribe, unsubscribe, send } = useChannel<Message>(actionCable);

  useEffect(() => {
    subscribe(
      { channel: "GamesChannel" },
      {
        received: (data) => {
          console.log("Received data:", data);
          // setMessagesAndScrollDown([...messages, data]);
        },
        connected: () => {
          send("get_game", {});
        },
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const response = await fetch("http://192.168.86.230:3000/messages", {
      credentials: "include",
    });
    const data = await response.json();
    setMessagesAndScrollDown(data);
  };

  const setMessagesAndScrollDown = (newMessages: Message[]) => {
    setMessages(newMessages);
    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight);
    }, 100);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const message = formData.get("message") as string;
    if (!message) return;

    form.reset();

    send("receive", { body: message, guid: guid });
  };

  return (
    <>
      <div className="App">
        <div>guid: {guid}</div>
        <h3>Messages</h3>
        <div>
          {messages.map((message) => (
            <div key={message.id}>{message.body}</div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <input type="text" name="message" />
          <button type="submit">Send</button>
        </form>
      </div>
    </>
  );
}

export default App;
