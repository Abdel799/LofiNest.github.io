import { useState, useRef, useEffect } from "react";
import styles from './Chatbot.module.css'

function Chatbot() {
    const [chats, setChats] = useState(() => {
        const savedChats = localStorage.getItem("allChats");
        return savedChats ? JSON.parse(savedChats) : [{ id: 1, messages: [], title: "New Chat" }];
    });
    
    const [currentChatId, setCurrentChatId] = useState(() => {
        const savedCurrentChatId = localStorage.getItem("currentChatId");
        return savedCurrentChatId ? Number(savedCurrentChatId) : 1;
    });
    
    const [inputValue, setInputValue] = useState('');
    const messageEndRef = useRef(null);

    const currentChat = chats.find(chat => chat.id === currentChatId);
    const messages = currentChat?.messages || [];

    useEffect(() => {
        localStorage.setItem("allChats", JSON.stringify(chats));
        localStorage.setItem("currentChatId", currentChatId.toString());
    }, [chats, currentChatId]);

    const buildConversationHistory = () => {
        return messages.map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.text
        }));
    };

    const generateChatTitle = (firstMessage) => {
        return firstMessage.length > 30 
            ? firstMessage.substring(0, 30) + "..." 
            : firstMessage;
    };

    const handleClick = async () => {
        if (!inputValue.trim()) return;

        const userMsg = { type: 'user', text: inputValue };
        const currentInput = inputValue;
        setInputValue('');

        setChats(prevChats => 
            prevChats.map(chat => 
                chat.id === currentChatId 
                    ? { 
                        ...chat, 
                        messages: [...chat.messages, userMsg],
                        title: chat.messages.length === 0 ? generateChatTitle(currentInput) : chat.title
                      }
                    : chat
            )
        );

        let botResponse = "Response";

        try {
            const conversationHistory = [
                ...buildConversationHistory(),
                { role: "user", content: currentInput }
            ];
            
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model: "llama-3.1-8b-instant",
                    messages: conversationHistory,
                    max_tokens: 500
                })
            });

            const data = await response.json();
            
            if (data.choices && data.choices[0]) {
                botResponse = data.choices[0].message.content;
            } else {
                botResponse = "Error: No response from API";
            }

        } catch (error) {
            console.error("Error fetching response:", error);
            botResponse = "Error: Could not connect to API";
        }

        const botMsg = { type: 'bot', text: botResponse };
        
        setChats(prevChats => 
            prevChats.map(chat => 
                chat.id === currentChatId 
                    ? { ...chat, messages: [...chat.messages, botMsg] }
                    : chat
            )
        );
    };

    const createNewChat = () => {
        const newChatId = Math.max(...chats.map(c => c.id)) + 1;
        setChats(prev => [...prev, { id: newChatId, messages: [], title: "New Chat" }]);
        setCurrentChatId(newChatId);
    };

    const switchChat = (chatId) => {
        setCurrentChatId(chatId);
    };

    const deleteChat = (chatId, e) => {
        e.stopPropagation();
        if (chats.length === 1) return;
        
        setChats(prev => prev.filter(chat => chat.id !== chatId));
        
        if (currentChatId === chatId) {
            const remainingChats = chats.filter(chat => chat.id !== chatId);
            setCurrentChatId(remainingChats[0].id);
        }
    };

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className={styles.chatContainer}>
            <div className={styles.sidebar}>
                <button 
                    onClick={createNewChat}
                    className={styles.newChatBtn}
                >
                    + New Chat
                </button>

                <div className={styles.chatList}>
                    {chats.map(chat => (
                        <div
                            key={chat.id}
                            onClick={() => switchChat(chat.id)}
                            className={`${styles.chatItem} ${currentChatId === chat.id ? styles.activeChatItem : ''}`}
                        >
                            <span className={styles.chatTitle}>
                                {chat.title}
                            </span>
                            {chats.length > 1 && (
                                <button
                                    onClick={(e) => deleteChat(chat.id, e)}
                                    className={styles.deleteBtn}
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.frame}>
                <div className={styles.messageHistory}>
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={msg.type === 'user' ? styles.userMessage : styles.response}
                        >
                            <h2>{msg.text}</h2>
                        </div>
                    ))}
                    <div ref={messageEndRef} />
                </div>

                <div className={styles.inputWrapper}>
                    <textarea
                        placeholder="Ask Anything..."
                        rows="1"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleClick();
                            }
                        }}
                    />
                    <button className={styles.send} onClick={handleClick}>
                        <i className="fas fa-arrow-up"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Chatbot;