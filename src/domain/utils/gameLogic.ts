import { Difficulty, QuestType } from '../entities/Quest';

export const calculateDifficulty = (
  title: string,
  description: string,
  deadline: number | null
): Difficulty => {
  let score = 0;
  const text = `${title} ${description}`.toLowerCase();

  // Complexity indicators
  const complexKeywords = ['项目', '报告', '计划', '季度', '年度', '策划', '方案', '设计', '开发', '系统'];
  const mediumKeywords = ['完成', '整理', '准备', '整理', '总结', '分析', '优化', '改进'];
  const urgentKeywords = ['紧急', '马上', '立刻', '今天', '明天', '尽快', '优先'];

  complexKeywords.forEach(kw => { if (text.includes(kw)) score += 3; });
  mediumKeywords.forEach(kw => { if (text.includes(kw)) score += 2; });
  urgentKeywords.forEach(kw => { if (text.includes(kw)) score += 2; });

  // Time pressure
  if (deadline) {
    const now = Date.now();
    const daysUntil = Math.floor((deadline - now) / (1000 * 60 * 60 * 24));
    
    if (daysUntil < 0) score += 5;        // Overdue
    else if (daysUntil === 0) score += 3; // Today
    else if (daysUntil <= 2) score += 2;  // Within 2 days
    else if (daysUntil <= 7) score += 1;  // Within a week
  }

  // Convert to difficulty
  if (score >= 6) return 'legendary';
  if (score >= 3) return 'elite';
  return 'common';
};

// Auto-detect quest type from content
export const detectQuestType = (title: string, description: string): QuestType => {
  const text = `${title} ${description}`.toLowerCase();
  
  const combatKeywords = ['消灭', '击败', '清除', '处理', '解决', '赶走', '击败', '战胜'];
  const gatheringKeywords = ['收集', '整理', '归类', '统计', '调研', '搜索', '查找', '获取'];
  const protectionKeywords = ['守护', '维护', '监控', '保持', '确保', '保养', '检查', '看护'];
  const explorationKeywords = ['探索', '发现', '计划', '规划', '设计', '研究', '分析', '思考'];

  if (combatKeywords.some(kw => text.includes(kw))) return 'combat';
  if (gatheringKeywords.some(kw => text.includes(kw))) return 'gathering';
  if (protectionKeywords.some(kw => text.includes(kw))) return 'protection';
  if (explorationKeywords.some(kw => text.includes(kw))) return 'exploration';
  
  return 'combat'; // Default
};

// Calculate rewards based on difficulty and streak
export const calculateRewards = (
  difficulty: Difficulty,
  streakDays: number
): { exp: number; gold: number } => {
  const baseExp = { common: 15, elite: 75, legendary: 350 }[difficulty];
  const baseGold = { common: 10, elite: 45, legendary: 150 }[difficulty];

  // Streak multipliers (capped)
  const expMultiplier = 1 + Math.min(streakDays * 0.05, 0.5);
  const goldMultiplier = 1 + Math.min(streakDays * 0.03, 0.3);

  return {
    exp: Math.round(baseExp * expMultiplier),
    gold: Math.round(baseGold * goldMultiplier),
  };
};

// Check if quest is overdue
export const isOverdue = (deadline: number | null): boolean => {
  if (!deadline) return false;
  return Date.now() > deadline;
};

// Get days until deadline (negative if overdue)
export const daysUntilDeadline = (deadline: number | null): number | null => {
  if (!deadline) return null;
  const days = Math.floor((deadline - Date.now()) / (1000 * 60 * 60 * 24));
  return days;
};

// Format deadline for display
export const formatDeadline = (deadline: number | null): string => {
  if (!deadline) return '无期限';
  
  const now = Date.now();
  const diff = deadline - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days < 0) return `已逾期 ${Math.abs(days)} 天`;
  if (days === 0) return '今天截止';
  if (days === 1) return '明天截止';
  if (days <= 7) return `${days} 天后截止`;
  
  const date = new Date(deadline);
  return `${date.getMonth() + 1}月${date.getDate()}日截止`;
};