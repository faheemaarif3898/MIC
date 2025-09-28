import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Calendar, MapPin, Clock, Users, Plus, Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'networking' | 'reunion' | 'workshop' | 'career' | 'social' | 'fundraising';
  capacity: number;
  registeredCount: number;
  image?: string;
  organizer: string;
  isRegistered: boolean;
  registrationDeadline: string;
  price?: number;
  agenda?: string[];
  speakers?: {
    name: string;
    title: string;
    company: string;
  }[];
}

export function EventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    type: 'networking' as Event['type'],
    capacity: 50,
    registrationDeadline: '',
    price: 0,
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-9b4de1de/events`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId: string) => {
    if (!user) {
      toast.error('Please log in to register for events');
      return;
    }

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-9b4de1de/events/${eventId}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (response.ok) {
        toast.success('Successfully registered for event!');
        fetchEvents(); // Refresh events
      } else {
        toast.error('Failed to register for event');
      }
    } catch (error) {
      console.error('Error registering for event:', error);
      toast.error('Error registering for event');
    }
  };

  const handleCreateEvent = async () => {
    if (!user) return;

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-9b4de1de/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          ...newEvent,
          organizerId: user.id,
          organizer: user.name || user.email,
        }),
      });

      if (response.ok) {
        toast.success('Event created successfully!');
        setIsCreateModalOpen(false);
        setNewEvent({
          title: '',
          description: '',
          date: '',
          time: '',
          location: '',
          type: 'networking',
          capacity: 50,
          registrationDeadline: '',
          price: 0,
        });
        fetchEvents();
      } else {
        toast.error('Failed to create event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Error creating event');
    }
  };

  const getEventTypeColor = (type: Event['type']) => {
    const colors = {
      networking: 'bg-blue-100 text-blue-800',
      reunion: 'bg-purple-100 text-purple-800',
      workshop: 'bg-green-100 text-green-800',
      career: 'bg-orange-100 text-orange-800',
      social: 'bg-pink-100 text-pink-800',
      fundraising: 'bg-red-100 text-red-800',
    };
    return colors[type];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filterEvents = (events: Event[], filter: string) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (filter) {
      case 'upcoming':
        return events.filter(event => new Date(event.date) >= today);
      case 'past':
        return events.filter(event => new Date(event.date) < today);
      case 'registered':
        return events.filter(event => event.isRegistered);
      default:
        return events;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Alumni Events</h1>
              <p className="mt-2 text-gray-600">Connect, learn, and grow together</p>
            </div>
            {(user?.role === 'Admin' || user?.role === 'Alumni') && (
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Event</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Event Title</Label>
                      <Input
                        id="title"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                        placeholder="Enter event title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                        placeholder="Enter event description"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={newEvent.date}
                          onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="time">Time</Label>
                        <Input
                          id="time"
                          type="time"
                          value={newEvent.time}
                          onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={newEvent.location}
                        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                        placeholder="Enter event location"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="type">Event Type</Label>
                        <Select value={newEvent.type} onValueChange={(value) => setNewEvent({ ...newEvent, type: value as Event['type'] })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="networking">Networking</SelectItem>
                            <SelectItem value="reunion">Reunion</SelectItem>
                            <SelectItem value="workshop">Workshop</SelectItem>
                            <SelectItem value="career">Career</SelectItem>
                            <SelectItem value="social">Social</SelectItem>
                            <SelectItem value="fundraising">Fundraising</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="capacity">Capacity</Label>
                        <Input
                          id="capacity"
                          type="number"
                          value={newEvent.capacity}
                          onChange={(e) => setNewEvent({ ...newEvent, capacity: parseInt(e.target.value) })}
                          min="1"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="deadline">Registration Deadline</Label>
                        <Input
                          id="deadline"
                          type="date"
                          value={newEvent.registrationDeadline}
                          onChange={(e) => setNewEvent({ ...newEvent, registrationDeadline: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="price">Price ($)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={newEvent.price}
                          onChange={(e) => setNewEvent({ ...newEvent, price: parseFloat(e.target.value) })}
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateEvent}>
                        Create Event
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
            <TabsTrigger value="registered">My Registrations</TabsTrigger>
          </TabsList>

          {['upcoming', 'past', 'registered'].map(tab => (
            <TabsContent key={tab} value={tab} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterEvents(events, tab).map((event) => (
                  <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48">
                      <ImageWithFallback
                        src={event.image || `https://images.unsplash.com/photo-1511578314322-379afb476865?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldmVudHMlMjBjb25mZXJlbmNlfGVufDF8fHx8MTc1ODk3ODYxMXww&ixlib=rb-4.1.0&q=80&w=400`}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className={getEventTypeColor(event.type)}>
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </Badge>
                      </div>
                      {event.price && event.price > 0 && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-white text-gray-900">
                            ${event.price}
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    <CardHeader>
                      <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                      <p className="text-sm text-gray-600 line-clamp-3">{event.description}</p>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        {event.time}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        {event.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        {event.registeredCount} / {event.capacity} registered
                      </div>
                      
                      <div className="pt-4">
                        {tab === 'upcoming' && !event.isRegistered && (
                          <Button
                            onClick={() => handleRegister(event.id)}
                            className="w-full"
                            disabled={event.registeredCount >= event.capacity || new Date(event.registrationDeadline) < new Date()}
                          >
                            {event.registeredCount >= event.capacity ? 'Full' : 'Register'}
                          </Button>
                        )}
                        {event.isRegistered && (
                          <Badge className="w-full bg-green-100 text-green-800 justify-center py-2">
                            Registered
                          </Badge>
                        )}
                        {tab === 'past' && (
                          <Button variant="outline" className="w-full">
                            View Details
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {filterEvents(events, tab).length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    {tab === 'upcoming' && 'No upcoming events at the moment.'}
                    {tab === 'past' && 'No past events to display.'}
                    {tab === 'registered' && 'You haven\'t registered for any events yet.'}
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}