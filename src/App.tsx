import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import CartoonFace from './components/CartoonFace.tsx';
import ChatInput from './components/ChatInput.tsx';
import ChatMessage from './components/ChatMessage.tsx';
import groqService from './services/groqService.ts';

// Define message type
interface Message {
  text: string;
  isUser: boolean;
}

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  font-family: 'Inter', sans-serif;
`;

const Header = styled.header`
  padding: 20px;
  text-align: center;
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h1`
  margin: 0;
  color: #333;
  font-size: 24px;
  font-weight: 600;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  overflow: hidden;
`;

const CartoonContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-height: 300px;
  overflow-y: auto;
  padding: 10px;
  margin-bottom: 20px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
`;

const InputContainer = styled.div`
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 15px 15px 0 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
`;

const ApiKeyInput = styled.div`
  margin-bottom: 20px;
  text-align: center;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 300px;
  font-size: 14px;
`;

const Button = styled.button`
  padding: 10px 15px;
  background-color: #4a7dff;
  color: white;
  border: none;
  border-radius: 5px;
  margin-left: 10px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background-color: #3a6ae0;
  }
`;

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Handle audio playback events
  useEffect(() => {
    const audioElement = audioRef.current;
    
    if (audioElement) {
      const handleEnded = () => {
        setIsSpeaking(false);
      };
      
      const handlePlay = () => {
        setIsSpeaking(true);
        console.log('Audio playback started');
      };
      
      const handlePause = () => {
        setIsSpeaking(false);
        console.log('Audio playback paused');
      };
      
      const handleError = (e: any) => {
        console.error('Audio playback error:', e);
        setIsSpeaking(false);
      };
      
      audioElement.addEventListener('ended', handleEnded);
      audioElement.addEventListener('play', handlePlay);
      audioElement.addEventListener('pause', handlePause);
      audioElement.addEventListener('error', handleError);
      
      return () => {
        audioElement.removeEventListener('ended', handleEnded);
        audioElement.removeEventListener('play', handlePlay);
        audioElement.removeEventListener('pause', handlePause);
        audioElement.removeEventListener('error', handleError);
      };
    }
  }, []);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if (!isApiKeySet) {
      alert('Please set your Groq API key first');
      return;
    }

    // Add user message to chat
    setMessages(prev => [...prev, { text: message, isUser: true }]);
    setIsLoading(true);

    try {
      // Get AI response
      const response = await groqService.sendMessage(message);
      
      // Add AI response to chat
      setMessages(prev => [...prev, { text: response, isUser: false }]);
      
      // Convert response to speech
      // Note: We're NOT setting isSpeaking=true here anymore
      // The audio 'play' event will trigger this instead
      const { audioUrl } = await groqService.textToSpeech(response);
      
      // Play the audio
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        // The play() method returns a Promise
        await audioRef.current.play();
      }
    } catch (error: any) {
      console.error('Error:', error);
      
      // Handle specific error messages
      let errorMessage = 'Sorry, I encountered an error. Please try again.';
      
      if (error.message && error.message.includes('Authentication failed')) {
        errorMessage = 'Authentication failed. Please check your API key or try setting a new one.';
        // Reset API key state to allow user to enter a new one
        setIsApiKeySet(false);
      } else if (error.message && error.message.includes('internet connection')) {
        errorMessage = 'Could not connect to Groq API. Please check your internet connection.';
      }
      
      setMessages(prev => [...prev, { 
        text: errorMessage, 
        isUser: false 
      }]);
      setIsSpeaking(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetApiKey = () => {
    if (apiKey.trim()) {
      const trimmedKey = apiKey.trim();
      
      // Basic validation for Groq API key format
      if (!trimmedKey.startsWith('gsk_')) {
        alert('Your API key should start with "gsk_". Please check your Groq API key.');
        return;
      }
      
      groqService.setApiKey(trimmedKey);
      setIsApiKeySet(true);
      console.log('API key set successfully');
      
      // Add welcome message
      setMessages([{ 
        text: "Hi there! I'm your cartoon AI assistant. How can I help you today?", 
        isUser: false 
      }]);
    } else {
      alert('Please enter a valid API key');
    }
  };

  return (
    <AppContainer>
      {/* Hidden audio element for speech playback */}
      <audio ref={audioRef} style={{ display: 'none' }} />
      
      {!isApiKeySet ? (
        <ApiKeyInput>
          <h2>Enter your Groq API Key to start</h2>
          <Input 
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Groq API key"
          />
          <Button onClick={handleSetApiKey}>Set API Key</Button>
        </ApiKeyInput>
      ) : (
        <>
          <Header>
            <Title>Toon AI Chatbot</Title>
          </Header>
          
          <MainContent>
            <CartoonContainer>
              <CartoonFace isSpeaking={isSpeaking} />
            </CartoonContainer>
            
            <ChatContainer ref={chatContainerRef}>
              {messages.map((msg, index) => (
                <ChatMessage 
                  key={index}
                  message={msg.text}
                  isUser={msg.isUser}
                />
              ))}
            </ChatContainer>
            
            <InputContainer>
              <ChatInput 
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
              />
            </InputContainer>
          </MainContent>
        </>
      )}
    </AppContainer>
  );
}

export default App;
