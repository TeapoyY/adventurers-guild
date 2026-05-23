// Adventurer stats
export interface AdventurerStats {
  strength: number;   // Power - speed of completing quests
  wisdom: number;      // Wisdom - accuracy of quest classification
  endurance: number;   // Stamina - ability to complete consecutive quests
  charisma: number;   // Charm - bonus for social quests
}

// Achievement entity
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: number | null;
}

// Adventurer entity - the player's character
export interface Adventurer {
  id: string;
  name: string;
  level: number;
  exp: number;
  title: string;
  stats: AdventurerStats;
  completedQuests: number;
  streakDays: number;
  lastCompletedDate: string | null; // ISO date string
  achievements: Achievement[];
}

// Level titles
export const LEVEL_TITLES: Record<number, string> = {
  1: '新手冒险家',
  5: '初级冒险家',
  10: '资深冒险家',
  15: '精英冒险家',
  20: '大师冒险家',
  25: '英雄冒险家',
  30: '传奇冒险家',
  40: '史诗冒险家',
  50: '神话冒险家',
};

// Calculate exp required for a level
export const expForLevel = (level: number): number => {
  if (level <= 1) return 0;
  return Math.floor(100 * Math.pow(level - 1, 1.5));
};

// Calculate total exp needed to reach a level
export const totalExpForLevel = (level: number): number => {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += expForLevel(i + 1);
  }
  return total;
};

// Calculate level from total exp
export const levelFromExp = (totalExp: number): { level: number; expInLevel: number; expToNext: number } => {
  let level = 1;
  let remaining = totalExp;
  
  while (true) {
    const needed = expForLevel(level + 1);
    if (remaining < needed) {
      return {
        level,
        expInLevel: remaining,
        expToNext: needed,
      };
    }
    remaining -= needed;
    level++;
  }
};

// Create initial adventurer
export const createInitialAdventurer = (name: string): Adventurer => ({
  id: 'player',
  name,
  level: 1,
  exp: 0,
  title: LEVEL_TITLES[1],
  stats: {
    strength: 5,
    wisdom: 5,
    endurance: 5,
    charisma: 5,
  },
  completedQuests: 0,
  streakDays: 0,
  lastCompletedDate: null,
  achievements: [],
});

// Default achievements
export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_quest', name: '初出茅庐', description: '完成你的第一个委托', icon: '🏅', unlockedAt: null },
  { id: 'streak_3', name: '三日之约', description: '连续3天完成委托', icon: '🔥', unlockedAt: null },
  { id: 'streak_7', name: '坚持一周', description: '连续7天完成委托', icon: '⭐', unlockedAt: null },
  { id: 'streak_30', name: '坚持者', description: '连续30天完成委托', icon: '👑', unlockedAt: null },
  { id: 'quests_10', name: '小有名气', description: '累计完成10个委托', icon: '🎖️', unlockedAt: null },
  { id: 'quests_50', name: '资深冒险家', description: '累计完成50个委托', icon: '🏆', unlockedAt: null },
  { id: 'elite_quest', name: '精英猎手', description: '完成一个精英委托', icon: '⚡', unlockedAt: null },
  { id: 'legendary_quest', name: '传说缔造者', description: '完成一个传说委托', icon: '💫', unlockedAt: null },
];