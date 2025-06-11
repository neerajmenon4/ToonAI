import axios from 'axios';

// Define types for API responses
interface ChatResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface TTSResponse {
  audio: string;
  // This is a simplified version - actual response might include more data
  viseme_data?: Array<{
    viseme: string;
    start: number;
    end: number;
  }>;
}

class GroqService {
  private apiKey: string;
  private baseURL: string = 'https://api.groq.com/openai/v1';

  constructor(apiKey: string = '') {
    this.apiKey = apiKey;
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  async sendMessage(message: string): Promise<string> {
    try {
      // Check if API key is set
      if (!this.apiKey) {
        throw new Error('API key is not set');
      }
      
      console.log('Sending message to Groq API...');
      
      const response = await axios.post<ChatResponse>(
        `${this.baseURL}/chat/completions`,
        {
          model: 'llama3-70b-8192',
          messages: [
            {
              role: 'system',
              content: 'You are a friendly and helpful cartoon character assistant. Keep your responses concise and engaging.'
            },
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.7,
          max_tokens: 800
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Successfully received response from Groq API');
      return response.data.choices[0].message.content;
    } catch (error: any) {
      console.error('Error sending message to Groq:', error);
      
      // More detailed error handling
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Response status:', error.response.status);
          console.error('Response data:', error.response.data);
          
          if (error.response.status === 401) {
            throw new Error('Authentication failed. Please check your API key.');
          }
        } else if (error.request) {
          // The request was made but no response was received
          throw new Error('No response received from Groq API. Please check your internet connection.');
        }
      }
      
      throw new Error('Failed to get response from AI: ' + (error.message || 'Unknown error'));
    }
  }

  async textToSpeech(text: string, voice: string = 'Fritz-PlayAI'): Promise<{ audioUrl: string, visemeData?: any }> {
    try {
      // Check if API key is set
      if (!this.apiKey) {
        throw new Error('API key is not set');
      }
      
      console.log('Converting text to speech using Groq TTS API...');
      
      // For demo purposes, we'll use a simple implementation
      // In a production app, you'd handle the binary audio data properly
      const response = await axios.post(
        `${this.baseURL}/audio/speech`,
        {
          model: 'playai-tts',
          input: text,
          voice: voice,
          response_format: 'wav'
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          responseType: 'arraybuffer'
        }
      );

      console.log('Successfully received audio data from Groq TTS API');
      
      // Convert the binary data to a base64 string to create an audio URL
      const audioBlob = new Blob([response.data], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);

      // In a real implementation, we would extract viseme data from the response
      // For now, we'll return a placeholder
      return {
        audioUrl,
        visemeData: [] // This would contain actual viseme data in a real implementation
      };
    } catch (error: any) {
      console.error('Error converting text to speech:', error);
      
      // More detailed error handling
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Response status:', error.response.status);
          console.error('Response data:', error.response.data);
          
          if (error.response.status === 401) {
            throw new Error('Authentication failed for TTS. Please check your API key.');
          } else if (error.response.status === 400) {
            throw new Error('Bad request to TTS API. The text might be too long or contain unsupported characters.');
          }
        } else if (error.request) {
          throw new Error('No response received from TTS API. Please check your internet connection.');
        }
      }
      
      throw new Error('Failed to convert text to speech: ' + (error.message || 'Unknown error'));
    }
  }
}

export default new GroqService();
