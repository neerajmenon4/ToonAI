import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
}

const MessageContainer = styled(motion.div)<{ $isUser: boolean }>`
  display: flex;
  justify-content: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
  margin: 10px 0;
  width: 100%;
`;

const MessageBubble = styled.div<{ $isUser: boolean }>`
  background-color: ${props => props.$isUser ? '#4a7dff' : '#f0f0f0'};
  color: ${props => props.$isUser ? 'white' : '#333'};
  padding: 12px 18px;
  border-radius: 18px;
  max-width: 70%;
  word-wrap: break-word;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  font-size: 16px;
  line-height: 1.4;
`;

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser }) => {
  return (
    <MessageContainer
      $isUser={isUser}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <MessageBubble $isUser={isUser}>
        {message}
      </MessageBubble>
    </MessageContainer>
  );
};

export default ChatMessage;
