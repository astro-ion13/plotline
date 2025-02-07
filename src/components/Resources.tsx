import React from 'react';
import { Book, Brain, MessageSquare, Sparkles, Heart, Lightbulb, BookOpen } from 'lucide-react';

interface ResourceSection {
  title: string;
  description: string;
  items: {
    title: string;
    content: string;
    icon?: React.ReactNode;
  }[];
  icon: React.ReactNode;
}

export function Resources() {
  const resources: ResourceSection[] = [
    {
      title: "Prompt Library",
      description: "A collection of effective prompts to inspire your writing",
      icon: <MessageSquare className="h-6 w-6" />,
      items: [
        {
          title: "Character Development",
          content: "Describe a moment when your character faced their greatest fear. What did they learn about themselves?",
          icon: <Brain className="h-5 w-5" />
        },
        {
          title: "World Building",
          content: "Create a unique cultural tradition for your story's world. How does it impact daily life?",
          icon: <Sparkles className="h-5 w-5" />
        },
        {
          title: "Conflict Creation",
          content: "Write a scene where two characters want the same thing but for different reasons.",
          icon: <Heart className="h-5 w-5" />
        }
      ]
    },
    {
      title: "Storytelling Frameworks",
      description: "Popular structures to help organize your narrative",
      icon: <Book className="h-6 w-6" />,
      items: [
        {
          title: "Hero's Journey",
          content: "The classic 12-step journey from ordinary world to transformation and return."
        },
        {
          title: "Three-Act Structure",
          content: "Setup, confrontation, and resolution - the backbone of storytelling."
        },
        {
          title: "Seven-Point Story Structure",
          content: "Hook, plot turn 1, pinch point 1, midpoint, pinch point 2, plot turn 2, resolution."
        }
      ]
    },
    {
      title: "Body Language 101",
      description: "Express emotions through physical descriptions",
      icon: <Brain className="h-6 w-6" />,
      items: [
        {
          title: "Micro-Expressions",
          content: "Subtle facial movements that reveal true emotions: lip quiver, eye twitch, nostril flare."
        },
        {
          title: "Posture Signals",
          content: "How body positioning conveys status, confidence, and emotional state."
        },
        {
          title: "Gesture Dictionary",
          content: "Common hand movements and their psychological implications."
        }
      ]
    },
    {
      title: "Visceral Vocabulary",
      description: "Words that evoke physical and emotional responses",
      icon: <BookOpen className="h-6 w-6" />,
      items: [
        {
          title: "Emotional States",
          content: "Flutter, clench, shiver, surge, pulse, tremor, ache"
        },
        {
          title: "Sensory Details",
          content: "Crisp, velvety, piercing, smoky, bitter, melodious"
        },
        {
          title: "Action Words",
          content: "Thrust, slash, caress, stumble, glide, prowl"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Writing Resources</h1>
          <p className="text-lg text-gray-600">Enhance your storytelling with these helpful guides and tools</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {resources.map((section, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-indigo-600">
                    {section.icon}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                </div>
                <p className="text-gray-600 mb-6">{section.description}</p>
                
                <div className="space-y-6">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        {item.icon && (
                          <div className="text-indigo-600 mt-1">
                            {item.icon}
                          </div>
                        )}
                        <div>
                          <h3 className="font-medium text-gray-900 mb-1">{item.title}</h3>
                          <p className="text-gray-600 text-sm">{item.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-indigo-50 rounded-lg p-6 text-center">
          <Lightbulb className="h-8 w-8 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Pro Writing Tip</h2>
          <p className="text-gray-600">
            Mix and match these resources to create unique and engaging stories. 
            Remember, the best writing often comes from combining different techniques 
            and making them your own.
          </p>
        </div>
      </div>
    </div>
  );
}