export const NEWS_CATEGORIES = [
  'Technology',
  'Artificial Intelligence',
  'Business',
  'Finance',
  'Politics',
  'Science',
  'Health',
  'Sports',
  'Entertainment',
  'World',
  'India',
  'Education',
  'Environment',
  'Other'
] as const;

export type NewsCategory = typeof NEWS_CATEGORIES[number];

// Combined list supporting both single categories and legacy combined categories
export const ALL_DISPLAY_CATEGORIES = [
  'All',
  ...NEWS_CATEGORIES,
  'AI & Technology',
  'Business & Finance',
  'Science & Space',
  'Health & Medicine',
  'World & Politics',
  'Climate & Environment',
  'Entertainment & Culture'
] as const;

export interface CategoryMeta {
  name: string;
  badgeColor: string;
  textColor: string;
  borderColor: string;
  bgGlow: string;
}

export const CATEGORY_STYLES: Record<string, CategoryMeta> = {
  'Technology': {
    name: 'Technology',
    badgeColor: 'bg-blue-500/10',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-500/30',
    bgGlow: 'from-blue-600/20'
  },
  'Artificial Intelligence': {
    name: 'Artificial Intelligence',
    badgeColor: 'bg-indigo-500/10',
    textColor: 'text-indigo-400',
    borderColor: 'border-indigo-500/30',
    bgGlow: 'from-indigo-600/20'
  },
  'AI & Technology': {
    name: 'AI & Technology',
    badgeColor: 'bg-indigo-500/10',
    textColor: 'text-indigo-400',
    borderColor: 'border-indigo-500/30',
    bgGlow: 'from-indigo-600/20'
  },
  'Business': {
    name: 'Business',
    badgeColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    bgGlow: 'from-emerald-600/20'
  },
  'Finance': {
    name: 'Finance',
    badgeColor: 'bg-green-500/10',
    textColor: 'text-green-400',
    borderColor: 'border-green-500/30',
    bgGlow: 'from-green-600/20'
  },
  'Business & Finance': {
    name: 'Business & Finance',
    badgeColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    bgGlow: 'from-emerald-600/20'
  },
  'Politics': {
    name: 'Politics',
    badgeColor: 'bg-amber-500/10',
    textColor: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    bgGlow: 'from-amber-600/20'
  },
  'Science': {
    name: 'Science',
    badgeColor: 'bg-cyan-500/10',
    textColor: 'text-cyan-400',
    borderColor: 'border-cyan-500/30',
    bgGlow: 'from-cyan-600/20'
  },
  'Science & Space': {
    name: 'Science & Space',
    badgeColor: 'bg-cyan-500/10',
    textColor: 'text-cyan-400',
    borderColor: 'border-cyan-500/30',
    bgGlow: 'from-cyan-600/20'
  },
  'Health': {
    name: 'Health',
    badgeColor: 'bg-rose-500/10',
    textColor: 'text-rose-400',
    borderColor: 'border-rose-500/30',
    bgGlow: 'from-rose-600/20'
  },
  'Health & Medicine': {
    name: 'Health & Medicine',
    badgeColor: 'bg-rose-500/10',
    textColor: 'text-rose-400',
    borderColor: 'border-rose-500/30',
    bgGlow: 'from-rose-600/20'
  },
  'Sports': {
    name: 'Sports',
    badgeColor: 'bg-orange-500/10',
    textColor: 'text-orange-400',
    borderColor: 'border-orange-500/30',
    bgGlow: 'from-orange-600/20'
  },
  'Entertainment': {
    name: 'Entertainment',
    badgeColor: 'bg-purple-500/10',
    textColor: 'text-purple-400',
    borderColor: 'border-purple-500/30',
    bgGlow: 'from-purple-600/20'
  },
  'Entertainment & Culture': {
    name: 'Entertainment & Culture',
    badgeColor: 'bg-purple-500/10',
    textColor: 'text-purple-400',
    borderColor: 'border-purple-500/30',
    bgGlow: 'from-purple-600/20'
  },
  'World': {
    name: 'World',
    badgeColor: 'bg-teal-500/10',
    textColor: 'text-teal-400',
    borderColor: 'border-teal-500/30',
    bgGlow: 'from-teal-600/20'
  },
  'World & Politics': {
    name: 'World & Politics',
    badgeColor: 'bg-teal-500/10',
    textColor: 'text-teal-400',
    borderColor: 'border-teal-500/30',
    bgGlow: 'from-teal-600/20'
  },
  'India': {
    name: 'India',
    badgeColor: 'bg-orange-500/10',
    textColor: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    bgGlow: 'from-amber-600/20'
  },
  'Education': {
    name: 'Education',
    badgeColor: 'bg-sky-500/10',
    textColor: 'text-sky-400',
    borderColor: 'border-sky-500/30',
    bgGlow: 'from-sky-600/20'
  },
  'Environment': {
    name: 'Environment',
    badgeColor: 'bg-lime-500/10',
    textColor: 'text-lime-400',
    borderColor: 'border-lime-500/30',
    bgGlow: 'from-lime-600/20'
  },
  'Climate & Environment': {
    name: 'Climate & Environment',
    badgeColor: 'bg-lime-500/10',
    textColor: 'text-lime-400',
    borderColor: 'border-lime-500/30',
    bgGlow: 'from-lime-600/20'
  },
  'Other': {
    name: 'Other',
    badgeColor: 'bg-slate-500/10',
    textColor: 'text-slate-400',
    borderColor: 'border-slate-500/30',
    bgGlow: 'from-slate-600/20'
  }
};

export const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=1200';

export function getCategoryStyle(cat: string): CategoryMeta {
  return CATEGORY_STYLES[cat] || {
    name: cat,
    badgeColor: 'bg-indigo-500/10',
    textColor: 'text-indigo-400',
    borderColor: 'border-indigo-500/30',
    bgGlow: 'from-indigo-600/20'
  };
}
