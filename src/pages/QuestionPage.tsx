import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getQuestionById, getPostById, answerQuestion } from '../lib/api';
import { Question, Post } from '../types';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Textarea from '../components/ui/Textarea';
import Loader from '../components/ui/Loader';
import toast from 'react-hot-toast';
import { ArrowLeft, User, Twitter, Facebook, Clipboard, Link as LinkIcon, Share2 } from 'lucide-react';

const QuestionPage = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const [question, setQuestion] = useState<Question | null>(null);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const isOwner = user && post?.user_id === user.id;

  useEffect(() => {
    const fetchQuestionAndPost = async () => {
      if (!questionId) return;
      
      try {
        const { data: questionData, error: questionError } = await getQuestionById(questionId);
        
        if (questionError) throw questionError;
        if (!questionData) throw new Error('Question not found');
        
        setQuestion(questionData);
        
        // Once we have the question, fetch the associated post
        const { data: postData, error: postError } = await getPostById(questionData.post_id);
        
        if (postError) throw postError;
        
        setPost(postData);
        
        // Pre-fill answer if it exists
        if (questionData.answer) {
          setAnswer(questionData.answer);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load the question');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionAndPost();
  }, [questionId]);

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionId) return;

    if (!answer.trim()) {
      toast.error('Please enter your answer');
      return;
    }

    setSubmitting(true);
    
    try {
      const { error } = await answerQuestion(questionId, answer);
      
      if (error) throw error;
      
      // Update the local question state
      if (question) {
        setQuestion({
          ...question,
          answer,
          answered: true,
          answer_created_at: new Date().toISOString()
        });
      }
      
      toast.success('Answer published successfully!');
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast.error('Failed to publish answer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleShare = (platform: 'twitter' | 'facebook' | 'copy') => {
    const url = window.location.href;
    const text = `Check out this Q&A: "${question?.content}"`;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url)
          .then(() => toast.success('Link copied to clipboard!'))
          .catch(() => toast.error('Failed to copy link'));
        break;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  if (loading) return <Loader />;
  
  if (!question || !post) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Question not found</h2>
        <p className="text-gray-400 mb-6">This question doesn't exist or has been removed.</p>
        <Link to="/">
          <Button>Return Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link to={`/p/${post.id}`} className="inline-flex items-center text-gray-400 hover:text-white mb-6">
        <ArrowLeft size={18} className="mr-1" />
        Back to Q&A Post
      </Link>
      
      <Card className="mb-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Anonymous Question</h1>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-white">{question.content}</p>
          </div>
          <div className="text-sm text-gray-500 mt-2">
            Asked on {formatDate(question.created_at)}
          </div>
        </div>
        
        {question.answered && question.answer ? (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Answer</h2>
            <div className="bg-gray-800 bg-opacity-50 p-5 rounded-lg">
              <div className="flex items-start gap-3">
                <User className="bg-gray-700 p-1 rounded-full mt-1" size={32} />
                <div>
                  <div className="flex items-center">
                    <p className="font-medium">{post.username || 'Anonymous'}</p>
                    <span className="mx-2 text-gray-500">•</span>
                    <p className="text-gray-500 text-sm">
                      {question.answer_created_at && formatDate(question.answer_created_at)}
                    </p>
                  </div>
                  <p className="text-gray-200 mt-2">{question.answer}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Share this Q&A</h3>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleShare('twitter')}
                  aria-label="Share on Twitter"
                >
                  <Twitter size={18} className="mr-1" />
                  Twitter
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleShare('facebook')}
                  aria-label="Share on Facebook"
                >
                  <Facebook size={18} className="mr-1" />
                  Facebook
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleShare('copy')}
                  aria-label="Copy link"
                >
                  <Clipboard size={18} className="mr-1" />
                  Copy Link
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {isOwner ? (
              <div className="mt-6">
                <h2 className="text-xl font-bold mb-4">Publish Your Answer</h2>
                <form onSubmit={handleSubmitAnswer}>
                  <Textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    required
                  />
                  <Button 
                    type="submit" 
                    loading={submitting}
                    className="mt-3"
                  >
                    Publish Answer
                  </Button>
                </form>
              </div>
            ) : (
              <div className="bg-gray-800 p-4 rounded-lg text-center mt-6">
                <p className="text-gray-300">
                  This question hasn't been answered yet. Check back later!
                </p>
              </div>
            )}
          </>
        )}
      </Card>
      
      <div className="text-center">
        <h3 className="text-lg font-medium mb-3">Want to ask your own questions?</h3>
        <Link to="/" className="inline-flex items-center hover:underline">
          <LinkIcon size={16} className="mr-1" />
          Create your own anonymous Q&A post
        </Link>
      </div>
    </div>
  );
};

export default QuestionPage;