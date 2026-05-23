// Quest Type - Defines the nature of the quest
export type QuestType = 'combat' | 'gathering' | 'protection' | 'exploration';

// Quest Difficulty - Affects rewards
export type Difficulty = 'common' | 'elite' | 'legendary';

// Quest Status - Current state
export type QuestStatus = 'posted' | 'accepted' | 'completed' | 'failed';

// Quest entity
export interface Quest {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  difficulty: Difficulty;
  rewardExp: number;
  rewardGold: number;
  deadline: number | null; // Unix timestamp
  status: QuestStatus;
  createdAt: number; // Unix timestamp
  completedAt: number | null;
  tags: string[];
}

// Quest type metadata
export const QUEST_TYPE_META: Record<QuestType, { icon: string; color: string; label: string }> = {
  combat: { icon: '⚔️', color: 'var(--color-combat)', label: '战斗' },
  gathering: { icon: '🌿', color: 'var(--color-gathering)', label: '采集' },
  protection: { icon: '🛡️', color: 'var(--color-protection)', label: '守护' },
  exploration: { icon: '🗺️', color: 'var(--color-exploration)', label: '探索' },
};

// Difficulty metadata
export const DIFFICULTY_META: Record<Difficulty, { color: string; label: string; multiplier: number }> = {
  common: { color: '#B0BEC5', label: '普通', multiplier: 1 },
  elite: { color: '#4A90D9', label: '精英', multiplier: 2.5 },
  legendary: { color: '#D4AF37', label: '传说', multiplier: 5 },
};

// Create empty quest
export const createEmptyQuest = (): Quest => ({
  id: '',
  title: '',
  description: '',
  type: 'combat',
  difficulty: 'common',
  rewardExp: 0,
  rewardGold: 0,
  deadline: null,
  status: 'posted',
  createdAt: Date.now(),
  completedAt: null,
  tags: [],
});