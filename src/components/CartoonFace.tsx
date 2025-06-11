import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface CartoonFaceProps {
  isSpeaking: boolean;
  visemeData?: Array<{ viseme: string; start: number; end: number }>;
}

const FaceContainer = styled.div`
  width: 300px;
  height: 300px;
  margin: 0 auto;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle, rgba(0,24,69,0.5) 0%, rgba(0,8,20,0) 70%);
  
  &::before {
    content: '';
    position: absolute;
    width: 280px;
    height: 280px;
    border-radius: 50%;
    border: 1px dashed rgba(0, 150, 255, 0.3);
    animation: rotate 20s linear infinite;
  }
  
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const Face = styled.div`
  width: 200px;
  height: 240px;
  background-color: rgba(0, 60, 255, 0.1);
  border-radius: 40% 40% 30% 30%;
  position: relative;
  box-shadow: 0 0 30px rgba(0, 150, 255, 0.5);
  border: 1px solid rgba(0, 150, 255, 0.3);
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      linear-gradient(90deg, transparent 50%, rgba(0, 150, 255, 0.1) 50%),
      linear-gradient(transparent 50%, rgba(0, 150, 255, 0.1) 50%);
    background-size: 10px 10px;
    z-index: 1;
    opacity: 0.7;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, rgba(0, 150, 255, 0.2) 0%, transparent 70%);
    z-index: 2;
  }
`;

const Eye = styled.div`
  width: 40px;
  height: 20px;
  background-color: rgba(0, 200, 255, 0.2);
  border-radius: 5px;
  position: absolute;
  top: 80px;
  overflow: hidden;
  border: 1px solid rgba(0, 200, 255, 0.5);
  box-shadow: 0 0 10px rgba(0, 200, 255, 0.5);
  z-index: 5;
`;

const LeftEye = styled(Eye)`
  left: 40px;
  transform: rotate(-5deg);
`;

const RightEye = styled(Eye)`
  right: 40px;
  transform: rotate(5deg);
`;

const Pupil = styled(motion.div)`
  width: 12px;
  height: 6px;
  background-color: rgba(0, 255, 255, 0.9);
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Mouth = styled(motion.div)<{ $isSpeaking: boolean }>`
  width: ${props => (props.$isSpeaking ? '50px' : '60px')};
  height: ${props => (props.$isSpeaking ? '25px' : '10px')};
  background-color: rgba(0, 200, 255, 0.3);
  border-radius: 3px;
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  transition: all 0.1s ease;
  border: 1px solid rgba(0, 200, 255, 0.5);
  box-shadow: 0 0 15px rgba(0, 200, 255, 0.4);
  
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.8), transparent);
    animation: ${props => props.$isSpeaking ? 'scan 1.5s linear infinite' : 'none'};
  }
  
  @keyframes scan {
    0% { top: 0; }
    100% { top: 100%; }
  }
`;

const Teeth = styled.div<{ hidden?: boolean }>`
  width: 80%;
  height: 4px;
  background-color: rgba(0, 255, 255, 0.7);
  border-radius: 1px;
  margin-top: 0;
  display: ${props => (props.hidden ? 'none' : 'block')};
  box-shadow: 0 0 5px rgba(0, 255, 255, 0.8);
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    animation: shimmer 2s infinite;
  }
  
  @keyframes shimmer {
    100% { left: 100%; }
  }
`;

const CircuitLines = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 3;
  pointer-events: none;
  
  &::before, &::after {
    content: '';
    position: absolute;
    background: linear-gradient(90deg, transparent, rgba(0, 200, 255, 0.2), transparent);
    height: 1px;
    width: 100px;
    top: 90px;
  }
  
  &::before {
    left: -50px;
    transform: rotate(-10deg);
  }
  
  &::after {
    right: -50px;
    transform: rotate(10deg);
  }
`;

const DataFlowLines = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 3;
  
  &::before, &::after {
    content: '';
    position: absolute;
    width: 1px;
    height: 40px;
    background: linear-gradient(to bottom, transparent, rgba(0, 220, 255, 0.6), transparent);
    animation: dataFlow 2s infinite linear;
  }
  
  &::before {
    left: 60px;
    top: 120px;
    height: 60px;
  }
  
  &::after {
    right: 60px;
    top: 120px;
    height: 60px;
    animation-delay: 1s;
  }
  
  @keyframes dataFlow {
    0% { transform: translateY(-100%); opacity: 0; }
    50% { opacity: 1; }
    100% { transform: translateY(100%); opacity: 0; }
  }
`;

const GlowEffect = styled.div<{ $isSpeaking: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 40% 40% 30% 30%;
  background: radial-gradient(
    circle at center, 
    rgba(0, 200, 255, ${props => props.$isSpeaking ? 0.15 : 0.05}) 0%, 
    transparent 70%
  );
  filter: blur(10px);
  z-index: 0;
  opacity: ${props => props.$isSpeaking ? 1 : 0.7};
  transition: opacity 0.3s ease;
`;

const CartoonFace: React.FC<CartoonFaceProps> = ({ isSpeaking, visemeData }) => {
  const [mouthShape, setMouthShape] = useState({ width: '60px', height: '10px' });
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Simple blinking animation
  const blinkVariants = {
    open: { scaleY: 1 },
    closed: { scaleY: 0.1 }
  };

  // Random blinking
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, Math.random() * 5000 + 2000); // Random blink between 2-7 seconds
    
    return () => clearInterval(blinkInterval);
  }, []);

  // Handle lip sync animation
  useEffect(() => {
    console.log('CartoonFace: isSpeaking changed to', isSpeaking);
    
    if (isSpeaking) {
      console.log('CartoonFace: Starting lip sync animation');
      // Simple mouth animation if no viseme data
      if (!visemeData || visemeData.length === 0) {
        // More dynamic mouth shapes for better lip sync simulation
        const mouthShapes = [
          { width: '40px', height: '30px' },  // slightly open
          { width: '50px', height: '25px' },  // wide
          { width: '45px', height: '35px' },  // medium open
          { width: '55px', height: '20px' },  // wide closed
          { width: '40px', height: '40px' },  // open
          { width: '35px', height: '35px' },  // small open
          { width: '60px', height: '30px' },  // very wide
          { width: '45px', height: '25px' },  // medium
        ];
        
        // Use variable intervals to make animation more natural
        const getRandomInterval = () => Math.random() * 100 + 80; // 80-180ms
        
        let index = 0;
        let lastShapeTime = Date.now();
        let currentInterval = getRandomInterval();
        
        const animate = () => {
          const now = Date.now();
          const elapsed = now - lastShapeTime;
          
          if (elapsed > currentInterval) {
            // Change mouth shape
            const newShape = mouthShapes[index % mouthShapes.length];
            setMouthShape(newShape);
            console.log('CartoonFace: Mouth shape changed to', newShape);
            index++;
            lastShapeTime = now;
            currentInterval = getRandomInterval();
          }
          
          // Continue animation if still speaking
          if (isSpeaking) {
            animationRef.current = requestAnimationFrame(animate);
          } else {
            console.log('CartoonFace: Animation stopped because isSpeaking is false');
          }
        };
        
        console.log('CartoonFace: Starting animation loop');
        animationRef.current = requestAnimationFrame(animate);
        
        return () => {
          if (animationRef.current) {
            console.log('CartoonFace: Cleaning up animation');
            cancelAnimationFrame(animationRef.current);
          }
        };
      } else {
        // Advanced lip sync with viseme data
        startTimeRef.current = Date.now();
        console.log('CartoonFace: Using viseme data for animation');
        
        const animate = () => {
          const currentTime = Date.now();
          const elapsed = currentTime - (startTimeRef.current || 0);
          
          // Find the current viseme based on elapsed time
          const currentViseme = visemeData.find(
            v => elapsed >= v.start && elapsed <= v.end
          );
          
          if (currentViseme) {
            // Map viseme to mouth shape (simplified)
            let newShape;
            switch(currentViseme.viseme) {
              case 'a':
                newShape = { width: '50px', height: '40px' };
                break;
              case 'e':
                newShape = { width: '60px', height: '25px' };
                break;
              case 'i':
                newShape = { width: '40px', height: '20px' };
                break;
              case 'o':
                newShape = { width: '45px', height: '45px' };
                break;
              case 'u':
                newShape = { width: '35px', height: '35px' };
                break;
              default:
                newShape = { width: '40px', height: '20px' };
            }
            setMouthShape(newShape);
            console.log('CartoonFace: Viseme mouth shape changed to', newShape);
          }
          
          // Continue animation if still speaking
          if (isSpeaking) {
            animationRef.current = requestAnimationFrame(animate);
          } else {
            console.log('CartoonFace: Viseme animation stopped because isSpeaking is false');
          }
        };
        
        animationRef.current = requestAnimationFrame(animate);
        
        return () => {
          if (animationRef.current) {
            console.log('CartoonFace: Cleaning up viseme animation');
            cancelAnimationFrame(animationRef.current);
          }
        };
      }
    } else {
      // Reset mouth when not speaking
      console.log('CartoonFace: Not speaking, resetting mouth shape');
      setMouthShape({ width: '60px', height: '20px' });
    }
  }, [isSpeaking, visemeData]);

  return (
    <FaceContainer>
      <Face>
        <GlowEffect $isSpeaking={isSpeaking} />
        <CircuitLines />
        <DataFlowLines />
        
        <LeftEye>
          <Pupil
            animate={isBlinking ? { scaleY: 0.1 } : { scaleY: 1 }}
            transition={{ duration: 0.1 }}
          />
        </LeftEye>
        <RightEye>
          <Pupil
            animate={isBlinking ? { scaleY: 0.1 } : { scaleY: 1 }}
            transition={{ duration: 0.1 }}
          />
        </RightEye>
        <Mouth
          $isSpeaking={isSpeaking}
          style={{
            width: mouthShape.width,
            height: mouthShape.height
          }}
        >
          {isSpeaking && <Teeth />}
        </Mouth>
      </Face>
    </FaceContainer>
  );
};

export default CartoonFace;
