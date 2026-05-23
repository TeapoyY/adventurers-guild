import { useState } from 'react';
import './AddQuestDialog.css';

interface AddQuestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, description: string, deadline: number | null) => void;
}

export const AddQuestDialog = ({ isOpen, onClose, onAdd }: AddQuestDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadlineEnabled, setDeadlineEnabled] = useState(false);
  const [deadlineDate, setDeadlineDate] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('');
  
  if (!isOpen) return null;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    let deadline: number | null = null;
    if (deadlineEnabled && deadlineDate && deadlineTime) {
      deadline = new Date(`${deadlineDate}T${deadlineTime}`).getTime();
    }
    
    onAdd(title.trim(), description.trim(), deadline);
    setTitle('');
    setDescription('');
    setDeadlineEnabled(false);
    setDeadlineDate('');
    setDeadlineTime('');
    onClose();
  };
  
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <div className="add-quest-dialog__backdrop" onClick={handleBackdropClick}>
      <div className="add-quest-dialog">
        <div className="add-quest-dialog__header">
          <h2 className="add-quest-dialog__title">📜 发布新委托</h2>
          <button className="add-quest-dialog__close" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="add-quest-dialog__form">
          <div className="add-quest-dialog__field">
            <label className="add-quest-dialog__label">委托标题 *</label>
            <input
              type="text"
              className="add-quest-dialog__input"
              placeholder="例如: 消灭办公室的噪音怪兽"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>
          
          <div className="add-quest-dialog__field">
            <label className="add-quest-dialog__label">委托详情</label>
            <textarea
              className="add-quest-dialog__textarea"
              placeholder="描述委托的具体内容..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="add-quest-dialog__field">
            <label className="add-quest-dialog__checkbox">
              <input
                type="checkbox"
                checked={deadlineEnabled}
                onChange={(e) => setDeadlineEnabled(e.target.checked)}
              />
              <span>设置截止时间</span>
            </label>
            
            {deadlineEnabled && (
              <div className="add-quest-dialog__deadline-inputs">
                <input
                  type="date"
                  className="add-quest-dialog__input add-quest-dialog__input--date"
                  value={deadlineDate}
                  onChange={(e) => setDeadlineDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
                <input
                  type="time"
                  className="add-quest-dialog__input add-quest-dialog__input--time"
                  value={deadlineTime}
                  onChange={(e) => setDeadlineTime(e.target.value)}
                />
              </div>
            )}
          </div>
          
          <div className="add-quest-dialog__actions">
            <button type="button" className="add-quest-dialog__btn add-quest-dialog__btn--cancel" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="add-quest-dialog__btn add-quest-dialog__btn--submit" disabled={!title.trim()}>
              📜 发布委托
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};