import { Quest } from '../domain/entities/Quest';
import { Adventurer, createInitialAdventurer } from '../domain/entities/Adventurer';

const KEYS = {
  QUESTS: 'adventurers_guild_quests',
  ADVENTURER: 'adventurers_guild_adventurer',
  SETTINGS: 'adventurers_guild_settings',
};

// Quest Storage
export const saveQuests = (quests: Quest[]): void => {
  localStorage.setItem(KEYS.QUESTS, JSON.stringify(quests));
};

export const loadQuests = (): Quest[] => {
  const data = localStorage.getItem(KEYS.QUESTS);
  if (!data) return [];
  try {
    return JSON.parse(data) as Quest[];
  } catch {
    return [];
  }
};

// Adventurer Storage
export const saveAdventurer = (adventurer: Adventurer): void => {
  localStorage.setItem(KEYS.ADVENTURER, JSON.stringify(adventurer));
};

export const loadAdventurer = (): Adventurer => {
  const data = localStorage.getItem(KEYS.ADVENTURER);
  if (!data) return createInitialAdventurer('冒险家');
  try {
    return JSON.parse(data) as Adventurer;
  } catch {
    return createInitialAdventurer('冒险家');
  }
};

// Initialize default data
export const initializeStorage = (): { quests: Quest[]; adventurer: Adventurer } => {
  let quests = loadQuests();
  let adventurer = loadAdventurer();
  
  // If first time, create sample quests
  if (quests.length === 0) {
    adventurer = createInitialAdventurer('冒险家');
    saveAdventurer(adventurer);
  }
  
  return { quests, adventurer };
};