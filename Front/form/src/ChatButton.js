import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './ChatButton.css';

const socket = io('http://localhost:5000');

const ChatButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        console.log("Connecting to Socket.IO server...");
        socket.on('chatMessage', (msg) => {
            setMessages(prevMessages => [...prevMessages, msg]);
        });

        return () => {
            socket.off('chatMessage');
        };
    }, []);


    const toggleChatWindow = () => {
        setIsOpen(!isOpen);
    };

    const sendMessage = () => {
        if (message.trim() !== '') {
            socket.emit('chatMessage', message); 
            setMessage('');
        }
    };

    const closeChatWindow = () => {
        setIsOpen(false);
    };

    return (
        <>
            <div className="chat-button" onClick={toggleChatWindow}>
                <i className="fas fa-comment"></i>
            </div>

            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <button className="close-button" onClick={closeChatWindow}>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    <div className="chat-body">
                        {messages.map((msg, index) => (
                            <div key={index}>{msg}</div>
                        ))}
                    </div>
                    <div className="chat-footer">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Type your message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button className="btn btn-primary" onClick={sendMessage}>
                            Send
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default ChatButton;
