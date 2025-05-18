/*
  # Initial Schema for Anonymous Q&A App

  1. New Tables
    - `profiles`: Stores user profile information including username
    - `posts`: Stores Q&A posts created by users
    - `questions`: Stores anonymous questions submitted to posts
  2. Security
    - Enable RLS on all tables
    - Add policies for authentication and data access
*/

-- Create profiles table to store user information
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create posts table to store Q&A posts
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create questions table to store anonymous questions
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  answered BOOLEAN DEFAULT false,
  answer TEXT,
  answer_created_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Profiles table policies
-- Users can read their own profile
CREATE POLICY "Users can read own profile" 
  ON profiles 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = id);

-- Users can create their own profile
CREATE POLICY "Users can create own profile" 
  ON profiles 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
  ON profiles 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id);

-- Posts table policies
-- Anyone can read posts (for public viewing)
CREATE POLICY "Anyone can read posts" 
  ON posts 
  FOR SELECT 
  TO anon, authenticated
  USING (true);

-- Authenticated users can create their own posts
CREATE POLICY "Users can create own posts" 
  ON posts 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own posts
CREATE POLICY "Users can update own posts" 
  ON posts 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Users can delete their own posts
CREATE POLICY "Users can delete own posts" 
  ON posts 
  FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Questions table policies
-- Anyone can read answered questions (for public viewing)
CREATE POLICY "Anyone can read answered questions" 
  ON questions 
  FOR SELECT 
  TO anon, authenticated 
  USING (answered = true);

-- Post owners can read all questions on their posts
CREATE POLICY "Post owners can read all questions" 
  ON questions 
  FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM posts 
      WHERE posts.id = questions.post_id 
      AND posts.user_id = auth.uid()
    )
  );

-- Anyone can create questions (anonymous questions)
CREATE POLICY "Anyone can create questions" 
  ON questions 
  FOR INSERT 
  TO anon, authenticated 
  WITH CHECK (true);

-- Only post owners can answer questions
CREATE POLICY "Post owners can answer questions" 
  ON questions 
  FOR UPDATE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM posts 
      WHERE posts.id = questions.post_id 
      AND posts.user_id = auth.uid()
    )
  );

-- Only post owners can delete questions
CREATE POLICY "Post owners can delete questions" 
  ON questions 
  FOR DELETE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM posts 
      WHERE posts.id = questions.post_id 
      AND posts.user_id = auth.uid()
    )
  );