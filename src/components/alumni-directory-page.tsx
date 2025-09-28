import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Search, MapPin, Briefcase, GraduationCap, Filter, Grid, List } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
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
}

interface AlumniDirectoryPageProps {
  onViewProfile: (alumniId: string) => void;
}

export function AlumniDirectoryPage({ onViewProfile }: AlumniDirectoryPageProps) {
  const { user } = useAuth();
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [filteredAlumni, setFilteredAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchAlumni();
  }, []);

  useEffect(() => {
    filterAlumniData();
  }, [alumni, searchTerm, filterIndustry, filterYear]);

  const fetchAlumni = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-9b4de1de/alumni`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        // Ensure data is an array and filter out any null/undefined entries
        const validAlumni = Array.isArray(data) ? data.filter(item => item && typeof item === 'object') : [];
        setAlumni(validAlumni);
      }
    } catch (error) {
      console.error('Error fetching alumni:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAlumniData = () => {
    let filtered = alumni.filter(person => {
      // Skip null/undefined entries
      if (!person) return false;
      
      const matchesSearch = (person.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                           (person.company?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                           (person.position?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                           (person.skills?.some(skill => skill?.toLowerCase().includes(searchTerm.toLowerCase())) || false);
      
      const matchesIndustry = filterIndustry === 'all' || person.industry === filterIndustry;
      const matchesYear = filterYear === 'all' || person.gradYear?.toString() === filterYear;
      
      return matchesSearch && matchesIndustry && matchesYear;
    });
    
    setFilteredAlumni(filtered);
  };

  const industries = Array.from(new Set(alumni.filter(person => person && person.industry).map(person => person.industry)));
  const graduationYears = Array.from(new Set(alumni.filter(person => person && person.gradYear).map(person => person.gradYear))).sort((a, b) => b - a);

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
              <h1 className="text-3xl font-bold text-gray-900">Alumni Directory</h1>
              <p className="mt-2 text-gray-600">Connect with {alumni.length} alumni worldwide</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4 mr-2" />
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4 mr-2" />
                List
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name, company, position, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-3">
              <Select value={filterIndustry} onValueChange={setFilterIndustry}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  {industries.map(industry => (
                    <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={filterYear} onValueChange={setFilterYear}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {graduationYears.map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Alumni Grid/List */}
        {filteredAlumni.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No alumni found matching your criteria.</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-4"
          }>
            {filteredAlumni.map((person) => (
              <Card key={person.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onViewProfile(person.id)}>
                {viewMode === 'grid' ? (
                  <>
                    <CardHeader className="text-center pb-4">
                      <div className="mx-auto mb-4">
                        <ImageWithFallback
                          src={person.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&size=80&background=0D8ABC&color=fff`}
                          alt={person.name}
                          className="w-20 h-20 rounded-full mx-auto object-cover"
                        />
                      </div>
                      <CardTitle className="text-lg">{person.name}</CardTitle>
                      <p className="text-sm text-gray-600">{person.position}</p>
                      <p className="text-sm font-medium text-blue-600">{person.company}</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <GraduationCap className="w-4 h-4 mr-2" />
                        {person.degree} • Class of {person.gradYear}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        {person.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Briefcase className="w-4 h-4 mr-2" />
                        {person.industry}
                      </div>
                      {person.isAvailableForMentorship && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Available for Mentorship
                        </Badge>
                      )}
                      <div className="flex flex-wrap gap-1 mt-3">
                        {person.skills.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {person.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{person.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </>
                ) : (
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <ImageWithFallback
                        src={person.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&size=60&background=0D8ABC&color=fff`}
                        alt={person.name}
                        className="w-15 h-15 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{person.name}</h3>
                            <p className="text-sm text-gray-600">{person.position} at {person.company}</p>
                          </div>
                          {person.isAvailableForMentorship && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Available for Mentorship
                            </Badge>
                          )}
                        </div>
                        <div className="mt-2 flex items-center space-x-6 text-sm text-gray-600">
                          <span className="flex items-center">
                            <GraduationCap className="w-4 h-4 mr-1" />
                            {person.degree} • {person.gradYear}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {person.location}
                          </span>
                          <span className="flex items-center">
                            <Briefcase className="w-4 h-4 mr-1" />
                            {person.industry}
                          </span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1">
                          {person.skills.slice(0, 5).map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {person.skills.length > 5 && (
                            <Badge variant="outline" className="text-xs">
                              +{person.skills.length - 5} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}