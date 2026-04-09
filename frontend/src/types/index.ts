export interface PostSummary {
  id: string;
  slug: string;
  title: string;
  date: string;
  categories: string[];
  tags: string[];
  excerpt: string;
  wordCount?: number;
  readingTime?: number;
}

export interface PostDetail extends PostSummary {
  content: string;
}