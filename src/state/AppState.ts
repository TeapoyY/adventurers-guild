import { useState, useCallback, useEffect } from 'react';
import { Quest } from '../domain/entities/Quest';
import { Adventurer, createInitialAdventurer, DEFAULT_ACHIEVEMENTS, levelFromExp, LEVEL_TITLES } from '../domain/entities/Adventurer';
import { calculateDifficulty, detectQuestType, calculateRewards } from '../domain/utils/gameLogic';
import { saveQuests, loadQuests, saveAdventurer, loadAdventurer } from '../data/storage';

// Generate unique ID
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Parse tags from text
const parseTags = (title: string, description: string): string[] => {
  const tags: string[] = [];
  const text = `${title} ${description}`;
  
  // Extract #tags
  const hashtagMatches = text.match(/#(\w+)/g);
  if (hashtagMatches) {
    tags.push(...hashtagMatches.map(t => t.substring(1)));
  }
  
  return [...new Set(tags)];
};

// Main app state hook
export const useAppState = () => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [adventurer, setAdventurer] = useState<Adventurer>(createInitialAdventurer('冒险家'));
  const [currentTab, setCurrentTab] = useState<'board' | 'log' | 'inventory' | 'profile'>('board');
  const [isLoading, setIsLoading] = useState(true);
  
  // Load from storage on mount
  useEffect(() => {
    const storedQuests = loadQuests();
    const storedAdventurer = loadAdventurer();
    setQuests(storedQuests);
    setAdventurer(storedAdventurer);
    setIsLoading(false);
  }, []);
  
  // Save quests when changed
  useEffect(() => {
    if (!isLoading) {
      saveQuests(quests);
    }
  }, [quests, isLoading]);
  
  // Save adventurer when changed
  useEffect(() => {
    if (!isLoading) {
      saveAdventurer(adventurer);
    }
  }, [adventurer, isLoading]);
  
  // Create a new quest
  const addQuest = useCallback((title: string, description: string, deadline: number | null = null) => {
    const difficulty = calculateDifficulty(title, description, deadline);
    const type = detectQuestType(title, description);
    const { exp, gold } = calculateRewards(difficulty, adventurer.streakDays);
    const tags = parseTags(title, description);
    
    const newQuest: Quest = {
      id: generateId(),
      title,
      description,
      type,
      difficulty,
      rewardExp: exp,
      rewardGold: gold,
      deadline,
      status: 'posted',
      createdAt: Date.now(),
      completedAt: null,
      tags,
    };
    
    setQuests(prev => [...prev, newQuest]);
    return newQuest;
  }, [adventurer.streakDays]);
  
  // Accept a quest
  const acceptQuest = useCallback((questId: string) => {
    setQuests(prev => prev.map(q => 
      q.id === questId ? { ...q, status: 'accepted' as const } : q
    ));
  }, []);
  
  // Complete a quest
  const completeQuest = useCallback((questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.status !== 'accepted') return;
    
    // Update quest status
    setQuests(prev => prev.map(q => 
      q.id === questId 
        ? { ...q, status: 'completed' as const, completedAt: Date.now() }
        : q
    ));
    
    // Update adventurer
    setAdventurer(prev => {
      let newAdventurer = { ...prev };
      
      // Add rewards
      const expGained = quest.rewardExp;
      let newExp = prev.exp + expGained;
      let newLevel = prev.level;
      let newTitle = prev.title;
      
      // Check for level up
      const levelInfo = levelFromExp(newExp);
      if (levelInfo.level > prev.level) {
        newLevel = levelInfo.level;
        newTitle = LEVEL_TITLES[newLevel] || prev.title;
      }
      
      // Update streak
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      let newStreak = prev.streakDays;
      
      if (prev.lastCompletedDate === yesterday) {
        newStreak = prev.streakDays + 1;
      } else if (prev.lastCompletedDate !== today) {
        newStreak = 1; // Reset streak
      }
      
      // Check achievements
      const newAchievements = [...prev.achievements];
      DEFAULT_ACHIEVEMENTS.forEach(ach => {
        const existing = newAchievements.find(a => a.id === ach.id);
        if (!existing) {
          newAchievements.push({ ...ach });
        }
      });
      
      // Unlock achievements based on conditions
      newAchievements.forEach(ach => {
        if (ach.unlockedAt) return; // Already unlocked
        
        switch (ach.id) {
          case 'first_quest':
            if (prev.completedQuests === 0) ach.unlockedAt = Date.now();
            break;
          case 'streak_3':
            if (newStreak >= 3) ach.unlockedAt = Date.now();
            break;
          case 'streak_7':
            if (newStreak >= 7) ach.unlockedAt = Date.now();
            break;
          case 'streak_30':
            if (newStreak >= 30) ach.unlockedAt = Date.now();
            break;
          case 'quests_10':
            if (prev.completedQuests + 1 >= 10) ach.unlockedAt = Date.now();
            break;
          case 'quests_50':
            if (prev.completedQuests + 1 >= 50) ach.unlockedAt = Date.now();
            break;
          case 'elite_quest':
            if (quest.difficulty === 'elite') ach.unlockedAt = Date.now();
            break;
          case 'legendary_quest':
            if (quest.difficulty === 'legendary') ach.unlockedAt = Date.now();
            break;
        }
      });
      
      newAdventurer = {
        ...newAdventurer,
        exp: newExp,
        level: newLevel,
        title: newTitle,
        completedQuests: prev.completedQuests + 1,
        streakDays: newStreak,
        lastCompletedDate: today,
        achievements: newAchievements,
      };
      
      return newAdventurer;
    });
  }, [quests]);
  
  // Abandon/fail a quest
  const abandonQuest = useCallback((questId: string) => {
    setQuests(prev => prev.map(q => 
      q.id === questId ? { ...q, status: 'failed' as const } : q
    ));
  }, []);
  
  // Delete a quest
  const deleteQuest = useCallback((questId: string) => {
    setQuests(prev => prev.filter(q => q.id !== questId));
  }, []);
  
  // Update adventurer name
  const updateAdventurerName = useCallback((name: string) => {
    setAdventurer(prev => ({ ...prev, name }));
  }, []);
  
  // Get quests by status
  const getPostedQuests = useCallback(() => 
    quests.filter(q => q.status === 'posted'), [quests]);
  
  const getAcceptedQuests = useCallback(() => 
    quests.filter(q => q.status === 'accepted'), [quests]);
  
  const getCompletedQuests = useCallback(() => 
    quests.filter(q => q.status === 'completed'), [quests]);
  
  const getFailedQuests = useCallback(() => 
    quests.filter(q => q.status === 'failed'), [quests]);
  
  return {
    quests,
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
  };
};

// Export types
export type AppState = ReturnType<typeof useAppState>;