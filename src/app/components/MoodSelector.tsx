import { motion } from 'motion/react';

const moods = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😍', label: 'Loved' },
  { emoji: '😎', label: 'Cool' },
  { emoji: '🤗', label: 'Grateful' },
  { emoji: '😌', label: 'Peaceful' },
  { emoji: '🥳', label: 'Excited' },
  { emoji: '😴', label: 'Tired' },
  { emoji: '😔', label: 'Sad' },
  { emoji: '😤', label: 'Frustrated' },
  { emoji: '🤔', label: 'Thoughtful' },
  { emoji: '😋', label: 'Yummy' },
  { emoji: '🥰', label: 'Loving' }
];

interface MoodSelectorProps {
  selectedMood: string;
  onMoodSelect: (emoji: string) => void;
}

export function MoodSelector({ selectedMood, onMoodSelect }: MoodSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700">How are you feeling today?</label>
      <div className="grid grid-cols-6 gap-2">
        {moods.map((mood) => (
          <motion.button
            key={mood.emoji}
            type="button"
            onClick={() => onMoodSelect(mood.emoji)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`
              aspect-square rounded-xl flex items-center justify-center text-2xl
              transition-all duration-200
              ${selectedMood === mood.emoji 
                ? 'bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg scale-110' 
                : 'bg-white hover:bg-gray-50 shadow-sm hover:shadow-md'
              }
            `}
            title={mood.label}
          >
            {mood.emoji}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
