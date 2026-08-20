import { ChatMessage, MessageItem } from '../types';
import { initialSingleChatMessages, initialGroupChatMessages } from './mockData';
import { getContactOrGroupProfile } from './contactProfiles';

// In-memory store for all chat sessions
const chatHistories: Record<string, ChatMessage[]> = {};
const listeners: Array<() => void> = [];

export const notifyChatStorageChanged = () => {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch (e) {
      console.error(e);
    }
  });
};

export const subscribeChatStorage = (listener: () => void) => {
  listeners.push(listener);
  return () => {
    const idx = listeners.indexOf(listener);
    if (idx !== -1) listeners.splice(idx, 1);
  };
};

export const getStoredChatHistory = (
  chatName: string,
  isGroup?: boolean,
  avatar?: string,
  avatarType?: 'image' | 'custom' | 'grid',
  gridAvatars?: string[]
): ChatMessage[] => {
  if (chatHistories[chatName]) {
    return chatHistories[chatName];
  }

  const profile = getContactOrGroupProfile(chatName);
  const isActualGroup =
    isGroup ??
    (profile.isGroup ||
      chatName.includes('群') ||
      chatName.includes('组') ||
      chatName.includes('队') ||
      Boolean(gridAvatars && gridAvatars.length > 0));

  const resolvedAvatar = avatar || profile.avatar;
  const resolvedAvatarType = avatarType || profile.avatarType;
  const resolvedGridAvatars = gridAvatars || profile.gridAvatars;

  // Initialize from default mock
  let initialList: ChatMessage[] = [];
  if (isActualGroup) {
    initialList = initialGroupChatMessages.map((m) => ({ ...m }));
  } else {
    initialList = initialSingleChatMessages.map((m) => {
      if (!m.isSelf) {
        return {
          ...m,
          senderName: chatName,
          senderAvatar: resolvedAvatar || m.senderAvatar,
          avatarType: resolvedAvatarType || m.avatarType,
          gridAvatars: resolvedGridAvatars || m.gridAvatars
        };
      }
      return { ...m };
    });
  }

  chatHistories[chatName] = initialList;
  return initialList;
};

export const appendMessagesToStoredChat = (chatName: string, newMessages: ChatMessage[]) => {
  const current = getStoredChatHistory(chatName);
  chatHistories[chatName] = [...current, ...newMessages];
  notifyChatStorageChanged();
};

export const forwardMessagesToStoredTargets = (
  targetNames: string[],
  forwardedMsgs: ChatMessage[],
  forwardComment: string = '',
  isMerge: boolean = false
) => {
  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  targetNames.forEach((targetName) => {
    const toAppend: ChatMessage[] = [];

    if (isMerge) {
      const senders = Array.from(new Set(forwardedMsgs.map((m) => m.senderName))).join('、');
      toAppend.push({
        id: `fwd_merge_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        senderId: 'user_me',
        senderName: '我',
        senderAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
        type: 'merged_record',
        content: `${senders} 的聊天记录`,
        mergedRecords: forwardedMsgs.map((m) => ({
          senderName: m.senderName,
          content: m.content,
          type: m.type,
          time: m.time
        })),
        time: timeStr,
        isSelf: true,
        status: 'read'
      });
    } else {
      forwardedMsgs.forEach((m, idx) => {
        toAppend.push({
          id: `fwd_single_${Date.now()}_${idx}_${Math.random().toString(36).slice(2, 6)}`,
          senderId: 'user_me',
          senderName: '我',
          senderAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
          type: m.type,
          content: m.content,
          fileName: m.fileName,
          fileSize: m.fileSize,
          audioDuration: m.audioDuration,
          mergedRecords: m.mergedRecords,
          time: timeStr,
          isSelf: true,
          status: 'read'
        });
      });
    }

    if (forwardComment.trim()) {
      toAppend.push({
        id: `fwd_comment_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        senderId: 'user_me',
        senderName: '我',
        senderAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
        type: 'text',
        content: forwardComment.trim(),
        time: timeStr,
        isSelf: true,
        status: 'read'
      });
    }

    appendMessagesToStoredChat(targetName, toAppend);
  });
};
