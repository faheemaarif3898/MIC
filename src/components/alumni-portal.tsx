import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { toast } from 'sonner';
import { 
  User, 
  Building, 
  GraduationCap, 
  Briefcase, 
  Linkedin, 
  Mail, 
  Phone,
  MapPin,
  Calendar,
  Users,
  Award,
  Plus
} from 'lucide-react';

interface AlumniProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  batch: string;
  department: string;
  currentCompany?: string;
  currentPosition?: string;
  linkedin?: string;
  location?: string;
  bio?: string;
  expertise?: string[];
  mentorshipAvailable: boolean;
  internshipOpportunities: boolean;
  createdAt: string;
}

export function AlumniPortal() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('directory');
  const [alumniList, setAlumniList] = useState<AlumniProfile[]>([]);
  const [userProfile, setUserProfile] = useState<AlumniProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    batch: '',
    department: '',
    currentCompany: '',
    currentPosition: '',
    linkedin: '',
    location: '',
    bio: '',
    expertise: '',
    mentorshipAvailable: false,
    internshipOpportunities: false
  });

  useEffect(() => {
    fetchAlumniList();
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchAlumniList = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-9b4de1de/alumni`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAlumniList(data);
      }
    } catch (error) {
      console.error('Error fetching alumni:', error);
    }
  };

  const fetchUserProfile = async () => {
    if (!user) return;
    
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        `https://${projectId}.supabase.co`,
        publicAnonKey
      );
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-9b4de1de/alumni`,
          {
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const userAlumni = data.find((alumni: AlumniProfile) => alumni.email === user.email);
          if (userAlumni) {
            setUserProfile(userAlumni);
            setFormData({
              name: userAlumni.name || '',
              phone: userAlumni.phone || '',
              batch: userAlumni.batch || '',
              department: userAlumni.department || '',
              currentCompany: userAlumni.currentCompany || '',
              currentPosition: userAlumni.currentPosition || '',
              linkedin: userAlumni.linkedin || '',
              location: userAlumni.location || '',
              bio: userAlumni.bio || '',
              expertise: userAlumni.expertise?.join(', ') || '',
              mentorshipAvailable: userAlumni.mentorshipAvailable || false,
              internshipOpportunities: userAlumni.internshipOpportunities || false
            });
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) {
      toast.error('Please login to save your profile');
      return;
    }

    if (!formData.name || !formData.batch || !formData.department) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        `https://${projectId}.supabase.co`,
        publicAnonKey
      );
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        toast.error('Please login to save your profile');
        return;
      }

      const profileData = {
        ...formData,
        email: user.email,
        expertise: formData.expertise.split(',').map(s => s.trim()).filter(Boolean)
      };

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-9b4de1de/alumni`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(profileData),
        }
      );

      if (response.ok) {
        const savedProfile = await response.json();
        setUserProfile(savedProfile);
        toast.success('Profile saved successfully!');
        await fetchAlumniList(); // Refresh the list
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const getDepartmentColor = (department: string) => {
    const colors = {
      'Computer Science': 'bg-blue-100 text-blue-800',
      'Electronics': 'bg-green-100 text-green-800',
      'Mechanical': 'bg-orange-100 text-orange-800',
      'Civil': 'bg-purple-100 text-purple-800',
      'Electrical': 'bg-yellow-100 text-yellow-800',
    };
    return colors[department as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatBatch = (batch: string) => {
    return `Batch of ${batch}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Alumni Portal</h1>
        <p className="text-lg text-gray-600">
          Connect with fellow alumni, find mentors, and explore opportunities
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="directory">Alumni Directory</TabsTrigger>
          <TabsTrigger value="profile">My Profile</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
        </TabsList>

        <TabsContent value="directory">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Alumni Network ({alumniList.length} members)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {alumniList.map((alumni) => (
                    <Card key={alumni.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4 mb-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback>
                              {alumni.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{alumni.name}</h3>
                            <p className="text-sm text-gray-600">{formatBatch(alumni.batch)}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <Badge className={getDepartmentColor(alumni.department)}>
                            {alumni.department}
                          </Badge>
                          
                          {alumni.currentCompany && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Building className="w-4 h-4 mr-2" />
                              {alumni.currentPosition} at {alumni.currentCompany}
                            </div>
                          )}
                          
                          {alumni.location && (
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="w-4 h-4 mr-2" />
                              {alumni.location}
                            </div>
                          )}
                        </div>

                        {alumni.bio && (
                          <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                            {alumni.bio}
                          </p>
                        )}

                        {alumni.expertise && alumni.expertise.length > 0 && (
                          <div className="mb-4">
                            <div className="flex flex-wrap gap-1">
                              {alumni.expertise.slice(0, 3).map((skill, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {alumni.expertise.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{alumni.expertise.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                          {alumni.mentorshipAvailable && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              Mentor Available
                            </Badge>
                          )}
                          {alumni.internshipOpportunities && (
                            <Badge className="bg-blue-100 text-blue-800 text-xs">
                              Internships
                            </Badge>
                          )}
                        </div>

                        <div className="flex gap-2 mt-4 pt-4 border-t">
                          {alumni.linkedin && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={alumni.linkedin} target="_blank" rel="noopener noreferrer">
                                <Linkedin className="w-4 h-4" />
                              </a>
                            </Button>
                          )}
                          <Button size="sm" variant="outline" asChild>
                            <a href={`mailto:${alumni.email}`}>
                              <Mail className="w-4 h-4" />
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="profile">
          {!user ? (
            <Card>
              <CardContent className="p-8 text-center">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Login Required</h3>
                <p className="text-gray-600 mb-4">
                  Please login to create or edit your alumni profile.
                </p>
                <Button>Login / Sign Up</Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Alumni Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="batch">Batch Year *</Label>
                    <Select value={formData.batch} onValueChange={(value) => setFormData(prev => ({ ...prev, batch: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select batch year" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(year => (
                          <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="department">Department *</Label>
                    <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Mechanical">Mechanical</SelectItem>
                        <SelectItem value="Civil">Civil</SelectItem>
                        <SelectItem value="Electrical">Electrical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currentCompany">Current Company</Label>
                    <Input
                      id="currentCompany"
                      value={formData.currentCompany}
                      onChange={(e) => setFormData(prev => ({ ...prev, currentCompany: e.target.value }))}
                      placeholder="Company name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="currentPosition">Current Position</Label>
                    <Input
                      id="currentPosition"
                      value={formData.currentPosition}
                      onChange={(e) => setFormData(prev => ({ ...prev, currentPosition: e.target.value }))}
                      placeholder="Job title"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="linkedin">LinkedIn Profile</Label>
                    <Input
                      id="linkedin"
                      value={formData.linkedin}
                      onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="City, State"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us about yourself, your interests, and professional journey"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="expertise">Areas of Expertise</Label>
                  <Input
                    id="expertise"
                    value={formData.expertise}
                    onChange={(e) => setFormData(prev => ({ ...prev, expertise: e.target.value }))}
                    placeholder="JavaScript, React, Machine Learning, Data Science (comma separated)"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Opportunities</Label>
                  <div className="flex flex-col space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.mentorshipAvailable}
                        onChange={(e) => setFormData(prev => ({ ...prev, mentorshipAvailable: e.target.checked }))}
                        className="rounded"
                      />
                      <span>Available for mentorship</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.internshipOpportunities}
                        onChange={(e) => setFormData(prev => ({ ...prev, internshipOpportunities: e.target.checked }))}
                        className="rounded"
                      />
                      <span>Can provide internship opportunities</span>
                    </label>
                  </div>
                </div>

                <Button onClick={handleSaveProfile} disabled={loading} className="w-full">
                  {loading ? 'Saving...' : 'Save Profile'}
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="opportunities">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Mentorship Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Connect with experienced alumni who can guide you in your career journey.
                  </p>
                  <div className="space-y-2">
                    {alumniList.filter(a => a.mentorshipAvailable).slice(0, 3).map(mentor => (
                      <div key={mentor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{mentor.name}</p>
                          <p className="text-sm text-gray-600">{mentor.currentPosition}</p>
                        </div>
                        <Button size="sm" variant="outline">Connect</Button>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    View All Mentors
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Internship Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Explore internship opportunities offered by alumni and their companies.
                  </p>
                  <div className="space-y-2">
                    {alumniList.filter(a => a.internshipOpportunities).slice(0, 3).map(provider => (
                      <div key={provider.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{provider.currentCompany}</p>
                          <p className="text-sm text-gray-600">Contact: {provider.name}</p>
                        </div>
                        <Button size="sm" variant="outline">Apply</Button>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    View All Opportunities
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold">Alumni Reunion 2025</h4>
                    <p className="text-sm text-gray-600">March 15, 2025 | MIC Campus</p>
                    <p className="text-sm">Join us for our annual alumni reunion with networking sessions and tech talks.</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold">Career Guidance Webinar</h4>
                    <p className="text-sm text-gray-600">February 28, 2025 | Online</p>
                    <p className="text-sm">Expert alumni will share insights on career transitions and industry trends.</p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-semibold">Startup Pitch Competition</h4>
                    <p className="text-sm text-gray-600">April 10, 2025 | Innovation Hub</p>
                    <p className="text-sm">Present your startup ideas to a panel of successful alumni entrepreneurs.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}