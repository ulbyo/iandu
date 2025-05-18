import { supabase } from './supabase';
import { nanoid } from 'nanoid';
import { Post, Question } from '../types';

// Posts
export async function createPost(title: string, description: string, userId: string): Promise<{ data: Post | null; error: Error | null }> {
  try {
    const postId = nanoid(10);
    
    const { data, error } = await supabase
      .from('posts')
      .insert([
        { 
          id: postId,
          title, 
          description, 
          user_id: userId,
        },
      ])
      .select()
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error creating post:', error);
    return { data: null, error: error as Error };
  }
}

export async function getUserPosts(userId: string): Promise<{ data: Post[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { data: null, error: error as Error };
  }
}

export async function getPostById(postId: string): Promise<{ data: Post | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*, profiles(username)')
      .eq('id', postId)
      .single();
    
    if (error) throw error;
    
    // Format the data to match our Post interface
    const formattedPost: Post = {
      ...data,
      username: data.profiles?.username
    };
    
    return { data: formattedPost, error: null };
  } catch (error) {
    console.error('Error fetching post:', error);
    return { data: null, error: error as Error };
  }
}

export async function deletePost(postId: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);
    
    if (error) throw error;
    
    return { error: null };
  } catch (error) {
    console.error('Error deleting post:', error);
    return { error: error as Error };
  }
}

// Questions
export async function createQuestion(content: string, postId: string): Promise<{ data: Question | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('questions')
      .insert([
        { content, post_id: postId }
      ])
      .select()
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error creating question:', error);
    return { data: null, error: error as Error };
  }
}

export async function getQuestionsForPost(postId: string): Promise<{ data: Question[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching questions:', error);
    return { data: null, error: error as Error };
  }
}

export async function getQuestionById(questionId: string): Promise<{ data: Question | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('id', questionId)
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching question:', error);
    return { data: null, error: error as Error };
  }
}

export async function answerQuestion(questionId: string, answer: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from('questions')
      .update({ 
        answer, 
        answered: true,
        answer_created_at: new Date().toISOString()
      })
      .eq('id', questionId);
    
    if (error) throw error;
    
    return { error: null };
  } catch (error) {
    console.error('Error answering question:', error);
    return { error: error as Error };
  }
}

export async function deleteQuestion(questionId: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', questionId);
    
    if (error) throw error;
    
    return { error: error as Error };
  } catch (error) {
    console.error('Error deleting question:', error);
    return { error: error as Error };
  }
}

// Create or update user profile
export async function updateProfile(userId: string, username: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert([
        { 
          id: userId,
          username,
          updated_at: new Date().toISOString()
        }
      ]);
    
    if (error) throw error;
    
    return { error: null };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { error: error as Error };
  }
}

// Get user profile
export async function getProfile(userId: string): Promise<{ data: { username: string } | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching profile:', error);
    return { data: null, error: error as Error };
  }
}