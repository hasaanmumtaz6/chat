import Image from "next/image";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { PiMailboxBold } from "react-icons/pi";

interface Responser {
  _id: string;
  name: string;
  email: string;
  message: string;
  submitedBy: [string];
  clientId: string;
  clientAvatar: string;
  date: string;
}

const ContactResponse = () => {
  const [responser, setResponser] = useState<Responser[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [clientMessages, setClientMessages] = useState<Responser[]>([]);

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/contact");
      setResponser(res.data);

      if (selectedClientId) {
        const clientMsgs = res.data.filter(
          (msg: Responser) => msg.clientId === selectedClientId
        );
        setClientMessages(clientMsgs);
      }
    } catch (err) {
      console.error("Error fetching clients:", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [selectedClientId]);

  const handleClientClick = (clientId: string) => {
    setSelectedClientId(clientId);
    const clientMsgs = responser.filter((msg) => msg.clientId === clientId);
    setClientMessages(clientMsgs);
  };

  const formatTo12HourTime = (dateString: string): string => {
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const paddedMinutes = minutes.toString().padStart(2, "0");
    return `${hours}:${paddedMinutes} ${ampm}`;
  };

  return (
    <div className="Message-response-box">
      <div className="response-opener-list-box">
        {Array.from(
          new Map(responser.map((msg) => [msg.clientId, msg])).values()
        ).map((client, index) => (
          <div
            key={index}
            className={`reponser-profile ${
              selectedClientId === client.clientId ? "active" : ""
            }`}
            onClick={() => handleClientClick(client.clientId)}
          >
            <picture>
              <Image
                src={client.clientAvatar}
                width={40}
                height={40}
                alt="user-profile"
                className="reponser-profile-pic"
              />
            </picture>
            <span className="responser-profiler-detail">
              <span>
                <h2>{client.name}</h2>
                <time>{formatTo12HourTime(client.date)}</time>
              </span>
              <p>{client.message.slice(0, 30)}...</p>
            </span>
          </div>
        ))}
      </div>

      <div className="response-messages-writer">
        {selectedClientId ? (
          <div className="client-chat-box">
            {clientMessages.map((msg, i) => (
              <div key={i} className="message-item">
                <picture>
                  <Image
                    src={msg.clientAvatar}
                    width={40}
                    height={40}
                    alt="avatar-responser"
                  />
                </picture>

                <div className="message-box">
                  <text>
                    <p>{msg.message}</p>
                  </text>
                  <time>{formatTo12HourTime(msg.date)}</time>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <span className="no-client-selected">
            <PiMailboxBold />
            <p>Select a client to view messages.</p>
          </span>
        )}
      </div>
    </div>
  );
};

export default ContactResponse;
