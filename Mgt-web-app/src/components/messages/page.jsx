import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MessageComponent = () => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    from: '',
    subject: '',
    content: '',
    attachment: '',
    userId: '',
  });

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await axios.get('/api/messages');
      setMessages(response.data);
    };
    fetchMessages();

    const fetchUsers = async () => {
      const response = await axios.get('/api/users');
      setUsers(response.data);
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const sendMessage = async () => {
    if (formData.from && formData.subject && formData.content && formData.userId) {
      const response = await axios.post('/api/messages', formData);
      setMessages([...messages, response.data]);
      setFormData({
        from: '',
        subject: '',
        content: '',
        attachment: '',
        userId: '',
      });
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        {messages.map((msg, index) => (
          <div key={index} className="p-2 border-b">
            <strong>From:</strong> {msg.from}<br />
            <strong>Subject:</strong> {msg.subject}<br />
            <strong>Message:</strong> {msg.content}<br />
            {msg.attachment && (
              <div>
                <strong>Attachment:</strong> <a href={msg.attachment} target="_blank" rel="noopener noreferrer">View</a>
              </div>
            )}
            <strong>To:</strong> {msg.user.name}
          </div>
        ))}
      </div>
      <div className="flex flex-col space-y-2">
        <input
          type="text"
          name="from"
          value={formData.from}
          onChange={handleChange}
          placeholder="From"
          className="p-2 border"
        />
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Subject"
          className="p-2 border"
        />
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Message"
          className="p-2 border"
        />
        <input
          type="text"
          name="attachment"
          value={formData.attachment}
          onChange={handleChange}
          placeholder="Attachment URL"
          className="p-2 border"
        />
        <select
          name="userId"
          value={formData.userId}
          onChange={handleChange}
          className="p-2 border"
        >
          <option value="">Select Recipient</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        <button onClick={sendMessage} className="p-2 bg-blue-500 text-white">
          Send
        </button>
      </div>
    </div>
  );
};

export default MessageComponent;
