import { useState, useEffect, FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPostById, createQuestion, getQuestionsForPost } from '../lib/api';
import { Post, Question } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Textarea from '../components/ui/Textarea';
import Loader from '../components/ui/Loader';
import toast from 'react-hot-toast';
import { MessageCircle, MessageSquare, ArrowLeft, User, Clock } from 'lucide-react';

const PostPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  useEffect(() => {
    const fetchPostAndQuestions = async () => {
      if (!postId) return;
      
      try {
        const [postResponse, questionsResponse] = await Promise.all([
          getPostById(postId),
          getQuestionsForPost(postId)
        ]);
        
        if (postResponse.error) throw postResponse.error;
        if (questionsResponse.error) throw questionsResponse.error;
        
        setPost(postResponse.data);
        
        // Only show answered questions in the public post page
        setQuestions((questionsResponse.data || []).filter(q => q.answered));
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load the post');
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndQuestions();
  }, [postId]);

  const handleSubmitQuestion = async (e: FormEvent) => {
    e.preventDefault();
    if (!postId) return;

    if (!newQuestion.trim()) {
      toast.error('Please enter your question');
      return;
    }

    setSubmitting(true);
    
    try {
      const { error } = await createQuestion(newQuestion, postId);
      
      if (error) throw error;
      
      setNewQuestion('');
      setShowThankYou(true);
      toast.success('Your question has been submitted anonymously!');
    } catch (error) {
      console.error('Error submitting question:', error);
      toast.error('Failed to submit question');
    } finally {
      setSubmitting(false);
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
  
  if (!post) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Post not found</h2>
        <p className="text-gray-400 mb-6">This Q&A post doesn't exist or has been removed.</p>
        <Link to="/">
          <Button>Return Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
        <ArrowLeft size={18} className="mr-1" />
        Back to Home
      </Link>
      
      <Card className="mb-8">
        <h1 className="text-2xl font-bold mb-3">{post.title}</h1>
        {post.description && (
          <p className="text-gray-300 mb-6">{post.description}</p>
        )}
        
        <div className="mb-6 flex items-center text-gray-400">
          <div className="flex items-center mr-4">
            <User size={16} className="mr-1" />
            <span>{post.username || 'Anonymous'}</span>
          </div>
          <div className="flex items-center">
            <Clock size={16} className="mr-1" />
            <span>{formatDate(post.created_at)}</span>
          </div>
        </div>

        {showThankYou ? (
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <MessageCircle size={48} className="mx-auto mb-4 text-white opacity-80" />
            <h3 className="text-xl font-semibold mb-2">Thanks for your question!</h3>
            <p className="text-gray-300 mb-4">
              Your question has been submitted anonymously. The owner of this Q&A post will review and may answer it publicly.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setShowThankYou(false)}
            >
              Ask another question
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmitQuestion}>
            <Textarea
              label="Ask an anonymous question"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="What would you like to ask? Your identity will remain anonymous."
              required
            />
            <Button 
              type="submit" 
              loading={submitting}
              className="mt-2"
            >
              Submit Question
            </Button>
          </form>
        )}
      </Card>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <MessageSquare size={20} className="mr-2" />
          Answered Questions {questions.length > 0 && `(${questions.length})`}
        </h2>
        
        {questions.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-gray-400">
              No questions have been answered yet. Be the first to ask something!
            </p>
          </Card>
        ) : (
          <div className="space-y-6">
            {questions.map((question) => (
              <Card key={question.id} className="transform transition-all duration-300">
                <h3 className="text-lg font-semibold mb-3">Anonymous Question:</h3>
                <p className="text-gray-300 mb-6 bg-gray-800 p-4 rounded-lg">{question.content}</p>
                
                {question.answered && question.answer && (
                  <div className="border-t border-gray-800 pt-4 mt-4">
                    <div className="flex items-start gap-3">
                      <User className="bg-gray-800 p-1 rounded-full mt-1" size={28} />
                      <div>
                        <div className="flex items-center">
                          <p className="font-medium">{post.username || 'Anonymous'}</p>
                          <span className="mx-2 text-gray-500">•</span>
                          <p className="text-gray-500 text-sm">
                            {question.answer_created_at && formatDate(question.answer_created_at)}
                          </p>
                        </div>
                        <p className="text-gray-300 mt-1">{question.answer}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-4 flex justify-end">
                  <Link to={`/q/${question.id}`}>
                    <Button variant="ghost" size="sm">
                      View Full Q&A
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostPage;