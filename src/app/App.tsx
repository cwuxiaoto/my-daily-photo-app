import { useState, useEffect } from 'react';
import { Camera, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { PhotoUpload } from '@/app/components/PhotoUpload';
import { PhotoGallery } from '@/app/components/PhotoGallery';

interface Photo {
  date: string;
  imageData: string; // 在云端版本中，这里存的是图片的 URL 链接
  mood?: string;
}

function App() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [todayPhoto, setTodayPhoto] = useState<string | undefined>(undefined);
  const [todayMood, setTodayMood] = useState<string | undefined>(undefined);

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // --- 逻辑改动 1：从服务器获取已上传的照片列表 ---
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch('/api/photos'); // 向你的 Droplet 请求照片列表
        if (response.ok) {
          const cloudPhotos = await response.json() as Photo[];
          setPhotos(cloudPhotos);
          
          const today = getTodayDate();
          const todayPhotoData = cloudPhotos.find(p => p.date === today);
          if (todayPhotoData) {
            setTodayPhoto(todayPhotoData.imageData);
            setTodayMood(todayPhotoData.mood);
          }
        }
      } catch (error) {
        console.error('无法从云端加载照片:', error);
      }
    };
    fetchPhotos();
  }, []);

  // --- 逻辑改动 2：将照片发送到服务器后端 ---
  const handleUpload = async (imageData: string, mood: string) => {
    const today = getTodayDate();
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          image: imageData, 
          mood: mood,
          date: today 
        }),
      });

      if (response.ok) {
        const result = await response.json();
        // 上传成功后，更新本地显示状态
        setTodayPhoto(imageData);
        setTodayMood(mood);
        // 重新获取列表以确保同步
        const newListResponse = await fetch('/api/photos');
        const updatedList = await newListResponse.json();
        setPhotos(updatedList);
        alert("🎉 照片已成功存入 DigitalOcean 云端！");
      } else {
        alert("上传失败，请检查服务器连接");
      }
    } catch (error) {
      console.error('上传过程出错:', error);
      alert("网络错误，无法连接到 Droplet");
    }
  };

  const hasPhotoToday = todayPhoto !== undefined;

  // --- 下方 UI 部分保持不变 ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjOTMzM2VhIiBzdHJva2Utb3BhY2l0eT0iLjA1IiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-40" />
      
      <div className="relative max-w-7xl mx-auto px-4 py-12">
        <motion.div 
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="flex items-center justify-center gap-3 mb-3"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
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

        <motion.div className="mb-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <PhotoUpload 
            onUpload={handleUpload} 
            hasPhotoToday={hasPhotoToday}
            todayPhoto={todayPhoto}
            todayMood={todayMood}
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
          <PhotoGallery photos={photos} />
        </motion.div>
      </div>
    </div>
  );
}

export default App;
