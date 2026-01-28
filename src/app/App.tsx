import { useState, useEffect } from 'react';
import { Camera, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { PhotoUpload } from '@/app/components/PhotoUpload';
import { PhotoGallery } from '@/app/components/PhotoGallery';

interface Photo {
  date: string;
  imageData: string;
  mood?: string;
}

const STORAGE_KEY = 'daily-photo-journal';

function App() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [todayPhoto, setTodayPhoto] = useState<string | undefined>(undefined);
  const [todayMood, setTodayMood] = useState<string | undefined>(undefined);

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  useEffect(() => {
    // Load photos from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsedPhotos = JSON.parse(stored) as Photo[];
        setPhotos(parsedPhotos);
        
        // Check if there's a photo for today
        const today = getTodayDate();
        const todayPhotoData = parsedPhotos.find(p => p.date === today);
        if (todayPhotoData) {
          setTodayPhoto(todayPhotoData.imageData);
          setTodayMood(todayPhotoData.mood);
        }
      } catch (error) {
        console.error('Failed to load photos:', error);
      }
    }
  }, []);

  const handleUpload = (imageData: string, mood: string) => {
    const today = getTodayDate();
    
    // Check if photo already exists for today
    const existingPhotoIndex = photos.findIndex(p => p.date === today);
    
    let updatedPhotos: Photo[];
    if (existingPhotoIndex >= 0) {
      // Update existing photo
      updatedPhotos = [...photos];
      updatedPhotos[existingPhotoIndex] = { date: today, imageData, mood };
    } else {
      // Add new photo
      updatedPhotos = [...photos, { date: today, imageData, mood }];
    }
    
    // Sort by date descending (newest first)
    updatedPhotos.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setPhotos(updatedPhotos);
    setTodayPhoto(imageData);
    setTodayMood(mood);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPhotos));
  };

  const hasPhotoToday = todayPhoto !== undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjOTMzM2VhIiBzdHJva2Utb3BhY2l0eT0iLjA1IiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-40" />
      
      <div className="relative max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div 
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="flex items-center justify-center gap-3 mb-3"
            animate={{ 
              scale: [1, 1.02, 1],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-lg opacity-50" />
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-xl">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
          </motion.div>
          <h1 className="text-5xl md:text-6xl mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Daily Photo Journal
          </h1>
          <p className="text-gray-600 text-lg flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            Capture one moment every day
            <Sparkles className="w-4 h-4 text-purple-500" />
          </p>
        </motion.div>

        {/* Upload Section */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <PhotoUpload 
            onUpload={handleUpload} 
            hasPhotoToday={hasPhotoToday}
            todayPhoto={todayPhoto}
            todayMood={todayMood}
          />
        </motion.div>

        {/* Gallery Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <PhotoGallery photos={photos} />
        </motion.div>
      </div>
    </div>
  );
}

export default App;
