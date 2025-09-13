'use client';
import React, { useState, useEffect } from 'react';
import { Search, Settings, X, File, Users, MessageCircle, List, Folder, Image, Video } from 'lucide-react';

type ResultType = 
  | { type: 'person'; name: string; status: string; avatar: string; statusColor: string }
  | { type: 'file'; name: string; location: string; time: string; icon: string; subtype: string }
  | { type: 'folder'; name: string; count: string; location: string; time: string; icon: string }
  | { type: 'chat'; name: string; lastMessage: string; time: string; participants: number }
  | { type: 'list'; name: string; items: number; completed: number; time: string };

const SearchBoxUI = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [showSettings, setShowSettings] = useState(false);
  const [animatingCounts, setAnimatingCounts] = useState<Record<string, number>>({});
  const [filterSettings, setFilterSettings] = useState({
    Files: true,
    People: true,
    Chats: false,
    Lists: false
  });
  const [resultsVisible, setResultsVisible] = useState(false);

  const mockResults: ResultType[] = [
    {
      type: 'person',
      name: 'Caroline Dribsson',
      status: 'Unactivated',
      avatar: '👩‍💼',
      statusColor: 'bg-red-500'
    },
    {
      type: 'person',
      name: 'Adam Cadribean',
      status: 'Active 1w ago',
      avatar: '👨‍💻',
      statusColor: 'bg-yellow-400'
    },
    {
      type: 'file',
      name: 'final_dribbble_presentation.jpg',
      location: 'in Presentations',
      time: 'Edited 1w ago',
      icon: '🖼️',
      subtype: 'image'
    },
    {
      type: 'person',
      name: 'Margareth Cendribgssen',
      status: 'Active 1w ago',
      avatar: '👩‍🎨',
      statusColor: 'bg-yellow-400'
    },
    {
      type: 'file',
      name: 'dribbble_animation.avi',
      location: 'in Videos',
      time: 'Added 1y ago',
      icon: '🎬',
      subtype: 'video'
    },
    {
      type: 'folder',
      name: 'Dribbble Folder',
      count: '12 Files',
      location: 'in Projects',
      time: 'Edited 2m ago',
      icon: '📁'
    },
    {
      type: 'chat',
      name: 'Design Team Discussion',
      lastMessage: 'Hey, can you review the latest mockups?',
      time: '2h ago',
      participants: 5
    },
    {
      type: 'list',
      name: 'Project Checklist',
      items: 12,
      completed: 8,
      time: 'Updated 1d ago'
    }
  ];

  const getFilteredResults = () => {
    return mockResults.filter(result => {
      if (!query.trim()) return false;
      const lowerQuery = query.toLowerCase();
      if ('name' in result && result.name.toLowerCase().includes(lowerQuery)) return true;
      if ('status' in result && result.status.toLowerCase().includes(lowerQuery)) return true;
      if ('location' in result && result.location.toLowerCase().includes(lowerQuery)) return true;
      if ('lastMessage' in result && result.lastMessage.toLowerCase().includes(lowerQuery)) return true;
      return false;
    });
  };

  const getDynamicCounts = () => {
    const filteredResults = getFilteredResults();
    return {
      All: filteredResults.length,
      Files: filteredResults.filter(r => r.type === 'file' || r.type === 'folder').length,
      People: filteredResults.filter(r => r.type === 'person').length,
      Chats: filteredResults.filter(r => r.type === 'chat').length,
      Lists: filteredResults.filter(r => r.type === 'list').length
    };
  };

  const counts = getDynamicCounts();

  const tabs = [
    { name: 'All', count: counts.All, icon: Search },
    { name: 'Files', count: counts.Files, icon: File },
    { name: 'People', count: counts.People, icon: Users },
    { name: 'Chats', count: counts.Chats, icon: MessageCircle },
    { name: 'Lists', count: counts.Lists, icon: List }
  ];

  useEffect(() => {
    tabs.forEach(tab => {
      if (animatingCounts[tab.name] !== tab.count) {
        setAnimatingCounts(prev => ({
          ...prev,
          [tab.name]: tab.count
        }));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counts]);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.trim()) {
      setIsSearching(true);
      setTimeout(() => {
        setIsSearching(false);
        setShowResults(true);
      }, 600);
    } else {
      setShowResults(false);
    }
  };

  useEffect(() => {
    if (showResults) {
      setResultsVisible(true);
    } else {
      const timeout = setTimeout(() => setResultsVisible(false), 400);
      return () => clearTimeout(timeout);
    }
  }, [showResults]);

  const handleClear = () => {
    setQuery('');
    setIsSearching(false);
    setShowResults(false);
  };

  const toggleFilter = (filterName: keyof typeof filterSettings) => {
    setFilterSettings(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  const getVisibleTabs = () => {
    return tabs.filter(tab => tab.name === 'All' || filterSettings[tab.name as keyof typeof filterSettings]);
  };

  const filteredResults = getFilteredResults().filter(result => {
    if (activeTab === 'Files' && !(result.type === 'file' || result.type === 'folder')) return false;
    if (activeTab === 'People' && result.type !== 'person') return false;
    if (activeTab === 'Chats' && result.type !== 'chat') return false;
    if (activeTab === 'Lists' && result.type !== 'list') return false;
    return true;
  });

  const getResultIcon = (result: ResultType) => {
    if (result.type === 'person') {
      return (
        <div className="relative">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg">
            {result.avatar}
          </div>
          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ${result.statusColor}`}></div>
        </div>
      );
    } else if (result.type === 'file') {
      if (result.subtype === 'image') {
        return (
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Image className="w-5 h-5 text-blue-600" aria-hidden="true" />
          </div>
        );
      } else if (result.subtype === 'video') {
        return (
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Video className="w-5 h-5 text-purple-600" aria-hidden="true" />
          </div>
        );
      } else {
        return (
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <File className="w-5 h-5 text-gray-500" aria-hidden="true" />
          </div>
        );
      }
    } else if (result.type === 'folder') {
      return (
        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
          <Folder className="w-5 h-5 text-yellow-600" aria-hidden="true" />
        </div>
      );
    } else if (result.type === 'chat') {
      return (
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-green-600" aria-hidden="true" />
        </div>
      );
    } else if (result.type === 'list') {
      return (
        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
          <List className="w-5 h-5 text-indigo-600" aria-hidden="true" />
        </div>
      );
    }
    return null;
  };

  const getResultSubtext = (result: ResultType) => {
    if (result.type === 'person') {
      return result.status;
    } else if (result.type === 'file' || result.type === 'folder') {
      return `${result.location} • ${result.time}${'count' in result && result.count ? ` • ${result.count}` : ''}`;
    } else if (result.type === 'chat') {
      return `${result.lastMessage} • ${result.participants} participants`;
    } else if (result.type === 'list') {
      return `${result.completed}/${result.items} completed • ${result.time}`;
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className={`bg-white rounded-2xl shadow-lg transition-all duration-1000 ease-in-out transform ${
          showResults ? '-translate-y-8 shadow-xl' : 'translate-y-0'
        }`}>
          
          <div className="flex items-center p-5">
            <div className="relative mr-4">
              {isSearching ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              ) : (
                <Search className="w-5 h-5 text-gray-400" />
              )}
            </div>
            
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search..."
              className="flex-1 outline-none text-lg text-gray-700 placeholder-gray-400"
            />
            
            <div className="flex items-center space-x-4">
              {query && (
                <button
                  onClick={handleClear}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              <span className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-lg">⌘ Quick Access</span>
            </div>
          </div>

          <div
            className={`transition-all duration-400 ease-in-out overflow-hidden ${
              showResults ? 'opacity-100 max-h-[500px] pointer-events-auto' : 'opacity-0 max-h-0 pointer-events-none'
            }`}
            style={{
              transition: 'opacity 0.4s, max-height 0.4s',
              willChange: 'opacity, max-height',
              display: resultsVisible ? 'block' : 'none'
            }}
          >
            <div className="flex items-center justify-between px-5 border-b border-gray-200 shadow-sm">
              <div className="flex items-center space-x-5">
                {getVisibleTabs().map((tab) => (
                  <button
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    className={`flex items-center space-x-3 text-sm font-medium  animate-easeOut ${
                      activeTab === tab.name
                        ? 'text-gray-900 border-b-3 py-3 border-gray-900 '
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                    <span className={`inline-block min-w-[20px] text-center transition-all duration-500 ${
                      tab.count > 0 ? 'text-gray-500 bg-gray-100 px-2 py-0.5 rounded-lg text-xs font-bold' : 'text-gray-400'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-500"
                >
                  <Settings className="w-5 h-5" />
                </button>
                
                {showSettings && (
                  <div className="absolute right-0 top-12 bg-white border border-gray-300 rounded-xl shadow-lg p-4 z-10 min-w-54 animate-easeOut">
                    {(['Files', 'People', 'Chats', 'Lists'] as (keyof typeof filterSettings)[]).map((filter) => {
                      const TabIcon = tabs.find(t => t.name === filter)?.icon || File;
                      return (
                        <div key={filter} className="flex flex-row gap-4 items-center justify-between py-1 space-x-4">
                          <div className="flex items-center space-x-2">
                            <TabIcon className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">{filter}</span>
                          </div>
                          <button
                            onClick={() => toggleFilter(filter)}
                            className={`relative w-7 h-4 rounded-full transition-all duration-500 ease-in-out ${
                              filterSettings[filter] ? 'bg-gray-900' : 'bg-gray-300'
                            }`}
                          >
                            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-md transition-all duration-500 ease-in-out ${
                              filterSettings[filter] ? 'translate-x-3.5' : 'translate-x-1'
                            }`}></div>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {filteredResults.length > 0 ? (
                filteredResults.map((result, index) => (
                  <div
                    key={index}
                    className="group flex items-center px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-b-0 relative"
                    style={{
                      animation: `slideInUp 0.4s ease-out ${index * 0.1}s both`
                    }}
                  >
                    <div className="mr-4">
                      {getResultIcon(result)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 mb-1">{result.name}</div>
                      <div className="text-sm text-gray-500">
                        {getResultSubtext(result)}
                      </div>
                    </div>
                    
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(`${window.location.origin}/${result.type}/${result.name.toLowerCase().replace(/\s+/g, '-')}`);
                          const button = e.currentTarget;
                          const tooltip = button.querySelector('.tooltip');
                          if (tooltip) {
                            tooltip.textContent = 'Link copied!';
                            tooltip.classList.remove('hidden');
                            setTimeout(() => {
                              tooltip.textContent = 'Copy link';
                              tooltip.classList.add('hidden');
                            }, 2000);
                          }
                        }}
                        className="relative flex items-center gap-0.5 px-2.5 py-1.5 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 z-30"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span className="tooltip hidden absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-30">
                          Copy link
                        </span>
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`${window.location.origin}/${result.type}/${result.name.toLowerCase().replace(/\s+/g, '-')}`, '_blank');
                        }}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span>New Tab</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : query.trim() ? (
                <div className="p-8 text-center text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-lg font-medium mb-1">No results found</p>
                  <p className="text-sm">Try adjusting your search terms</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 2px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default SearchBoxUI;