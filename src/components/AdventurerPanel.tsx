import { Adventurer, levelFromExp } from '../domain/entities/Adventurer';
import './AdventurerPanel.css';

interface AdventurerPanelProps {
  adventurer: Adventurer;
}

export const AdventurerPanel = ({ adventurer }: AdventurerPanelProps) => {
  const levelInfo = levelFromExp(adventurer.exp);
  const expPercent = levelInfo.expToNext > 0 
    ? Math.round((levelInfo.expInLevel / levelInfo.expToNext) * 100) 
    : 0;
  
  return (
    <div className="adventurer-panel">
      <div className="adventurer-panel__header">
        <div className="adventurer-panel__avatar">
          <span className="adventurer-panel__level">Lv.{adventurer.level}</span>
        </div>
        <div className="adventurer-panel__info">
          <h2 className="adventurer-panel__name">{adventurer.name}</h2>
          <p className="adventurer-panel__title">{adventurer.title}</p>
        </div>
        <div className="adventurer-panel__gold">
          <span className="adventurer-panel__gold-icon">💰</span>
          <span className="adventurer-panel__gold-amount">
            {adventurer.completedQuests * 10 + adventurer.level * 20}
          </span>
        </div>
      </div>
      
      <div className="adventurer-panel__exp">
        <div className="adventurer-panel__exp-label">
          <span>经验值</span>
          <span>{levelInfo.expInLevel} / {levelInfo.expToNext}</span>
        </div>
        <div className="adventurer-panel__exp-bar">
          <div 
            className="adventurer-panel__exp-fill"
            style={{ width: `${expPercent}%` }}
          />
        </div>
      </div>
      
      <div className="adventurer-panel__stats">
        <div className="adventurer-panel__stat">
          <span className="adventurer-panel__stat-icon">⚔️</span>
          <span className="adventurer-panel__stat-label">力量</span>
          <span className="adventurer-panel__stat-value">{adventurer.stats.strength}</span>
        </div>
        <div className="adventurer-panel__stat">
          <span className="adventurer-panel__stat-icon">💡</span>
          <span className="adventurer-panel__stat-label">智慧</span>
          <span className="adventurer-panel__stat-value">{adventurer.stats.wisdom}</span>
        </div>
        <div className="adventurer-panel__stat">
          <span className="adventurer-panel__stat-icon">🛡️</span>
          <span className="adventurer-panel__stat-label">耐力</span>
          <span className="adventurer-panel__stat-value">{adventurer.stats.endurance}</span>
        </div>
        <div className="adventurer-panel__stat">
          <span className="adventurer-panel__stat-icon">✨</span>
          <span className="adventurer-panel__stat-label">魅力</span>
          <span className="adventurer-panel__stat-value">{adventurer.stats.charisma}</span>
        </div>
      </div>
      
      <div className="adventurer-panel__streak">
        <span className="adventurer-panel__streak-icon">🔥</span>
        <span className="adventurer-panel__streak-label">连续冒险</span>
        <span className="adventurer-panel__streak-value">{adventurer.streakDays} 天</span>
      </div>
    </div>
  );
};