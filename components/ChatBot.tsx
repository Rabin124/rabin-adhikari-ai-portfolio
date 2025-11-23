import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles, Smile, Paperclip, BookOpen, Trash2 } from 'lucide-react';
import { Chat, GenerateContentResponse, Part } from "@google/genai";
import { createPortfolioChatSession } from '../services/gemini';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string; // base64
}

const INITIAL_MESSAGE: Message = { 
  id: 'welcome', 
  role: 'model', 
  text: "Hi! I'm Rabin Assistant. Ask me anything about the developer's projects or skills, or ask for a story about a project!" 
};

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  // Refs
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const EMOJIS = ['😀', '😂', '😎', '🚀', '💻', '📱', '🤖', '🔥', '✨', '🎉', '👍', '🤔', '👀', '❤️', '✅', '🐛', '🎨', '📝', '⚡', '👋'];

  useEffect(() => {
    // Initialize chat session when component mounts
    chatSessionRef.current = createPortfolioChatSession();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, selectedImage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddEmoji = (emoji: string) => {
    setInputText(prev => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const handleClearChat = () => {
    // Reset UI State
    setMessages([INITIAL_MESSAGE]);
    setInputText('');
    setSelectedImage(null);
    setShowEmojiPicker(false);
    
    // Reset AI Session to clear context
    chatSessionRef.current = createPortfolioChatSession();
  };

  const handleStoryMode = () => {
    setInputText("Tell me a creative, behind-the-scenes story about the development journey of one of the projects.");
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if ((!inputText.trim() && !selectedImage) || !chatSessionRef.current) return;

    const currentInput = inputText;
    const currentImage = selectedImage;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: currentInput,
      image: currentImage || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      let result;
      
      // Prepare message parts
      const parts: (string | Part)[] = [];
      if (currentInput) parts.push({ text: currentInput });
      if (currentImage) {
        // Extract base64 data (remove data:image/png;base64, prefix)
        const base64Data = currentImage.split(',')[1];
        const mimeType = currentImage.split(';')[0].split(':')[1];
        
        parts.push({
          inlineData: {
            mimeType: mimeType,
            data: base64Data
          }
        });
      }

      // If parts has only text, send string, otherwise send parts array as message
      // The updated Gemini API allows message to be string | Part[]
      const messagePayload = parts.length === 1 && 'text' in (parts[0] as any) 
        ? (parts[0] as any).text 
        : parts;

      result = await chatSessionRef.current.sendMessageStream({
         message: messagePayload
      });

      // Create a placeholder for the model response
      const modelMessageId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: modelMessageId, role: 'model', text: '' }]);

      let fullText = '';
      
      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        const text = c.text;
        if (text) {
          fullText += text;
          setMessages(prev => 
            prev.map(msg => 
              msg.id === modelMessageId ? { ...msg, text: fullText } : msg
            )
          );
        }
      }

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'model', 
        text: "I'm having trouble connecting right now. Please check your internet connection." 
      }]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-android-500/30 ${
          isOpen 
            ? 'bg-red-500 text-white rotate-90' 
            : 'bg-android-600 text-white hover:bg-android-500'
        }`}
        aria-label="Toggle Chat"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-3rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col transition-all duration-300 origin-bottom-right ${
        isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10 pointer-events-none'
      }`} style={{ height: '550px', maxHeight: '70vh' }}>
        
        {/* Header */}
        <div className="bg-android-600 p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full relative">
              <Sparkles className="text-white w-5 h-5" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-300"></span>
              </span>
            </div>
            <div>
              <h3 className="text-white font-bold">Rabin Assistant</h3>
              <p className="text-android-100 text-xs">Interactive & Storyteller</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button 
               onClick={handleClearChat}
               className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
               title="Clear Chat"
            >
               <Trash2 size={20} />
            </button>
            <button 
               onClick={handleStoryMode}
               className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
               title="Tell me a story"
            >
               <BookOpen size={20} />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                msg.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' 
                  ? 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300' 
                  : 'bg-android-100 dark:bg-android-900 text-android-600 dark:text-android-400'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              
              <div className="max-w-[80%] flex flex-col gap-2">
                 {msg.image && (
                   <img src={msg.image} alt="Upload" className="rounded-lg max-w-full h-auto border border-slate-200 dark:border-slate-700 shadow-sm" />
                 )}
                 {msg.text && (
                    <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        msg.role === 'user'
                        ? 'bg-android-600 text-white rounded-tr-none'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none'
                    }`}>
                        {msg.text}
                    </div>
                 )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-android-100 dark:bg-android-900 text-android-600 dark:text-android-400 flex items-center justify-center flex-shrink-0">
                <Bot size={16} />
              </div>
              <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-700 shadow-sm">
                <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Image Preview */}
        {selectedImage && (
          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between animate-slide-up">
            <div className="flex items-center gap-2">
              <img src={selectedImage} alt="Preview" className="h-12 w-12 object-cover rounded-md border border-slate-300 dark:border-slate-600" />
              <span className="text-xs text-slate-500 dark:text-slate-400">Image attached</span>
            </div>
            <button onClick={() => setSelectedImage(null)} className="text-slate-400 hover:text-red-500">
              <X size={16} />
            </button>
          </div>
        )}

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 relative">
          
          {/* Emoji Picker Popover */}
          {showEmojiPicker && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowEmojiPicker(false)}></div>
              <div className="absolute bottom-16 left-4 z-20 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-xl p-3 w-64 grid grid-cols-5 gap-2 animate-fade-in">
                {EMOJIS.map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => handleAddEmoji(emoji)}
                    className="text-xl hover:bg-slate-100 dark:hover:bg-slate-700 rounded p-1 transition"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="flex items-center gap-2">
             {/* File Input */}
             <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-slate-400 hover:text-android-600 dark:hover:text-android-400 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Upload Image"
            >
              <Paperclip size={20} />
            </button>

            {/* Emoji Toggle */}
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 text-slate-400 hover:text-yellow-500 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Add Emoji"
            >
              <Smile size={20} />
            </button>

            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Message..."
                className="w-full bg-slate-100 dark:bg-slate-800 border-0 rounded-full px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-android-500 focus:outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={(!inputText.trim() && !selectedImage) || isLoading}
              className="p-3 bg-android-600 text-white rounded-full hover:bg-android-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ChatBot;