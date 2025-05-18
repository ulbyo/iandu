import { Heart, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-800 py-6">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400">&copy; {new Date().getFullYear()} AnonQ - Anonymous Q&A Platform</p>
          </div>
          <div className="flex items-center space-x-4">
            <a 
              href="#" 
              className="text-gray-400 hover:text-white transition-colors flex items-center"
              aria-label="Support with love"
            >
              <Heart size={18} className="mr-1" />
              <span>Support</span>
            </a>
            <a 
              href="#" 
              className="text-gray-400 hover:text-white transition-colors flex items-center"
              aria-label="GitHub repository"
            >
              <Github size={18} className="mr-1" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;