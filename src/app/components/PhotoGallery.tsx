import { Calendar, Image as ImageIcon, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Card } from '@/app/components/ui/card';

interface Photo {
  date: string;
  imageData: string;
  mood?: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  if (photos.length === 0) {
    return (
      <Card className="p-12 bg-gradient-to-br from-blue-50 to-purple-50 border-0 shadow-lg">
        <div className="text-center text-gray-500">
          <motion.div 
            className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-4 shadow-lg"
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <ImageIcon className="w-10 h-10 text-white" />
          </motion.div>
          <p className="text-xl mb-1">No photos yet</p>
          <p className="text-sm mt-1">Start building your daily photo journal!</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-purple-500" />
        <h2 className="text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Your Photo Journal
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo, index) => {
          const date = new Date(photo.date);
          const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
          const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
          
          return (
            <motion.div
              key={photo.date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:scale-105">
                <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  <img 
                    src={photo.imageData} 
                    alt={`Photo from ${formattedDate}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {photo.mood && (
                    <motion.div 
                      className="absolute top-3 right-3 w-14 h-14 bg-white rounded-full flex items-center justify-center text-3xl shadow-lg"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      {photo.mood}
                    </motion.div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-5 bg-gradient-to-br from-white to-gray-50">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <div>
                      <p className="font-semibold text-gray-900">{formattedDate}</p>
                      <p className="text-xs text-gray-500">{dayOfWeek}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
