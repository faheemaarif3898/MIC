import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft, MapPin, Briefcase, GraduationCap, Mail, ExternalLink, Calendar, Award, Users, MessageCircle } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Alumni {
  id: string;
  name: string;
  email: string;
  gradYear: number;
  degree: string;
  company: string;
  position: string;
  location: string;
  industry: string;
  skills: string[];
  bio: string;
  profileImage?: string;
  linkedinUrl?: string;
  isAvailableForMentorship: boolean;
  experience: {
    company: string;
    position: string;
    duration: string;
    description: string;
  }[];
  achievements: string[];
  interests: string[];
  joinedDate: string;
  lastActive: string;
}

interface AlumniProfilePageProps {
  alumniId: string | null;
  onBack: () => void;
}

export function AlumniProfilePage({ alumniId, onBack }: AlumniProfilePageProps) {
  const { user } = useAuth();
  const [alumni, setAlumni] = useState<Alumni | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (alumniId) {
      fetchAlumniProfile();
    }
  }, [alumniId]);

  const fetchAlumniProfile = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-9b4de1de/alumni/${alumniId}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setAlumni(data);
      }
    } catch (error) {
      console.error('Error fetching alumni profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    if (!user || !alumni) return;

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-9b4de1de/connections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          fromUserId: user.id,
          toUserId: alumni.id,
          message: `Hi ${alumni.name}, I'd like to connect with you through our alumni network.`
        }),
      });

      if (response.ok) {
        alert('Connection request sent successfully!');
      }
    } catch (error) {
      console.error('Error sending connection request:', error);
    }
  };

  const handleRequestMentorship = async () => {
    if (!user || !alumni) return;

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-9b4de1de/mentorship-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          mentorId: alumni.id,
          menteeId: user.id,
          message: `Hi ${alumni.name}, I'm interested in learning more about your experience in ${alumni.industry}. Would you be available for mentorship?`
        }),
      });

      if (response.ok) {
        alert('Mentorship request sent successfully!');
      }
    } catch (error) {
      console.error('Error sending mentorship request:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!alumni) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Alumni profile not found.</p>
          <Button onClick={onBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Directory
          </Button>

          <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
            <div className="flex-shrink-0 mb-4 md:mb-0">
              <ImageWithFallback
                src={alumni.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(alumni.name)}&size=120&background=0D8ABC&color=fff`}
                alt={alumni.name}
                className="w-32 h-32 rounded-full object-cover mx-auto md:mx-0"
              />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{alumni.name}</h1>
                  <p className="text-xl text-gray-600 mt-1">{alumni.position}</p>
                  <p className="text-lg text-blue-600 font-medium">{alumni.company}</p>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <GraduationCap className="w-4 h-4 mr-1" />
                      {alumni.degree} • Class of {alumni.gradYear}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {alumni.location}
                    </span>
                    <span className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-1" />
                      {alumni.industry}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 mt-6 md:mt-0">
                  {alumni.isAvailableForMentorship && (
                    <Button onClick={handleRequestMentorship} className="bg-green-600 hover:bg-green-700">
                      <Users className="w-4 h-4 mr-2" />
                      Request Mentorship
                    </Button>
                  )}
                  <Button onClick={handleConnect} variant="outline">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Connect
                  </Button>
                  {alumni.linkedinUrl && (
                    <Button variant="outline" asChild>
                      <a href={alumni.linkedinUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        LinkedIn
                      </a>
                    </Button>
                  )}
                </div>
              </div>
              
              {alumni.isAvailableForMentorship && (
                <Badge className="bg-green-100 text-green-800 mt-4">
                  Available for Mentorship
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="about" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{alumni.bio}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Interests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {alumni.interests?.map((interest, index) => (
                    <Badge key={index} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="text-gray-700">{alumni.email}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="text-gray-700">Member since {new Date(alumni.joinedDate).getFullYear()}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience" className="space-y-6">
            {alumni.experience?.map((exp, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{exp.position}</CardTitle>
                  <div className="flex items-center justify-between">
                    <p className="text-blue-600 font-medium">{exp.company}</p>
                    <p className="text-sm text-gray-500">{exp.duration}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{exp.description}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Technical Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {alumni.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="px-3 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Achievements & Recognition</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alumni.achievements?.map((achievement, index) => (
                    <div key={index} className="flex items-start">
                      <Award className="w-5 h-5 text-yellow-500 mr-3 mt-0.5" />
                      <p className="text-gray-700">{achievement}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}