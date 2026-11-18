import React, { useState, useCallback } from 'react';
import McpChat from '../../apps/McpChat';
import KnowledgeBase from '../../apps/KnowledgeBase';
import SystemSettings from '../../apps/SystemSettings';
import ErrorBoundary from '../../components/ErrorBoundary';

const TABS = [
  { id: 'mcp-chat', label: 'MCP Chat', icon: '💬' },
  { id: 'knowledge-base', label: 'Knowledge Base', icon: '📚' },
];

/**
 * 既存業務システムへ組み込むための EACore サイドパネルラッパー。
 * 単体モード（iframe 等での埋め込み想定）とドッキングモードの両方で動作する。
 */
const SidePanelWidget = ({
  user,
  config,
  onLogout,
  onClose,
  standalone = false,
  activeTab: controlledTab,
  onTabChange,
  isExpanded = false,
  onToggleExpand,
}) => {
  const [internalTab, setInternalTab] = useState('mcp-chat');
  const [overlayApp, setOverlayApp] = useState(null);

  const activeTab = controlledTab ?? internalTab;
  const setActiveTab = useCallback(
    (tabId) => {
      setOverlayApp(null);
      if (onTabChange) {
        onTabChange(tabId);
      } else {
        setInternalTab(tabId);
      }
    },
    [onTabChange]
  );

  const capabilities = config?.capabilities || [];

  // 各アプリから呼ばれる onOpen(type, props) をサイドパネル内のタブ切替／オーバーレイに変換
  const handleAppOpen = useCallback(
    (type, props = {}) => {
      if (type === 'mcp-chat') {
        setActiveTab('mcp-chat');
        return;
      }
      if (type === 'knowledge-base') {
        setActiveTab('knowledge-base');
        return;
      }
      if (type === 'settings') {
        setOverlayApp({ type: 'settings', title: 'システム設定', props });
      }
    },
    [setActiveTab]
  );

  return (
    <aside
      className={`flex flex-col bg-white text-gray-800 border-l border-gray-200 shadow-xl ${
        standalone ? 'w-full h-screen' : 'w-full h-full'
      }`}
    >
      {/* Side Panel Header */}
      <div className="flex-none bg-slate-900 text-white px-3 py-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-indigo-500 text-xs font-bold shrink-0">
            EA
          </span>
          <div className="truncate">
            <div className="text-xs font-semibold leading-tight truncate">
              EACore Assistant
            </div>
            <div className="text-[10px] text-slate-300 truncate">
              {user?.name || user?.email || 'Authenticated'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setOverlayApp({ type: 'settings', title: 'システム設定', props: {} })}
            className="px-2 py-1 text-xs rounded hover:bg-slate-700 text-slate-200 transition-colors"
            title="システム設定"
          >
            ⚙
          </button>
          {!standalone && onToggleExpand && (
            <button
              type="button"
              onClick={onToggleExpand}
              className="px-2 py-1 text-xs rounded hover:bg-slate-700 text-slate-200 transition-colors"
              title={isExpanded ? '標準幅に戻す' : 'パネルを広げる'}
            >
              {isExpanded ? '◧' : '◨'}
            </button>
          )}
          {standalone && onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="px-2 py-1 text-[11px] rounded bg-slate-700 hover:bg-slate-600 text-slate-100 transition-colors"
            >
              ログアウト
            </button>
          )}
          {!standalone && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-2 py-1 text-xs rounded hover:bg-slate-700 text-slate-200 transition-colors"
              title="サイドパネルを閉じる"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex-none flex border-b border-gray-200 bg-gray-50 px-2 pt-1.5 gap-1">
        {TABS.map((tab) => {
          const isActive = !overlayApp && activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-t border-b-2 transition-colors ${
                isActive
                  ? 'bg-white text-indigo-700 border-indigo-600 shadow-2xs'
                  : 'text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
        {overlayApp && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-t border-b-2 bg-white text-indigo-700 border-indigo-600">
            <span>⚙ {overlayApp.title}</span>
            <button
              type="button"
              onClick={() => setOverlayApp(null)}
              className="ml-1 text-gray-400 hover:text-gray-700"
              title="閉じる"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 min-h-0 relative overflow-hidden bg-white">
        <ErrorBoundary>
          {overlayApp?.type === 'settings' ? (
            <div className="w-full h-full overflow-auto">
              <SystemSettings user={user} />
            </div>
          ) : (
            <>
              <div className={`w-full h-full ${activeTab === 'mcp-chat' ? 'block' : 'hidden'}`}>
                <McpChat
                  user={user}
                  capabilities={capabilities}
                  onOpen={handleAppOpen}
                />
              </div>
              <div className={`w-full h-full ${activeTab === 'knowledge-base' ? 'block' : 'hidden'}`}>
                <KnowledgeBase
                  user={user}
                  capabilities={capabilities}
                  onOpen={handleAppOpen}
                />
              </div>
            </>
          )}
        </ErrorBoundary>
      </div>
    </aside>
  );
};

export default SidePanelWidget;
