import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

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

// Define viseme data interface
interface VisemeData {
  viseme: string;
  start: number;
  end: number;
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

  async textToSpeech(text: string, voice: string = 'Celeste-PlayAI'): Promise<{ audioUrl: string, visemeData: Array<{ viseme: string, start: number, end: number }> }> {
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

      // Extract viseme data using Rhubarb Lip Sync
      let visemeData: Array<{ viseme: string, start: number, end: number }> = [];
      try {
        visemeData = await this.extractVisemeData(response.data, text);
      } catch (error) {
        console.error('Error extracting viseme data:', error);
        // Fall back to synthetic viseme data
        visemeData = this.generateSyntheticVisemeData(text);
      }
      
      return {
        audioUrl,
        visemeData
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
  
  /**
   * Extract viseme data from audio data
   * In browser environment, we'll use Web Speech API for better timing
   */
  private async extractVisemeData(
    audioData: ArrayBuffer, 
    text: string
  ): Promise<Array<{ viseme: string, start: number, end: number }>> {
    try {
      console.log('Generating viseme data for text:', text);
      // Try using Web Speech API first
      const webSpeechVisemes = await this.generateWebSpeechVisemeData(text);
      return webSpeechVisemes;
    } catch (error) {
      console.error('Error extracting viseme data with Web Speech API:', error);
      // Fall back to basic synthetic generation
      return this.generateSyntheticVisemeData(text);
    }
  }
  
  /**
   * Generate viseme data using Web Speech API
   * This uses the browser's speech synthesis for more accurate timing
   */
  private generateWebSpeechVisemeData(text: string): Promise<Array<{ viseme: string, start: number, end: number }>> {
    return new Promise((resolve, reject) => {
      if (!window.speechSynthesis) {
        reject(new Error('Speech synthesis not supported in this browser'));
        return;
      }
      
      const visemeData: Array<{ viseme: string, start: number, end: number }> = [];
      const utterance = new SpeechSynthesisUtterance(text);
      let startTime = 0;
      
      // Map of common phonemes to visemes
      const phonemeToViseme: Record<string, string> = {
        'AA': 'o', // as in "odd" - ɑ
        'AE': 'a', // as in "at" - æ
        'AH': 'a', // as in "hut" - ʌ
        'AO': 'o', // as in "ought" - ɔ
        'AW': 'a', // as in "cow" - aʊ
        'AY': 'a', // as in "hide" - aɪ
        'B': 'e', // as in "be" - b
        'CH': 'i', // as in "cheese" - tʃ
        'D': 'e', // as in "dee" - d
        'DH': 'e', // as in "thee" - ð
        'EH': 'e', // as in "Ed" - ɛ
        'ER': 'e', // as in "hurt" - ɝ
        'EY': 'e', // as in "ate" - eɪ
        'F': 'e', // as in "fee" - f
        'G': 'e', // as in "green" - g
        'HH': 'a', // as in "he" - h
        'IH': 'i', // as in "it" - ɪ
        'IY': 'i', // as in "eat" - i
        'JH': 'i', // as in "gee" - dʒ
        'K': 'e', // as in "key" - k
        'L': 'i', // as in "lee" - l
        'M': 'e', // as in "me" - m
        'N': 'e', // as in "knee" - n
        'NG': 'e', // as in "ping" - ŋ
        'OW': 'o', // as in "oat" - oʊ
        'OY': 'o', // as in "toy" - ɔɪ
        'P': 'e', // as in "pee" - p
        'R': 'i', // as in "read" - r
        'S': 'i', // as in "sea" - s
        'SH': 'i', // as in "she" - ʃ
        'T': 'e', // as in "tea" - t
        'TH': 'i', // as in "theta" - θ
        'UH': 'u', // as in "hood" - ʊ
        'UW': 'u', // as in "two" - u
        'V': 'e', // as in "vee" - v
        'W': 'u', // as in "we" - w
        'Y': 'i', // as in "yield" - j
        'Z': 'i', // as in "zee" - z
        'ZH': 'i', // as in "seizure" - ʒ
      };
      
      // Track boundary events to get timing information
      utterance.onboundary = (event) => {
        if (event.name === 'word' || event.name === 'sentence') {
          const charIndex = event.charIndex;
          const charLength = event.charLength || 1;
          const word = text.substr(charIndex, charLength);
          const syllableCount = this.estimateSyllables(word);
          
          if (syllableCount > 0) {
            const syllableDuration = 150; // Average syllable duration in ms
            let currentTime = startTime;
            
            for (let i = 0; i < syllableCount; i++) {
              // Determine viseme based on vowel sounds in the word
              let viseme = 'a'; // default
              const lowerWord = word.toLowerCase();
              
              // Simple vowel detection for viseme selection
              if (lowerWord.includes('a')) viseme = 'a';
              else if (lowerWord.includes('e')) viseme = 'e';
              else if (lowerWord.includes('i')) viseme = 'i';
              else if (lowerWord.includes('o')) viseme = 'o';
              else if (lowerWord.includes('u')) viseme = 'u';
              
              visemeData.push({
                viseme,
                start: currentTime,
                end: currentTime + syllableDuration
              });
              
              currentTime += syllableDuration;
            }
            
            startTime = currentTime + 50; // Add a small pause between words
          }
        }
      };
      
      utterance.onend = () => {
        if (visemeData.length === 0) {
          // If we didn't get any boundary events, fall back to synthetic generation
          resolve(this.generateSyntheticVisemeData(text));
        } else {
          resolve(visemeData);
        }
        
        // Cancel the speech synthesis to avoid actually speaking
        window.speechSynthesis.cancel();
      };
      
      utterance.onerror = (event) => {
        reject(new Error(`Speech synthesis error: ${event.error}`));
        window.speechSynthesis.cancel();
      };
      
      // Start the speech synthesis but don't actually speak
      utterance.volume = 0;
      window.speechSynthesis.speak(utterance);
    });
  }
  // Browser-compatible methods only
  
  /**
   * Generate synthetic viseme data as a fallback
   * This method is more deterministic than random for consistent results
   */
  private generateSyntheticVisemeData(text: string): Array<{ viseme: string, start: number, end: number }> {
    const visemeData: Array<{ viseme: string, start: number, end: number }> = [];
    const words = text.split(' ');
    const avgSyllableDuration = 150;
    let currentTime = 0;
    
    words.forEach(word => {
      const syllableCount = this.estimateSyllables(word);
      const lowerWord = word.toLowerCase();
      
      // Try to assign visemes based on vowels in the word for more natural results
      let wordVisemes: string[] = [];
      
      // Extract vowels from the word
      const vowels = lowerWord.match(/[aeiouy]/g) || [];
      
      if (vowels.length > 0) {
        // Use actual vowels from the word
        wordVisemes = vowels.map(v => {
          if ('aA'.includes(v)) return 'a';
          if ('eE'.includes(v)) return 'e';
          if ('iIyY'.includes(v)) return 'i';
          if ('oO'.includes(v)) return 'o';
          if ('uU'.includes(v)) return 'u';
          return 'a'; // Default
        });
      } else {
        // No vowels found, use default
        wordVisemes = ['a'];
      }
      
      // Ensure we have enough visemes for all syllables
      while (wordVisemes.length < syllableCount) {
        wordVisemes.push(wordVisemes[wordVisemes.length - 1] || 'a');
      }
      
      // Trim if we have too many
      wordVisemes = wordVisemes.slice(0, syllableCount);
      
      // Add visemes with timing
      for (let i = 0; i < syllableCount; i++) {
        visemeData.push({
          viseme: wordVisemes[i],
          start: currentTime,
          end: currentTime + avgSyllableDuration
        });
        currentTime += avgSyllableDuration;
      }
      
      // Add a small pause between words
      currentTime += 50;
    });
    
    return visemeData;
  }
  
  /**
   * Very simple syllable estimator
   */
  private estimateSyllables(word: string): number {
    // Count vowels as a rough approximation of syllables
    const vowels = word.toLowerCase().match(/[aeiouy]/g);
    return vowels ? vowels.length : 1;
  }
}

export default new GroqService();
