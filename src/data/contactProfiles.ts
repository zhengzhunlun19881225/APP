import { ForwardTargetItem, mockRecentForwarded, mockRecentChats, mockRecentContacts, mockStandardMembers, mockDepartments, mockMyGroups, mockMyFollowed, mockSearchContacts, mockSearchGroups } from './forwardData';
import { initialMessages, initialContacts } from './mockData';
import { mockEnterpriseData } from './enterpriseDirectoryData';

// Master lookup dictionary
const profileMap = new Map<string, ForwardTargetItem>();

// Seed master dictionary
const seedItem = (item: {
  name: string;
  avatar?: string;
  avatarType?: 'image' | 'grid' | 'custom';
  gridAvatars?: string[];
  department?: string;
  role?: string;
  isGroup?: boolean;
}) => {
  if (!item || !item.name) return;
  if (!profileMap.has(item.name)) {
    profileMap.set(item.name, {
      id: `profile_${item.name}`,
      name: item.name,
      avatar: item.avatar !== undefined ? item.avatar : '',
      avatarType: item.avatarType || (item.gridAvatars?.length ? 'grid' : 'image'),
      gridAvatars: item.gridAvatars,
      department: item.department,
      role: item.role,
      isGroup: item.isGroup
    });
  }
};

// Seed all known sources
[
  ...mockRecentForwarded,
  ...mockRecentChats,
  ...mockRecentContacts,
  ...mockStandardMembers,
  ...mockSearchContacts,
  ...mockSearchGroups,
  ...mockMyFollowed
].forEach(seedItem);

mockDepartments.forEach((dept) => {
  dept.members.forEach(seedItem);
});

mockMyGroups.forEach((grp) => {
  seedItem({
    name: grp.name,
    avatar: grp.avatar,
    avatarType: grp.avatar ? 'image' : 'grid',
    gridAvatars: grp.gridAvatars,
    isGroup: true
  });
  grp.members.forEach(seedItem);
});

initialMessages.forEach((m) => {
  seedItem({
    name: m.name,
    avatar: m.avatar,
    avatarType: m.avatarType,
    gridAvatars: m.gridAvatars,
    isGroup: m.isGroup
  });
});

initialContacts.forEach((c) => {
  seedItem({
    name: c.name,
    avatar: c.avatar,
    avatarType: 'image',
    department: c.department,
    role: c.role,
    isGroup: false
  });
});

mockEnterpriseData.departments.forEach((dept) => {
  dept.members.forEach((m) => {
    seedItem({
      name: m.name,
      avatar: m.avatar,
      avatarType: 'image',
      department: m.department,
      role: m.role,
      isGroup: false
    });
  });
});

export const getContactOrGroupProfile = (name: string): ForwardTargetItem => {
  if (profileMap.has(name)) {
    return profileMap.get(name)!;
  }

  const isGroup = name.includes('群') || name.includes('组') || name.includes('队') || name.includes('班');

  const generatedProfile: ForwardTargetItem = {
    id: `custom_${name}`,
    name,
    avatar: '',
    avatarType: isGroup ? 'grid' : 'image',
    gridAvatars: isGroup
      ? [
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=80&q=80',
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80'
        ]
      : undefined,
    isGroup
  };

  profileMap.set(name, generatedProfile);
  return generatedProfile;
};
