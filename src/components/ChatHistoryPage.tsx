import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  Search,
  SlidersHorizontal,
  LayoutGrid,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Archive,
  MoreHorizontal,
  Check,
  Share2,
  Star,
  Trash2,
  Download,
  Calendar,
  X,
  Play,
  FileSpreadsheet,
  FileBox
} from 'lucide-react';
import { MessageItem, ChatMessage } from '../types';
import { Avatar } from './Avatar';
import { SendConfirmDialog } from './SendConfirmDialog';
import { ForwardModal } from './ForwardModal';

export interface ChatHistoryPageProps {
  chatInfo: MessageItem;
  onBack: () => void;
  onJumpToMessage?: (messageId: string) => void;
  onShowToast?: (msg: string) => void;
}

export type HistorySubView = 'main' | 'date' | 'media' | 'files';

interface ChatFileItem {
  id: string;
  senderName: string;
  senderAvatar: string;
  timeStr: string;
  timestamp: number; // for sorting
  fileName: string;
  fileSize: string;
  fileType: 'doc' | 'image' | 'video' | 'audio' | 'zip' | 'other';
  section: string;
  colorClass: string;
  ext: string;
}

interface ChatMediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  duration?: string;
  section: string;
  timeStr: string;
  timestamp: number;
}

// Mock Files matching the screenshots
const initialChatFiles: ChatFileItem[] = [
  {
    id: 'f1',
    senderName: '宇茜朗',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    timeStr: '2天前',
    timestamp: 1684400000000,
    fileName: '设计图汇总.zip',
    fileSize: '8.2MB',
    fileType: 'zip',
    section: '这个月',
    colorClass: 'bg-[#ff4d4f]',
    ext: 'ZIP'
  },
  {
    id: 'f2',
    senderName: '洛仪德',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    timeStr: '2022/5/18',
    timestamp: 1652860800000,
    fileName: '行业相关资料整理.zip',
    fileSize: '12MB',
    fileType: 'zip',
    section: '这个月',
    colorClass: 'bg-[#ff4d4f]',
    ext: 'ZIP'
  },
  {
    id: 'f3',
    senderName: '张杰婕',
    senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    timeStr: '2022/4/25',
    timestamp: 1650873600000,
    fileName: '任务清单梳理.xlsx',
    fileSize: '2.5MB',
    fileType: 'doc',
    section: '2022年4月',
    colorClass: 'bg-[#10b981]',
    ext: 'XLSX'
  },
  {
    id: 'f4',
    senderName: '艾宁青',
    senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    timeStr: '2022/3/16',
    timestamp: 1647417600000,
    fileName: '工作汇报.pptx',
    fileSize: '3.6MB',
    fileType: 'doc',
    section: '2022年3月',
    colorClass: 'bg-[#ff7a45]',
    ext: 'PPT'
  },
  {
    id: 'f5',
    senderName: '拓晓',
    senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    timeStr: '2022/3/10',
    timestamp: 1646899200000,
    fileName: '应急预案管理手册.docx',
    fileSize: '4.1MB',
    fileType: 'doc',
    section: '2022年3月',
    colorClass: 'bg-[#1890ff]',
    ext: 'DOC'
  },
  {
    id: 'f6',
    senderName: '殷霭东',
    senderAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
    timeStr: '2022/2/28',
    timestamp: 1646035200000,
    fileName: '现场勘查报告.pdf',
    fileSize: '5.7MB',
    fileType: 'doc',
    section: '2022年2月',
    colorClass: 'bg-[#f5222d]',
    ext: 'PDF'
  }
];

// Mock Media matching screenshots 7, 8, 9
const initialChatMedia: ChatMediaItem[] = [
  // 2022年4月
  {
    id: 'm1',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=300&q=80',
    type: 'image',
    section: '2022年4月',
    timeStr: '2022/04/28',
    timestamp: 1651132800000
  },
  {
    id: 'm2',
    url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=300&q=80',
    type: 'image',
    section: '2022年4月',
    timeStr: '2022/04/26',
    timestamp: 1650960000000
  },
  {
    id: 'm3',
    url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=300&q=80',
    type: 'image',
    section: '2022年4月',
    timeStr: '2022/04/22',
    timestamp: 1650614400000
  },
  {
    id: 'm4',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=300&q=80',
    type: 'image',
    section: '2022年4月',
    timeStr: '2022/04/20',
    timestamp: 1650441600000
  },
  {
    id: 'm5',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80',
    type: 'video',
    duration: '01:12',
    section: '2022年4月',
    timeStr: '2022/04/18',
    timestamp: 1650268800000
  },
  {
    id: 'm6',
    url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=300&q=80',
    type: 'image',
    section: '2022年4月',
    timeStr: '2022/04/15',
    timestamp: 1650009600000
  },

  // 这个月
  {
    id: 'm7',
    url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=300&q=80',
    type: 'image',
    section: '这个月',
    timeStr: '5天前',
    timestamp: 1684100000000
  },
  {
    id: 'm8',
    url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=300&q=80',
    type: 'image',
    section: '这个月',
    timeStr: '6天前',
    timestamp: 1684000000000
  },
  {
    id: 'm9',
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=300&q=80',
    type: 'image',
    section: '这个月',
    timeStr: '7天前',
    timestamp: 1683900000000
  },
  {
    id: 'm10',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    type: 'image',
    section: '这个月',
    timeStr: '8天前',
    timestamp: 1683800000000
  },
  {
    id: 'm11',
    url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=300&q=80',
    type: 'image',
    section: '这个月',
    timeStr: '10天前',
    timestamp: 1683600000000
  },
  {
    id: 'm12',
    url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=300&q=80',
    type: 'image',
    section: '这个月',
    timeStr: '12天前',
    timestamp: 1683400000000
  },
  {
    id: 'm13',
    url: 'https://images.unsplash.com/photo-1507208773393-40d9fc6be0b2?auto=format&fit=crop&w=300&q=80',
    type: 'video',
    duration: '02:25',
    section: '这个月',
    timeStr: '14天前',
    timestamp: 1683200000000
  },
  {
    id: 'm14',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=300&q=80',
    type: 'video',
    duration: '00:31',
    section: '这个月',
    timeStr: '15天前',
    timestamp: 1683100000000
  },
  {
    id: 'm15',
    url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=300&q=80',
    type: 'image',
    section: '这个月',
    timeStr: '16天前',
    timestamp: 1683000000000
  },

  // 本周
  {
    id: 'm16',
    url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=300&q=80',
    type: 'image',
    section: '本周',
    timeStr: '周一',
    timestamp: 1684500000000
  },
  {
    id: 'm17',
    url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=300&q=80',
    type: 'image',
    section: '本周',
    timeStr: '周二',
    timestamp: 1684600000000
  },
  {
    id: 'm18',
    url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=300&q=80',
    type: 'image',
    section: '本周',
    timeStr: '周三',
    timestamp: 1684700000000
  },
  {
    id: 'm19',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=300&q=80',
    type: 'image',
    section: '本周',
    timeStr: '周四',
    timestamp: 1684800000000
  },
  {
    id: 'm20',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=300&q=80',
    type: 'image',
    section: '本周',
    timeStr: '周五',
    timestamp: 1684900000000
  },
  {
    id: 'm21',
    url: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=300&q=80',
    type: 'image',
    section: '本周',
    timeStr: '周六',
    timestamp: 1685000000000
  },
  {
    id: 'm22',
    url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=300&q=80',
    type: 'image',
    section: '本周',
    timeStr: '昨天',
    timestamp: 1685100000000
  }
];

export const ChatHistoryPage: React.FC<ChatHistoryPageProps> = ({
  chatInfo,
  onBack,
  onJumpToMessage,
  onShowToast
}) => {
  const [currentView, setCurrentView] = useState<HistorySubView>('main');
  const [searchQuery, setSearchQuery] = useState('');

  // Toast helper
  const triggerToast = (msg: string) => {
    if (onShowToast) {
      onShowToast(msg);
    } else {
      console.log(msg);
    }
  };

  // -------------------- FILES VIEW STATES --------------------
  const [filesList, setFilesList] = useState<ChatFileItem[]>(initialChatFiles);
  const [fileSearchQuery, setFileSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [showCategorySheet, setShowCategorySheet] = useState(false);
  const [showSortSheet, setShowSortSheet] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // 'asc' = 按时间正序, 'desc' = 按时间倒序

  // -------------------- MEDIA VIEW STATES --------------------
  const [mediaList, setMediaList] = useState<ChatMediaItem[]>(initialChatMedia);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedMediaIds, setSelectedMediaIds] = useState<string[]>([]);
  const [previewMediaItem, setPreviewMediaItem] = useState<ChatMediaItem | null>(null);

  // Forwarding
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [forwardData, setForwardData] = useState<{
    type: 'image' | 'file';
    title: string;
    imageUrl?: string;
    fileName?: string;
    fileSize?: string;
  } | null>(null);

  // Filtered & Sorted Files
  const filteredFiles = useMemo(() => {
    return filesList
      .filter((file) => {
        // category match
        if (selectedCategory === '文档' && file.fileType !== 'doc') return false;
        if (selectedCategory === '图片' && file.fileType !== 'image') return false;
        if (selectedCategory === '视频' && file.fileType !== 'video') return false;
        if (selectedCategory === '音频' && file.fileType !== 'audio') return false;
        if (selectedCategory === '压缩包' && file.fileType !== 'zip') return false;
        if (selectedCategory === '其他' && file.fileType !== 'other') return false;

        // search query
        if (fileSearchQuery.trim()) {
          const q = fileSearchQuery.toLowerCase();
          return (
            file.fileName.toLowerCase().includes(q) ||
            file.senderName.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortOrder === 'asc') {
          return a.timestamp - b.timestamp;
        } else {
          return b.timestamp - a.timestamp;
        }
      });
  }, [filesList, selectedCategory, fileSearchQuery, sortOrder]);

  // Group files by section
  const groupedFiles = useMemo(() => {
    const map: Record<string, ChatFileItem[]> = {};
    filteredFiles.forEach((f) => {
      const sec = f.section || '其他时间';
      if (!map[sec]) map[sec] = [];
      map[sec].push(f);
    });
    return map;
  }, [filteredFiles]);

  // Group media by section
  const groupedMedia = useMemo(() => {
    const map: Record<string, ChatMediaItem[]> = {};
    mediaList.forEach((m) => {
      const sec = m.section || '其他';
      if (!map[sec]) map[sec] = [];
      map[sec].push(m);
    });
    return map;
  }, [mediaList]);

  // Handle Media Selection Toggle
  const toggleSelectMedia = (id: string) => {
    setSelectedMediaIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Handle Media Actions
  const handleBatchForward = () => {
    if (selectedMediaIds.length === 0) {
      triggerToast('请先选择需要转发的图片或视频');
      return;
    }
    const firstSelected = mediaList.find((m) => m.id === selectedMediaIds[0]);
    setForwardData({
      type: 'image',
      title: `[图片及视频] 共 ${selectedMediaIds.length} 项`,
      imageUrl: firstSelected?.url
    });
    setShowForwardModal(true);
  };

  const handleBatchFavorite = () => {
    if (selectedMediaIds.length === 0) {
      triggerToast('请先选择需要收藏的内容');
      return;
    }
    triggerToast(`已成功收藏 ${selectedMediaIds.length} 个项目`);
    setIsSelectMode(false);
    setSelectedMediaIds([]);
  };

  const handleBatchDelete = () => {
    if (selectedMediaIds.length === 0) {
      triggerToast('请先选择需要删除的内容');
      return;
    }
    setMediaList((prev) => prev.filter((m) => !selectedMediaIds.includes(m.id)));
    triggerToast(`已删除 ${selectedMediaIds.length} 个项目`);
    setIsSelectMode(false);
    setSelectedMediaIds([]);
  };

  const handleBatchDownload = () => {
    if (selectedMediaIds.length === 0) {
      triggerToast('请先选择需要下载的内容');
      return;
    }
    triggerToast(`正在保存 ${selectedMediaIds.length} 张图片到相册...`);
    setTimeout(() => {
      triggerToast('已保存到系统相册');
      setIsSelectMode(false);
      setSelectedMediaIds([]);
    }, 600);
  };

  // Render Category Filter Dropdown
  const categoryOptions = [
    { label: '全部', icon: LayoutGrid, color: 'text-blue-600 bg-blue-50' },
    { label: '文档', icon: FileText, color: 'text-slate-600 bg-slate-100' },
    { label: '图片', icon: ImageIcon, color: 'text-slate-600 bg-slate-100' },
    { label: '视频', icon: Video, color: 'text-slate-600 bg-slate-100' },
    { label: '音频', icon: Music, color: 'text-slate-600 bg-slate-100' },
    { label: '压缩包', icon: Archive, color: 'text-slate-600 bg-slate-100' },
    { label: '其他', icon: MoreHorizontal, color: 'text-slate-600 bg-slate-100' }
  ];

  // =========================================================================
  // VIEW 1: 查找聊天记录 (Main Search Page) - Screenshot 1
  // =========================================================================
  if (currentView === 'main') {
    return (
      <div className="flex flex-col h-full bg-white select-none animate-in fade-in duration-150">
        {/* Search Header */}
        <div className="px-4 pt-3 pb-3 flex items-center gap-3 border-b border-slate-100/60 bg-white">
          <div className="flex-1 flex items-center gap-2 bg-[#f4f5f8] rounded-full px-3 py-2 text-slate-800">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索"
              autoFocus
              className="bg-transparent border-none outline-none text-[15px] w-full text-slate-900 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            onClick={onBack}
            className="text-[15px] text-blue-600 active:opacity-70 font-normal shrink-0"
          >
            取消
          </button>
        </div>

        {/* Content Body */}
        {!searchQuery ? (
          <div className="flex-1 flex flex-col justify-start pt-12">
            <div className="text-center text-[13px] text-slate-400 mb-5">
              快速查找聊天内容
            </div>

            {/* 3 Entry Links: 日期 | 图片及视频 | 文件 */}
            <div className="flex items-center justify-center gap-6 text-[15px] text-blue-600 font-normal">
              <button
                onClick={() => setCurrentView('date')}
                className="hover:opacity-80 active:scale-95 transition-all cursor-pointer py-1"
              >
                日期
              </button>
              <div className="h-4 w-[1px] bg-slate-200" />
              <button
                onClick={() => setCurrentView('media')}
                className="hover:opacity-80 active:scale-95 transition-all cursor-pointer py-1"
              >
                图片及视频
              </button>
              <div className="h-4 w-[1px] bg-slate-200" />
              <button
                onClick={() => setCurrentView('files')}
                className="hover:opacity-80 active:scale-95 transition-all cursor-pointer py-1"
              >
                文件
              </button>
            </div>

            {/* Virtual Keyboard Mockup at Bottom matching Screenshot 1 */}
            <div className="mt-auto bg-[#cfd3db] p-1.5 border-t border-slate-300 shadow-inner">
              <div className="space-y-2 py-1">
                <div className="flex justify-center gap-1.5 px-0.5">
                  {['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'].map((k) => (
                    <button
                      key={k}
                      onClick={() => setSearchQuery((prev) => prev + k)}
                      className="flex-1 h-10 bg-white rounded-[5px] text-[18px] text-slate-900 font-light shadow-xs flex items-center justify-center active:bg-slate-200 transition-colors"
                    >
                      {k}
                    </button>
                  ))}
                </div>
                <div className="flex justify-center gap-1.5 px-3">
                  {['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'].map((k) => (
                    <button
                      key={k}
                      onClick={() => setSearchQuery((prev) => prev + k)}
                      className="flex-1 h-10 bg-white rounded-[5px] text-[18px] text-slate-900 font-light shadow-xs flex items-center justify-center active:bg-slate-200 transition-colors"
                    >
                      {k}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between gap-1.5 px-0.5">
                  <div className="w-10 h-10 bg-[#abb2be] rounded-[5px] flex items-center justify-center text-slate-700 shadow-xs">
                    ⇧
                  </div>
                  {['z', 'x', 'c', 'v', 'b', 'n', 'm'].map((k) => (
                    <button
                      key={k}
                      onClick={() => setSearchQuery((prev) => prev + k)}
                      className="flex-1 h-10 bg-white rounded-[5px] text-[18px] text-slate-900 font-light shadow-xs flex items-center justify-center active:bg-slate-200 transition-colors"
                    >
                      {k}
                    </button>
                  ))}
                  <button
                    onClick={() => setSearchQuery((prev) => prev.slice(0, -1))}
                    className="w-10 h-10 bg-[#abb2be] rounded-[5px] flex items-center justify-center text-slate-700 shadow-xs active:bg-slate-400"
                  >
                    ⌫
                  </button>
                </div>
                <div className="flex gap-1.5 px-0.5 pt-1">
                  <button className="w-12 h-10 bg-[#abb2be] rounded-[5px] text-[14px] text-slate-800 flex items-center justify-center font-medium shadow-xs">
                    123
                  </button>
                  <button
                    onClick={() => setSearchQuery((prev) => prev + ' ')}
                    className="flex-1 h-10 bg-white rounded-[5px] text-[14px] text-slate-800 flex items-center justify-center shadow-xs active:bg-slate-200"
                  >
                    space
                  </button>
                  <button
                    onClick={() => {}}
                    className="w-16 h-10 bg-[#abb2be] rounded-[5px] text-[14px] text-slate-800 flex items-center justify-center font-medium shadow-xs"
                  >
                    完成
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Search Results */
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="text-[12px] text-slate-400 font-medium px-1">
              搜索结果
            </div>

            {/* Matching text / media / files */}
            <div className="bg-white rounded-xl divide-y divide-slate-100 border border-slate-100">
              <div
                onClick={() => {
                  triggerToast('正在定位到该条消息...');
                  onBack();
                }}
                className="p-3.5 hover:bg-slate-50 cursor-pointer flex items-start gap-3 transition-colors"
              >
                <Avatar
                  src={chatInfo.avatar}
                  name={chatInfo.name}
                  avatarType={chatInfo.avatarType}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-semibold text-slate-900">
                      {chatInfo.name}
                    </span>
                    <span className="text-[11px] text-slate-400">14:28</span>
                  </div>
                  <p className="text-[13px] text-slate-600 mt-1 leading-snug">
                    塑造本来就在石头里，我只是把不要的部分去掉
                  </p>
                </div>
              </div>

              <div
                onClick={() => {
                  setCurrentView('files');
                  setFileSearchQuery(searchQuery);
                }}
                className="p-3.5 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                    <Archive className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[14px] font-medium text-slate-900">
                      设计图汇总.zip
                    </div>
                    <div className="text-[11px] text-slate-400">来自 宇茜朗 · 8.2MB</div>
                  </div>
                </div>
                <span className="text-[12px] text-blue-600">查看文件</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: 按日期查找 (Search by Date) - Screenshot 2
  // =========================================================================
  if (currentView === 'date') {
    return (
      <div className="flex flex-col h-full bg-white select-none animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100 sticky top-0 bg-white z-10">
          <button
            onClick={() => setCurrentView('main')}
            className="flex items-center text-slate-800 active:opacity-70 p-1 -ml-1"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
          </button>
          <span className="text-[17px] font-semibold text-slate-900">按日期查找</span>
          <div className="w-6" />
        </div>

        {/* Calendar Grid Container */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          {/* Weekday Row */}
          <div className="grid grid-cols-7 text-center py-2 text-[13px] text-slate-400 font-medium">
            <span>日</span>
            <span>一</span>
            <span>二</span>
            <span>三</span>
            <span>四</span>
            <span>五</span>
            <span>六</span>
          </div>

          {/* Month: 2月 */}
          <div className="mb-4">
            <div className="grid grid-cols-7 text-center gap-y-3 py-1">
              {['20', '21', '22', '23', '24', '25', '26'].map((d) => (
                <button
                  key={d}
                  onClick={() => triggerToast(`定位到 2026年2月${d}日 的聊天记录`)}
                  className="h-9 w-9 mx-auto rounded-full flex items-center justify-center text-[15px] text-slate-900 hover:bg-slate-100 active:bg-blue-50 transition-colors"
                >
                  {d}
                </button>
              ))}
              {['27', '28'].map((d) => (
                <button
                  key={d}
                  onClick={() => triggerToast(`定位到 2026年2月${d}日 的聊天记录`)}
                  className="h-9 w-9 mx-auto rounded-full flex items-center justify-center text-[15px] text-slate-900 hover:bg-slate-100 active:bg-blue-50 transition-colors"
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Month: 3月 */}
          <div className="mb-4">
            <div className="text-[14px] text-blue-600 font-medium py-1.5">3月</div>
            <div className="grid grid-cols-7 text-center gap-y-3 py-1">
              {/* Empty offset 2 days */}
              <div />
              <div />
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                <button
                  key={d}
                  onClick={() => triggerToast(`定位到 2026年3月${d}日 的聊天记录`)}
                  className="h-9 w-9 mx-auto rounded-full flex items-center justify-center text-[15px] text-slate-900 hover:bg-slate-100 active:bg-blue-50 transition-colors"
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Month: 4月 */}
          <div className="mb-6">
            <div className="text-[14px] text-blue-600 font-medium py-1.5">4月</div>
            <div className="grid grid-cols-7 text-center gap-y-3 py-1">
              {/* Empty offset 5 days */}
              <div />
              <div />
              <div />
              <div />
              <div />
              {Array.from({ length: 19 }, (_, i) => i + 1).map((d) => {
                const isToday = d === 19;
                return (
                  <button
                    key={d}
                    onClick={() => {
                      triggerToast(isToday ? '已定位至今日聊天记录' : `定位到 2026年4月${d}日 的聊天记录`);
                      onBack();
                    }}
                    className={`h-9 w-9 mx-auto rounded-full flex flex-col items-center justify-center transition-all ${
                      isToday
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-900 hover:bg-slate-100 active:bg-blue-50'
                    }`}
                  >
                    <span className="text-[15px] font-medium leading-none">{d}</span>
                    {isToday && (
                      <span className="text-[9px] text-blue-600 absolute -bottom-3.5 font-normal">
                        今天
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 3: 聊天文件 (Chat Files) - Screenshots 3, 4, 5, 6
  // =========================================================================
  if (currentView === 'files') {
    return (
      <div className="flex flex-col h-full bg-[#f4f5f8] select-none relative animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-between bg-white border-b border-slate-100 sticky top-0 z-20">
          <button
            onClick={() => setCurrentView('main')}
            className="flex items-center text-slate-800 active:opacity-70 p-1 -ml-1"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
          </button>
          <span className="text-[17px] font-semibold text-slate-900">聊天文件</span>
          <button
            onClick={() => setShowSortSheet(true)}
            className="flex items-center gap-1 text-[15px] text-blue-600 active:opacity-70 font-normal"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>排序</span>
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="px-4 py-2.5 bg-white border-b border-slate-100/80 flex items-center gap-3 relative z-20">
          {/* Search Box */}
          <div className="flex-1 flex items-center gap-2 bg-[#f4f5f8] rounded-lg px-3 py-1.5 text-slate-800">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={fileSearchQuery}
              onChange={(e) => setFileSearchQuery(e.target.value)}
              placeholder="搜索"
              className="bg-transparent border-none outline-none text-[14px] w-full text-slate-900 placeholder:text-slate-400"
            />
            {fileSearchQuery && (
              <button
                onClick={() => setFileSearchQuery('')}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Dropdown Trigger */}
          <button
            onClick={() => setShowCategorySheet(!showCategorySheet)}
            className="flex items-center gap-1 text-[14px] text-slate-700 font-normal px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors shrink-0"
          >
            <span>{selectedCategory}</span>
            <span className="text-[10px] text-slate-400">
              {showCategorySheet ? '▲' : '▼'}
            </span>
          </button>
        </div>

        {/* Category Filter Dropdown Sheet matching Screenshot 4 & 5 */}
        {showCategorySheet && (
          <>
            {/* Backdrop */}
            <div
              onClick={() => setShowCategorySheet(false)}
              className="absolute inset-0 bg-black/30 z-30 transition-opacity"
            />
            {/* Grid Panel */}
            <div className="absolute top-[96px] left-0 right-0 bg-white z-40 p-4 shadow-lg border-b border-slate-100 animate-in slide-in-from-top duration-200">
              <div className="grid grid-cols-4 gap-y-4 text-center">
                {categoryOptions.map((cat) => {
                  const isSelected = selectedCategory === cat.label;
                  const IconComp = cat.icon;
                  return (
                    <button
                      key={cat.label}
                      onClick={() => {
                        setSelectedCategory(cat.label);
                        setShowCategorySheet(false);
                      }}
                      className="flex flex-col items-center gap-1.5 group"
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                        }`}
                      >
                        <IconComp className="w-5 h-5 stroke-[2]" />
                      </div>
                      <span
                        className={`text-[12px] ${
                          isSelected
                            ? 'text-blue-600 font-semibold'
                            : 'text-slate-700'
                        }`}
                      >
                        {cat.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Files List Grouped by Timeline */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
          {Object.keys(groupedFiles).length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-[13px]">
              没有找到相关文件
            </div>
          ) : (
            (Object.entries(groupedFiles) as [string, ChatFileItem[]][]).map(([section, items]) => (
              <div key={section} className="space-y-3">
                {/* Timeline Header (e.g. 这个月, 2022年4月, 2022年3月) */}
                <div className="text-[13px] text-slate-400 font-medium pt-1">
                  {section}
                </div>

                {/* File items in this section */}
                <div className="space-y-3">
                  {items.map((file) => (
                    <div
                      key={file.id}
                      className="bg-white rounded-2xl p-3 shadow-2xs border border-slate-100 space-y-2 hover:shadow-xs transition-shadow"
                    >
                      {/* Sender Info Line */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar
                            src={file.senderAvatar}
                            name={file.senderName}
                            size="sm"
                          />
                          <span className="text-[14px] font-semibold text-slate-900">
                            {file.senderName}
                          </span>
                        </div>
                        <span className="text-[12px] text-slate-400">
                          {file.timeStr}
                        </span>
                      </div>

                      {/* File Container Card */}
                      <div
                        onClick={() => {
                          setForwardData({
                            type: 'file',
                            title: file.fileName,
                            fileName: file.fileName,
                            fileSize: file.fileSize
                          });
                          setShowForwardModal(true);
                        }}
                        className="bg-[#f8f9fc] hover:bg-slate-100/80 active:scale-[0.99] rounded-xl p-3 flex items-center gap-3 transition-all cursor-pointer"
                      >
                        {/* File Format Badge */}
                        <div
                          className={`w-11 h-11 rounded-lg ${file.colorClass} text-white flex flex-col items-center justify-center font-black shadow-xs shrink-0`}
                        >
                          {file.ext === 'ZIP' ? (
                            <Archive className="w-5 h-5 stroke-[2.5]" />
                          ) : file.ext === 'XLSX' ? (
                            <span className="text-[16px] font-bold">S</span>
                          ) : file.ext === 'PPT' ? (
                            <span className="text-[16px] font-bold">P</span>
                          ) : file.ext === 'DOC' ? (
                            <span className="text-[16px] font-bold">W</span>
                          ) : (
                            <FileText className="w-5 h-5 stroke-[2.2]" />
                          )}
                        </div>

                        {/* File Title & Size */}
                        <div className="flex-1 min-w-0">
                          <div className="text-[15px] font-semibold text-slate-900 truncate">
                            {file.fileName}
                          </div>
                          <div className="text-[12px] text-slate-400 mt-0.5">
                            {file.fileSize}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sort Action Sheet matching Screenshot 6 */}
        {showSortSheet && (
          <>
            <div
              onClick={() => setShowSortSheet(false)}
              className="fixed inset-0 bg-black/40 z-50 transition-opacity"
            />
            <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 p-2 shadow-2xl animate-in slide-in-from-bottom duration-200">
              <div className="divide-y divide-slate-100">
                <button
                  onClick={() => {
                    setSortOrder('asc');
                    setShowSortSheet(false);
                  }}
                  className="w-full py-3.5 px-4 flex items-center justify-between text-[16px] text-slate-900 active:bg-slate-50 transition-colors"
                >
                  <span className={sortOrder === 'asc' ? 'font-medium text-blue-600' : ''}>
                    按时间正序排序
                  </span>
                  {sortOrder === 'asc' && <Check className="w-5 h-5 text-blue-600" />}
                </button>

                <button
                  onClick={() => {
                    setSortOrder('desc');
                    setShowSortSheet(false);
                  }}
                  className="w-full py-3.5 px-4 flex items-center justify-between text-[16px] text-slate-900 active:bg-slate-50 transition-colors"
                >
                  <span className={sortOrder === 'desc' ? 'font-medium text-blue-600' : ''}>
                    按时间倒序排序
                  </span>
                  {sortOrder === 'desc' && <Check className="w-5 h-5 text-blue-600" />}
                </button>
              </div>

              <div className="pt-2 pb-3 px-2 border-t border-slate-100 mt-1">
                <button
                  onClick={() => setShowSortSheet(false)}
                  className="w-full py-3 rounded-xl bg-slate-100 text-[15px] font-medium text-slate-700 active:bg-slate-200 transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          </>
        )}

        {/* Forward Modal for Files */}
        {showForwardModal && forwardData && (
          <ForwardModal
            isOpen={showForwardModal}
            itemData={forwardData}
            onClose={() => setShowForwardModal(false)}
            onForwardSuccess={(target) => {
              triggerToast(`已成功转发「${forwardData.fileName}」给 ${target.name}`);
              setShowForwardModal(false);
            }}
          />
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW 4: 图片及视频 (Images & Videos) - Screenshots 7, 8, 9
  // =========================================================================
  return (
    <div className="flex flex-col h-full bg-white select-none relative animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100 sticky top-0 bg-white z-20">
        <button
          onClick={() => {
            if (isSelectMode) {
              setIsSelectMode(false);
              setSelectedMediaIds([]);
            } else {
              setCurrentView('main');
            }
          }}
          className="flex items-center text-slate-800 active:opacity-70 p-1 -ml-1"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
        </button>

        <span className="text-[17px] font-semibold text-slate-900">图片及视频</span>

        {/* Right Toggle Button: '选择' vs '取消' */}
        <button
          onClick={() => {
            setIsSelectMode(!isSelectMode);
            setSelectedMediaIds([]);
          }}
          className="text-[15px] text-blue-600 active:opacity-70 font-normal py-1 px-1"
        >
          {isSelectMode ? '取消' : '选择'}
        </button>
      </div>

      {/* Media Grid Grouped by Timeline */}
      <div className={`flex-1 overflow-y-auto p-2 space-y-4 ${isSelectMode ? 'pb-20' : ''}`}>
        {(Object.entries(groupedMedia) as [string, ChatMediaItem[]][]).map(([section, items]) => (
          <div key={section} className="space-y-1.5">
            {/* Section Header (e.g. 2022年4月, 这个月, 本周) */}
            <div className="text-[13px] text-slate-400 font-medium px-1 pt-1">
              {section}
            </div>

            {/* 4-column photo & video grid */}
            <div className="grid grid-cols-4 gap-1">
              {items.map((media) => {
                const isSelected = selectedMediaIds.includes(media.id);
                return (
                  <div
                    key={media.id}
                    onClick={() => {
                      if (isSelectMode) {
                        toggleSelectMedia(media.id);
                      } else {
                        setPreviewMediaItem(media);
                      }
                    }}
                    className="relative aspect-square overflow-hidden bg-slate-100 cursor-pointer group select-none"
                  >
                    <img
                      src={media.url}
                      alt="media"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />

                    {/* Video Duration Badge */}
                    {media.type === 'video' && (
                      <div className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        <span>{media.duration}</span>
                      </div>
                    )}

                    {/* Selection Checkbox Overlay matching Screenshots 8 & 9 */}
                    {isSelectMode && (
                      <div className="absolute top-1.5 right-1.5 z-10">
                        {isSelected ? (
                          <div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center shadow-xs">
                            <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-white/90 bg-black/25 shadow-xs" />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Multi-Select Action Bar matching Screenshots 8 & 9 */}
      {isSelectMode && (
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-6 py-3 flex items-center justify-between z-30 shadow-lg animate-in slide-in-from-bottom duration-150">
          {/* Forward */}
          <button
            onClick={handleBatchForward}
            className="flex flex-col items-center gap-1 text-slate-700 hover:text-blue-600 active:scale-90 transition-all"
          >
            <Share2 className="w-5 h-5 stroke-[1.8]" />
          </button>

          {/* Favorite */}
          <button
            onClick={handleBatchFavorite}
            className="flex flex-col items-center gap-1 text-slate-700 hover:text-amber-500 active:scale-90 transition-all"
          >
            <Star className="w-5 h-5 stroke-[1.8]" />
          </button>

          {/* Delete */}
          <button
            onClick={handleBatchDelete}
            className="flex flex-col items-center gap-1 text-slate-700 hover:text-red-500 active:scale-90 transition-all"
          >
            <Trash2 className="w-5 h-5 stroke-[1.8]" />
          </button>

          {/* Download */}
          <button
            onClick={handleBatchDownload}
            className="flex flex-col items-center gap-1 text-slate-700 hover:text-blue-600 active:scale-90 transition-all"
          >
            <Download className="w-5 h-5 stroke-[1.8]" />
          </button>
        </div>
      )}

      {/* Fullscreen Single Media Preview */}
      {previewMediaItem && (
        <div
          onClick={() => setPreviewMediaItem(null)}
          className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="relative max-w-full max-h-[80vh]">
            <img
              src={previewMediaItem.url}
              alt="preview"
              referrerPolicy="no-referrer"
              className="max-h-[75vh] w-auto object-contain rounded-lg shadow-2xl"
            />
            {previewMediaItem.type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-black/60 text-white flex items-center justify-center shadow-lg">
                  <Play className="w-7 h-7 fill-white translate-x-0.5" />
                </div>
              </div>
            )}
          </div>

          <div className="absolute top-4 right-4 text-white">
            <button
              onClick={() => setPreviewMediaItem(null)}
              className="p-2 rounded-full bg-black/40 hover:bg-black/70"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="absolute bottom-6 flex items-center gap-8 text-white">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setForwardData({
                  type: 'image',
                  title: '[图片]',
                  imageUrl: previewMediaItem.url
                });
                setShowForwardModal(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-[13px]"
            >
              <Share2 className="w-4 h-4" />
              <span>转发</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                triggerToast('已保存图片到系统相册');
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-[13px]"
            >
              <Download className="w-4 h-4" />
              <span>保存</span>
            </button>
          </div>
        </div>
      )}

      {/* Forward Modal for Media */}
      {showForwardModal && forwardData && (
        <ForwardModal
          isOpen={showForwardModal}
          itemData={forwardData}
          onClose={() => setShowForwardModal(false)}
          onForwardSuccess={(target) => {
            triggerToast(`已成功转发给 ${target.name}`);
            setShowForwardModal(false);
            setIsSelectMode(false);
            setSelectedMediaIds([]);
          }}
        />
      )}
    </div>
  );
};
