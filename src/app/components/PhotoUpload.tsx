import { useState } from 'react';
import { Upload, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { MoodSelector } from '@/app/components/MoodSelector';

interface PhotoUploadProps {
  onUpload: (imageData: string, mood: string) => void;
  hasPhotoToday: boolean;
  todayPhoto?: string;
  todayMood?: string;
}

export function PhotoUpload({ onUpload, hasPhotoToday, todayPhoto, todayMood }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(todayPhoto || null);
  const [selectedMood, setSelectedMood] = useState<string>(todayMood || '😊');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        onUpload(result, selectedMood);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        onUpload(result, selectedMood);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleMoodChange = (mood: string) => {
    setSelectedMood(mood);
    if (preview) {
      onUpload(preview, mood);
    }
  };

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <Card className="p-8 bg-white shadow-xl border-0">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-purple-500" />
          <h2 className="text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Today's Memory
          </h2>
        </div>
        <p className="text-gray-600">{today}</p>
      </div>

      <AnimatePresence mode="wait">
        {hasPhotoToday && preview ? (
          <motion.div
            key="uploaded"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg">
              <img 
                src={preview} 
                alt="Today's upload" 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 w-16 h-16 bg-white rounded-full flex items-center justify-center text-4xl shadow-lg">
                {selectedMood}
              </div>
            </div>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-2 text-green-600 bg-green-50 py-3 rounded-xl"
            >
              <Check className="w-5 h-5" />
              <span className="font-medium">Photo uploaded for today!</span>
            </motion.div>
            <MoodSelector selectedMood={selectedMood} onMoodSelect={handleMoodChange} />
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`
                border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
                ${isDragging 
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 scale-105' 
                  : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                }
              `}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-4">
                  <motion.div 
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Upload className="w-10 h-10 text-white" />
                  </motion.div>
                  <div>
                    <p className="text-xl mb-1">Drop your photo here or click to browse</p>
                    <p className="text-sm text-gray-500">Capture today's moment</p>
                  </div>
                  <Button type="button" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg">
                    Choose Photo
                  </Button>
                </div>
              </label>
            </div>
            <MoodSelector selectedMood={selectedMood} onMoodSelect={setSelectedMood} />
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
