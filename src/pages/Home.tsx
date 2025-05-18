import { Link } from 'react-router-dom';
import { MessageCircle, Shield, Share2, User } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center">
      <section className="text-center py-16 md:py-24">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Anonymous Questions.
          <br />
          <span className="text-gray-400">Public Answers.</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Create your own Q&A space where anyone can ask you questions anonymously.
          You decide which ones to answer publicly.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          {user ? (
            <Link to="/dashboard">
              <Button size="lg">Go to Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link to="/signup">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">Login</Button>
              </Link>
            </>
          )}
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-3xl h-[400px] rounded-xl bg-gradient-to-br from-gray-800 to-transparent relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-white bg-opacity-5 rounded-full backdrop-blur-xl"></div>
            <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-white bg-opacity-5 rounded-full backdrop-blur-xl"></div>
            
            {/* Sample Q&A Interface */}
            <div className="relative z-10 flex items-center justify-center h-full">
              <Card className="max-w-md w-full transform transition-all duration-500 hover:scale-105">
                <h3 className="text-xl font-semibold mb-4">Anonymous Question</h3>
                <p className="text-gray-300 mb-6">What's your favorite book and why do you recommend it?</p>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <User className="bg-gray-700 p-1 rounded-full" size={32} />
                    <div>
                      <p className="font-medium">John Doe</p>
                      <p className="text-gray-400 text-sm">"I'd recommend Dune by Frank Herbert because it's a masterpiece of world-building and philosophical depth."</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card hoverable className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
                <MessageCircle size={32} />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3">Create Your Q&A Space</h3>
            <p className="text-gray-400">Sign up and create your own personalized Q&A post with a unique link to share.</p>
          </Card>
          
          <Card hoverable className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
                <Shield size={32} />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3">Receive Anonymous Questions</h3>
            <p className="text-gray-400">Anyone with your link can submit questions anonymously without an account.</p>
          </Card>
          
          <Card hoverable className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
                <Share2 size={32} />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3">Share Your Answers</h3>
            <p className="text-gray-400">Choose which questions to answer and share your responses on social media.</p>
          </Card>
        </div>
      </section>

      <section className="w-full py-16 md:py-24 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start?</h2>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Join thousands of creators, influencers, and individuals who engage with their audience through anonymous Q&As.
        </p>
        
        {user ? (
          <Link to="/dashboard">
            <Button size="lg">Go to Dashboard</Button>
          </Link>
        ) : (
          <Link to="/signup">
            <Button size="lg">Create Your Q&A Space</Button>
          </Link>
        )}
      </section>
    </div>
  );
};

export default Home;