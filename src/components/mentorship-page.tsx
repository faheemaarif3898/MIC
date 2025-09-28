import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, Users, MessageSquare, Calendar, Star, Plus, Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';

interface Mentor {
  id: string;
  name: string;
  profileImage?: string;
  position: string;
  company: string;
  industry: string;
  expertise: string[];
  experience: number;
  rating: number;
  totalMentees: number;
  bio: string;
  availability: 'available' | 'busy' | 'unavailable';
  location: string;
}

interface MentorshipRequest {
  id: string;
  mentorId: string;
  menteeId: string;
  mentorName: string;
  menteeName: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  expertise: string;
}

interface MentorshipPair {
  id: string;
  mentorId: string;
  menteeId: string;
  mentorName: string;
  menteeName: string;
  startDate: string;
  status: 'active' | 'completed' | 'paused';
  goals: string;
  meetings: number;
  nextMeeting?: string;
}

export function MentorshipPage() {
  const { user } = useAuth();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [mentorshipRequests, setMentorshipRequests] = useState<MentorshipRequest[]>([]);
  const [mentorshipPairs, setMentorshipPairs] = useState<MentorshipPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('find-mentor');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('all');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [requestMessage, setRequestMessage] = useState('');

  useEffect(() => {
    fetchMentors();
    if (user) {
      fetchMentorshipRequests();
      fetchMentorshipPairs();
    }
  }, [user]);

  const fetchMentors = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-9b4de1de/mentors`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setMentors(data);
      }
    } catch (error) {
      console.error('Error fetching mentors:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMentorshipRequests = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-9b4de1de/mentorship-requests/${user?.id}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setMentorshipRequests(data);
      }
    } catch (error) {
      console.error('Error fetching mentorship requests:', error);
    }
  };

  const fetchMentorshipPairs = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-9b4de1de/mentorship-pairs/${user?.id}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setMentorshipPairs(data);
      }
    } catch (error) {
      console.error('Error fetching mentorship pairs:', error);
    }
  };

  const handleRequestMentorship = async () => {
    if (!user || !selectedMentor) return;

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-9b4de1de/mentorship-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          mentorId: selectedMentor.id,
          menteeId: user.id,
          message: requestMessage,
        }),
      });

      if (response.ok) {
        toast.success('Mentorship request sent successfully!');
        setIsRequestModalOpen(false);
        setRequestMessage('');
        setSelectedMentor(null);
        fetchMentorshipRequests();
      } else {
        toast.error('Failed to send mentorship request');
      }
    } catch (error) {
      console.error('Error sending mentorship request:', error);
      toast.error('Error sending mentorship request');
    }
  };

  const handleRequestResponse = async (requestId: string, status: 'accepted' | 'declined') => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-9b4de1de/mentorship-requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        toast.success(`Mentorship request ${status}!`);
        fetchMentorshipRequests();
        if (status === 'accepted') {
          fetchMentorshipPairs();
        }
      } else {
        toast.error(`Failed to ${status} mentorship request`);
      }
    } catch (error) {
      console.error('Error responding to mentorship request:', error);
      toast.error('Error processing request');
    }
  };

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.expertise.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesIndustry = filterIndustry === 'all' || mentor.industry === filterIndustry;
    
    return matchesSearch && matchesIndustry && mentor.availability === 'available';
  });

  const industries = Array.from(new Set(mentors.map(mentor => mentor.industry)));

  const getAvailabilityColor = (availability: Mentor['availability']) => {
    const colors = {
      available: 'bg-green-100 text-green-800',
      busy: 'bg-yellow-100 text-yellow-800',
      unavailable: 'bg-red-100 text-red-800',
    };
    return colors[availability];
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      declined: 'bg-red-100 text-red-800',
      active: 'bg-blue-100 text-blue-800',
      completed: 'bg-gray-100 text-gray-800',
      paused: 'bg-orange-100 text-orange-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Mentorship Program</h1>
            <p className="mt-2 text-gray-600">Connect with experienced professionals and guide the next generation</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="find-mentor">Find Mentors</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="my-mentorships">My Mentorships</TabsTrigger>
            <TabsTrigger value="mentor-dashboard">Be a Mentor</TabsTrigger>
          </TabsList>

          <TabsContent value="find-mentor" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search mentors by name, company, or expertise..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterIndustry} onValueChange={setFilterIndustry}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Industries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  {industries.map(industry => (
                    <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Mentors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMentors.map((mentor) => (
                <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4">
                      <ImageWithFallback
                        src={mentor.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}&size=80&background=0D8ABC&color=fff`}
                        alt={mentor.name}
                        className="w-20 h-20 rounded-full mx-auto object-cover"
                      />
                    </div>
                    <CardTitle className="text-lg">{mentor.name}</CardTitle>
                    <p className="text-sm text-gray-600">{mentor.position}</p>
                    <p className="text-sm font-medium text-blue-600">{mentor.company}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge className={getAvailabilityColor(mentor.availability)}>
                        {mentor.availability.charAt(0).toUpperCase() + mentor.availability.slice(1)}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        {mentor.rating} ({mentor.totalMentees} mentees)
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Expertise:</p>
                      <div className="flex flex-wrap gap-1">
                        {mentor.expertise.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {mentor.expertise.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{mentor.expertise.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 line-clamp-3">{mentor.bio}</p>

                    <Button
                      onClick={() => {
                        setSelectedMentor(mentor);
                        setIsRequestModalOpen(true);
                      }}
                      className="w-full"
                      disabled={mentor.availability !== 'available'}
                    >
                      Request Mentorship
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredMentors.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No mentors found matching your criteria.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Mentorship Requests</h2>
              
              {mentorshipRequests.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No mentorship requests found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {mentorshipRequests.map((request) => (
                    <Card key={request.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold">
                                {user?.id === request.menteeId ? `To: ${request.mentorName}` : `From: ${request.menteeName}`}
                              </h3>
                              <Badge className={getStatusColor(request.status)}>
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </Badge>
                            </div>
                            <p className="text-gray-700 mb-3">{request.message}</p>
                            <p className="text-sm text-gray-500">
                              Sent on {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          
                          {user?.id === request.mentorId && request.status === 'pending' && (
                            <div className="flex space-x-2 ml-4">
                              <Button
                                size="sm"
                                onClick={() => handleRequestResponse(request.id, 'accepted')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRequestResponse(request.id, 'declined')}
                              >
                                Decline
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="my-mentorships" className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Active Mentorships</h2>
              
              {mentorshipPairs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No active mentorships found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mentorshipPairs.map((pair) => (
                    <Card key={pair.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">
                            {user?.id === pair.menteeId ? `Mentor: ${pair.mentorName}` : `Mentee: ${pair.menteeName}`}
                          </CardTitle>
                          <Badge className={getStatusColor(pair.status)}>
                            {pair.status.charAt(0).toUpperCase() + pair.status.slice(1)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Goals:</p>
                          <p className="text-sm">{pair.goals}</p>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>Started: {new Date(pair.startDate).toLocaleDateString()}</span>
                          <span>{pair.meetings} meetings</span>
                        </div>
                        
                        {pair.nextMeeting && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            Next meeting: {new Date(pair.nextMeeting).toLocaleDateString()}
                          </div>
                        )}
                        
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Message
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Calendar className="w-4 h-4 mr-2" />
                            Schedule
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="mentor-dashboard" className="space-y-6">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Become a Mentor</h2>
              <p className="text-gray-600 mb-8">Share your experience and help guide the next generation of professionals.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <Card className="p-6">
                  <div className="text-center">
                    <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Make an Impact</h3>
                    <p className="text-sm text-gray-600">Guide students and young professionals in their career journey</p>
                  </div>
                </Card>
                
                <Card className="p-6">
                  <div className="text-center">
                    <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Share Expertise</h3>
                    <p className="text-sm text-gray-600">Leverage your experience to help others succeed</p>
                  </div>
                </Card>
                
                <Card className="p-6">
                  <div className="text-center">
                    <MessageSquare className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Build Network</h3>
                    <p className="text-sm text-gray-600">Expand your professional network and give back</p>
                  </div>
                </Card>
              </div>
              
              <Button size="lg" className="mt-8">
                Apply to be a Mentor
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Request Mentorship Modal */}
        <Dialog open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Mentorship</DialogTitle>
            </DialogHeader>
            {selectedMentor && (
              <div className="space-y-4">
                <div className="text-center">
                  <ImageWithFallback
                    src={selectedMentor.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedMentor.name)}&size=80&background=0D8ABC&color=fff`}
                    alt={selectedMentor.name}
                    className="w-16 h-16 rounded-full mx-auto object-cover mb-2"
                  />
                  <h3 className="font-semibold">{selectedMentor.name}</h3>
                  <p className="text-sm text-gray-600">{selectedMentor.position} at {selectedMentor.company}</p>
                </div>
                
                <div>
                  <Label htmlFor="message">Why would you like to connect with this mentor?</Label>
                  <Textarea
                    id="message"
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    placeholder="Tell them about your goals and what you hope to learn..."
                    rows={4}
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setIsRequestModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleRequestMentorship} disabled={!requestMessage.trim()}>
                    Send Request
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}