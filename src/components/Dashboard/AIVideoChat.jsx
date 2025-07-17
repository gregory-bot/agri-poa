import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Video, VideoOff, Mic, MicOff, Send, Phone, User } from 'lucide-react';
import { chatModel } from '../../config/gemini';

const AIVideoChat = ({ language }) => {
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isAITalking, setIsAITalking] = useState(false);
  const userVideoRef = useRef(null);
  const aiVideoRef = useRef(null);
  const streamRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const recognitionRef = useRef(null);

  const aiAvatarVideos = {
    idle: 'https://www.w3schools.com/html/mov_bbb.mp4',
    talking: 'https://www.w3schools.com/html/movie.mp4'
  };

  useEffect(() => {
    setMessages([{
      id: 1,
      sender: 'ai',
      content: getWelcomeMessage(),
      timestamp: new Date()
    }]);

    if (aiVideoRef.current) {
      aiVideoRef.current.src = aiAvatarVideos.idle;
      aiVideoRef.current.loop = true;
      aiVideoRef.current.play().catch(e => console.log('Video play error:', e));
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (synthRef.current.speaking) {
        synthRef.current.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language]);

  const getWelcomeMessage = () => {
    switch (language) {
      case 'sw':
        return 'Habari! Mimi ni mshauri wa kilimo wa AI. Ninaweza kukusaidia na maswali yako ya kilimo, magonjwa ya mazao, na afya ya wanyamapori. Ni nini naweza kukusaidia leo?';
      case 'ki':
        return 'Wĩ mwega! Nĩ niĩ mũtaari wa ũrĩmi wa AI. Nĩndĩrakũteithia na ciũria ciaku cia ũrĩmi, mĩrimũ ya irio, na ũgima wa nyamũ. Nĩ atĩa ingĩkũteithia ũmũthĩ?';
      default:
        return 'Hello! I\'m your AI agriculture consultant. How can I assist you today?';
    }
  };

  const startVideoChat = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = stream;
      }

      setIsVideoOn(true);
      setIsMicOn(true);
      setIsConnected(true);

      speakMessage(getWelcomeMessage());
      startVoiceRecognition();
    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Could not access camera/microphone. Please check permissions.');
    }
  };

  const startVoiceRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'sw' ? 'sw-KE' : language === 'ki' ? 'en-KE' : 'en-US';
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      sendMessage(transcript);
    };

    recognition.onerror = (e) => console.error('Recognition error:', e);
    recognition.onend = () => recognition.start();

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopVideoChat = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (synthRef.current.speaking) {
      synthRef.current.cancel();
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsVideoOn(false);
    setIsMicOn(false);
    setIsConnected(false);
    setIsAITalking(false);
    if (aiVideoRef.current) {
      aiVideoRef.current.src = aiAvatarVideos.idle;
    }
  };

  const speakMessage = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'sw' ? 'sw-KE' : language === 'ki' ? 'en-KE' : 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    if (aiVideoRef.current) {
      aiVideoRef.current.src = aiAvatarVideos.talking;
      aiVideoRef.current.loop = true;
      aiVideoRef.current.play().catch(e => console.log('Video play error:', e));
      setIsAITalking(true);
    }

    utterance.onend = () => {
      setIsAITalking(false);
      if (aiVideoRef.current) {
        aiVideoRef.current.src = aiAvatarVideos.idle;
        aiVideoRef.current.loop = true;
        aiVideoRef.current.play().catch(e => console.log('Video play error:', e));
      }
    };

    synthRef.current.speak(utterance);
  };

  const sendMessage = async (message) => {
    if (!message.trim()) return;

    const userMessage = { id: Date.now(), sender: 'user', content: message, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const prompt = `You are an AI agricultural expert. Respond to this: "${message}". Give helpful advice about crops, animals, or AgriPoa features. Language: ${language}`;
      const result = await chatModel.generateContent(prompt);
      const aiResponse = result.response.text();

      const aiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      speakMessage(aiResponse);
    } catch (error) {
      console.error('AI error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center">AI Video Chat</h2>

      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video">
          <video ref={userVideoRef} autoPlay muted className="w-full h-full object-cover" />
          <div className="absolute top-4 right-4 w-32 h-32 rounded-lg overflow-hidden border-2">
            <video ref={aiVideoRef} autoPlay muted className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="flex flex-col h-[500px] bg-white rounded-xl border p-4">
          <div className="flex-1 overflow-y-auto space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`text-sm ${msg.sender === 'ai' ? 'text-left' : 'text-right'}`}>
                <div className={`inline-block px-4 py-2 rounded-lg ${msg.sender === 'ai' ? 'bg-gray-100' : 'bg-green-500 text-white'}`}>
                  <p>{msg.content}</p>
                </div>
              </div>
            ))}
            {isTyping && <p className="text-gray-500">AI is typing...</p>}
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-4 gap-3">
        <button onClick={startVideoChat} className="bg-green-500 text-white px-4 py-2 rounded-lg">Start</button>
        <button onClick={stopVideoChat} className="bg-red-500 text-white px-4 py-2 rounded-lg">End</button>
      </div>
    </div>
  );
};

export default AIVideoChat;
