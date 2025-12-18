declare module 'newsapi' {
  export interface Article {
    source: {
      id: string | null;
      name: string;
    };
    author: string | null;
    title: string;
    description: string | null;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string | null;
  }

  export interface NewsResponse {
    status: 'ok' | 'error';
    totalResults: number;
    articles: Article[];
    code?: string;
    message?: string;
  }

  export interface EverythingOptions {
    q?: string;
    searchIn?: 'title' | 'description' | 'content';
    sources?: string;
    domains?: string;
    excludeDomains?: string;
    from?: string;
    to?: string;
    language?: 'ar' | 'de' | 'en' | 'es' | 'fr' | 'he' | 'it' | 'nl' | 'no' | 'pt' | 'ru' | 'se' | 'ud' | 'zh';
    sortBy?: 'relevancy' | 'popularity' | 'publishedAt';
    pageSize?: number;
    page?: number;
  }

  export interface TopHeadlinesOptions extends EverythingOptions {
    country?: string;
    category?: 'business' | 'entertainment' | 'general' | 'health' | 'science' | 'sports' | 'technology';
  }

  export interface SourcesOptions {
    category?: string;
    language?: string;
    country?: string;
  }

  class NewsAPI {
    constructor(apiKey: string);
    v2: {
      topHeadlines(params: TopHeadlinesOptions): Promise<NewsResponse>;
      everything(params: EverythingOptions): Promise<NewsResponse>;
      sources(params: SourcesOptions): Promise<any>;
    };
  }

  export default NewsAPI;
}