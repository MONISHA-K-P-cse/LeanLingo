export interface Challenge {
  id: string;
  title: string;
  brief: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  image: string;
  constraints: string[];
  submissions: number;
  deadline?: string;
  resources: Array<{
    title: string;
    type: 'article' | 'video' | 'inspiration' | 'material';
    url: string;
    thumbnail?: string;
  }>;
  hints: Array<{
    level: number;
    text: string;
    unlocked: boolean;
  }>;
}

export interface UserProgress {
  challengeId: string;
  status: 'not_started' | 'in_progress' | 'submitted' | 'completed';
  submissions: Array<{
    id: string;
    imageUrl: string;
    title: string;
    description: string;
    materials: any[];
    submittedAt: string;
    votes: number;
    feedback: Array<{
      author: string;
      comment: string;
      avatar: string;
    }>;
  }>;
  lastAccessed: string;
  hintsUnlocked: number;
  scrollPosition?: number;
}

export const mockChallenges: Challenge[] = [
  {
    id: 'c1',
    title: 'Minimalist Living Room',
    brief: 'Design a living room under 20m² that feels spacious and serene. Use a maximum of 3 main colors and focus on natural materials.',
    difficulty: 'beginner',
    category: 'living room',
    image: 'https://images.unsplash.com/photo-1705321963943-de94bb3f0dd3?w=800',
    constraints: [
      'Budget: $5,000 max',
      'Space: 18m² (4m x 4.5m)',
      'Natural light: One window',
      'Max 3 main colors',
    ],
    submissions: 147,
    deadline: '2026-05-15',
    resources: [
      {
        title: 'Minimalist Design Principles',
        type: 'article',
        url: '#',
        thumbnail: 'https://images.unsplash.com/photo-1617596225496-1d9da33a144b?w=400',
      },
      {
        title: 'Small Space Solutions',
        type: 'video',
        url: '#',
        thumbnail: 'https://images.unsplash.com/photo-1760072513442-9872656c1b07?w=400',
      },
      {
        title: 'Natural Materials Guide',
        type: 'material',
        url: '#',
        thumbnail: 'https://images.unsplash.com/photo-1610307540583-7472788642d6?w=400',
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Consider multi-functional furniture like storage ottomans or nesting tables to maximize space.',
        unlocked: false,
      },
      {
        level: 2,
        text: 'Use vertical space with floating shelves or wall-mounted storage to keep the floor clear.',
        unlocked: false,
      },
      {
        level: 3,
        text: 'A light color palette (whites, beiges, soft grays) with strategic mirrors can make the space feel larger.',
        unlocked: false,
      },
    ],
  },
  {
    id: 'c2',
    title: 'Brutalist Kitchen Redesign',
    brief: 'Transform a standard kitchen into a brutalist-inspired space. Embrace raw materials, geometric forms, and industrial aesthetics.',
    difficulty: 'advanced',
    category: 'brutalist',
    image: 'https://images.unsplash.com/photo-1557226217-bf0da2478e6c?w=800',
    constraints: [
      'Budget: $15,000 max',
      'Must retain existing layout',
      'Concrete or stone required',
      'Industrial lighting',
    ],
    submissions: 89,
    deadline: '2026-06-01',
    resources: [
      {
        title: 'Brutalist Architecture Guide',
        type: 'article',
        url: '#',
        thumbnail: 'https://images.unsplash.com/photo-1758866555610-c44c609ae88b?w=400',
      },
      {
        title: 'Industrial Materials Sourcing',
        type: 'material',
        url: '#',
        thumbnail: 'https://images.unsplash.com/photo-1761683369185-20ab99d43889?w=400',
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Exposed concrete or concrete-effect finishes can be applied over existing surfaces.',
        unlocked: false,
      },
      {
        level: 2,
        text: 'Consider statement pendant lights with visible bulbs and metal finishes.',
        unlocked: false,
      },
      {
        level: 3,
        text: 'Mix textures: polished concrete counters with rough stone backsplashes create depth.',
        unlocked: false,
      },
    ],
  },
  {
    id: 'c3',
    title: 'Velvet Accent Chair Styling',
    brief: 'Style a single velvet accent chair within a neutral space. Show 3 different seasonal looks using textiles and accessories.',
    difficulty: 'intermediate',
    category: 'velvets',
    image: 'https://images.unsplash.com/photo-1597075418805-0e98dd819c0e?w=800',
    constraints: [
      'Budget: $500 for accessories',
      'Same chair, 3 seasonal looks',
      'Focus on textiles & cushions',
      'Warm, cool, and neutral palettes',
    ],
    submissions: 203,
    resources: [
      {
        title: 'Seasonal Color Theory',
        type: 'article',
        url: '#',
        thumbnail: 'https://images.unsplash.com/photo-1771876499965-72f0a702c45a?w=400',
      },
      {
        title: 'Textile Layering Techniques',
        type: 'video',
        url: '#',
        thumbnail: 'https://images.unsplash.com/photo-1588296401836-21d1fbcafd5b?w=400',
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Spring/Summer: Light linens, pastels, and botanical prints create freshness.',
        unlocked: false,
      },
      {
        level: 2,
        text: 'Autumn/Winter: Layer with chunky knits, deep jewel tones, and metallic accents.',
        unlocked: false,
      },
      {
        level: 3,
        text: 'Year-round: Neutral base with interchangeable throw pillows keeps it versatile.',
        unlocked: false,
      },
    ],
  },
];

export const userProgress: { [key: string]: UserProgress } = {
  c1: {
    challengeId: 'c1',
    status: 'in_progress',
    submissions: [],
    lastAccessed: '2026-04-27T14:30:00Z',
    hintsUnlocked: 1,
    scrollPosition: 0,
  },
};
