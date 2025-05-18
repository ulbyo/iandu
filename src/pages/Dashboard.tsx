import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserPosts, createPost, deletePost, getProfile, updateProfile } from '../lib/api';
import { Post } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import toast from 'react-hot-toast';
import { Share2, MessageCircle, Trash2, Plus, Copy } from 'lucide-react';
import Loader from '../components/ui/Loader';

const Dashboard = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostDescription, setNewPostDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [username, setUsername] = useState('');
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');

  // Fetch user posts
  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await getUserPosts(user.id);
        if (error) throw error;
        setPosts(data || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
        toast.error('Failed to load your posts');
      } finally {
        setLoading(false);
      }
    };

    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await getProfile(user.id);
        if (error) throw error;
        if (data) {
          setUsername(data.username || '');
          setNewUsername(data.username || '');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchUserPosts();
    fetchUserProfile();
  }, [user]);

  // Create new post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!newPostTitle.trim()) {
      toast.error('Please enter a title for your post');
      return;
    }

    setSubmitting(true);
    
    try {
      const { data, error } = await createPost(newPostTitle, newPostDescription, user.id);
      
      if (error) throw error;
      
      if (data) {
        setPosts([data, ...posts]);
        setNewPostTitle('');
        setNewPostDescription('');
        setShowNewPostForm(false);
        toast.success('Post created successfully!');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete post
  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post? All questions will be permanently deleted.')) {
      return;
    }
    
    try {
      const { error } = await deletePost(postId);
      
      if (error) throw error;
      
      setPosts(posts.filter(post => post.id !== postId));
      toast.success('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  // Update username
  const handleUpdateUsername = async () => {
    if (!user) return;
    
    if (!newUsername.trim()) {
      toast.error('Username cannot be empty');
      return;
    }
    
    try {
      const { error } = await updateProfile(user.id, newUsername);
      
      if (error) throw error;
      
      setUsername(newUsername);
      setIsEditingUsername(false);
      toast.success('Username updated successfully!');
    } catch (error) {
      console.error('Error updating username:', error);
      toast.error('Failed to update username');
    }
  };

  // Copy post link to clipboard
  const copyPostLink = (postId: string) => {
    const link = `${window.location.origin}/p/${postId}`;
    navigator.clipboard.writeText(link)
      .then(() => toast.success('Link copied to clipboard!'))
      .catch(() => toast.error('Failed to copy link'));
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Your Dashboard</h1>
          {!isEditingUsername ? (
            <div className="flex items-center text-gray-400 mb-6">
              <User size={18} className="mr-2" />
              <span>{username || 'Set your username'}</span>
              <button 
                onClick={() => setIsEditingUsername(true)}
                className="ml-2 text-white text-sm hover:underline"
              >
                Edit
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-6">
              <Input
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Enter username"
                className="max-w-xs"
              />
              <Button size="sm" onClick={handleUpdateUsername}>Save</Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => {
                  setNewUsername(username);
                  setIsEditingUsername(false);
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
        <Button 
          onClick={() => setShowNewPostForm(!showNewPostForm)} 
          className="mt-4 md:mt-0"
        >
          <Plus size={18} className="mr-1" />
          New Q&A Post
        </Button>
      </div>

      {showNewPostForm && (
        <Card className="mb-8 transform transition-all duration-300">
          <h2 className="text-xl font-bold mb-4">Create New Q&A Post</h2>
          <form onSubmit={handleCreatePost}>
            <Input
              label="Title"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              placeholder="Ask me anything about..."
              required
            />
            <Textarea
              label="Description (Optional)"
              value={newPostDescription}
              onChange={(e) => setNewPostDescription(e.target.value)}
              placeholder="Add more context or instructions for people asking questions..."
            />
            <div className="flex gap-3 mt-4">
              <Button type="submit" loading={submitting}>
                Create Post
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowNewPostForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {posts.length === 0 ? (
        <Card className="text-center py-12">
          <MessageCircle size={48} className="mx-auto mb-4 text-gray-500" />
          <h2 className="text-xl font-semibold mb-2">No Q&A Posts Yet</h2>
          <p className="text-gray-400 mb-6">
            Create your first Q&A post and share the link to start receiving anonymous questions.
          </p>
          <Button onClick={() => setShowNewPostForm(true)}>
            <Plus size={18} className="mr-1" />
            Create Your First Post
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {posts.map((post) => (
            <Card 
              key={post.id} 
              className="transition-all duration-300 hover:border-gray-700"
            >
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                <div className="flex gap-2">
                  <button 
                    className="p-2 rounded-full hover:bg-gray-800"
                    onClick={() => copyPostLink(post.id)}
                    aria-label="Copy link"
                  >
                    <Copy size={18} />
                  </button>
                  <button 
                    className="p-2 rounded-full hover:bg-gray-800 text-red-500"
                    onClick={() => handleDeletePost(post.id)}
                    aria-label="Delete post"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              {post.description && (
                <p className="text-gray-400 mb-4 line-clamp-2">{post.description}</p>
              )}
              
              <div className="flex flex-wrap gap-3 mt-4">
                <Link to={`/p/${post.id}`}>
                  <Button variant="secondary" size="sm">
                    <MessageCircle size={16} className="mr-1" />
                    View Questions
                  </Button>
                </Link>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => copyPostLink(post.id)}
                >
                  <Share2 size={16} className="mr-1" />
                  Share Link
                </Button>
              </div>
              
              <div className="text-sm text-gray-500 mt-4">
                Created: {new Date(post.created_at).toLocaleDateString()}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Missing import for the User icon
import { User } from 'lucide-react';

export default Dashboard;