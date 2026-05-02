export interface Question {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  points: number;
  code: string;
  solution: string;
  acceptedSolutions?: string[];
  tags: string[];
  author: string;
  completions: number;
  resources?: QuestionResource[];
  hints?: QuestionHint[];
}

export interface QuestionResource {
  id: string;
  title: string;
  type: 'video' | 'article' | 'documentation' | 'example';
  url: string;
  uploadedBy: string;
  votes: number;
}

export interface QuestionHint {
  level: number;
  text: string;
  unlocked: boolean;
}

export interface UserProgress {
  questionId: string;
  code: string;
  scrollPosition: number;
  lastAccessed: string;
  hintsUnlocked: number;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  username: string;
  points: number;
  level: number;
  questionsCompleted: number;
  avatar?: string;
}

export const mockQuestions: Question[] = [
  {
    id: '1',
    title: 'Prove Basic Addition',
    description: 'Prove that 2 + 2 = 4 using Lean\'s natural number system.',
    difficulty: 'Beginner',
    points: 50,
    code: 'theorem two_plus_two : 2 + 2 = 4 := by\n  -- Your proof here\n  sorry',
    solution: 'theorem two_plus_two : 2 + 2 = 4 := by\n  rfl',
    acceptedSolutions: [
      'theorem two_plus_two : 2 + 2 = 4 := by\n  rfl',
      'theorem two_plus_two : 2 + 2 = 4 := by\n  norm_num',
      'theorem two_plus_two : 2 + 2 = 4 := by\n  decide',
    ],
    tags: ['arithmetic', 'basics'],
    author: 'lean_master',
    completions: 1250,
    resources: [
      {
        id: 'r1',
        title: 'Lean 4 Natural Numbers Tutorial',
        type: 'video',
        url: 'https://youtube.com/lean4-nat',
        uploadedBy: 'math_wizard',
        votes: 24,
      },
      {
        id: 'r2',
        title: 'Introduction to Reflexivity',
        type: 'article',
        url: 'https://leanprover.github.io/rfl',
        uploadedBy: 'lean_master',
        votes: 18,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'The reflexivity tactic (rfl) can prove equalities that are definitionally equal.',
        unlocked: false,
      },
      {
        level: 2,
        text: 'In Lean, 2 + 2 and 4 are the same value when computed, so rfl works here.',
        unlocked: false,
      },
      {
        level: 3,
        text: 'Try using "rfl" after the "by" keyword to complete this proof.',
        unlocked: false,
      },
    ],
  },
  {
    id: '2',
    title: 'Commutativity of Addition',
    description: 'Prove that addition is commutative for natural numbers.',
    difficulty: 'Intermediate',
    points: 100,
    code: 'theorem add_comm (a b : ℕ) : a + b = b + a := by\n  -- Your proof here\n  sorry',
    solution: 'theorem add_comm (a b : ℕ) : a + b = b + a := by\n  induction a with\n  | zero => simp\n  | succ n ih => simp [Nat.succ_add, ih]',
    acceptedSolutions: [
      'theorem add_comm (a b : ℕ) : a + b = b + a := by\n  induction a with\n  | zero => simp\n  | succ n ih => simp [Nat.succ_add, ih]',
      'theorem add_comm (a b : ℕ) : a + b = b + a := by\n  omega',
      'theorem add_comm (a b : ℕ) : a + b = b + a := Nat.add_comm a b',
    ],
    tags: ['algebra', 'proofs'],
    author: 'theorem_hunter',
    completions: 856,
    resources: [
      {
        id: 'r3',
        title: 'Mathematical Induction in Lean',
        type: 'documentation',
        url: 'https://leanprover.github.io/induction',
        uploadedBy: 'theorem_hunter',
        votes: 31,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'This proof requires induction on one of the natural numbers.',
        unlocked: false,
      },
      {
        level: 2,
        text: 'Use "induction a with" to start the induction on variable a.',
        unlocked: false,
      },
      {
        level: 3,
        text: 'The base case (zero) and inductive case (succ) can both be solved with simp.',
        unlocked: false,
      },
    ],
  },
  {
    id: '3',
    title: 'List Length Properties',
    description: 'Prove that the length of a concatenated list equals the sum of individual lengths.',
    difficulty: 'Intermediate',
    points: 120,
    code: 'theorem list_length_append (l1 l2 : List α) : \n  (l1 ++ l2).length = l1.length + l2.length := by\n  -- Your proof here\n  sorry',
    solution: 'theorem list_length_append (l1 l2 : List α) : \n  (l1 ++ l2).length = l1.length + l2.length := by\n  induction l1 with\n  | nil => simp\n  | cons h t ih => simp [ih]',
    acceptedSolutions: [
      'theorem list_length_append (l1 l2 : List α) : \n  (l1 ++ l2).length = l1.length + l2.length := by\n  induction l1 with\n  | nil => simp\n  | cons h t ih => simp [ih]',
      'theorem list_length_append (l1 l2 : List α) : \n  (l1 ++ l2).length = l1.length + l2.length := by\n  induction l1 <;> simp [*]',
    ],
    tags: ['lists', 'induction'],
    author: 'list_lover',
    completions: 643,
    resources: [
      {
        id: 'r4',
        title: 'Working with Lists in Lean',
        type: 'documentation',
        url: 'https://leanprover.github.io/lists',
        uploadedBy: 'list_lover',
        votes: 22,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Use structural induction on the first list (l1).',
        unlocked: false,
      },
      {
        level: 2,
        text: 'The base case is when l1 is empty (nil), and the recursive case handles cons.',
        unlocked: false,
      },
      {
        level: 3,
        text: 'Both cases can be solved with "simp" - it will automatically use the induction hypothesis.',
        unlocked: false,
      },
    ],
  },
  {
    id: '4',
    title: 'Even Number Definition',
    description: 'Define and prove basic properties of even numbers.',
    difficulty: 'Beginner',
    points: 75,
    code: 'def is_even (n : ℕ) : Prop := ∃ k, n = 2 * k\n\ntheorem zero_is_even : is_even 0 := by\n  -- Your proof here\n  sorry',
    solution: 'def is_even (n : ℕ) : Prop := ∃ k, n = 2 * k\n\ntheorem zero_is_even : is_even 0 := by\n  use 0\n  rfl',
    acceptedSolutions: [
      'def is_even (n : ℕ) : Prop := ∃ k, n = 2 * k\n\ntheorem zero_is_even : is_even 0 := by\n  use 0\n  rfl',
      'def is_even (n : ℕ) : Prop := ∃ k, n = 2 * k\n\ntheorem zero_is_even : is_even 0 := by\n  existsi 0\n  rfl',
    ],
    tags: ['definitions', 'basics'],
    author: 'math_wizard',
    completions: 921,
    resources: [
      {
        id: 'r5',
        title: 'Existential Proofs in Lean',
        type: 'article',
        url: 'https://leanprover.github.io/existential',
        uploadedBy: 'math_wizard',
        votes: 19,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'To prove an existential statement (∃ k, ...), you need to provide a witness.',
        unlocked: false,
      },
      {
        level: 2,
        text: 'Use the "use" tactic to provide a specific value for k that makes the statement true.',
        unlocked: false,
      },
      {
        level: 3,
        text: 'For 0 to be even, you need k = 0, so use "use 0" followed by "rfl".',
        unlocked: false,
      },
    ],
  },
  {
    id: '5',
    title: 'Function Composition',
    description: 'Prove associativity of function composition.',
    difficulty: 'Advanced',
    points: 150,
    code: 'theorem comp_assoc (f : γ → δ) (g : β → γ) (h : α → β) :\n  (f ∘ g) ∘ h = f ∘ (g ∘ h) := by\n  -- Your proof here\n  sorry',
    solution: 'theorem comp_assoc (f : γ → δ) (g : β → γ) (h : α → β) :\n  (f ∘ g) ∘ h = f ∘ (g ∘ h) := by\n  ext x\n  rfl',
    acceptedSolutions: [
      'theorem comp_assoc (f : γ → δ) (g : β → γ) (h : α → β) :\n  (f ∘ g) ∘ h = f ∘ (g ∘ h) := by\n  ext x\n  rfl',
      'theorem comp_assoc (f : γ → δ) (g : β → γ) (h : α → β) :\n  (f ∘ g) ∘ h = f ∘ (g ∘ h) := by\n  funext x\n  rfl',
      'theorem comp_assoc (f : γ → δ) (g : β → γ) (h : α → β) :\n  (f ∘ g) ∘ h = f ∘ (g ∘ h) := rfl',
    ],
    tags: ['functions', 'advanced'],
    author: 'category_theory_fan',
    completions: 412,
    resources: [
      {
        id: 'r6',
        title: 'Function Extensionality',
        type: 'documentation',
        url: 'https://leanprover.github.io/funext',
        uploadedBy: 'category_theory_fan',
        votes: 15,
      },
      {
        id: 'r7',
        title: 'Advanced Function Proofs',
        type: 'video',
        url: 'https://youtube.com/lean4-functions',
        uploadedBy: 'type_theorist',
        votes: 28,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'To prove two functions are equal, you need to show they give the same result for all inputs.',
        unlocked: false,
      },
      {
        level: 2,
        text: 'Use the "ext" (extensionality) tactic to introduce an arbitrary input x.',
        unlocked: false,
      },
      {
        level: 3,
        text: 'After using "ext x", both sides of the equation will be definitionally equal, so "rfl" completes the proof.',
        unlocked: false,
      },
    ],
  },
];

export const mockLeaderboard: LeaderboardEntry[] = [
  { id: 'u1', rank: 1, username: 'lean_master', points: 5420, level: 12, questionsCompleted: 89 },
  { id: 'u2', rank: 2, username: 'theorem_hunter', points: 4850, level: 11, questionsCompleted: 76 },
  { id: 'u3', rank: 3, username: 'proof_ninja', points: 4230, level: 10, questionsCompleted: 68 },
  { id: 'u4', rank: 4, username: 'math_wizard', points: 3890, level: 9, questionsCompleted: 62 },
  { id: 'u5', rank: 5, username: 'logic_lover', points: 3560, level: 9, questionsCompleted: 58 },
  { id: 'u6', rank: 6, username: 'category_theory_fan', points: 3240, level: 8, questionsCompleted: 51 },
  { id: 'u7', rank: 7, username: 'type_theorist', points: 2950, level: 8, questionsCompleted: 47 },
  { id: 'u8', rank: 8, username: 'formal_verification', points: 2680, level: 7, questionsCompleted: 43 },
  { id: 'u9', rank: 9, username: 'dependent_types', points: 2340, level: 7, questionsCompleted: 38 },
  { id: 'u10', rank: 10, username: 'curry_howard', points: 2120, level: 6, questionsCompleted: 34 },
];
