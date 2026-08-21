import React, { useState } from 'react';
import { TabType, MessageItem, ContactItem } from './types';
import { initialMessages, initialContacts } from './data/mockData';
import { appendMessagesToStoredChat } from './data/chatStorage';
import { getContactOrGroupProfile } from './data/contactProfiles';
import { StatusBar } from './components/StatusBar';
import { HomePage } from './components/HomePage';
import { MessagesPage } from './components/MessagesPage';
import { ContactsPage } from './components/ContactsPage';
import { ChatPage } from './components/ChatPage';
import { TrainingExamPage } from './components/TrainingExamPage';
import { MyGroupsPage, GroupInfo, initialCreatedGroups, initialJoinedGroups } from './components/MyGroupsPage';
import { PlanQueryPage } from './components/PlanQueryPage';
import { MaterialManagementPage } from './components/MaterialManagementPage';
import { RiskRectificationPage } from './components/RiskRectificationPage';
import { MeetingSystemPage } from './components/MeetingSystemPage';
import { PersonnelDispatchPage } from './components/PersonnelDispatchPage';
import { EventDetailPage } from './components/EventDetailPage';
import { EventListPage } from './components/EventListPage';
import { AiPlusPage } from './components/AiPlusPage';
import { MapPage } from './components/MapPage';
import { SurveillanceModulePage } from './components/SurveillanceModulePage';
import { KnowledgeBasePage } from './components/KnowledgeBasePage';
import { ProfilePage } from './components/ProfilePage';
import { FavoritesPage, FavoriteItem } from './components/FavoritesPage';
import { BottomNav } from './components/BottomNav';
import { CallModal, CallSession } from './components/CallModal';
import { GlobalSearchPage, SearchTabType } from './components/GlobalSearchPage';
import { ContactProfilePage } from './components/ContactProfilePage';
import { EnterpriseDirectoryPage } from './components/EnterpriseDirectoryPage';
import { CreateGroupPage } from './components/CreateGroupPage';
import { DutyHandoverPage } from './components/DutyHandoverPage';
import { ScanQrModal } from './components/ScanQrModal';
import { AlertTriangle, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [messages, setMessages] = useState<MessageItem[]>(initialMessages);
  const [contacts] = useState<ContactItem[]>(initialContacts);
  const [activeChat, setActiveChat] = useState<MessageItem | null>(null);
  const [selectedContactProfile, setSelectedContactProfile] = useState<ContactItem | null>(null);
  const [subPage, setSubPage] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchInitialTab, setSearchInitialTab] = useState<SearchTabType>('all');
  const [isAiSubView, setIsAiSubView] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [createdGroups, setCreatedGroups] = useState<GroupInfo[]>(initialCreatedGroups);
  const [joinedGroups, setJoinedGroups] = useState<GroupInfo[]>(initialJoinedGroups);
  const [activeCallSession, setActiveCallSession] = useState<CallSession | null>(null);
  const [isScanQrOpen, setIsScanQrOpen] = useState(false);
  const [isMapOverlayOpen, setIsMapOverlayOpen] = useState(false);

  const handleAddCreatedGroup = (newGroup: GroupInfo) => {
    setCreatedGroups((prev) => [newGroup, ...prev]);
  };

  const showToast = (text: string) => {
    setToastMessage(text);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleSelectMessage = (msg: MessageItem) => {
    // Mark message as read if unread
    if (msg.unreadCount) {
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, unreadCount: 0 } : m))
      );
    }
    setActiveChat(msg);
  };

  const handleContactAction = (contact: ContactItem, action: 'chat' | 'call') => {
    if (action === 'call') {
      // Launch Audio Call Modal directly
      setActiveCallSession({
        id: `call_${Date.now()}`,
        type: 'audio',
        role: 'outgoing',
        status: 'calling',
        targetName: contact.name,
        targetAvatar: contact.avatar
      });
    } else {
      // Find or create a message item for this contact to open chat
      const existing = messages.find((m) => m.name === contact.name);
      if (existing) {
        setActiveChat(existing);
      } else {
        const newChatItem: MessageItem = {
          id: `chat_${contact.id}`,
          name: contact.name,
          avatar: contact.avatar,
          lastMessage: '开始聊天...',
          time: '刚刚',
          isGroup: false
        };
        setMessages((prev) => [newChatItem, ...prev]);
        setActiveChat(newChatItem);
      }
    }
  };

  const handleEndCall = (durationSeconds: number, endReason: 'hangup' | 'rejected' | 'cancelled' | 'normal') => {
    if (activeCallSession) {
      const typeLabel =
        activeCallSession.type === 'video'
          ? '视频通话'
          : activeCallSession.type === 'meeting'
          ? '视频会议'
          : '语音通话';

      let statusDesc = '';
      if (endReason === 'rejected') {
        statusDesc = '已拒绝';
      } else if (endReason === 'cancelled') {
        statusDesc = '已取消';
      } else if (durationSeconds > 0) {
        const mins = Math.floor(durationSeconds / 60);
        const secs = durationSeconds % 60;
        statusDesc = `通话时长 ${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      } else {
        statusDesc = '通话结束';
      }

      showToast(`[${typeLabel}] ${statusDesc}`);
    }
    setActiveCallSession(null);
  };

  const handleOpenGroupChat = (groupName: string) => {
    setSubPage(null);
    const existing = messages.find((m) => m.name === groupName);
    if (existing) {
      setActiveChat(existing);
    } else {
      const allG = [...createdGroups, ...joinedGroups];
      const matchedG = allG.find((g) => g.name === groupName);
      const newGroupItem: MessageItem = {
        id: `group_${Date.now()}`,
        name: groupName,
        avatar: '',
        avatarType: 'grid',
        gridAvatars: matchedG?.gridAvatars || [
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80',
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80'
        ],
        lastMessage: '暂无新消息',
        time: '刚刚',
        isGroup: true
      };
      setMessages((prev) => [newGroupItem, ...prev]);
      setActiveChat(newGroupItem);
    }
  };

  const totalUnreadCount = messages.reduce(
    (acc, m) => acc + (m.unreadCount || 0),
    0
  );
  const usesIntegratedStatusBar =
    (activeTab === 'home' && !subPage && !selectedContactProfile && !activeChat && !isSearching) ||
    (activeTab === 'messages' && !subPage && !selectedContactProfile && !activeChat && !isSearching) ||
    (activeTab === 'contacts' && !subPage && !selectedContactProfile && !activeChat && !isSearching) ||
    (activeTab === 'map' && !subPage) ||
    subPage === 'plan-query' ||
    subPage === 'materials' ||
    subPage === 'knowledge-base';
  const usesGradientExternalStatusBar =
    subPage === 'event-list' ||
    subPage === 'duty-handover' ||
    subPage === 'meeting' ||
    subPage === 'training' ||
    subPage === 'event-detail' ||
    subPage === 'enterprise-directory' ||
    subPage === 'create-group';

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-0 md:p-6 font-sans">
      {/* Toast Alert Notice */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white text-xs md:text-sm px-4 py-2.5 rounded-full shadow-lg border border-slate-700/80 backdrop-blur-md flex items-center gap-2 animate-fade-in">
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Mobile Screen Frame Container */}
      <div className="w-[375px] h-[812px] max-w-[100vw] max-h-[100vh] bg-white md:rounded-[44px] shadow-2xl border-0 md:border-[10px] border-slate-800 flex flex-col overflow-hidden relative">
        {/* Mobile Top Speaker/Notch indicator for high fidelity frame */}
        <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-slate-800 rounded-b-2xl z-30"></div>

        {!usesIntegratedStatusBar && (
          <div className={usesGradientExternalStatusBar ? 'app-plan-query-status-bg' : ''}>
            <StatusBar />
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative">
          {subPage === 'training' ? (
            <TrainingExamPage onBack={() => setSubPage(null)} />
          ) : subPage === 'groups' ? (
            <MyGroupsPage
              onBack={() => setSubPage(null)}
              onOpenGroupChat={handleOpenGroupChat}
              createdGroups={createdGroups}
              joinedGroups={joinedGroups}
              onAddCreatedGroup={handleAddCreatedGroup}
            />
          ) : subPage === 'create-group' ? (
            <CreateGroupPage
              onBack={() => setSubPage(null)}
              onCreateSuccess={(groupName, selectedMembersCount) => {
                const newGroup: GroupInfo = {
                  id: 'g_' + Date.now(),
                  name: groupName,
                  memberCount: selectedMembersCount || 1,
                  type: 'none',
                  createdByMe: true,
                  gridAvatars: [
                    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&q=80',
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
                    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80'
                  ]
                };
                handleAddCreatedGroup(newGroup);
                setSubPage(null);
                handleOpenGroupChat(groupName);
                showToast(`群组「${groupName}」已创建`);
              }}
            />
          ) : subPage === 'plan-query' ? (
            <PlanQueryPage onBack={() => setSubPage(null)} />
          ) : subPage === 'materials' ? (
            <MaterialManagementPage onBack={() => setSubPage(null)} />
          ) : subPage === 'risk-rectification' ? (
            <RiskRectificationPage onBack={() => setSubPage(null)} />
          ) : subPage === 'meeting' ? (
            <MeetingSystemPage onBack={() => setSubPage(null)} />
          ) : subPage === 'personnel-dispatch' ? (
            <PersonnelDispatchPage
              onBack={() => setSubPage(null)}
              contacts={contacts}
              onOpenChatWithPerson={(name, avatarUrl) => {
                setSubPage(null);
                const existing = messages.find((m) => m.name === name);
                if (existing) {
                  setActiveChat(existing);
                } else {
                  const contactMatch = contacts.find((c) => c.name === name);
                  const newChat: MessageItem = {
                    id: `chat_${Date.now()}`,
                    name,
                    avatar: avatarUrl || contactMatch?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
                    lastMessage: '开始聊天...',
                    time: '刚刚',
                    isGroup: false
                  };
                  setMessages((prev) => [newChat, ...prev]);
                  setActiveChat(newChat);
                }
              }}
            />
          ) : subPage === 'event-list' ? (
            <EventListPage
              onBack={() => setSubPage(null)}
              onSelectEvent={(_event) => setSubPage('event-detail')}
            />
          ) : subPage === 'event-detail' ? (
            <EventDetailPage
              onBack={() => setSubPage(null)}
              onNavigateToMeeting={() => setSubPage('meeting')}
              onNavigateToPersonnelDispatch={() => setSubPage('personnel-dispatch')}
            />
          ) : subPage === 'monitoring' ? (
            <SurveillanceModulePage onBack={() => setSubPage(null)} />
          ) : subPage === 'enterprise-directory' ? (
            <EnterpriseDirectoryPage
              onBack={() => setSubPage(null)}
              onSelectMember={(member) => setSelectedContactProfile(member)}
              onChatWithMember={(member) => {
                setSubPage(null);
                handleContactAction(member, 'chat');
              }}
              onCallMember={(member) => handleContactAction(member, 'call')}
            />
          ) : subPage === 'duty-handover' ? (
            <DutyHandoverPage
              onBack={() => setSubPage(null)}
              onOpenChat={(name) => {
                const found = messages.find((m) => m.name === name);
                if (found) {
                  setActiveChat(found);
                  setSubPage(null);
                } else {
                  const profile = getContactOrGroupProfile(name);
                  setActiveChat({
                    id: `chat_${Date.now()}`,
                    name: profile.name,
                    avatar: profile.avatar,
                    avatarType: profile.avatarType,
                    gridAvatars: profile.gridAvatars,
                    lastMessage: '',
                    time: '刚刚',
                    isGroup: profile.isGroup || false
                  });
                  setSubPage(null);
                }
              }}
              onCall={(name, _phone) => {
                const profile = getContactOrGroupProfile(name);
                setActiveCallSession({
                  id: `call_${Date.now()}`,
                  type: 'audio',
                  role: 'outgoing',
                  status: 'calling',
                  targetName: name,
                  targetAvatar: profile.avatar
                });
              }}
              onShowToast={(msg) => showToast(msg)}
            />
          ) : subPage === 'knowledge-base' ? (
            <KnowledgeBasePage onBack={() => setSubPage(null)} />
          ) : subPage === 'favorites' ? (
            <FavoritesPage
              onBack={() => setSubPage(null)}
              onSendToChat={(item, comment, targetName) => {
                showToast(`已将收藏「${item.title}」发送给 ${targetName}`);

                const now = new Date();
                const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

                appendMessagesToStoredChat(targetName, [
                  {
                    id: `fav_item_${Date.now()}`,
                    senderId: 'user_me',
                    senderName: '我',
                    senderAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
                    type: item.type === 'file' ? 'file' : item.type === 'image' ? 'image' : 'text',
                    content: item.type === 'image' ? (item.data.imageUrl || item.title) : item.title,
                    fileName: item.data.fileName,
                    fileSize: item.data.fileSize,
                    time: timeStr,
                    isSelf: true,
                    status: 'read'
                  }
                ]);

                if (comment && comment.trim()) {
                  appendMessagesToStoredChat(targetName, [
                    {
                      id: `fav_cmt_${Date.now()}`,
                      senderId: 'user_me',
                      senderName: '我',
                      senderAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
                      type: 'text',
                      content: comment.trim(),
                      time: timeStr,
                      isSelf: true,
                      status: 'read'
                    }
                  ]);
                }

                const previewText = comment ? `[收藏] ${item.title} ${comment}` : `[收藏] ${item.title}`;

                // Update messages preview
                setMessages((prev) => {
                  const updated = [...prev];
                  const existingIdx = updated.findIndex((m) => m.name === targetName);
                  if (existingIdx !== -1) {
                    const found = updated[existingIdx];
                    updated.splice(existingIdx, 1);
                    updated.unshift({
                      ...found,
                      lastMessage: previewText,
                      time: '刚刚'
                    });
                  } else {
                    const profile = getContactOrGroupProfile(targetName);
                    updated.unshift({
                      id: `chat_${Date.now()}`,
                      name: profile.name,
                      avatar: profile.avatar,
                      avatarType: profile.avatarType,
                      gridAvatars: profile.gridAvatars,
                      lastMessage: previewText,
                      time: '刚刚',
                      isGroup: profile.isGroup || false
                    });
                  }
                  return updated;
                });

                // Find or open target chat
                const existing = messages.find((m) => m.name === targetName);
                if (existing) {
                  setActiveChat(existing);
                  setSubPage(null);
                } else {
                  const profile = getContactOrGroupProfile(targetName);
                  setActiveChat({
                    id: `chat_${Date.now()}`,
                    name: profile.name,
                    avatar: profile.avatar,
                    avatarType: profile.avatarType,
                    gridAvatars: profile.gridAvatars,
                    lastMessage: previewText,
                    time: '刚刚',
                    isGroup: profile.isGroup || false
                  });
                  setSubPage(null);
                }
              }}
            />
          ) : subPage === 'profile-view' ? (
            <div className="flex flex-col h-full bg-[#f4f5f8]">
              <div className="bg-white px-4 py-3 flex items-center gap-2 border-b border-slate-100">
                <button
                  onClick={() => setSubPage(null)}
                  className="p-1 -ml-1 text-slate-700 hover:text-slate-900"
                >
                  <X className="w-5 h-5" />
                </button>
                <span className="text-base font-bold text-slate-800">个人中心</span>
              </div>
              <div className="flex-1 overflow-y-auto">
                <ProfilePage
                  onNavigateToKnowledgeBase={() => setSubPage('knowledge-base')}
                  onNavigateToFavorites={() => setSubPage('favorites')}
                  onNavigateToContacts={() => {
                    setSubPage(null);
                    setActiveTab('contacts');
                  }}
                />
              </div>
            </div>
          ) : selectedContactProfile ? (
            <ContactProfilePage
              contact={selectedContactProfile}
              onBack={() => setSelectedContactProfile(null)}
              onShowToast={(msg) => showToast(msg)}
              onAction={(action) => {
                const target = selectedContactProfile;
                if (action === 'call') {
                  handleContactAction(target, 'call');
                } else if (action === 'chat') {
                  setSelectedContactProfile(null);
                  handleContactAction(target, 'chat');
                }
              }}
            />
          ) : activeChat ? (
            <ChatPage
              chatInfo={activeChat}
              onBack={() => setActiveChat(null)}
              onStartCall={(session) => setActiveCallSession(session)}
              onForwardComplete={(targetNames, lastMessageText, targetObjects) => {
                setMessages((prev) => {
                  const updated = [...prev];
                  targetNames.forEach((targetName) => {
                    const existingIdx = updated.findIndex((m) => m.name === targetName);
                    const targetObj = targetObjects?.find((t) => t.name === targetName);
                    const profile = targetObj || getContactOrGroupProfile(targetName);

                    if (existingIdx !== -1) {
                      const item = updated[existingIdx];
                      updated.splice(existingIdx, 1);
                      updated.unshift({
                        ...item,
                        lastMessage: lastMessageText,
                        time: '刚刚'
                      });
                    } else {
                      updated.unshift({
                        id: `chat_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
                        name: profile.name,
                        avatar: profile.avatar,
                        avatarType: profile.avatarType,
                        gridAvatars: profile.gridAvatars,
                        lastMessage: lastMessageText,
                        time: '刚刚',
                        isGroup: profile.isGroup || false
                      });
                    }
                  });
                  return updated;
                });
              }}
              onSwitchChat={(targetName) => {
                const found = messages.find((m) => m.name === targetName);
                if (found) {
                  setActiveChat(found);
                } else {
                  const profile = getContactOrGroupProfile(targetName);
                  setActiveChat({
                    id: `chat_${Date.now()}`,
                    name: profile.name,
                    avatar: profile.avatar,
                    avatarType: profile.avatarType,
                    gridAvatars: profile.gridAvatars,
                    lastMessage: '',
                    time: '刚刚',
                    isGroup: profile.isGroup || false
                  });
                }
              }}
            />
          ) : (
            <>
              {activeTab === 'home' && (
                <HomePage
                  onNavigateToTraining={() => setSubPage('training')}
                  onNavigateToPlanQuery={() => setSubPage('plan-query')}
                  onNavigateToMaterials={() => setSubPage('materials')}
                  onNavigateToRiskRectification={() => setSubPage('risk-rectification')}
                  onNavigateToMeeting={() => setSubPage('meeting')}
                  onNavigateToPersonnelDispatch={() => setSubPage('personnel-dispatch')}
                  onNavigateToEventDetail={() => setSubPage('event-detail')}
                  onNavigateToEventList={() => setSubPage('event-list')}
                  onNavigateToMonitoring={() => setSubPage('monitoring')}
                  onNavigateToKnowledgeBase={() => setSubPage('knowledge-base')}
                  onNavigateToProfile={() => setSubPage('profile-view')}
                  onNavigateToDutyHandover={() => setSubPage('duty-handover')}
                  onNavigateToAi={() => setActiveTab('ai')}
                />
              )}

              {activeTab === 'messages' && (
                <MessagesPage
                  messages={messages}
                  onSelectMessage={handleSelectMessage}
                  onOpenSearch={() => {
                    setSearchInitialTab('all');
                    setIsSearching(true);
                  }}
                  onCreateGroup={() => setSubPage('create-group')}
                  onScanQr={() => setIsScanQrOpen(true)}
                />
              )}

              {activeTab === 'contacts' && (
                <ContactsPage
                  contacts={contacts}
                  onContactAction={handleContactAction}
                  onSelectContact={(contact) => setSelectedContactProfile(contact)}
                  onOpenMyGroups={() => setSubPage('groups')}
                  onOpenEnterpriseDirectory={() => setSubPage('enterprise-directory')}
                  onOpenSearch={() => {
                    setSearchInitialTab('all');
                    setIsSearching(true);
                  }}
                  onCreateGroup={() => setSubPage('create-group')}
                  onScanQr={() => setIsScanQrOpen(true)}
                />
              )}

              {/* 地图 (Map) */}
              {activeTab === 'map' && (
                <MapPage onOverlayChange={setIsMapOverlayOpen} />
              )}

              {/* AI+ 智能体群 */}
              {activeTab === 'ai' && (
                <AiPlusPage onSubViewChange={(isSub) => setIsAiSubView(isSub)} />
              )}

              {/* Profile */}
              {activeTab === 'profile' && (
                <ProfilePage
                  onNavigateToKnowledgeBase={() => setSubPage('knowledge-base')}
                  onNavigateToFavorites={() => setSubPage('favorites')}
                  onNavigateToContacts={() => setActiveTab('contacts')}
                />
              )}
            </>
          )}
        </div>

        {/* Bottom Navigation (Hidden inside active chat view, subPage, selectedContactProfile, or AI+ sub-view) */}
        {!activeChat && !subPage && !selectedContactProfile && !isAiSubView && !isMapOverlayOpen && (
          <BottomNav
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab);
              setIsAiSubView(false);
            }}
            messagesUnreadCount={totalUnreadCount}
          />
        )}

        {!activeChat && !selectedContactProfile && !isSearching && !activeCallSession && !isScanQrOpen && !isMapOverlayOpen && (
          <button
            type="button"
            onClick={() => showToast('上报事件入口待接入')}
            className="absolute right-4 bottom-[76px] z-40 flex items-center gap-1.5 rounded-full bg-blue-600 px-3.5 py-2 text-[13px] font-bold text-white shadow-lg shadow-blue-600/25 border border-white/40 active:scale-95 transition-all"
            title="上报事件"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>上报事件</span>
          </button>
        )}

        {/* Global Search Page Modal Overlay */}
        {isSearching && (
          <GlobalSearchPage
            initialTab={searchInitialTab}
            contacts={contacts}
            messages={messages}
            onClose={() => setIsSearching(false)}
            onSelectContact={(contact) => {
              setIsSearching(false);
              handleContactAction(contact, 'chat');
            }}
            onSelectChat={(chat) => {
              setIsSearching(false);
              handleSelectMessage(chat);
            }}
          />
        )}

        {/* Global Call Modal & Overlay Layer (Audio/Video/Meeting Calls) */}
        {activeCallSession && (
          <CallModal session={activeCallSession} onClose={handleEndCall} />
        )}

        {/* Global Scan QR Code Modal */}
        <ScanQrModal
          isOpen={isScanQrOpen}
          onClose={() => setIsScanQrOpen(false)}
          onScanResult={(_res) => {
            showToast('已扫描识别二维码');
          }}
        />

        {/* Bottom Home Indicator Line for iOS style frame */}
        <div className="bg-white py-1 flex justify-center">
          <div className="w-32 h-1 bg-slate-900/80 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
