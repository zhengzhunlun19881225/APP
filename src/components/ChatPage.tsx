import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  MoreHorizontal,
  Volume2,
  Smile,
  Plus,
  Mic,
  Image as ImageIcon,
  Camera,
  FileText,
  Pause,
  Send,
  X,
  FileDown,
  MapPin,
  Share2,
  Copy,
  Trash2,
  RotateCcw,
  CheckSquare,
  Square,
  Bookmark,
  Layers,
  Check,
  MessageSquare,
  Phone,
  Video,
  PhoneIncoming,
  PhoneCall,
  Users,
  Sparkles
} from 'lucide-react';
import { ChatMessage, MessageItem } from '../types';
import { Avatar } from './Avatar';
import { initialSingleChatMessages, initialGroupChatMessages } from '../data/mockData';
import {
  getStoredChatHistory,
  appendMessagesToStoredChat,
  forwardMessagesToStoredTargets,
  subscribeChatStorage
} from '../data/chatStorage';
import { ChatSettingsPage } from './ChatSettingsPage';
import { LocationPickerModal, LocationItem } from './LocationPickerModal';
import { ForwardModal } from './ForwardModal';
import { ForwardTargetItem } from '../data/forwardData';
import { CallSession, CallType, CallRole } from './CallModal';
import { FavoritesPage, FavoriteItem } from './FavoritesPage';

interface ChatPageProps {
  chatInfo: MessageItem;
  onBack: () => void;
  onStartCall?: (session: CallSession) => void;
  onForwardComplete?: (targetNames: string[], lastMessageText: string, targetObjects?: ForwardTargetItem[]) => void;
  onSwitchChat?: (chatName: string) => void;
}

export const ChatPage: React.FC<ChatPageProps> = ({
  chatInfo,
  onBack,
  onStartCall,
  onForwardComplete,
  onSwitchChat
}) => {
  const isGroup = chatInfo.isGroup || false;

  // Retrieve messages from central chat storage
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    getStoredChatHistory(
      chatInfo.name,
      chatInfo.isGroup,
      chatInfo.avatar,
      chatInfo.avatarType,
      chatInfo.gridAvatars
    )
  );

  // Keep messages in sync when active chat changes or when storage updates
  useEffect(() => {
    setMessages(
      getStoredChatHistory(
        chatInfo.name,
        chatInfo.isGroup,
        chatInfo.avatar,
        chatInfo.avatarType,
        chatInfo.gridAvatars
      )
    );
  }, [chatInfo.id, chatInfo.name, chatInfo.avatar, chatInfo.avatarType, chatInfo.isGroup]);

  useEffect(() => {
    const unsubscribe = subscribeChatStorage(() => {
      setMessages([
        ...getStoredChatHistory(
          chatInfo.name,
          chatInfo.isGroup,
          chatInfo.avatar,
          chatInfo.avatarType,
          chatInfo.gridAvatars
        )
      ]);
    });
    return unsubscribe;
  }, [chatInfo.name, chatInfo.isGroup]);

  const [showSettings, setShowSettings] = useState(false);

  const [inputText, setInputText] = useState('');
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showPlusPanel, setShowPlusPanel] = useState(false);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showFavoritesPicker, setShowFavoritesPicker] = useState(false);

  // Forwarding and Message Management States
  const [activeContextMenuMsgId, setActiveContextMenuMsgId] = useState<string | null>(null);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [selectedMsgIds, setSelectedMsgIds] = useState<string[]>([]);
  const [forwardModalState, setForwardModalState] = useState<{
    isOpen: boolean;
    messages: ChatMessage[];
    isMerge: boolean;
  }>({
    isOpen: false,
    messages: [],
    isMerge: false
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [viewingMergedRecord, setViewingMergedRecord] = useState<ChatMessage | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (text: string) => {
    setToastMessage(text);
    setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showEmojiPicker, showPlusPanel]);

  // Handle Voice Playback Simulation
  const handlePlayVoice = (msgId: string) => {
    if (playingVoiceId === msgId) {
      setPlayingVoiceId(null);
    } else {
      setPlayingVoiceId(msgId);
      setTimeout(() => {
        setPlayingVoiceId(null);
      }, 3000);
    }
  };

  const [showCallOptionModal, setShowCallOptionModal] = useState(false);

  // Start Call Handler
  const handleInitiateCall = (type: CallType, role: CallRole = 'outgoing', customMeetingTitle?: string) => {
    setShowCallOptionModal(false);
    setShowPlusPanel(false);

    const newSession: CallSession = {
      id: `call_${Date.now()}`,
      type,
      role,
      status: role === 'outgoing' ? 'calling' : 'ringing',
      targetName: chatInfo.name || '常琼艳',
      targetAvatar:
        chatInfo.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      meetingTitle: customMeetingTitle || '部门周例会',
      meetingTime: '今天 14:00'
    };

    if (onStartCall) {
      onStartCall(newSession);
    }
  };

  // Generic Send Message function
  const sendMessage = (
    type: 'text' | 'image' | 'voice' | 'file' | 'location' | 'merged_record' | 'call',
    content: string,
    extra?: {
      fileName?: string;
      fileSize?: string;
      audioDuration?: number;
      callType?: 'audio' | 'video' | 'meeting';
      callDuration?: number;
      callState?: 'completed' | 'cancelled' | 'rejected' | 'missed';
      mergedRecords?: ChatMessage['mergedRecords'];
    }
  ) => {
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      senderId: 'user_me',
      senderName: '我',
      senderAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
      type,
      content,
      fileName: extra?.fileName,
      fileSize: extra?.fileSize,
      audioDuration: extra?.audioDuration,
      callType: extra?.callType,
      callDuration: extra?.callDuration,
      callState: extra?.callState,
      mergedRecords: extra?.mergedRecords,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      isSelf: true,
      status: 'unread'
    };

    setMessages((prev) => [...prev, newMsg]);
    appendMessagesToStoredChat(chatInfo.name, [newMsg]);

    // Simulate auto-read after 2 seconds
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === newMsg.id ? { ...m, status: 'read' } : m))
      );
    }, 2000);

    // Simulate contact response
    setTimeout(() => {
      const replies = isGroup
        ? [
            { name: '荆宁若', text: '收到，我来看下！', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
            { name: '谷菲婷', text: '完全赞同，这个设计非常清晰！', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80' }
          ]
        : [
            { name: chatInfo.name, text: '好的，收到！', avatar: chatInfo.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80' }
          ];

      const replyChoice = replies[Math.floor(Math.random() * replies.length)];

      const replyMsg: ChatMessage = {
        id: `reply_${Date.now()}`,
        senderId: 'contact_reply',
        senderName: replyChoice.name,
        senderAvatar: replyChoice.avatar,
        type: 'text',
        content: replyChoice.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        isSelf: false
      };

      setMessages((prev) => [...prev, replyMsg]);
      appendMessagesToStoredChat(chatInfo.name, [replyMsg]);
    }, 1600);
  };

  const handleSendText = () => {
    if (!inputText.trim()) return;
    sendMessage('text', inputText.trim());
    setInputText('');
    setShowEmojiPicker(false);
  };

  // Photo / Image Selection
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          sendMessage('image', event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
    setShowPlusPanel(false);
  };

  // File Selection
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileSizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      sendMessage('file', file.name, {
        fileName: file.name,
        fileSize: fileSizeMb
      });
    }
    setShowPlusPanel(false);
  };

  // Camera Shot Simulation
  const handleCameraCapture = () => {
    const cameraPhotos = [
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80'
    ];
    const photo = cameraPhotos[Math.floor(Math.random() * cameraPhotos.length)];
    sendMessage('image', photo);
    setShowPlusPanel(false);
  };

  // Voice Message Send Simulation
  const handleSendVoice = () => {
    sendMessage('voice', '语音消息', { audioDuration: Math.floor(Math.random() * 8) + 3 });
    setShowPlusPanel(false);
  };

  // Long press / Context menu handling
  const handleTouchStart = (msgId: string) => {
    if (isMultiSelectMode) return;
    longPressTimerRef.current = setTimeout(() => {
      setActiveContextMenuMsgId(msgId);
    }, 450);
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, msgId: string) => {
    e.preventDefault();
    if (isMultiSelectMode) return;
    setActiveContextMenuMsgId(msgId);
  };

  // Message Actions
  const handleCopyMessage = (msg: ChatMessage) => {
    if (msg.type === 'text') {
      navigator.clipboard?.writeText(msg.content);
      showToast('已复制到剪贴板');
    } else {
      showToast('已复制内容');
    }
    setActiveContextMenuMsgId(null);
  };

  const handleFavoriteMessage = () => {
    showToast('已添加到收藏');
    setActiveContextMenuMsgId(null);
  };

  const handleRecallMessage = (msg: ChatMessage) => {
    setMessages((prev) => prev.filter((m) => m.id !== msg.id));
    if (msg.type === 'text') {
      setInputText(msg.content);
    }
    showToast('已撤回消息');
    setActiveContextMenuMsgId(null);
  };

  const handleDeleteSingle = (msgId: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== msgId));
    showToast('已删除消息');
    setActiveContextMenuMsgId(null);
  };

  // Trigger Forward for single message
  const handleTriggerSingleForward = (msg: ChatMessage) => {
    setActiveContextMenuMsgId(null);
    setForwardModalState({
      isOpen: true,
      messages: [msg],
      isMerge: false
    });
  };

  // Multi-Select Message Operations
  const handleStartMultiSelect = (initialId?: string) => {
    setActiveContextMenuMsgId(null);
    setIsMultiSelectMode(true);
    setSelectedMsgIds(initialId ? [initialId] : []);
  };

  const handleToggleSelectMsg = (msgId: string) => {
    if (selectedMsgIds.includes(msgId)) {
      setSelectedMsgIds(selectedMsgIds.filter((id) => id !== msgId));
    } else {
      setSelectedMsgIds([...selectedMsgIds, msgId]);
    }
  };

  const handleBatchDelete = () => {
    if (selectedMsgIds.length === 0) return;
    setMessages((prev) => prev.filter((m) => !selectedMsgIds.includes(m.id)));
    showToast(`已删除 ${selectedMsgIds.length} 条消息`);
    setIsMultiSelectMode(false);
    setSelectedMsgIds([]);
  };

  const handleForwardOneByOne = () => {
    if (selectedMsgIds.length === 0) return;
    const selectedMsgs = messages.filter((m) => selectedMsgIds.includes(m.id));
    setForwardModalState({
      isOpen: true,
      messages: selectedMsgs,
      isMerge: false
    });
  };

  const handleForwardMerged = () => {
    if (selectedMsgIds.length === 0) return;
    const selectedMsgs = messages.filter((m) => selectedMsgIds.includes(m.id));
    setForwardModalState({
      isOpen: true,
      messages: selectedMsgs,
      isMerge: true
    });
  };

  // Confirm and Execute Forward
  const handleConfirmForward = (
    targetChatNames: string[],
    forwardComment: string,
    forwardedMsgs: ChatMessage[],
    isMerge: boolean,
    targetObjects?: ForwardTargetItem[]
  ) => {
    setForwardModalState({ isOpen: false, messages: [], isMerge: false });
    setIsMultiSelectMode(false);
    setSelectedMsgIds([]);

    const targetSummary = targetChatNames.join('、');
    showToast(`已成功转发给 ${targetSummary}`);

    // Persist and distribute forwarded messages to all targeted contacts or groups
    forwardMessagesToStoredTargets(targetChatNames, forwardedMsgs, forwardComment, isMerge);

    // Compute last message text summary for message list preview
    let summaryText = '[转发消息]';
    if (isMerge) {
      const senders = Array.from(new Set(forwardedMsgs.map((m) => m.senderName))).join('、');
      summaryText = `[聊天记录] ${senders} 的聊天记录`;
    } else if (forwardedMsgs.length === 1) {
      const msg = forwardedMsgs[0];
      if (msg.type === 'image') summaryText = '[图片]';
      else if (msg.type === 'file') summaryText = `[文件] ${msg.fileName || msg.content}`;
      else if (msg.type === 'voice') summaryText = '[语音]';
      else summaryText = msg.content;
    } else {
      summaryText = `[转发 ${forwardedMsgs.length} 条消息]`;
    }

    if (forwardComment.trim()) {
      summaryText = `${summaryText} ${forwardComment.trim()}`;
    }

    onForwardComplete?.(targetChatNames, summaryText, targetObjects);
  };

  // Emoji selection
  const emojis = ['😊', '😂', '👍', '❤️', '🎉', '🔥', '🙏', '👏', '🥳', '💡', '😮', '🚀', '🎁', '🌟', '👌', '🤝', '🙌', '💯'];

  if (showSettings) {
    return (
      <ChatSettingsPage
        chatInfo={chatInfo}
        onBack={() => setShowSettings(false)}
        onActionNotice={(msg) => showToast(msg)}
      />
    );
  }

  return (
    <div
      onClick={() => {
        if (activeContextMenuMsgId) setActiveContextMenuMsgId(null);
      }}
      className="flex flex-col h-full bg-[#f4f5f8] select-none relative overflow-hidden"
    >
      {/* Toast Alert Notice */}
      {toastMessage && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white text-xs px-4 py-2 rounded-full shadow-lg border border-slate-700 backdrop-blur-md flex items-center gap-1.5 animate-in fade-in zoom-in-95">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hidden Inputs for File/Photo selection */}
      <input
        type="file"
        ref={imageInputRef}
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Top Header Bar */}
      <div className="px-4 py-3 flex items-center justify-between bg-[#f4f5f8]/95 backdrop-blur-md sticky top-0 z-20 border-b border-slate-200/50">
        {isMultiSelectMode ? (
          <>
            <button
              onClick={() => {
                setIsMultiSelectMode(false);
                setSelectedMsgIds([]);
              }}
              className="text-[14px] text-slate-700 hover:text-slate-900 font-medium"
            >
              取消
            </button>
            <div className="text-center font-bold text-[16px] text-slate-900">
              已选择 {selectedMsgIds.length} 条
            </div>
            <button
              onClick={() => {
                if (selectedMsgIds.length === messages.length) {
                  setSelectedMsgIds([]);
                } else {
                  setSelectedMsgIds(messages.map((m) => m.id));
                }
              }}
              className="text-[14px] text-blue-600 font-medium"
            >
              {selectedMsgIds.length === messages.length ? '全不选' : '全选'}
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onBack}
              className="system-back-button"
            >
              <ChevronLeft />
            </button>

            <div className="text-center font-bold text-[17px] text-slate-900 truncate max-w-[200px]">
              {chatInfo.name}
            </div>

            {/* Header Right Action Buttons */}
            <div className="flex items-center gap-1">
              {/* Chat Settings */}
              <button
                onClick={() => setShowSettings(true)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-slate-700 hover:bg-slate-200/60 active:scale-95 transition-all cursor-pointer"
                title="聊天信息"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Message Stream Area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {/* Time Badge */}
        <div className="text-center my-2">
          <span className="text-[12px] text-slate-400 font-normal px-2.5 py-0.5 rounded-full bg-slate-200/50">
            14:28
          </span>
        </div>

        {messages.map((msg) => {
          const isSelected = selectedMsgIds.includes(msg.id);
          const showContextMenu = activeContextMenuMsgId === msg.id;

          return (
            <div
              key={msg.id}
              className="flex items-center gap-2.5 relative w-full"
            >
              {/* Multi-Select Checkbox strictly on Left */}
              {isMultiSelectMode && (
                <div
                  onClick={() => handleToggleSelectMsg(msg.id)}
                  className="cursor-pointer p-1 -ml-1 text-slate-400 hover:text-blue-600 transition-colors flex-shrink-0 self-center"
                >
                  {isSelected ? (
                    <CheckSquare className="w-5 h-5 text-blue-600 fill-blue-50" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-300" />
                  )}
                </div>
              )}

              <div
                className={`flex-1 flex flex-col relative ${
                  msg.isSelf ? 'items-end' : 'items-start'
                }`}
              >
                {/* Sender Name above avatar / message */}
                {!msg.isSelf && (
                  <span className="text-[12px] text-slate-400 mb-1 ml-11 font-normal">
                    {msg.senderName}
                  </span>
                )}

                <div
                  className={`flex items-start gap-2.5 max-w-[88%] ${
                    msg.isSelf ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {/* CIRCULAR Avatar */}
                  <Avatar
                    src={msg.senderAvatar}
                    name={msg.senderName}
                    avatarType={msg.avatarType}
                    gridAvatars={msg.gridAvatars}
                    size="sm"
                  />

                  {/* Message Bubble Content Wrapper */}
                  <div
                    onTouchStart={() => handleTouchStart(msg.id)}
                    onTouchEnd={handleTouchEnd}
                    onMouseDown={() => handleTouchStart(msg.id)}
                    onMouseUp={handleTouchEnd}
                    onContextMenu={(e) => handleContextMenu(e, msg.id)}
                    className="flex flex-col relative group cursor-pointer"
                  >
                    {/* Floating Context Action Menu Popover (微信/钉钉风格长按操作栏) */}
                    {showContextMenu && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className={`absolute -top-12 ${
                          msg.isSelf ? 'right-0' : 'left-0'
                        } z-40 bg-slate-900 text-white rounded-xl shadow-2xl py-1.5 px-2 flex items-center gap-2 border border-slate-700 text-[12px] whitespace-nowrap animate-in fade-in zoom-in-95`}
                      >
                        {/* 转发 */}
                        <button
                          onClick={() => handleTriggerSingleForward(msg)}
                          className="flex items-center gap-1 px-1.5 py-0.5 hover:text-blue-400 transition-colors cursor-pointer"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>转发</span>
                        </button>

                        <span className="w-px h-3 bg-slate-700" />

                        {/* 复制 */}
                        <button
                          onClick={() => handleCopyMessage(msg)}
                          className="flex items-center gap-1 px-1.5 py-0.5 hover:text-blue-400 transition-colors cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>复制</span>
                        </button>

                        <span className="w-px h-3 bg-slate-700" />

                        {/* 收藏 */}
                        <button
                          onClick={handleFavoriteMessage}
                          className="flex items-center gap-1 px-1.5 py-0.5 hover:text-blue-400 transition-colors cursor-pointer"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>收藏</span>
                        </button>

                        <span className="w-px h-3 bg-slate-700" />

                        {/* 多选 */}
                        <button
                          onClick={() => handleStartMultiSelect(msg.id)}
                          className="flex items-center gap-1 px-1.5 py-0.5 hover:text-blue-400 transition-colors cursor-pointer"
                        >
                          <Layers className="w-3.5 h-3.5" />
                          <span>多选</span>
                        </button>

                        {/* 撤回 (If self sent) */}
                        {msg.isSelf && (
                          <>
                            <span className="w-px h-3 bg-slate-700" />
                            <button
                              onClick={() => handleRecallMessage(msg)}
                              className="flex items-center gap-1 px-1.5 py-0.5 hover:text-amber-400 transition-colors cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>撤回</span>
                            </button>
                          </>
                        )}

                        <span className="w-px h-3 bg-slate-700" />

                        {/* 删除 */}
                        <button
                          onClick={() => handleDeleteSingle(msg.id)}
                          className="flex items-center gap-1 px-1.5 py-0.5 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>删除</span>
                        </button>
                      </div>
                    )}

                    {/* 1. TEXT Message (Exact Original Bubble Style Preserved) */}
                    {msg.type === 'text' && (
                      <div
                        className={`px-3.5 py-2.5 text-[15px] leading-relaxed break-words rounded-2xl shadow-2xs ${
                          msg.isSelf
                            ? 'bg-[#bfdbfe] text-slate-900 rounded-tr-xs'
                            : 'bg-white text-slate-900 rounded-tl-xs border border-slate-100'
                        }`}
                      >
                        {msg.content.startsWith('http') ? (
                          <a
                            href={msg.content}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 underline hover:text-blue-800 break-all"
                          >
                            {msg.content}
                          </a>
                        ) : (
                          msg.content
                        )}
                      </div>
                    )}

                    {/* 2. IMAGE Message (Exact Original Bubble Style Preserved) */}
                    {msg.type === 'image' && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewImage(msg.content);
                        }}
                        className="overflow-hidden rounded-2xl border border-slate-200/80 shadow-xs cursor-pointer max-w-[220px] bg-slate-100"
                      >
                        <img
                          src={msg.content}
                          alt="shared photo"
                          className="w-full h-auto object-cover max-h-[260px] hover:opacity-95 transition-opacity"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}

                    {/* 3. VOICE Message (Exact Original Bubble Style Preserved) */}
                    {msg.type === 'voice' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayVoice(msg.id);
                        }}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl shadow-2xs cursor-pointer transition-all active:scale-95 ${
                          msg.isSelf
                            ? 'bg-[#bfdbfe] text-slate-900 rounded-tr-xs flex-row-reverse'
                            : 'bg-white text-slate-900 rounded-tl-xs border border-slate-100'
                        }`}
                      >
                        {playingVoiceId === msg.id ? (
                          <Pause className="w-4 h-4 text-blue-600 animate-pulse" />
                        ) : (
                          <Volume2 className="w-4 h-4 text-slate-700" />
                        )}
                        <span className="text-[14px] font-medium">
                          {msg.audioDuration || 5}"
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {playingVoiceId === msg.id ? '播放中...' : '点击播放'}
                        </span>
                      </button>
                    )}

                    {/* 4. FILE Message (Exact Original Bubble Style Preserved) */}
                    {msg.type === 'file' && (
                      <div
                        className={`flex items-center gap-3 p-3 rounded-2xl shadow-2xs border max-w-[240px] ${
                          msg.isSelf
                            ? 'bg-[#bfdbfe] border-blue-200/60 rounded-tr-xs'
                            : 'bg-white border-slate-100 rounded-tl-xs'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[14px] font-semibold text-slate-900 truncate">
                            {msg.fileName || msg.content}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {msg.fileSize || '2.4 MB'}
                          </div>
                        </div>
                        <FileDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      </div>
                    )}

                    {/* 5. MERGED RECORD Message (Merged Forward Card) */}
                    {msg.type === 'merged_record' && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewingMergedRecord(msg);
                        }}
                        className={`p-3.5 rounded-2xl shadow-2xs border max-w-[250px] cursor-pointer hover:opacity-90 transition-all ${
                          msg.isSelf
                            ? 'bg-[#bfdbfe] border-blue-200/60 rounded-tr-xs'
                            : 'bg-white border-slate-100 rounded-tl-xs'
                        }`}
                      >
                        <div className="text-[14px] font-bold text-slate-900 pb-1.5 border-b border-slate-300/40 truncate flex items-center gap-1.5">
                          <MessageSquare className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <span className="truncate">{msg.content}</span>
                        </div>
                        <div className="mt-2 space-y-1 text-[12px] text-slate-600">
                          {msg.mergedRecords?.slice(0, 3).map((rec, i) => (
                            <div key={i} className="truncate">
                              <span className="font-semibold text-slate-700">{rec.senderName}: </span>
                              <span>{rec.content}</span>
                            </div>
                          ))}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-2 text-right">
                          聊天记录 (共 {msg.mergedRecords?.length || 0} 条)
                        </div>
                      </div>
                    )}

                    {/* 6. CALL Record Message (Audio / Video / Conference) */}
                    {msg.type === 'call' && (
                      <button
                        onClick={() => {
                          if (msg.callType === 'video') {
                            handleInitiateCall('video', 'outgoing');
                          } else if (msg.callType === 'meeting') {
                            handleInitiateCall('meeting', 'incoming', `${chatInfo.name} 周例会`);
                          } else {
                            handleInitiateCall('audio', 'outgoing');
                          }
                        }}
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl shadow-2xs border text-left cursor-pointer transition-all active:scale-95 ${
                          msg.isSelf
                            ? 'bg-[#bfdbfe] border-blue-200/60 rounded-tr-xs text-slate-900'
                            : 'bg-white border-slate-100 rounded-tl-xs text-slate-900'
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            msg.callState === 'rejected' || msg.callState === 'missed'
                              ? 'bg-rose-100 text-rose-600'
                              : msg.callType === 'video'
                              ? 'bg-blue-600 text-white shadow-xs'
                              : msg.callType === 'meeting'
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'bg-emerald-600 text-white shadow-xs'
                          }`}
                        >
                          {msg.callType === 'video' ? (
                            <Video className="w-5 h-5" />
                          ) : msg.callType === 'meeting' ? (
                            <Users className="w-5 h-5" />
                          ) : (
                            <Phone className="w-5 h-5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 pr-1">
                          <div className="text-[13px] font-bold flex items-center gap-1.5">
                            <span>
                              {msg.callType === 'video'
                                ? '视频通话'
                                : msg.callType === 'meeting'
                                ? '视频会议'
                                : '语音通话'}
                            </span>
                          </div>
                          <div className="text-[12px] text-slate-600 mt-0.5">
                            {msg.content}
                          </div>
                        </div>
                      </button>
                    )}

                    {/* Status Indicator (Read / Unread) under Sent Messages */}
                    {msg.isSelf && (
                      <div className="text-right mt-0.5">
                        <span
                          className={`text-[11px] font-normal ${
                            msg.status === 'read' ? 'text-slate-400' : 'text-blue-500'
                          }`}
                        >
                          {msg.status === 'read' ? '已读' : '未读'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Control Dock OR Multi-Select Bottom Action Dock */}
      {isMultiSelectMode ? (
        <div className="bg-white border-t border-slate-200 p-3 z-30 flex items-center justify-around shadow-lg animate-in slide-in-from-bottom duration-200">
          {/* 逐条转发 */}
          <button
            disabled={selectedMsgIds.length === 0}
            onClick={handleForwardOneByOne}
            className="flex flex-col items-center gap-1 text-slate-700 hover:text-blue-600 disabled:text-slate-300 transition-colors cursor-pointer disabled:pointer-events-none"
          >
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-blue-50">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-[12px] font-medium">逐条转发</span>
          </button>

          {/* 合并转发 */}
          <button
            disabled={selectedMsgIds.length === 0}
            onClick={handleForwardMerged}
            className="flex flex-col items-center gap-1 text-slate-700 hover:text-blue-600 disabled:text-slate-300 transition-colors cursor-pointer disabled:pointer-events-none"
          >
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-blue-50">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-[12px] font-medium">合并转发</span>
          </button>

          {/* 批量删除 */}
          <button
            disabled={selectedMsgIds.length === 0}
            onClick={handleBatchDelete}
            className="flex flex-col items-center gap-1 text-slate-700 hover:text-red-600 disabled:text-slate-300 transition-colors cursor-pointer disabled:pointer-events-none"
          >
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-red-50">
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>
            <span className="text-[12px] font-medium text-red-500">删除</span>
          </button>
        </div>
      ) : (
        <div className="bg-white border-t border-slate-100 p-2.5 z-20">
          <div className="flex items-center gap-2">
            {/* Audio Mode Toggle */}
            <button
              onClick={() => {
                setIsVoiceMode(!isVoiceMode);
                setShowEmojiPicker(false);
                setShowPlusPanel(false);
              }}
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-95 transition-all flex-shrink-0 cursor-pointer"
            >
              <Volume2 className={`w-5 h-5 ${isVoiceMode ? 'text-blue-600' : ''}`} />
            </button>

            {/* Middle Input or Hold-to-Speak Button */}
            {isVoiceMode ? (
              <button
                onMouseDown={() => setIsRecording(true)}
                onMouseUp={() => {
                  setIsRecording(false);
                  handleSendVoice();
                }}
                onTouchStart={() => setIsRecording(true)}
                onTouchEnd={() => {
                  setIsRecording(false);
                  handleSendVoice();
                }}
                className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-all border shadow-2xs select-none ${
                  isRecording
                    ? 'bg-blue-600 text-white border-blue-600 scale-[0.99]'
                    : 'bg-slate-100 text-slate-700 border-slate-200/80 hover:bg-slate-200/60'
                }`}
              >
                {isRecording ? '正在录音... (松开发送)' : '按住 说话'}
              </button>
            ) : (
              <div className="flex-1 flex items-center bg-[#f4f5f8] rounded-2xl px-3.5 py-2 border border-slate-200/60 focus-within:border-blue-400 focus-within:bg-white transition-all">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
                  placeholder="请输入内容"
                  className="w-full text-[14px] text-slate-900 placeholder-slate-400 bg-transparent outline-none"
                />
              </div>
            )}

            {/* Emoji Toggle */}
            <button
              onClick={() => {
                setShowEmojiPicker(!showEmojiPicker);
                setShowPlusPanel(false);
                setIsVoiceMode(false);
              }}
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-95 transition-all flex-shrink-0 cursor-pointer"
            >
              <Smile className={`w-5 h-5 ${showEmojiPicker ? 'text-blue-600' : ''}`} />
            </button>

            {/* Plus Toggle / Send Text Button */}
            {inputText.trim() ? (
              <button
                onClick={handleSendText}
                className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs hover:bg-blue-700 active:scale-95 transition-all flex-shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setShowPlusPanel(!showPlusPanel);
                  setShowEmojiPicker(false);
                  setIsVoiceMode(false);
                }}
                className="w-9 h-9 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-95 transition-all flex-shrink-0 cursor-pointer"
              >
                <Plus className={`w-6 h-6 stroke-[2] ${showPlusPanel ? 'text-blue-600 rotate-45' : ''} transition-transform`} />
              </button>
            )}
          </div>

          {/* EMOJI PICKER PANEL */}
          {showEmojiPicker && (
            <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-6 gap-2 bg-slate-50 p-2 rounded-2xl max-h-40 overflow-y-auto">
              {emojis.map((emoji, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInputText((prev) => prev + emoji);
                  }}
                  className="text-2xl p-2 hover:bg-white rounded-xl transition-colors text-center active:scale-125 cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* PLUS FUNCTION EXTENSION PANEL */}
          {showPlusPanel && (
            <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-4 gap-3 px-1 py-2">
              {/* 照片 */}
              <button
                onClick={() => imageInputRef.current?.click()}
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#f0f2f5] border border-slate-200/80 flex items-center justify-center text-slate-800 group-hover:bg-slate-200 active:scale-95 transition-all shadow-2xs">
                  <ImageIcon className="w-5 h-5 stroke-[1.8]" />
                </div>
                <span className="text-[12px] text-slate-600 font-medium">照片</span>
              </button>

              {/* 拍摄 */}
              <button
                onClick={handleCameraCapture}
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#f0f2f5] border border-slate-200/80 flex items-center justify-center text-slate-800 group-hover:bg-slate-200 active:scale-95 transition-all shadow-2xs">
                  <Camera className="w-5 h-5 stroke-[1.8]" />
                </div>
                <span className="text-[12px] text-slate-600 font-medium">拍摄</span>
              </button>

              {/* 语音通话 */}
              <button
                onClick={() => handleInitiateCall('audio', 'outgoing')}
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#f0f2f5] border border-slate-200/80 flex items-center justify-center text-slate-800 group-hover:bg-slate-200 active:scale-95 transition-all shadow-2xs">
                  <Phone className="w-5 h-5 stroke-[1.8]" />
                </div>
                <span className="text-[12px] text-slate-600 font-medium">语音通话</span>
              </button>

              {/* 视频通话 */}
              <button
                onClick={() => handleInitiateCall('video', 'outgoing')}
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#f0f2f5] border border-slate-200/80 flex items-center justify-center text-slate-800 group-hover:bg-slate-200 active:scale-95 transition-all shadow-2xs">
                  <Video className="w-5 h-5 stroke-[1.8]" />
                </div>
                <span className="text-[12px] text-slate-600 font-medium">视频通话</span>
              </button>

              {/* 视频会议 */}
              <button
                onClick={() => handleInitiateCall('meeting', 'incoming', '部门周例会')}
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#f0f2f5] border border-slate-200/80 flex items-center justify-center text-slate-800 group-hover:bg-slate-200 active:scale-95 transition-all shadow-2xs">
                  <Users className="w-5 h-5 stroke-[1.8]" />
                </div>
                <span className="text-[12px] text-slate-600 font-medium">视频会议</span>
              </button>

              {/* 位置 */}
              <button
                onClick={() => {
                  setShowLocationPicker(true);
                  setShowPlusPanel(false);
                }}
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#f0f2f5] border border-slate-200/80 flex items-center justify-center text-slate-800 group-hover:bg-slate-200 active:scale-95 transition-all shadow-2xs">
                  <MapPin className="w-5 h-5 stroke-[1.8]" />
                </div>
                <span className="text-[12px] text-slate-600 font-medium">位置</span>
              </button>

              {/* 文件 */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#f0f2f5] border border-slate-200/80 flex items-center justify-center text-slate-800 group-hover:bg-slate-200 active:scale-95 transition-all shadow-2xs">
                  <FileText className="w-5 h-5 stroke-[1.8]" />
                </div>
                <span className="text-[12px] text-slate-600 font-medium">文件</span>
              </button>

              {/* 收藏 */}
              <button
                onClick={() => {
                  setShowFavoritesPicker(true);
                  setShowPlusPanel(false);
                }}
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#f0f2f5] border border-slate-200/80 flex items-center justify-center text-slate-800 group-hover:bg-slate-200 active:scale-95 transition-all shadow-2xs">
                  <Bookmark className="w-5 h-5 stroke-[1.8]" />
                </div>
                <span className="text-[12px] text-slate-600 font-medium">我的收藏</span>
              </button>

              {/* 模拟体验 */}
              <button
                onClick={() => {
                  setShowCallOptionModal(true);
                  setShowPlusPanel(false);
                }}
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#f0f2f5] border border-slate-200/80 flex items-center justify-center text-slate-800 group-hover:bg-slate-200 active:scale-95 transition-all shadow-2xs">
                  <Sparkles className="w-5 h-5 stroke-[1.8]" />
                </div>
                <span className="text-[12px] text-slate-600 font-medium">通话测试</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Forward Modal Sheet */}
      {forwardModalState.isOpen && (
        <ForwardModal
          messagesToForward={forwardModalState.messages}
          isMergeForward={forwardModalState.isMerge}
          onClose={() =>
            setForwardModalState({ isOpen: false, messages: [], isMerge: false })
          }
          onConfirmForward={handleConfirmForward}
        />
      )}

      {/* Viewing Merged Records Detail Modal */}
      {viewingMergedRecord && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200">
          <div className="app-bottom-sheet !bg-[#f4f5f8] max-h-[85%] flex flex-col overflow-hidden shadow-2xl border-t border-slate-100 animate-in slide-in-from-bottom duration-250">
            <div className="px-4 py-3.5 bg-white border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-slate-900 truncate">
                {viewingMergedRecord.content}
              </h3>
              <button
                onClick={() => setViewingMergedRecord(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {viewingMergedRecord.mergedRecords?.map((rec, idx) => (
                <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between text-[12px] text-slate-400 mb-1">
                    <span className="font-semibold text-slate-800">{rec.senderName}</span>
                    <span>{rec.time || '14:28'}</span>
                  </div>
                  <div className="text-[14px] text-slate-800">
                    {rec.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Location Picker Modal */}
      {showLocationPicker && (
        <LocationPickerModal
          onClose={() => setShowLocationPicker(false)}
          onSendLocation={(loc) => {
            setShowLocationPicker(false);
            sendMessage('text', `📍 [位置分享] ${loc.name}（${loc.address}）`);
          }}
        />
      )}

      {/* Favorites Selector Modal */}
      {showFavoritesPicker && (
        <div className="absolute inset-0 z-50 bg-white flex flex-col animate-in slide-in-from-bottom duration-250">
          <FavoritesPage
            onBack={() => setShowFavoritesPicker(false)}
            onSendToChat={(favItem, comment, targetName) => {
              setShowFavoritesPicker(false);
              // Send the item into the current conversation
              if (favItem.type === 'image') {
                sendMessage('image', favItem.data.imageUrl || '');
              } else if (favItem.type === 'file') {
                sendMessage('file', favItem.data.fileName || '应急救援物资明细表.xlsx');
              } else if (favItem.type === 'chat_record') {
                sendMessage('merged_record', favItem.data.recordTitle || '聊天记录');
              } else if (favItem.type === 'link') {
                sendMessage('text', `[链接] ${favItem.data.linkTitle || ''}`);
              } else {
                sendMessage('text', favItem.data.textContent || favItem.title);
              }
              if (comment && comment.trim()) {
                setTimeout(() => {
                  sendMessage('text', comment.trim());
                }, 300);
              }
              showToast(`已发送收藏内容给 ${targetName || chatInfo.name}`);
            }}
          />
        </div>
      )}

      {/* Image Full Screen Preview Modal */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="absolute inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-pointer"
        >
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full bg-white/10"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={previewImage}
            alt="full preview"
            className="max-w-full max-h-full object-contain rounded-lg"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      {/* Call Scenario Simulation Modal Sheet */}
      {showCallOptionModal && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200">
          <div className="app-bottom-sheet p-5 shadow-2xl border-t border-slate-100 animate-in slide-in-from-bottom duration-250 select-none">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-slate-900">音视频通话与会议体验</h3>
                  <p className="text-[11px] text-slate-500">选择要体验或模拟的通话状态</p>
                </div>
              </div>
              <button
                onClick={() => setShowCallOptionModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2.5 mt-4 max-h-[380px] overflow-y-auto">
              {/* 1. 语音呼叫中 */}
              <button
                onClick={() => handleInitiateCall('audio', 'outgoing')}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/80 border border-slate-200/80 hover:border-emerald-200 transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-slate-800 group-hover:text-emerald-700">
                      语音通话 · 呼叫中
                    </div>
                    <div className="text-[12px] text-slate-500">
                      等待对方接听，支持静音、挂断、免提
                    </div>
                  </div>
                </div>
                <span className="text-[12px] font-medium text-emerald-600 bg-emerald-100/70 px-2.5 py-1 rounded-full">
                  发起呼叫
                </span>
              </button>

              {/* 2. 语音来电 (被呼叫) */}
              <button
                onClick={() => handleInitiateCall('audio', 'incoming')}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/80 border border-slate-200/80 hover:border-emerald-200 transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <PhoneIncoming className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-slate-800 group-hover:text-emerald-700">
                      语音通话 · 模拟来电
                    </div>
                    <div className="text-[12px] text-slate-500">
                      {chatInfo.name} 邀请你语音通话（接听/拒绝）
                    </div>
                  </div>
                </div>
                <span className="text-[12px] font-medium text-emerald-600 bg-emerald-100/70 px-2.5 py-1 rounded-full">
                  模拟来电
                </span>
              </button>

              {/* 3. 视频呼叫中 */}
              <button
                onClick={() => handleInitiateCall('video', 'outgoing')}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/80 border border-slate-200/80 hover:border-blue-200 transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-xs">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-slate-800 group-hover:text-blue-700">
                      视频通话 · 呼叫中
                    </div>
                    <div className="text-[12px] text-slate-500">
                      背景视频画面 + 翻转镜头 + 等待接听
                    </div>
                  </div>
                </div>
                <span className="text-[12px] font-medium text-blue-600 bg-blue-100/70 px-2.5 py-1 rounded-full">
                  发起视频
                </span>
              </button>

              {/* 4. 视频来电 (被呼叫) */}
              <button
                onClick={() => handleInitiateCall('video', 'incoming')}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/80 border border-slate-200/80 hover:border-blue-200 transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-slate-800 group-hover:text-blue-700">
                      视频通话 · 模拟来电
                    </div>
                    <div className="text-[12px] text-slate-500">
                      {chatInfo.name} 邀请你视频通话（接听/画中画）
                    </div>
                  </div>
                </div>
                <span className="text-[12px] font-medium text-blue-600 bg-blue-100/70 px-2.5 py-1 rounded-full">
                  模拟来电
                </span>
              </button>

              {/* 5. 视频会议 - 被邀请加入 */}
              <button
                onClick={() => handleInitiateCall('meeting', 'incoming', '部门周例会')}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50/80 border border-slate-200/80 hover:border-indigo-200 transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-slate-800 group-hover:text-indigo-700">
                      视频会议 · 邀请加入
                    </div>
                    <div className="text-[12px] text-slate-500">
                      常琼艳邀请你加入【部门周例会】
                    </div>
                  </div>
                </div>
                <span className="text-[12px] font-medium text-indigo-600 bg-indigo-100/70 px-2.5 py-1 rounded-full">
                  模拟邀请
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
