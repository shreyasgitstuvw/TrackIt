
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AttendanceDashboard from "@/components/AttendanceDashboard";
import UserProfile from "@/components/UserProfile";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { User, LogIn } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-gray-800">Welcome to TrackIt</h1>
          <p className="text-gray-600 max-w-md">
            Please sign in to access your attendance dashboard and start tracking your progress.
          </p>
          <Button 
            onClick={() => navigate('/auth')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative">
      {/* Profile Button */}
      <div className="absolute top-4 right-4 z-10">
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className="bg-white/80 backdrop-blur-sm hover:bg-white/90"
            >
              <User className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <UserProfile />
          </DialogContent>
        </Dialog>
      </div>

      <AttendanceDashboard />
    </div>
  );
};

export default Index;
