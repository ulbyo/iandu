export interface Post {
  id: string;
  title: string;
  description: string;
  user_id: string;
  created_at: string;
  username?: string;
}

export interface Question {
  id: string;
  content: string;
  post_id: string;
  created_at: string;
  answered: boolean;
  answer?: string;
  answer_created_at?: string;
}