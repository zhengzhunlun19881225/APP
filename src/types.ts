export type TabType = 'home' | 'ai' | 'messages' | 'contacts' | 'map' | 'profile';

export interface MessageItem {
  id: string;
  name: string;
  avatar: string;
  avatarType?: 'image' | 'custom' | 'grid';
  gridAvatars?: string[];
  lastMessage: string;
  highlightText?: string;
  time: string;
  unreadCount?: number;
  isGroup?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;
  avatarType?: 'image' | 'custom' | 'grid';
  gridAvatars?: string[];
  type?: 'text' | 'image' | 'file' | 'voice' | 'audio' | 'video' | 'location' | 'call' | 'merged_record';
  content?: string;
  text?: string;
  time: string;
  isSelf?: boolean;
  isMe?: boolean;
  status?: 'sending' | 'sent' | 'read' | 'unread';
  audioDuration?: number;
  fileName?: string;
  fileSize?: string;
  fileInfo?: {
    name: string;
    size: string;
    ext: string;
  };
  mergedRecords?: any[];
  [key: string]: any;
}

export interface ContactItem {
  id: string;
  name: string;
  avatar: string;
  gender?: '男' | '女' | 'male' | 'female';
  birthday?: string;
  nativePlace?: string;
  phone?: string;
  role?: string;
  duty?: string;
  status?: string;
  department?: string;
  email?: string;
  tags?: string[];
  recentIncidents?: string[];
  isSpecialist?: boolean;
  avatarType?: 'image' | 'custom';
  [key: string]: any;
}

export interface EnterpriseDepartment {
  id: string;
  name: string;
  memberCount: number;
  children?: EnterpriseDepartment[];
}

export interface EnterpriseMember {
  id: string;
  name: string;
  title: string;
  department: string;
  phone: string;
  avatar: string;
  status: 'online' | 'busy' | 'offline';
  roleTag?: string;
  gender?: '男' | '女' | 'male' | 'female';
  birthday?: string;
  nativePlace?: string;
  [key: string]: any;
}

export interface UserGroupItem {
  id: string;
  name: string;
  memberCount: number;
  type: 'emergency' | 'department' | 'special';
  description: string;
  avatar: string;
  members: ContactItem[];
}
