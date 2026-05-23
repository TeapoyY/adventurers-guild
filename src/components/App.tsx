import { useState } from 'react';
import { useAppState } from '../state/AppState';
import { QuestCard } from './QuestCard';
import { AdventurerPanel } from './AdventurerPanel';
import { AddQuestDialog } from './AddQuestDialog';
import './App.css';

export const App = () => {
  const {
    adventurer,
    currentTab,
    setCurrentTab,
    isLoading,
    addQuest,
    acceptQuest,
    completeQuest,
    abandonQuest,
    deleteQuest,
    updateAdventurerName,
    getPostedQuests,
    getAcceptedQuests,
    getCompletedQuests,
    getFailedQuests,
  } = useAppState();
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(adventurer.name);
  
  if (isLoading) {
    return (
      <div className="app app--loading">
        <div className="loading-spinner">⚔️ 加载中...</div>
      </div>
    );
  }
  
  const postedQuests = getPostedQuests();
  const acceptedQuests = getAcceptedQuests();
  const completedQuests = getCompletedQuests();
  const failedQuests = getFailedQuests();
  
  const handleNameSubmit = () => {
    if (tempName.trim()) {
      updateAdventurerName(tempName.trim());
    }
    setEditingName(false);
  };
  
  const totalGold = adventurer.completedQuests * 10 + adventurer.level * 20;
  
  return (
    <div className="app">
      {/* Header */}
      <header className="app__header">
        <div className="app__header-content">
          <h1 className="app__title font-display">冒险家协会</h1>
          <p className="app__subtitle">Adventurers Guild</p>
        </div>
        <div className="app__header-gold">
          <span className="app__gold-icon">💰</span>
          <span className="app__gold-value">{totalGold}</span>
        </div>
      </header>
      
      {/* Adventurer Panel */}
      <section className="app__adventurer">
        <AdventurerPanel adventurer={adventurer} />
      </section>
      
      {/* Main Content */}
      <main className="app__main">
        {currentTab === 'board' && (
          <div className="app__board">
            {/* Accepted Quests */}
            {acceptedQuests.length > 0 && (
              <div className="app__section">
                <h2 className="app__section-title">
                  <span className="app__section-icon">⚔️</span>
                  进行中的委托
                </h2>
                <div className="app__quest-grid">
                  {acceptedQuests.map(quest => (
                    <QuestCard
                      key={quest.id}
                      quest={quest}
                      onComplete={() => completeQuest(quest.id)}
                      onAbandon={() => abandonQuest(quest.id)}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Posted Quests */}
            <div className="app__section">
              <h2 className="app__section-title">
                <span className="app__section-icon">📜</span>
                委托公告板
                {postedQuests.length > 0 && (
                  <span className="app__section-count">{postedQuests.length}</span>
                )}
              </h2>
              {postedQuests.length > 0 ? (
                <div className="app__quest-grid">
                  {postedQuests.map(quest => (
                    <QuestCard
                      key={quest.id}
                      quest={quest}
                      onAccept={() => acceptQuest(quest.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="app__empty-state">
                  <p className="app__empty-icon">🗺️</p>
                  <p className="app__empty-text">公告板上暂无委托</p>
                  <p className="app__empty-hint">点击下方按钮发布新委托</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {currentTab === 'log' && (
          <div className="app__log">
            {completedQuests.length > 0 || failedQuests.length > 0 ? (
              <>
                {completedQuests.length > 0 && (
                  <div className="app__section">
                    <h2 className="app__section-title app__section-title--success">
                      <span className="app__section-icon">✅</span>
                      已完成 ({completedQuests.length})
                    </h2>
                    <div className="app__quest-list">
                      {completedQuests
                        .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0))
                        .map(quest => (
                          <QuestCard
                            key={quest.id}
                            quest={quest}
                            showActions={false}
                          />
                        ))}
                    </div>
                  </div>
                )}
                
                {failedQuests.length > 0 && (
                  <div className="app__section">
                    <h2 className="app__section-title app__section-title--danger">
                      <span className="app__section-icon">❌</span>
                      已放弃 ({failedQuests.length})
                    </h2>
                    <div className="app__quest-list">
                      {failedQuests
                        .sort((a, b) => b.createdAt - a.createdAt)
                        .map(quest => (
                          <QuestCard
                            key={quest.id}
                            quest={quest}
                            onDelete={() => deleteQuest(quest.id)}
                          />
                        ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="app__empty-state">
                <p className="app__empty-icon">📖</p>
                <p className="app__empty-text">冒险日志为空</p>
                <p className="app__empty-hint">完成委托后将记录在这里</p>
              </div>
            )}
          </div>
        )}
        
        {currentTab === 'inventory' && (
          <div className="app__inventory">
            <div className="app__section">
              <h2 className="app__section-title">
                <span className="app__section-icon">🏅</span>
                成就徽章
              </h2>
              <div className="app__achievements">
                {adventurer.achievements.map(ach => (
                  <div 
                    key={ach.id} 
                    className={`app__achievement ${ach.unlockedAt ? 'app__achievement--unlocked' : 'app__achievement--locked'}`}
                  >
                    <span className="app__achievement-icon">{ach.icon}</span>
                    <span className="app__achievement-name">{ach.name}</span>
                    <span className="app__achievement-desc">{ach.description}</span>
                    {ach.unlockedAt && (
                      <span className="app__achievement-date">
                        {new Date(ach.unlockedAt).toLocaleDateString('zh-CN')}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="app__section">
              <h2 className="app__section-title">
                <span className="app__section-icon">📊</span>
                冒险统计
              </h2>
              <div className="app__stats-grid">
                <div className="app__stat-card">
                  <span className="app__stat-value">{adventurer.completedQuests}</span>
                  <span className="app__stat-label">完成委托</span>
                </div>
                <div className="app__stat-card">
                  <span className="app__stat-value">{adventurer.streakDays}</span>
                  <span className="app__stat-label">连续天数</span>
                </div>
                <div className="app__stat-card">
                  <span className="app__stat-value">{adventurer.level}</span>
                  <span className="app__stat-label">当前等级</span>
                </div>
                <div className="app__stat-card">
                  <span className="app__stat-value">{failedQuests.length}</span>
                  <span className="app__stat-label">放弃委托</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {currentTab === 'profile' && (
          <div className="app__profile">
            <div className="app__section">
              <h2 className="app__section-title">
                <span className="app__section-icon">👤</span>
                冒险家档案
              </h2>
              <div className="app__profile-card">
                {editingName ? (
                  <div className="app__name-edit">
                    <input
                      type="text"
                      className="app__name-input"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      autoFocus
                    />
                    <button 
                      className="app__name-btn app__name-btn--save"
                      onClick={handleNameSubmit}
                    >
                      保存
                    </button>
                    <button 
                      className="app__name-btn app__name-btn--cancel"
                      onClick={() => {
                        setTempName(adventurer.name);
                        setEditingName(false);
                      }}
                    >
                      取消
                    </button>
                  </div>
                ) : (
                  <div className="app__name-display">
                    <h3 className="app__profile-name">{adventurer.name}</h3>
                    <button 
                      className="app__edit-btn"
                      onClick={() => {
                        setTempName(adventurer.name);
                        setEditingName(true);
                      }}
                    >
                      ✏️ 修改
                    </button>
                  </div>
                )}
                
                <div className="app__profile-details">
                  <div className="app__profile-stat">
                    <span className="app__profile-stat-label">等级</span>
                    <span className="app__profile-stat-value">Lv. {adventurer.level}</span>
                  </div>
                  <div className="app__profile-stat">
                    <span className="app__profile-stat-label">称号</span>
                    <span className="app__profile-stat-value">{adventurer.title}</span>
                  </div>
                  <div className="app__profile-stat">
                    <span className="app__profile-stat-label">经验</span>
                    <span className="app__profile-stat-value">{adventurer.exp} EXP</span>
                  </div>
                </div>
                
                <div className="app__profile-abilities">
                  <h4 className="app__profile-abilities-title">能力值</h4>
                  <div className="app__ability-row">
                    <span className="app__ability-name">⚔️ 力量</span>
                    <div className="app__ability-bar">
                      <div 
                        className="app__ability-fill app__ability-fill--str" 
                        style={{ width: `${(adventurer.stats.strength / 20) * 100}%` }}
                      />
                    </div>
                    <span className="app__ability-value">{adventurer.stats.strength}</span>
                  </div>
                  <div className="app__ability-row">
                    <span className="app__ability-name">💡 智慧</span>
                    <div className="app__ability-bar">
                      <div 
                        className="app__ability-fill app__ability-fill--wis" 
                        style={{ width: `${(adventurer.stats.wisdom / 20) * 100}%` }}
                      />
                    </div>
                    <span className="app__ability-value">{adventurer.stats.wisdom}</span>
                  </div>
                  <div className="app__ability-row">
                    <span className="app__ability-name">🛡️ 耐力</span>
                    <div className="app__ability-bar">
                      <div 
                        className="app__ability-fill app__ability-fill--end" 
                        style={{ width: `${(adventurer.stats.endurance / 20) * 100}%` }}
                      />
                    </div>
                    <span className="app__ability-value">{adventurer.stats.endurance}</span>
                  </div>
                  <div className="app__ability-row">
                    <span className="app__ability-name">✨ 魅力</span>
                    <div className="app__ability-bar">
                      <div 
                        className="app__ability-fill app__ability-fill--cha" 
                        style={{ width: `${(adventurer.stats.charisma / 20) * 100}%` }}
                      />
                    </div>
                    <span className="app__ability-value">{adventurer.stats.charisma}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* FAB - Add Quest */}
      <button 
        className="app__fab"
        onClick={() => setShowAddDialog(true)}
        aria-label="发布新委托"
      >
        +
      </button>
      
      {/* Bottom Navigation */}
      <nav className="app__nav">
        <button 
          className={`app__nav-btn ${currentTab === 'board' ? 'app__nav-btn--active' : ''}`}
          onClick={() => setCurrentTab('board')}
        >
          <span className="app__nav-icon">📜</span>
          <span className="app__nav-label">委托板</span>
        </button>
        <button 
          className={`app__nav-btn ${currentTab === 'log' ? 'app__nav-btn--active' : ''}`}
          onClick={() => setCurrentTab('log')}
        >
          <span className="app__nav-icon">⚔️</span>
          <span className="app__nav-label">冒险日志</span>
        </button>
        <button 
          className={`app__nav-btn ${currentTab === 'inventory' ? 'app__nav-btn--active' : ''}`}
          onClick={() => setCurrentTab('inventory')}
        >
          <span className="app__nav-icon">🎒</span>
          <span className="app__nav-label">背包</span>
        </button>
        <button 
          className={`app__nav-btn ${currentTab === 'profile' ? 'app__nav-btn--active' : ''}`}
          onClick={() => setCurrentTab('profile')}
        >
          <span className="app__nav-icon">👤</span>
          <span className="app__nav-label">冒险家</span>
        </button>
      </nav>
      
      {/* Add Quest Dialog */}
      <AddQuestDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onAdd={addQuest}
      />
    </div>
  );
};