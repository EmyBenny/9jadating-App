import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, ChatMessage, VoiceNoteData } from '../../types';
import { 
  ArrowLeft, MoreVertical, Send, Image as ImageIcon, 
  CheckCheck, Check, ShieldAlert, UserX, AlertTriangle, 
  Mic, Square, Play, Pause, Reply, Sparkles, Smile, X, 
  CheckCircle2 
} from 'lucide-react';

interface ChatRoomProps {
  currentUser: UserProfile;
  matchedUser: UserProfile;
  messages: ChatMessage[];
  onSendMessage: (text: string, photoUrl?: string, voiceNote?: VoiceNoteData, replyTo?: ChatMessage['replyTo']) => void;
  onBack: () => void;
  onOpenUnmatch: (user: UserProfile) => void;
  onReport: (user: UserProfile) => void;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({
  currentUser,
  matchedUser,
  messages,
  onSendMessage,
  onBack,
  onOpenUnmatch,
  onReport,
}) => {
  const [inputText, setInputText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [showIcebreakers, setShowIcebreakers] = useState(false);
  const [reactionsByMessageId, setReactionsByMessageId] = useState<Record<string, string>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isRecordingVoice]);

  // Voice recording timer
  useEffect(() => {
    if (isRecordingVoice) {
      setRecordingDuration(0);
      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecordingVoice]);

  const handleSendText = () => {
    if (!inputText.trim()) return;
    const textToSend = inputText.trim();
    setInputText('');
    
    const replyPayload = replyingTo ? {
      id: replyingTo.id,
      text: replyingTo.text,
      senderName: replyingTo.senderId === 'me' ? 'You' : matchedUser.name,
    } : undefined;

    setReplyingTo(null);
    onSendMessage(textToSend, undefined, undefined, replyPayload);

    // Simulate realistic Nigerian conversational response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const naijaResponses = [
        "How far nau! My day has been mad busy with Lagos traffic 😂",
        "Ah sharp! You sabi vibe well well ✨",
        "Haha no cap! Amala Shitta is undisputed on the mainland.",
        "What time are you free this weekend? We can grab coffee in Lekki.",
        "No dulling! Send me that your favorite playlist on Apple/Spotify.",
      ];
      const randomReply = naijaResponses[Math.floor(Math.random() * naijaResponses.length)];
      onSendMessage(randomReply);
    }, 1800);
  };

  const handleFinishVoiceRecord = () => {
    setIsRecordingVoice(false);
    const duration = Math.max(recordingDuration, 3);
    onSendMessage(
      '🎙️ Voice note',
      undefined,
      {
        audioUrl: 'simulated_audio_note.mp3',
        durationSeconds: duration,
      },
      replyingTo ? { id: replyingTo.id, text: replyingTo.text, senderName: matchedUser.name } : undefined
    );
    setReplyingTo(null);

    // Simulate voice reply
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        onSendMessage(
          '🎙️ Voice reply',
          undefined,
          {
            audioUrl: 'matched_user_voice.mp3',
            durationSeconds: 7,
          }
        );
      }, 2000);
    }, 1000);
  };

  const handleSendSamplePhoto = () => {
    const samplePhotos = [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    ];
    const chosen = samplePhotos[Math.floor(Math.random() * samplePhotos.length)];
    onSendMessage('Checked out this spot today! Thought you might like it ✨', chosen);
  };

  const toggleVoicePlayback = (msgId: string) => {
    if (playingVoiceId === msgId) {
      setPlayingVoiceId(null);
    } else {
      setPlayingVoiceId(msgId);
      setTimeout(() => {
        setPlayingVoiceId(null);
      }, 5000);
    }
  };

  const handleAddReaction = (msgId: string, emoji: string) => {
    setReactionsByMessageId((prev) => ({
      ...prev,
      [msgId]: prev[msgId] === emoji ? '' : emoji,
    }));
  };

  const icebreakerPrompts = [
    'Third mainland bridge or Lekki-Ikoyi link bridge traffic?',
    'What’s your holy grail Amala or Suya spot in Lagos/Abuja?',
    'What song is on repeat in your headphones right now?',
    'Cold stone or palmwine & peppersoup date?',
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 overflow-hidden relative">
      {/* Top Header */}
      <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 -ml-1 text-slate-400 hover:text-white rounded-lg transition-colors"
            aria-label="Back to messages"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* User Avatar + Status */}
          <div className="relative">
            <img
              src={matchedUser.photos[0]}
              alt={matchedUser.name}
              className="w-10 h-10 rounded-full object-cover border border-slate-700"
              referrerPolicy="no-referrer"
            />
            {matchedUser.isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-white tracking-tight leading-none">
                {matchedUser.name}
              </h3>
              {matchedUser.verified && (
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {matchedUser.isOnline ? 'Active now' : (matchedUser.lastSeen || 'Offline')} · {matchedUser.location.city}
            </p>
          </div>
        </div>

        {/* Action Menu Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
            aria-label="More actions"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-10 w-44 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
              <button
                onClick={() => {
                  setShowMenu(false);
                  onOpenUnmatch(matchedUser);
                }}
                className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-rose-400 flex items-center gap-2"
              >
                <UserX className="w-3.5 h-3.5" />
                <span>Unmatch with Reason</span>
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  onReport(matchedUser);
                }}
                className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-slate-800 flex items-center gap-2"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Report or Block</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Naija Safety Banner */}
      <div className="bg-amber-950/40 border-b border-amber-900/30 px-4 py-1.5 flex items-center justify-between text-[11px] text-amber-300/90 shrink-0">
        <div className="flex items-center gap-2 truncate">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate">Safety Rule: Never send money or crypto to matches.</span>
        </div>
        <button
          onClick={() => setShowIcebreakers(!showIcebreakers)}
          className="text-orange-400 hover:text-orange-300 font-bold shrink-0 ml-2 flex items-center gap-1"
        >
          <Sparkles className="w-3 h-3" />
          <span>Icebreakers</span>
        </button>
      </div>

      {/* Icebreaker Drawers */}
      {showIcebreakers && (
        <div className="p-3 bg-slate-900/95 border-b border-slate-800 space-y-1.5 animate-in slide-in-from-top duration-200 shrink-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Suggested Naija Icebreakers
          </span>
          <div className="grid grid-cols-1 gap-1.5">
            {icebreakerPrompts.map((ib, i) => (
              <button
                key={i}
                onClick={() => {
                  setInputText(ib);
                  setShowIcebreakers(false);
                }}
                className="text-left text-xs bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white px-3 py-1.5 rounded-xl border border-slate-700/60 transition-colors"
              >
                {ib}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Match Header Teaser */}
        <div className="text-center py-4 text-xs text-slate-400">
          <p>You matched with <strong className="text-slate-200">{matchedUser.name}</strong></p>
          <span className="text-[10px] text-slate-400">End-to-end encrypted connection</span>
        </div>

        {messages.map((msg) => {
          const isMe = msg.senderId === 'me' || msg.senderId === currentUser.id;
          const currentReaction = reactionsByMessageId[msg.id];

          return (
            <div
              key={msg.id}
              className={`flex flex-col group relative ${isMe ? 'items-end' : 'items-start'}`}
            >
              {/* Reply Reference Bubble */}
              {msg.replyTo && (
                <div className={`text-[10px] text-slate-400 px-3 py-1 rounded-t-xl mb-0.5 border border-slate-700/40 bg-slate-900/70 max-w-[70%] truncate ${isMe ? 'text-right' : 'text-left'}`}>
                  Replying to <span className="text-orange-400 font-semibold">{msg.replyTo.senderName}:</span> {msg.replyTo.text}
                </div>
              )}

              <div
                className={`relative max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                  isMe
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-br-xs'
                    : 'bg-slate-800 text-slate-100 rounded-bl-xs border border-slate-700/60'
                }`}
              >
                {/* Photo attachment if available */}
                {msg.photoUrl && (
                  <div className="mb-2 rounded-xl overflow-hidden border border-black/20">
                    <img
                      src={msg.photoUrl}
                      alt="Shared media"
                      className="w-full max-h-48 object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                {/* Voice Note Bubble */}
                {msg.voiceNote ? (
                  <div className="flex items-center gap-3 py-1 min-w-[180px]">
                    <button
                      onClick={() => toggleVoicePlayback(msg.id)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                        isMe ? 'bg-white text-orange-600' : 'bg-orange-600 text-white'
                      }`}
                    >
                      {playingVoiceId === msg.id ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </button>

                    {/* Audio Waveform Bars Simulation */}
                    <div className="flex-1 flex items-center gap-0.5 h-6">
                      {[40, 70, 30, 90, 60, 100, 40, 80, 50, 75, 35, 95].map((h, idx) => (
                        <div
                          key={idx}
                          className={`w-1 rounded-full transition-all ${
                            playingVoiceId === msg.id ? 'bg-amber-300 animate-pulse' : isMe ? 'bg-white/70' : 'bg-slate-400'
                          }`}
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>

                    <span className="text-[11px] font-mono tabular-nums shrink-0">
                      0:{msg.voiceNote.durationSeconds < 10 ? `0${msg.voiceNote.durationSeconds}` : msg.voiceNote.durationSeconds}
                    </span>
                  </div>
                ) : (
                  <p>{msg.text}</p>
                )}

                {/* Displayed Emoji Reaction */}
                {currentReaction && (
                  <div className="absolute -bottom-2 right-2 bg-slate-900 border border-slate-700 rounded-full px-1.5 py-0.2 text-xs shadow-md">
                    {currentReaction}
                  </div>
                )}
              </div>

              {/* Timestamp, Delivery Receipt, & Hover Actions */}
              <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 px-1">
                <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                
                {isMe && (
                  msg.status === 'read' ? (
                    <span className="flex items-center text-amber-400 font-bold" title="Read">
                      <CheckCheck className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <Check className="w-3 h-3 text-slate-400" />
                  )
                )}

                {/* Quick Action Reactions Strip */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-slate-900/90 rounded-full px-1.5 py-0.5 border border-slate-800">
                  <button
                    onClick={() => setReplyingTo(msg)}
                    className="hover:text-white p-0.5"
                    title="Reply to message"
                  >
                    <Reply className="w-3 h-3" />
                  </button>
                  {['❤️', '😂', '🔥'].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleAddReaction(msg.id, emoji)}
                      className="hover:scale-125 transition-transform text-[11px]"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 italic">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
            <span>{matchedUser.name} dey type...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Reply Quote Banner */}
      {replyingTo && (
        <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300 shrink-0">
          <div className="flex items-center gap-2 truncate">
            <Reply className="w-4 h-4 text-orange-400 shrink-0" />
            <span className="truncate">
              Replying to <strong className="text-white">{replyingTo.senderId === 'me' ? 'yourself' : matchedUser.name}</strong>: "{replyingTo.text}"
            </span>
          </div>
          <button
            onClick={() => setReplyingTo(null)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Voice Recording Active Banner */}
      {isRecordingVoice ? (
        <div className="p-3 bg-rose-950/60 border-t border-rose-900/80 flex items-center justify-between shrink-0 animate-in fade-in">
          <div className="flex items-center gap-2 text-rose-300 text-xs font-semibold">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
            <span>Recording Voice Note... 0:{recordingDuration < 10 ? `0${recordingDuration}` : recordingDuration}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRecordingVoice(false)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs text-slate-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleFinishVoiceRecord}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Voice</span>
            </button>
          </div>
        </div>
      ) : (
        /* Standard Input Bar */
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2 shrink-0">
          <button
            onClick={handleSendSamplePhoto}
            className="p-2 text-slate-400 hover:text-orange-400 rounded-xl hover:bg-slate-800 transition-colors"
            title="Share Photo"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsRecordingVoice(true)}
            className="p-2 text-slate-400 hover:text-orange-400 rounded-xl hover:bg-slate-800 transition-colors"
            title="Record Voice Note"
          >
            <Mic className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message ${matchedUser.name}...`}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendText();
            }}
          />

          <button
            onClick={handleSendText}
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 text-white disabled:opacity-40 disabled:pointer-events-none hover:brightness-110 active:scale-95 transition-all shadow-md"
            title="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
