import { useState, useRef, useEffect } from 'react';
import API from '../services/api';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useNavigate } from 'react-router-dom';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m the Draviṇa support bot 👋 How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [escalated, setEscalated] = useState(false);
  const [sessionId, setSessionId] = useState(null);
    const [stompClient, setStompClient] = useState(null);
    const [queuePosition, setQueuePosition] = useState(null);
    const [agentJoined, setAgentJoined] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const startLiveChat = async (user) => {
  try {
    const res = await API.post('/chat/start', {
      userName: user.fullName || user.name,
      userEmail: user.email
    }, { withCredentials: true });

    const { sessionId, queuePosition, status } = res.data;
    setSessionId(sessionId);
    setQueuePosition(queuePosition);

    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `⏳ You're in the queue! Position: #${queuePosition}. An agent will be with you shortly.`
    }]);

    const socket = new SockJS('http://localhost:8080/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('WebSocket connected!');

        client.subscribe(`/topic/chat/${sessionId}`, (message) => {
          const data = JSON.parse(message.body);

          if (data.type === 'AGENT_JOINED') {
            setAgentJoined(true);
            setQueuePosition(null);
            setMessages(prev => [...prev, {
              role: 'assistant',
              content: '🟢 An agent has joined! You can start chatting now.'
            }]);
          } else if (data.type === 'CHAT_CLOSED') {
            setMessages(prev => [...prev, {
              role: 'assistant',
              content: '🔴 Chat has been closed. Thank you!'
            }]);
            setEscalated(false);
            setAgentJoined(false);
            setSessionId(null);
          } else if (data.senderType === 'AGENT') {
            setMessages(prev => [...prev, {
              role: 'assistant',
              content: data.content
            }]);
          }
        });
      },
      onStompError: (frame) => {
        console.error('WebSocket error:', frame);
      }
    });

    client.activate();
    setStompClient(client);

  } catch (err) {
    console.error('Failed to start live chat:', err);
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: '❌ Could not connect to live chat. Please try again.'
    }]);
  }
};

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');

    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);

    if (escalated && agentJoined && stompClient) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      stompClient.publish({
        destination: '/app/chat.send',
        body: JSON.stringify({
          sessionId: sessionId,
          content: userMessage,
          senderType: 'USER',
          senderId: user.id || user.email
        })
      });
      return;
    }

    setLoading(true);

    try {
      const history = newMessages.slice(1).map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content
      }));

      const res = await API.post('/chat/bot', {
        message: userMessage,
        history: history.slice(0, -1)
      });

      const { reply, escalate } = res.data;

      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);

      if (escalate === 'true') {
        // ✅ FIXED — stronger login check
        const stored = localStorage.getItem('user');
        const user = stored ? JSON.parse(stored) : null;
        const isLoggedIn = user && user.email;  // must have email to be valid

        if (!isLoggedIn) {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: '🔐 To connect with a live agent, please login first.',
            showLogin: true
          }]);
        } else {
          setEscalated(true);
          startLiveChat(user);
        }
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I\'m having trouble. Please try again.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          width: '350px', height: '480px', background: '#1a1a2e',
          borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', flexDirection: 'column', marginBottom: '12px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
        }}>
          {/* Header */}
          <div style={{
            padding: '16px', background: 'linear-gradient(135deg, #667eea, #764ba2)',
            borderRadius: '16px 16px 0 0', display: 'flex',
            alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: '18px'
              }}>🤖</div>
              <div>
                <div style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>
                  Draviṇa Support
                </div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>
                  {escalated ? '🟡 Connecting to agent...' : '🟢 Bot Online'}
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{
              background: 'none', border: 'none', color: 'white',
              cursor: 'pointer', fontSize: '18px', padding: '4px'
            }}>✕</button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '16px',
            display: 'flex', flexDirection: 'column', gap: '12px'
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  maxWidth: '80%', padding: '10px 14px', borderRadius: '12px',
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, #667eea, #764ba2)'
                    : 'rgba(255,255,255,0.08)',
                  color: 'white', fontSize: '13px', lineHeight: '1.5'
                }}>
                  {msg.content}
                    {msg.showLogin && (<button
                        onClick={() => navigate('/', { state: { openLogin: true }})}
                        className="mt-2 w-full py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition"
                        >
                        Login to continue
                        </button>
                    )}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '10px 14px', borderRadius: '12px',
                  background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)',
                  fontSize: '13px'
                }}>typing...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '12px', borderTop: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', gap: '8px'
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              style={{
                flex: 1, padding: '10px 14px', borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.08)', color: 'white',
                fontSize: '13px', outline: 'none'
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                border: 'none', color: 'white', cursor: 'pointer',
                fontSize: '16px', display: 'flex', alignItems: 'center',
                justifyContent: 'center'
              }}
            >➤</button>
          </div>
        </div>
      )}

      {/* Bubble Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '56px', height: '56px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          border: 'none', cursor: 'pointer', fontSize: '24px',
          boxShadow: '0 4px 20px rgba(102,126,234,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
      >
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  );
};

export default ChatWidget;