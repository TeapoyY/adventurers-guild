import { Quest, QUEST_TYPE_META, DIFFICULTY_META } from '../domain/entities/Quest';
import { formatDeadline, isOverdue } from '../domain/utils/gameLogic';
import './QuestCard.css';

interface QuestCardProps {
  quest: Quest;
  onAccept?: () => void;
  onComplete?: () => void;
  onAbandon?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export const QuestCard = ({ 
  quest, 
  onAccept, 
  onComplete, 
  onAbandon,
  onDelete,
  showActions = true 
}: QuestCardProps) => {
  const typeMeta = QUEST_TYPE_META[quest.type];
  const diffMeta = DIFFICULTY_META[quest.difficulty];
  const overdue = isOverdue(quest.deadline);
  
  const handleAction = (e: React.MouseEvent, action?: () => void) => {
    e.stopPropagation();
    action?.();
  };
  
  return (
    <div className={`quest-card quest-card--${quest.status} ${overdue && quest.status === 'accepted' ? 'quest-card--overdue' : ''}`}>
      <div className="quest-card__header">
        <span className="quest-card__type" style={{ color: typeMeta.color }}>
          {typeMeta.icon} {typeMeta.label}
        </span>
        <span 
          className="quest-card__difficulty"
          style={{ color: diffMeta.color }}
        >
          ★ {diffMeta.label}
        </span>
      </div>
      
      <h3 className="quest-card__title">{quest.title}</h3>
      
      {quest.description && (
        <p className="quest-card__description">{quest.description}</p>
      )}
      
      <div className="quest-card__footer">
        <div className="quest-card__rewards">
          <span className="quest-card__exp">✨ {quest.rewardExp}</span>
          <span className="quest-card__gold">💰 {quest.rewardGold}</span>
        </div>
        
        {quest.deadline && (
          <span className={`quest-card__deadline ${overdue ? 'quest-card__deadline--overdue' : ''}`}>
            ⏰ {formatDeadline(quest.deadline)}
          </span>
        )}
      </div>
      
      {showActions && (
        <div className="quest-card__actions">
          {quest.status === 'posted' && onAccept && (
            <button className="quest-card__btn quest-card__btn--accept" onClick={(e) => handleAction(e, onAccept)}>
              接取委托
            </button>
          )}
          
          {quest.status === 'accepted' && onComplete && (
            <>
              <button className="quest-card__btn quest-card__btn--complete" onClick={(e) => handleAction(e, onComplete)}>
                ✅ 完成
              </button>
              {onAbandon && (
                <button className="quest-card__btn quest-card__btn--abandon" onClick={(e) => handleAction(e, onAbandon)}>
                  放弃
                </button>
              )}
            </>
          )}
          
          {(quest.status === 'completed' || quest.status === 'failed') && onDelete && (
            <button className="quest-card__btn quest-card__btn--delete" onClick={(e) => handleAction(e, onDelete)}>
              🗑️
            </button>
          )}
        </div>
      )}
      
      {quest.tags.length > 0 && (
        <div className="quest-card__tags">
          {quest.tags.map(tag => (
            <span key={tag} className="quest-card__tag">#{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
};