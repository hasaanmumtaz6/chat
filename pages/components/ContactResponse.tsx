import Image from "next/image";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { PiMailboxBold } from "react-icons/pi";
import { IoSend } from "react-icons/io5";
import { useSession } from "next-auth/react";

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
interface RegisterData {
  _id: string;
  name: string;
  avatar: string[];
  email: string;
  username: number;
}

const ContactResponse = () => {
  const [responser, setResponser] = useState<Responser[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [clientMessages, setClientMessages] = useState<Responser[]>([]);
  const [clientName, setClientName] = useState<string>("");
  const [clientEmail, setClientEmail] = useState<string>("");
  const [clientId, setClientId] = useState<string>("");
  const [clientAvatar, setClientAvatar] = useState<string>("");
  const [messageToClient, setMessageToClient] = useState<string>("");
  const [formStatus, setFormStatus] = useState<string>("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");
  const [userData, setUserData] = useState<RegisterData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    axios
      .get("/api/contact")
      .then((res) => {
        const responser = res.data;
        setResponser(responser);
      })
      .catch((err) => {
        console.error("Error fetching clients:", err);
      });
  }, [responser]);

  useEffect(() => {
    if (!session?.user?.email) return;

    axios
      .get("/api/register")
      .then((response) => {
        const users: RegisterData[] = Array.isArray(response.data)
          ? response.data
          : response.data.blogs || [];

        const matchedUser = users.find(
          (user) => user.email === session.user?.email
        );

        if (matchedUser) {
          setUserData(matchedUser);
        } else {
          setError("User not found.");
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [session]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const contactData = {
      clientName,
      clientEmail,
      clientAvatar,
      clientId: clientId,
      messageToClient,
      submitedBy: [
        userData?.name,
        userData?.avatar,
        userData?.email,
        userData?.username,
      ],
    };

    try {
      const response = await axios.post("/api/contact", contactData);

      if (response.status === 200) {
        setFormStatus("Contact submitted successfully!");
        setStatusType("success");
        setMessageToClient("");
      } else {
        throw new Error(`Unexpected response: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormStatus("Failed to submit Contact.");
      setStatusType("error");
    }

    setTimeout(() => {
      setFormStatus("");
      setStatusType("");
    }, 8000);
  };

  const handleClientClick = (clientId: string) => {
    setSelectedClientId(clientId);
    const clientMsgs = responser.filter((msg) => msg.clientId === clientId);
    setClientMessages(clientMsgs);
    setMessageToClient("");

    if (clientMsgs.length > 0) {
      const { name, email, clientAvatar, clientId } = clientMsgs[0];
      setClientName(name);
      setClientEmail(email);
      setClientAvatar(clientAvatar);
      setClientId(clientId);
    }
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
            <div className="chatheader">
              <div className="user-profile-chat-header">
                <picture>
                  <Image
                    src={clientAvatar}
                    alt={`${clientId}-${clientName}_${clientId}`}
                    height={40}
                    width={40}
                  />
                </picture>
                <span>
                  <h2 className="chater-name-responser">{clientName}</h2>
                  <p className="status-line">typing...</p>
                </span>
              </div>
              <div className="icons-forchats"></div>
            </div>
            <div className="reponser-chat-box">
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

            <form className="Messageform-writemessage" onSubmit={handleSubmit}>
              {formStatus && (
                <p
                  className={`text-sm mt-2 fixed top-[1rem] right-[1rem] ${
                    statusType === "success" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {formStatus}
                </p>
              )}

              <input
                type="text"
                placeholder="Write Message"
                value={messageToClient}
                onChange={(e) => setMessageToClient(e.target.value)}
                required
              />
              <button type="submit">
                <IoSend />
              </button>
            </form>
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
