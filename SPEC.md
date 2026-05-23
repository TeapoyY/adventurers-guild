# Adventurers Guild - 冒险家协会

## 1. Concept & Vision

**一个把待办事项变成冒险委托的 RPG 风格 App**

在冒险家协会的世界里，每一项任务都是一次激动人心的冒险。你不是简单地"完成任务"，而是作为一名冒险家，接受来自酒馆公告板上的委托，击败怪物、收集稀有材料、帮助 NPC 完成请求。

**核心体验**: 将现实中的待办事项包装在剑与魔法的世界观中，通过任务系统、角色成长、奖励反馈，让平凡的日常任务变得具有成就感和叙事性。

---

## 2. Design Language

### 2.1 Aesthetic Direction
**"Fantasy Tavern Bulletin Board"** — 温暖的木质酒馆氛围，像古老的中世纪酒馆公告板。羊皮纸质感、羽毛笔字迹、烛光摇曳的暖色调。

### 2.2 Color Palette

| 用途 | 颜色 | Hex |
|-----|-----|-----|
| Primary (木质) | 深胡桃木 | `#5D4037` |
| Secondary (羊皮纸) | 暖米色 | `#F5E6C8` |
| Accent (金色) | 古铜金 | `#D4AF37` |
| Accent (能量) | 冒险蓝 | `#4A90D9` |
| Success | 成就绿 | `#7CB342` |
| Danger | 怪物红 | `#C62828` |
| Background | 深夜色 | `#1A1512` |
| Surface | 木板色 | `#3E2723` |
| Text Primary | 羊皮纸白 | `#FFF8E7` |
| Text Secondary | 旧墨色 | `#8D6E63` |

### 2.3 Typography

```
Headings:     "Cinzel Decorative" — 中世纪奇幻标题
Subheadings:  "Cinzel" — 章节标题
Body:         "Merriweather" — 可读性强的衬线字体
UI Elements:  "Roboto Slab" — 按钮和标签
```

### 2.4 Visual Assets

- **图标**: 自定义像素风格图标 (剑、盾牌、药水、怪物)
- **装饰元素**: 角落花纹、羊皮纸边缘、木质纹理背景
- **状态视觉**: 任务难度用颜色区分 (普通=白, 精英=蓝, 传说=金)

### 2.5 Motion Philosophy

- **任务接受**: 公告板震动 + 纸张展开动画
- **任务完成**: 金币飞入动画 + 成就徽章弹出
- **等级提升**: 全屏光芒 + 震屏效果
- **危险警告**: 红色脉冲 + 震动反馈

---

## 3. Layout & Structure

### 3.1 Screen Architecture

```
┌─────────────────────────────────────────┐
│           冒险家协会 (酒馆场景)            │
├─────────────────────────────────────────┤
│  [玩家状态栏]                            │
│  Lv.12 冒险家 · 经验条 · 金币: 1,250      │
├─────────────────────────────────────────┤
│                                         │
│   ┌─────────────────────────────────┐   │
│   │     委托公告板 (Bulletin Board)   │   │
│   │                                 │   │
│   │  ┌─────┐ ┌─────┐ ┌─────┐       │   │
│   │  │任务1│ │任务2│ │任务3│ ...   │   │
│   │  └─────┘ └─────┘ └─────┘       │   │
│   │                                 │   │
│   └─────────────────────────────────┘   │
│                                         │
├─────────────────────────────────────────┤
│  [底部导航]                               │
│  📜 委托板 | ⚔️ 冒险日志 | 🎒 背包 | 👤 冒险家 │
└─────────────────────────────────────────┘
```

### 3.2 核心页面

1. **委托公告板 (Quest Board)** — 主页面，显示所有待接受/进行中的委托
2. **冒险日志 (Adventure Log)** — 历史已完成的任务记录
3. **背包 (Inventory)** — 已获得的奖励、徽章、称号
4. **冒险家档案 (Character Profile)** — 角色等级、技能、统计

---

## 4. Features & Interactions

### 4.1 Quest System (委托系统)

**任务创建/接受流程**:

```
用户输入待办事项
        ↓
系统将其转化为"委托"格式:
  - 标题 = 任务名
  - 描述 = 委托详情
  - 难度 = 根据关键词自动判定 (时间紧迫度/重要性)
  - 类型 = 战斗/采集/守护/探索 (自动分类)
        ↓
发布到公告板 → 冒险家接受 → 执行 → 完成
```

**任务属性**:

```dart
Quest {
  id: string
  title: string           // "消灭办公室的噪音怪兽"
  description: string      // "周一早会前整理好所有文件"
  type: QuestType         // combat / gathering / protection / exploration
  difficulty: Difficulty  // common / elite / legendary
  reward: {
    exp: int              // 经验值
    gold: int             // 金币
    items: List<Item>    // 特殊奖励
  }
  deadline: DateTime?     // 可选截止日期
  status: QuestStatus     // posted / accepted / completed / failed
  tags: List<string>     // 标签 ["工作", "紧急", "团队"]
}
```

**任务难度自动判定**:

```
普通 (Common): 普通日常事项
  - "回复邮件"
  - "整理桌面"

精英 (Elite): 需要更多努力/时间
  - "完成项目报告" (deadline < 3天)
  - "准备演示文稿"

传说 (Legendary): 重大目标/长期项目
  - "完成季度OKR"
  - "准备年度述职"
```

### 4.2 Character System (角色系统)

**冒险家属性**:

```dart
Adventurer {
  name: string              // 冒险家名称
  level: int                // 当前等级 (1-100)
  exp: int                  // 当前经验值
  title: string             // 当前称号
  
  stats: {
    strength: int          // 力量 (完成任务的速度)
    wisdom: int            // 智慧 (任务分类准确性)
    endurance: int         // 耐力 (连续完成任务能力)
    charisma: int          // 魅力 (社交任务的加成)
  }
  
  achievements: List<Achievement>  // 已获得成就
  completedQuests: int     // 已完成任务总数
  streak: int              // 当前连续完成任务天数
}
```

**等级与经验**:

```
Level 1:  0 exp
Level 2:  100 exp
Level 3:  300 exp
Level 5:  800 exp
Level 10: 3000 exp
Level 20: 15000 exp (资深冒险家)
Level 50: 200000 exp (传奇冒险家)
```

### 4.3 Reward System (奖励系统)

**完成任务奖励**:

| 难度 | 经验 | 金币 | 额外 |
|-----|-----|-----|-----|
| 普通 | 10-20 | 5-15 | 随机物品碎片 |
| 精英 | 50-100 | 30-60 | 1个小徽章 |
| 传说 | 200-500 | 100-200 | 称号/特殊道具 |

**连续奖励 (Streak)**:

```
连续3天: 经验 +10%
连续7天: 金币 +20% 额外
连续30天: 特殊称号 "坚持者"
连续100天: 传说装备 "不屈之剑"
```

### 4.4 交互细节

**任务接受**:
1. 点击公告板上的委托卡片
2. 卡片展开显示详情 (羊皮纸展开动画)
3. 点击"接受委托"按钮
4. 公告板震动，卡片移至"进行中"区域

**任务完成**:
1. 在进行中列表点击任务
2. 选择"确认完成"或"放弃委托"
3. 完成 → 金币飞入动画 + 经验值飘字 + 等级进度动画
4. 放弃 → 任务移至失败区，不扣经验但扣信誉

**任务逾期**:
1. 超过 deadline 24小时，任务状态变为"逾期"
2. 公告板显示红色警告
3. 完成仍可获得50%奖励，但不获得连续加成

---

## 5. Component Inventory

### 5.1 Quest Card (委托卡片)

```
状态:
- Default: 木质底纹，羊皮纸内容区
- Hover/Touch: 轻微上浮 + 发光边框
- Accepted: 蓝色边框，表示进行中
- Completed: 绿色对勾 + 暗化
- Overdue: 红色脉冲边框

内容:
┌────────────────────────┐
│ ⚔️ [难度图标] 任务标题    │
│ ────────────────────  │
│ 委托详情简述...          │
│                        │
│ 🏆 +25经验  💰 +15金币   │
│ ⏰ 截止: 周五 18:00      │
└────────────────────────┘
```

### 5.2 Character Stats Panel (角色状态面板)

```
┌─────────────────────────────┐
│  🛡️ Lv.12 冒险家 · 剑圣       │
│ ════════════════════════    │
│ 经验 ████████░░░░  850/1200 │
│                        │
│ ⚔️力量 14  💡智慧 12        │
│ 🛡️耐力 10  ✨魅力 8         │
│                        │
│ 💰 金币: 1,250          │
│ 🔥 连续: 7天            │
└─────────────────────────────┘
```

### 5.3 Achievement Badge (成就徽章)

```
┌───────────┐
│   🏅      │
│  "首战告捷" │
│            │
│  完成首个委托 │
└───────────┘
```

### 5.4 Bottom Navigation (底部导航)

```
┌────────────────────────────────────────┐
│ 📜 委托板 | ⚔️ 冒险日志 | 🎒 背包 | 👤 冒险家 │
└────────────────────────────────────────┘
```

---

## 6. Technical Approach

### 6.1 Tech Stack

| 层级 | 技术 |
|-----|-----|
| Framework | Flutter 3.x |
| State Management | Riverpod |
| Local Storage | SQLite (sqflite) |
| Notifications | flutter_local_notifications |
| Animations | flutter_animate |
| Architecture | Clean Architecture (Domain/Data/Presentation) |

### 6.2 Project Structure

```
lib/
├── main.dart
├── app.dart
├── core/
│   ├── theme/
│   │   ├── app_theme.dart
│   │   ├── app_colors.dart
│   │   └── app_typography.dart
│   ├── constants/
│   │   └── game_constants.dart
│   └── utils/
│       └── quest_difficulty_calculator.dart
├── domain/
│   ├── entities/
│   │   ├── quest.dart
│   │   ├── adventurer.dart
│   │   ├── reward.dart
│   │   └── achievement.dart
│   ├── repositories/
│   │   └── quest_repository.dart
│   └── usecases/
│       ├── create_quest.dart
│       ├── complete_quest.dart
│       └── level_up_adventurer.dart
├── data/
│   ├── datasources/
│   │   └── local_database.dart
│   ├── models/
│   │   ├── quest_model.dart
│   │   └── adventurer_model.dart
│   └── repositories/
│       └── quest_repository_impl.dart
└── presentation/
    ├── providers/
    │   ├── quest_provider.dart
    │   └── adventurer_provider.dart
    ├── screens/
    │   ├── quest_board_screen.dart
    │   ├── adventure_log_screen.dart
    │   ├── inventory_screen.dart
    │   └── profile_screen.dart
    └── widgets/
        ├── quest_card.dart
        ├── character_panel.dart
        ├── animated_reward_popup.dart
        └── parchment_dialog.dart
```

### 6.3 Data Model

**Quest Model (SQLite)**:

```sql
CREATE TABLE quests (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,          -- combat, gathering, protection, exploration
  difficulty TEXT NOT NULL,    -- common, elite, legendary
  reward_exp INTEGER NOT NULL,
  reward_gold INTEGER NOT NULL,
  deadline INTEGER,            -- Unix timestamp
  status TEXT NOT NULL,        -- posted, accepted, completed, failed
  created_at INTEGER NOT NULL,
  completed_at INTEGER,
  tags TEXT                    -- JSON array
);

CREATE TABLE adventurers (
  id TEXT PRIMARY KEY DEFAULT 'player',
  name TEXT NOT NULL,
  level INTEGER DEFAULT 1,
  exp INTEGER DEFAULT 0,
  title TEXT DEFAULT '新手冒险家',
  strength INTEGER DEFAULT 5,
  wisdom INTEGER DEFAULT 5,
  endurance INTEGER DEFAULT 5,
  charisma INTEGER DEFAULT 5,
  completed_quests INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_completed_date TEXT
);

CREATE TABLE achievements (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  unlocked_at INTEGER
);
```

### 6.4 State Management (Riverpod)

```dart
// Quest State
@riverpod
class QuestNotifier extends _$QuestNotifier {
  @override
  List<Quest> build() => [];
  
  Future<void> addQuest(String title, String desc, {DateTime? deadline}) async {...}
  Future<void> completeQuest(String id) async {...}
  Future<void> abandonQuest(String id) async {...}
}

// Adventurer State  
@riverpod
class AdventurerNotifier extends _$AdventurerNotifier {
  @override
  Adventurer build() => Adventurer.initial();
  
  Future<void> addExp(int exp) async {...}
  void checkLevelUp() {...}
}
```

---

## 7. Game Mechanics Detail

### 7.1 Quest Type System

| 类型 | 图标 | 描述 | 适合任务 |
|-----|-----|-----|---------|
| Combat ⚔️ | 剑 | 消灭敌人/克服障碍 | 紧急事项、清理任务 |
| Gathering 🌿 | 草药 | 收集材料/信息 | 研究、调研、数据整理 |
| Protection 🛡️ | 盾牌 | 守护/维持/监控 | 日常维护、周期任务 |
| Exploration 🗺️ | 罗盘 | 探索/发现/规划 | 新项目、计划类任务 |

### 7.2 Difficulty Calculator Algorithm

```dart
Difficulty calculateDifficulty(String title, String description, DateTime? deadline) {
  int score = 0;
  
  // Complexity indicators (title/description keywords)
  if (containsAny(title, ["项目", "报告", "计划", "季度", "年度"])) score += 3;
  if (containsAny(title, ["完成", "整理", "准备"])) score += 2;
  if (containsAny(description, ["重要", "紧急", "必须"])) score += 2;
  
  // Time pressure
  if (deadline != null) {
    final daysUntil = deadline.difference(DateTime.now()).inDays;
    if (daysUntil < 0) score += 5;        // Overdue
    else if (daysUntil == 0) score += 3; // Today
    else if (daysUntil <= 2) score += 2;  // Within 2 days
    else if (daysUntil <= 7) score += 1;  // Within a week
  }
  
  // Convert score to difficulty
  if (score >= 6) return Difficulty.legendary;
  if (score >= 3) return Difficulty.elite;
  return Difficulty.common;
}
```

### 7.3 Reward Calculation

```dart
Reward calculateReward(Difficulty difficulty, int streakDays) {
  final baseExp = switch (difficulty) {
    Difficulty.common => 15,
    Difficulty.elite => 75,
    Difficulty.legendary => 350,
  };
  
  final baseGold = switch (difficulty) {
    Difficulty.common => 10,
    Difficulty.elite => 45,
    Difficulty.legendary => 150,
  };
  
  // Streak multiplier
  final expMultiplier = 1.0 + (streakDays * 0.05).clamp(0, 0.5);
  final goldMultiplier = 1.0 + (streakDays * 0.03).clamp(0, 0.3);
  
  return Reward(
    exp: (baseExp * expMultiplier).round(),
    gold: (baseGold * goldMultiplier).round(),
  );
}
```

### 7.4 Level Up Thresholds

```dart
int expForLevel(int level) {
  if (level <= 1) return 0;
  // Slightly exponential curve
  return (100 * pow(level - 1, 1.5)).round();
}

int totalExpForLevel(int level) {
  return List.generate(level, (i) => expForLevel(i + 1)).reduce((a, b) => a + b);
}
```

---

## 8. Onboarding Experience

### 8.1 First Launch Flow

```
1. 欢迎界面: "欢迎来到冒险家协会"
   - 背景: 酒馆大厅全景图
   - NPC 管 理员说: "新来的冒险家吗? 做个自我介绍吧!"
   
2. 冒险家命名
   - 输入名字或随机生成
   - 选择职业 (可选): 战士/法师/游侠
   
3. 教程任务
   - "你的第一份委托" — 创建一个待办事项
   - 完成后获得 "初出茅庐" 徽章
   
4. 主界面
   - 公告板出现入门任务作为示例
```

---

## 9. Future Enhancements (Post-MVP)

- [ ] **多人协作**:组队接受委托，共享奖励
- [ ] **公会系统**:创建/加入冒险家公会
- [ ] **每日悬赏**:每日随机出现高奖励特殊委托
- [ ] **成就系统**:丰富成就树，解锁特殊称号
- [ ] **装备系统**:收集武器/防具提升属性
- [ ] **世界事件**:节日活动、限时委托
- [ ] **AI NPC 对话**:用 LLM 生成 NPC 对话，增加沉浸感

---

*冒险家协会 — 让每一次待办都成为一场冒险。*