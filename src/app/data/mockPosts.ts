export interface Post {
  id: string;
  imageUrl: string;
  title: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string[];
  likes: number;
  isLiked: boolean;
  description: string;
  materials: Array<{
    name: string;
    source?: string;
    x: number;
    y: number;
  }>;
  aspectRatio: number;
}

export const mockPosts: Post[] = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1705321963943-de94bb3f0dd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    title: 'Soft Neutrals',
    author: { name: 'Pipcke', avatar: 'https://i.pravatar.cc/150?u=pipcke' },
    category: ['living room', 'minimalist'],
    likes: 247,
    isLiked: false,
    description: 'A study in restraint—warm oak against cool plaster.',
    materials: [
      { name: 'Bouclé Sofa', source: 'Muuto', x: 35, y: 60 },
      { name: 'Oak Coffee Table', x: 55, y: 70 }
    ],
    aspectRatio: 1.8
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1617596225496-1d9da33a144b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    title: 'Monochrome Serenity',
    author: { name: 'Deconovo', avatar: 'https://i.pravatar.cc/150?u=deconovo' },
    category: ['living room', 'textiles'],
    likes: 189,
    isLiked: true,
    description: 'Layered whites create depth without color.',
    materials: [
      { name: 'Linen Cushions', x: 45, y: 50 },
      { name: 'Textured Throw', source: 'Zara Home', x: 60, y: 65 }
    ],
    aspectRatio: 1.5
  },
  {
    id: '3',
    imageUrl: 'https://images.unsplash.com/photo-1597075418805-0e98dd819c0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    title: 'Velvet Accent',
    author: { name: 'Ambitious Studio', avatar: 'https://i.pravatar.cc/150?u=ambitious' },
    category: ['velvets', 'chairs'],
    likes: 412,
    isLiked: false,
    description: 'Mid-century meets contemporary comfort.',
    materials: [
      { name: 'Velvet Armchair', source: 'Article', x: 50, y: 55 },
      { name: 'Walnut Frame', x: 48, y: 70 }
    ],
    aspectRatio: 0.67
  },
  {
    id: '4',
    imageUrl: 'https://images.unsplash.com/photo-1760072513442-9872656c1b07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    title: 'Editorial Living',
    author: { name: 'Obegi Home', avatar: 'https://i.pravatar.cc/150?u=obegi' },
    category: ['living room', 'modern'],
    likes: 328,
    isLiked: true,
    description: 'Curated shelving as functional art.',
    materials: [
      { name: 'Modular Shelving', x: 25, y: 40 },
      { name: 'Stone Console', source: 'Ferm Living', x: 70, y: 60 }
    ],
    aspectRatio: 1.5
  },
  {
    id: '5',
    imageUrl: 'https://images.unsplash.com/photo-1771876499965-72f0a702c45a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    title: 'Teal Opulence',
    author: { name: 'Evgeniy', avatar: 'https://i.pravatar.cc/150?u=evgeniy' },
    category: ['velvets', 'vintage'],
    likes: 567,
    isLiked: false,
    description: 'Vintage teal velvet against raw concrete.',
    materials: [
      { name: 'Vintage Velvet Sofa', x: 50, y: 65 },
      { name: 'Reclaimed Wood Stool', source: 'Etsy', x: 60, y: 75 }
    ],
    aspectRatio: 0.67
  },
  {
    id: '6',
    imageUrl: 'https://images.unsplash.com/photo-1557226217-bf0da2478e6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    title: 'Concrete Poetry',
    author: { name: 'Stuart Frisby', avatar: 'https://i.pravatar.cc/150?u=stuart' },
    category: ['brutalist', 'architecture'],
    likes: 693,
    isLiked: true,
    description: 'Light and shadow on raw concrete.',
    materials: [
      { name: 'Exposed Concrete', x: 30, y: 50 },
      { name: 'Steel Railing', x: 15, y: 30 }
    ],
    aspectRatio: 1.5
  },
  {
    id: '7',
    imageUrl: 'https://images.unsplash.com/photo-1610307540583-7472788642d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    title: 'Warm Minimalism',
    author: { name: 'Erika Osberg', avatar: 'https://i.pravatar.cc/150?u=erika' },
    category: ['living room', 'wood'],
    likes: 234,
    isLiked: false,
    description: 'Organic shapes soften clean lines.',
    materials: [
      { name: 'Round Wood Table', source: 'HAY', x: 55, y: 70 },
      { name: 'Neutral Sofa', x: 40, y: 50 }
    ],
    aspectRatio: 0.75
  },
  {
    id: '8',
    imageUrl: 'https://images.unsplash.com/photo-1751945965560-9f46a8cd62e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    title: 'Urban Vista',
    author: { name: 'Nha Chill', avatar: 'https://i.pravatar.cc/150?u=nha' },
    category: ['living room', 'modern'],
    likes: 445,
    isLiked: false,
    description: 'The city as backdrop to refined interiors.',
    materials: [
      { name: 'Modular Sofa', x: 45, y: 60 },
      { name: 'Glass Coffee Table', source: 'CB2', x: 55, y: 75 }
    ],
    aspectRatio: 1.78
  },
  {
    id: '9',
    imageUrl: 'https://images.unsplash.com/photo-1588296401836-21d1fbcafd5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    title: 'Botanical Corner',
    author: { name: 'Haley Truong', avatar: 'https://i.pravatar.cc/150?u=haley' },
    category: ['plants', 'details'],
    likes: 156,
    isLiked: true,
    description: 'Green life against natural wood grain.',
    materials: [
      { name: 'Ceramic Planter', x: 50, y: 30 },
      { name: 'Teak Side Table', source: 'West Elm', x: 50, y: 70 }
    ],
    aspectRatio: 0.67
  },
  {
    id: '10',
    imageUrl: 'https://images.unsplash.com/photo-1756199638047-6d6930280e37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    title: 'Coastal Calm',
    author: { name: 'Fazeel PH', avatar: 'https://i.pravatar.cc/150?u=fazeel' },
    category: ['living room', 'light'],
    likes: 301,
    isLiked: false,
    description: 'Natural light floods open-plan living.',
    materials: [
      { name: 'Linen Sofa', source: 'Parachute', x: 50, y: 60 },
      { name: 'Rattan Accent', x: 30, y: 50 }
    ],
    aspectRatio: 1.5
  }
];

export const categories = [
  'all',
  'living room',
  'velvets',
  'brutalist',
  'minimalist',
  'textiles',
  'architecture',
  'plants'
];
