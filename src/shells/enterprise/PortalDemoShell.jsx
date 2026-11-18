import React, { useState } from 'react';
import SidePanelWidget from './SidePanelWidget';

const AI_MENU_TITLE = 'EA-Core AI Agent';

const AI_MENU_ITEMS = [
  { id: 'mcp-chat', label: 'MCP Chat', icon: '💬' },
  { id: 'knowledge-base', label: 'Knowledge Base', icon: '📚' },
  { id: 'hide', label: 'パネル非表示', icon: '⏏' },
];

const SIDEBAR_GROUPS = [
  {
    title: '組織振替',
    items: ['組織振替'],
  },
  {
    title: '案件照会',
    items: ['見積依頼・見積回答', 'すべて', '発注', '検収', '検収完了', '一時保存'],
  },
  {
    title: '契約案件照会',
    items: ['すべて', '契約申請', '契約中', '契約完了', '一時保存'],
  },
  {
    title: '契約支払案件照会',
    items: ['すべて', '支払確認', '支払申請完了'],
  },
  {
    title: '請求支払案件照会',
    items: ['すべて（支払申請待ち除く）'],
  },
];

const TODO_GROUPS = [
  {
    title: '見積ToDo',
    items: [
      { label: '承認待ち', count: 42, alert: false },
      { label: '差戻し', count: 19, alert: true },
      { label: '回答待ち', count: 292, alert: false },
      { label: '回答あり', count: 114, alert: true },
      { label: '採用なし', count: 14, alert: true },
    ],
  },
  {
    title: '発注ToDo',
    items: [
      { label: '承認待ち', count: 154, alert: false },
      { label: '差戻し', count: 42, alert: true },
      { label: '受注待ち', count: 192, alert: false },
      { label: '受注辞退', count: 15, alert: true },
    ],
  },
  {
    title: '検収ToDo',
    items: [
      { label: '納品待ち', count: 80, alert: false },
      { label: '未検収', count: 93, alert: true },
      { label: '承認待ち', count: 32, alert: false },
    ],
  },
  {
    title: '契約ToDo',
    items: [
      { label: '承認待ち', count: 12, alert: false },
      { label: '差戻し', count: 0, alert: false },
      { label: '変更依頼', count: 2, alert: true },
    ],
  },
];

const CATALOG_PROVIDERS = [
  { id: 'original', name: 'オリジナルカタログ', color: 'border-rose-300 text-rose-700' },
  { id: 'amazon', name: 'Amazon Business', color: 'border-sky-300 text-sky-700' },
  { id: 'tanomail', name: 'たのめーる', color: 'border-emerald-300 text-emerald-700' },
  { id: 'askul', name: 'アスクル', color: 'border-blue-300 text-blue-700' },
  { id: 'bic', name: 'ビックカメラ', color: 'border-red-300 text-red-700' },
  { id: 'orange', name: 'オレンジブック.com', color: 'border-orange-300 text-orange-700' },
  { id: 'monotaro', name: 'モノタロウ', color: 'border-amber-300 text-amber-700' },
  { id: 'midori', name: 'ミドリ安全', color: 'border-green-300 text-green-700' },
  { id: 'as1', name: 'アズワン', color: 'border-cyan-300 text-cyan-700' },
  { id: 'misumi', name: 'ミスミ', color: 'border-indigo-300 text-indigo-700' },
];

/**
 * 既存業務システム（パターン②）への EACore サイドパネル組み込みを検証・デモするためのポータルシェル。
 */
const PortalDemoShell = ({ user, onLogout, config }) => {
  // EA-Core パネルはメイン領域に表示する（右ドッキングは廃止）
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [hasPanelMounted, setHasPanelMounted] = useState(false);
  const [panelTab, setPanelTab] = useState('mcp-chat');
  const [activeMenu, setActiveMenu] = useState('トップページ');
  const [searchText, setSearchText] = useState('マウス');

  const openPanelWithTab = (tabId) => {
    setPanelTab(tabId);
    setIsPanelOpen(true);
    setHasPanelMounted(true);
    setActiveMenu(`${AI_MENU_TITLE}:${tabId}`);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    setActiveMenu('トップページ');
  };

  const selectHostMenu = (key) => {
    setIsPanelOpen(false);
    setActiveMenu(key);
  };

  return (
    <div className="w-full h-screen flex flex-col bg-slate-100 text-slate-800 overflow-hidden font-sans">
      {/* Top Global Header */}
      <header className="flex-none h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between gap-4 shadow-2xs z-20">
        <div className="flex items-center gap-4 min-w-0">
          <div className="font-serif italic font-bold text-xl tracking-tight text-slate-800 whitespace-nowrap">
            PURCHASE <span className="text-amber-600">ONE</span>
            <span className="ml-2 not-italic font-sans text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
              Demo Host UI
            </span>
          </div>
          <button
            type="button"
            onClick={closePanel}
            className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 whitespace-nowrap"
          >
            <span>🏠</span>
            <span>トップページへ</span>
          </button>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right leading-tight hidden sm:block">
            <div className="text-[10px] text-slate-400">ログインユーザー</div>
            <div className="text-xs font-medium text-slate-700">
              {user?.name || user?.email || 'Demo User'}
            </div>
          </div>

          <a
            href="?shell=desktop"
            className="px-2.5 py-1 text-xs rounded border border-slate-300 text-slate-600 hover:bg-slate-50 whitespace-nowrap"
            title="従来の macOS デスクトップ UI に切り替え"
          >
            Desktop UI
          </a>

          <button
            type="button"
            onClick={onLogout}
            className="px-2.5 py-1 text-xs rounded border border-slate-300 text-slate-600 hover:bg-slate-50 whitespace-nowrap"
          >
            ログアウト
          </button>
        </div>
      </header>

      {/* Main Body: Left Sidebar + (Host Portal Area | EA-Core AI Agent) */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <nav className="w-48 flex-none bg-[#2c3b4c] text-slate-200 overflow-y-auto text-xs select-none">
          {/* EA-Core AI Agent Menu */}
          <div className="border-b border-slate-600/50">
            <div className="px-3 py-2 text-[11px] font-semibold text-indigo-200 bg-[#2a2f5a] flex items-center gap-1.5">
              <span className="inline-flex items-center justify-center w-4 h-4 rounded bg-indigo-500 text-[8px] font-bold text-white">
                EA
              </span>
              <span>{AI_MENU_TITLE}</span>
            </div>
            <ul>
              {AI_MENU_ITEMS.map((item) => {
                const isActive =
                  item.id === 'hide' ? false : isPanelOpen && panelTab === item.id;
                const isDisabled = item.id === 'hide' && !isPanelOpen;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      disabled={isDisabled}
                      onClick={() =>
                        item.id === 'hide' ? closePanel() : openPanelWithTab(item.id)
                      }
                      className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors ${
                        isActive
                          ? 'bg-indigo-600 text-white font-medium'
                          : isDisabled
                            ? 'text-slate-500 cursor-default'
                            : 'hover:bg-[#354659] text-slate-200'
                      }`}
                    >
                      <span className="truncate flex items-center gap-1.5">
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </span>
                      <span className="text-slate-400 text-[10px]">›</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {SIDEBAR_GROUPS.map((group) => (
            <div key={group.title} className="border-b border-slate-600/50">
              <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 bg-[#243140]">
                {group.title}
              </div>
              <ul>
                {group.items.map((item) => {
                  const key = `${group.title}:${item}`;
                  const isActive = !isPanelOpen && activeMenu === key;
                  return (
                    <li key={key}>
                      <button
                        type="button"
                        onClick={() => selectHostMenu(key)}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors ${
                          isActive
                            ? 'bg-[#1d2834] text-white font-medium'
                            : 'hover:bg-[#354659] text-slate-200'
                        }`}
                      >
                        <span className="truncate">{item}</span>
                        <span className="text-slate-400 text-[10px]">›</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Host System Main Workspace */}
        <main className={`flex-1 min-w-0 overflow-y-auto bg-white p-5 space-y-6 ${isPanelOpen ? 'hidden' : ''}`}>
          {/* ToDo Status Bar */}
          <section className="border border-slate-200 rounded-md p-3 bg-slate-50/70">
            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-4 gap-4">
              {TODO_GROUPS.map((group) => (
                <div key={group.title} className="space-y-1.5">
                  <div className="text-xs font-semibold text-slate-700">{group.title}</div>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <div key={item.label} className="flex flex-col items-center">
                        <span
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                            item.alert
                              ? 'bg-amber-500 text-white border-amber-500'
                              : 'bg-white text-slate-700 border-slate-400'
                          }`}
                        >
                          {item.count}
                        </span>
                        <span
                          className={`text-[10px] mt-0.5 ${
                            item.alert ? 'text-amber-600 font-medium' : 'text-slate-500'
                          }`}
                        >
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Catalog Search Section */}
          <section className="space-y-2">
            <div className="flex items-baseline gap-3">
              <h2 className="text-lg font-medium text-slate-800">カタログで購入</h2>
              <span className="text-xs text-slate-500">
                登録しているカタログを全部まとめて検索できます
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex border border-slate-300 rounded overflow-hidden focus-within:ring-2 focus-within:ring-amber-400">
                <select className="bg-slate-50 border-r border-slate-300 px-3 py-2 text-xs text-slate-700 outline-none">
                  <option>すべて</option>
                  <option>OA・PC周辺機器</option>
                  <option>事務用品</option>
                </select>
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="商品名・型番で検索"
                  className="flex-1 px-3 py-2 text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={() => openPanelWithTab('mcp-chat')}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-4 text-sm font-medium transition-colors"
                >
                  🔍 検索
                </button>
              </div>
              <button
                type="button"
                onClick={() => openPanelWithTab('mcp-chat')}
                className="px-3 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium whitespace-nowrap shadow-2xs transition-colors"
              >
                🤖 AIに購買相談
              </button>
              <button
                type="button"
                onClick={() => openPanelWithTab('knowledge-base')}
                className="px-3 py-2 rounded border border-indigo-300 text-indigo-700 hover:bg-indigo-50 text-xs font-medium whitespace-nowrap transition-colors"
              >
                📚 購買規程を確認
              </button>
            </div>
          </section>

          {/* Catalog Providers Grid */}
          <section className="space-y-3">
            <h2 className="text-lg font-medium text-slate-800">購入先のカタログを選んで購入</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {CATALOG_PROVIDERS.map((provider) => (
                <button
                  key={provider.id}
                  type="button"
                  onClick={() => setActiveMenu(`カタログ:${provider.name}`)}
                  className={`border rounded p-4 bg-white hover:bg-slate-50 transition-colors flex flex-col items-center justify-center gap-1.5 text-center shadow-2xs ${provider.color}`}
                >
                  <span className="text-sm font-bold">{provider.name}</span>
                  <span className="text-[11px] text-slate-500">カタログを開く</span>
                </button>
              ))}
            </div>
          </section>

          {/* Current Demo State Info */}
          <section className="text-xs text-slate-500 border-t border-slate-200 pt-3 flex flex-wrap items-center justify-between gap-2">
            <span>選択中ビュー: {activeMenu}</span>
            <span>
              単体サイドパネル確認用 URL:{' '}
              <a href="?shell=sidepanel" className="text-indigo-600 underline">
                ?shell=sidepanel
              </a>
            </span>
          </section>
        </main>

        {/* EA-Core AI Agent（メイン領域を置き換えて表示。一度開いたら状態保持のためマウントを維持） */}
        {hasPanelMounted && (
          <div className={`flex-1 min-w-0 h-full ${isPanelOpen ? 'block' : 'hidden'}`}>
            <SidePanelWidget
              user={user}
              config={config}
              onLogout={onLogout}
              onClose={closePanel}
              activeTab={panelTab}
              onTabChange={(tabId) => openPanelWithTab(tabId)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PortalDemoShell;
