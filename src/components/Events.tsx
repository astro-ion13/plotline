import React from 'react';
import { Calendar, Users, Trophy, BookOpen, MapPin, Clock, ExternalLink } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  type: 'slam' | 'competition' | 'workshop';
  date: string;
  time: string;
  location: string;
  description: string;
  registrationUrl?: string;
  capacity?: number;
  price?: string;
}

export function Events() {
  const events: Event[] = [
    {
      id: '1',
      title: 'Monthly Story Slam: Heroes & Villains',
      type: 'slam',
      date: '2025-03-15',
      time: '19:00',
      location: 'The Literary Cafe, Downtown',
      description: 'Join us for an evening of storytelling centered around the theme of Heroes & Villains. Share your 5-minute story or come to listen and vote for your favorite tale!',
      registrationUrl: 'https://example.com/storyslam-march',
      capacity: 50,
      price: '$10'
    },
    {
      id: '2',
      title: 'Spring Writing Competition',
      type: 'competition',
      date: '2025-04-01',
      time: '23:59',
      location: 'Online',
      description: 'Submit your best short story (max 5000 words) for a chance to win publication and cash prizes. Theme: New Beginnings.',
      registrationUrl: 'https://example.com/spring-competition',
      price: '$15'
    },
    {
      id: '3',
      title: 'Character Development Workshop',
      type: 'workshop',
      date: '2025-03-20',
      time: '14:00',
      location: 'Virtual Workshop',
      description: 'Learn advanced techniques for creating memorable characters with bestselling author Jane Smith. Interactive exercises and personalized feedback included.',
      registrationUrl: 'https://example.com/character-workshop',
      capacity: 25,
      price: '$45'
    },
    {
      id: '4',
      title: 'Flash Fiction Challenge',
      type: 'competition',
      date: '2025-03-10',
      time: '20:00',
      location: 'Online',
      description: 'Write a complete story in exactly 100 words. Weekly prompts and peer feedback. Join our growing community of flash fiction enthusiasts!',
      registrationUrl: 'https://example.com/flash-fiction',
      price: 'Free'
    }
  ];

  const getEventIcon = (type: Event['type']) => {
    switch (type) {
      case 'slam':
        return <Users className="h-6 w-6" />;
      case 'competition':
        return <Trophy className="h-6 w-6" />;
      case 'workshop':
        return <BookOpen className="h-6 w-6" />;
    }
  };

  const getEventTypeLabel = (type: Event['type']) => {
    switch (type) {
      case 'slam':
        return 'Story Slam';
      case 'competition':
        return 'Competition';
      case 'workshop':
        return 'Workshop';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Upcoming Events</h1>
          <p className="text-lg text-gray-600">Join our community events to improve your writing and connect with fellow storytellers</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-indigo-600">
                      {getEventIcon(event.type)}
                    </div>
                    <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-sm font-medium text-indigo-800">
                      {getEventTypeLabel(event.type)}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-indigo-600">
                    {event.price}
                  </div>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mb-3">{event.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>

                <div className="space-y-2 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(event.date).toLocaleDateString('en-US', { 
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  {event.capacity && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Limited to {event.capacity} participants</span>
                    </div>
                  )}
                </div>

                {event.registrationUrl && (
                  <a
                    href={event.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Register Now
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-indigo-50 rounded-lg p-6 text-center">
          <Calendar className="h-8 w-8 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Want to Host an Event?</h2>
          <p className="text-gray-600">
            If you're interested in organizing a story slam, workshop, or competition, 
            we'd love to help promote it to our community. Contact us for more information.
          </p>
        </div>
      </div>
    </div>
  );
}