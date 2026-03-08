import { useState, useEffect } from 'react';
import './EduGenie.css';

// API Configuration - Use backend proxy to avoid CORS
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const HF_CHAT_ENDPOINT = `${API_BASE_URL}/ai/chat`;

const EduGenie = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "Hi! I'm EduGenie 🧞 Your versatile AI assistant! Ask me anything - general knowledge, creative tasks, coding, math, writing, recommendations, or just chat! How can I help you today? ✨",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Get AI response from Hugging Face
  const getAIResponse = async (userMessage) => {
    try {
      // Build comprehensive conversation context (last 10 messages for better memory)
      const conversationHistory = messages
        .slice(-10)
        .map(msg => `${msg.type === 'user' ? 'User' : 'EduGenie'}: ${msg.text}`)
        .join('\n');
      
      const prompt = `[INST] You are EduGenie, a friendly, intelligent, and versatile AI assistant. You can help with ANYTHING:

🌟 YOU CAN HELP WITH:
- General knowledge and facts
- Creative writing and storytelling
- Coding and technical questions
- Math and science problems
- Language translation and grammar
- Recommendations (movies, books, courses, etc.)
- Advice and life tips
- Jokes and entertainment
- Current events and news
- Health and wellness (general info only)
- Travel planning
- Food and recipes
- And much more!

🎯 YOUR PERSONALITY:
- Be friendly, helpful, and conversational
- Provide detailed, accurate information
- Use clear explanations suitable for all ages
- Add emojis occasionally to be engaging
- Remember previous conversation context
- If you don't know something, admit it honestly
- Think step-by-step for complex problems

${conversationHistory}
User: ${userMessage}
EduGenie: [/INST]`;

      console.log('Sending request to backend AI proxy...');
      console.log('Endpoint:', HF_CHAT_ENDPOINT);

      const response = await fetch(HF_CHAT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt
        })
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error Details:', errorData);
        throw new Error(`API error: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      const result = await response.json();
      console.log('AI Response:', result);
      
      // Extract generated text
      let aiText = '';
      if (Array.isArray(result) && result[0]?.generated_text) {
        aiText = result[0].generated_text.trim();
      } else if (result.generated_text) {
        aiText = result.generated_text.trim();
      } else {
        aiText = "I'm here to help! Feel free to ask me anything! 😊";
      }

      // Clean up any instruction tokens and system messages
      aiText = aiText.replace(/\[\/INST\]/g, '').trim();
      aiText = aiText.replace(/\[INST\][\s\S]*?\[\/INST\]/g, '').trim();
      
      return aiText;
    } catch (error) {
      console.error('AI API Error:', error);
      console.error('Error details:', error.message);
      
      // More detailed error message
      if (error.message.includes('401')) {
        return "⚠️ API Token Issue: The Hugging Face token is invalid or expired. Please check your environment variables.";
      } else if (error.message.includes('429')) {
        return "⏳ Rate Limit: I'm getting too many requests. Please wait a moment and try again.";
      } else if (error.message.includes('503')) {
        return "🔧 Service Unavailable: The AI model is loading or temporarily unavailable. Try again in a few seconds.";
      } else {
        return `⚠️ Connection Issue: ${error.message}. Please check your internet connection and try again.`;
      }
    }
  };

  // Fallback responses when AI fails
  const getFallbackResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Course-related queries
    if (message.includes('course') && (message.includes('recommend') || message.includes('suggest'))) {
      return "I'd recommend checking out our popular courses in the Courses section! Look for courses with high ratings and reviews. What subject are you interested in?";
    }
    
    if (message.includes('course') && (message.includes('hard') || message.includes('difficult') || message.includes('easy'))) {
      return "Course difficulty varies by individual. I suggest reading the course descriptions and prerequisites. Start with beginner courses if you're new to the topic!";
    }
    
    // Learning progress
    if (message.includes('progress') || message.includes('track')) {
      return "You can track your learning progress in the Dashboard! It shows your enrolled courses, completed lessons, and overall progress.";
    }
    
    if (message.includes('enroll') || message.includes('enrollment')) {
      return "To enroll in a course, go to the Courses page, click on a course card, and hit the Enroll button. Happy learning!";
    }
    
    // Certificate
    if (message.includes('certificate') || message.includes('certification')) {
      return "After completing all lessons and sections in a course, you'll receive a certificate of completion!";
    }
    
    // Navigation help
    if (message.includes('dashboard')) {
      return "The Dashboard shows your learning overview - enrolled courses, recent activity, and progress tracking.";
    }
    
    if (message.includes('login') || message.includes('sign in')) {
      return "You can log in using the Login button in the navigation menu. Make sure to use your registered email!";
    }
    
    if (message.includes('signup') || message.includes('register') || message.includes('sign up')) {
      return "Click on 'Get Started' or 'Signup' to create a new account. It's free and takes just a minute!";
    }
    
    // Learning tips
    if (message.includes('tip') || message.includes('advice') || message.includes('how to learn')) {
      return "Here are some tips: 1) Set a regular study schedule, 2) Take breaks between lessons, 3) Practice what you learn, 4) Join course discussions, 5) Don't rush - focus on understanding concepts!";
    }
    
    if (message.includes('motivat') || message.includes('inspire')) {
      return "You're doing great! Every lesson you complete brings you closer to your goals. Keep going! 💪";
    }
    
    // Technical support
    if (message.includes('video') && (message.includes('not work') || message.includes('not load') || message.includes('problem'))) {
      return "If videos aren't loading, try: 1) Refresh the page, 2) Check your internet connection, 3) Clear browser cache, 4) Try a different browser.";
    }
    
    if (message.includes('error') || message.includes('bug') || message.includes('issue') || message.includes('problem')) {
      return "Sorry you're experiencing issues! Please try refreshing the page. If the problem persists, contact our support team.";
    }
    
    // Greetings
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! Ready to learn something new today? Feel free to ask me anything about your learning journey!";
    }
    
    if (message.includes('thank')) {
      return "You're welcome! Happy learning! 📚";
    }
    
    if (message.includes('bye') || message.includes('goodbye')) {
      return "Goodbye! Come back anytime you need help. Happy learning! 👋";
    }
    
    if (message.includes('who are you') || message.includes('what are you')) {
      return "I'm EduGenie, your AI learning assistant! I'm here to help you navigate the platform, find courses, and make your learning journey smoother.";
    }
    
    // Default fallback
    return "That's interesting! I'm here to help with your learning journey. Ask me about courses, study tips, progress tracking, or anything related to your education!";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Get AI response from Hugging Face
      const aiResponseText = await getAIResponse(inputValue);
      
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        text: aiResponseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      // Show error message
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        text: "I'm having trouble connecting right now, but I'm here to help! Please try again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: 'bot',
        text: "Hi! I'm EduGenie 🧞 Your AI course assistant. Ask me anything about your courses, learning strategies, assignments, or study tips! How can I help you today? 📚",
        timestamp: new Date()
      }
    ]);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button className="edugenie-toggle" onClick={toggleChat}>
        {isOpen ? '✕' : '🧞'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="edugenie-chat">
          {/* Chat Header */}
          <div className="edugenie-header">
            <div className="edugenie-title">
              <span className="edugenie-icon">🧞</span>
              <span className="edugenie-name">EduGenie</span>
            </div>
            <p className="edugenie-subtitle">Your Versatile AI Assistant</p>
            <button className="clear-chat-btn" onClick={clearChat} title="Start new conversation">
              🗑️ New Chat
            </button>
          </div>

          {/* Chat Messages */}
          <div className="edugenie-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.type}`}
              >
                <div className="message-content">
                  {message.text}
                </div>
                <div className="message-timestamp">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot typing">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="edugenie-input-container">
            <textarea
              className="edugenie-input"
              placeholder="Ask me anything..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              rows="1"
            />
            <button 
              className="edugenie-send"
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EduGenie;
