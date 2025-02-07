import React from 'react';

interface TextAnalysisProps {
  text: string;
}

interface SentenceAnalysis {
  text: string;
  isComplex: boolean;
  isPassive: boolean;
}

export function TextAnalysis({ text }: TextAnalysisProps) {
  const analyzeSentence = (sentence: string): SentenceAnalysis => {
    const wordCount = sentence.split(/\s+/).length;
    const isComplex = wordCount > 20;
    const isPassive = /\b(am|is|are|was|were|be|been|being)\s+\w+ed\b/i.test(sentence);
    
    return {
      text: sentence.trim(),
      isComplex,
      isPassive
    };
  };

  const calculateReadingLevel = (text: string): number => {
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    const words = text.split(/\s+/).filter(Boolean);
    const syllables = words.reduce((count, word) => {
      return count + (word.match(/[aeiouy]{1,2}/gi)?.length || 1);
    }, 0);

    // Simplified Flesch-Kincaid Grade Level
    const level = 0.39 * (words.length / sentences.length) + 
                 11.8 * (syllables / words.length) - 15.59;
    return Math.round(level * 10) / 10;
  };

  const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);
  const analyzedSentences = sentences.map(analyzeSentence);
  const readingLevel = calculateReadingLevel(text);

  return (
    <div className="space-y-4">
      <div className="prose max-w-none">
        {analyzedSentences.map((sentence, index) => (
          <span
            key={index}
            className={`
              ${sentence.isComplex ? 'bg-red-100' : ''}
              ${sentence.isPassive ? 'bg-yellow-100' : ''}
              ${!sentence.isComplex && !sentence.isPassive ? 'bg-green-50' : ''}
              transition-colors duration-200
            `}
          >
            {sentence.text}{' '}
          </span>
        ))}
      </div>
      
      <div className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded-md">
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-red-100 rounded"></span>
            <span className="text-gray-600">Complex Sentences</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-yellow-100 rounded"></span>
            <span className="text-gray-600">Passive Voice</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-50 rounded"></span>
            <span className="text-gray-600">Clear Writing</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Reading Level:</span>
          <span className="font-medium text-indigo-600">Grade {readingLevel}</span>
        </div>
      </div>
    </div>
  );
}