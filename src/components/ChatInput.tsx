import React, { useState, KeyboardEvent } from 'react';
import styled from 'styled-components';
import { FaPaperPlane, FaMicrophone } from 'react-icons/fa';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border-radius: 25px;
  padding: 10px 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

const TextInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  padding: 10px;
  background: transparent;
  font-family: 'Inter', sans-serif;
`;

const SendButton = styled.button<{ $isLoading: boolean }>`
  background-color: ${props => props.$isLoading ? '#cccccc' : '#4a7dff'};
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.$isLoading ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  margin-left: 10px;
  
  &:hover {
    background-color: ${props => props.$isLoading ? '#cccccc' : '#3a6ae0'};
    transform: ${props => props.$isLoading ? 'none' : 'scale(1.05)'};
  }
`;

const MicButton = styled.button`
  background-color: #4ad295;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: 10px;
  
  &:hover {
    background-color: #3ab380;
    transform: scale(1.05);
  }
`;

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <InputContainer>
      <TextInput
        type="text"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isLoading}
      />
      <SendButton onClick={handleSend} $isLoading={isLoading}>
        <FaPaperPlane size={16} />
      </SendButton>
      <MicButton>
        <FaMicrophone size={16} />
      </MicButton>
    </InputContainer>
  );
};

export default ChatInput;
