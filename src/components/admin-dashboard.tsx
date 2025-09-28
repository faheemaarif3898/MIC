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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Users, 
  FileText, 
  BarChart3, 
  Download,
  Building,
  Calendar,
  Target,
  Award
} from 'lucide-react';

interface Analytics {
  totalUsers: number;
  totalAlumni: number;
  totalEvents: number;
  totalDonations: number;
  alumniByIndustry: Record<string, number>;
  recentActivity: {
    newAlumni: number;
    newEvents: number;
    totalFundsRaised: number;
    activeMentorships: number;
  };
}

interface ProblemStatement {
  id: string;
  title: string;
  description: string;
  organization: string;
  department: string;
  category: string;
  theme: string;
  psNumber: string;
  deadline: string;
  impact: string;
  expectedOutcomes: string;
  stakeholders: string;
  submittedIdeasCount: number;
}

export function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState<Analytics>({
    totalUsers: 0,
    totalAlumni: 0,
    totalEvents: 0,
    totalDonations: 0,
    alumniByIndustry: {},
    recentActivity: {
      newAlumni: 0,
      newEvents: 0,
      totalFundsRaised: 0,
      activeMentorships: 0
    }
  });
  const [problems, setProblems] = useState<ProblemStatement[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateProblem, setShowCreateProblem] = useState(false);
  const [editingProblem, setEditingProblem] = useState<ProblemStatement | null>(null);
  
  const [problemForm, setProblemForm] = useState({
    title: '',
    description: '',
    organization: '',
    department: '',
    category: '',
    theme: '',
    psNumber: '',
    deadline: '',
    impact: '',
    expectedOutcomes: '',
    stakeholders: ''
  });

  useEffect(() => {
    if (user?.role === 'Admin') {
      fetchAnalytics();
      fetchProblems();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        `https://${projectId}.supabase.co`,
        publicAnonKey
      );
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-9b4de1de/analytics`,
          {
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setAnalytics(data);
        } else {
          console.error('Failed to fetch analytics:', response.status);
        }
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const fetchProblems = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-9b4de1de/problem-statements?limit=100`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProblems(data.problems);
      }
    } catch (error) {
      console.error('Error fetching problems:', error);
    }
  };

  const handleCreateProblem = async () => {
    if (!problemForm.title || !problemForm.organization || !problemForm.category) {
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

      if (session) {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-9b4de1de/problem-statements`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`,
            },
            body: JSON.stringify(problemForm),
          }
        );

        if (response.ok) {
          toast.success('Problem statement created successfully!');
          setShowCreateProblem(false);
          resetForm();
          await fetchProblems();
          await fetchAnalytics();
        } else {
          const error = await response.json();
          toast.error(error.error || 'Failed to create problem statement');
        }
      }
    } catch (error) {
      console.error('Error creating problem:', error);
      toast.error('Failed to create problem statement');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setProblemForm({
      title: '',
      description: '',
      organization: '',
      department: '',
      category: '',
      theme: '',
      psNumber: '',
      deadline: '',
      impact: '',
      expectedOutcomes: '',
      stakeholders: ''
    });
    setEditingProblem(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Software':
        return 'bg-blue-100 text-blue-800';
      case 'Hardware':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Check if user is admin
  if (user?.role !== 'Admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-red-500 mb-4">
              <Building className="w-12 h-12 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">
              You don't have permission to access the admin dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-lg text-gray-600">
          Manage problem statements, view analytics, and oversee portal activities
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="problems">Alumni Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.totalUsers || 0}</div>
                <p className="text-xs text-muted-foreground">Registered users</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Alumni Network</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.totalAlumni || 0}</div>
                <p className="text-xs text-muted-foreground">Active alumni</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.totalEvents || 0}</div>
                <p className="text-xs text-muted-foreground">Active events</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${analytics?.totalDonations || 0}</div>
                <p className="text-xs text-muted-foreground">Funds raised</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New problem statement added</p>
                    <p className="text-xs text-gray-500">Smart Traffic Management System - 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New idea submission</p>
                    <p className="text-xs text-gray-500">IoT-based Waste Management - 4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Alumni profile created</p>
                    <p className="text-xs text-gray-500">John Doe - Computer Science - 6 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="problems">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Problem Statements</h2>
              <Dialog open={showCreateProblem} onOpenChange={setShowCreateProblem}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Problem Statement
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create Problem Statement</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          value={problemForm.title}
                          onChange={(e) => setProblemForm(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Problem statement title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="psNumber">PS Number</Label>
                        <Input
                          id="psNumber"
                          value={problemForm.psNumber}
                          onChange={(e) => setProblemForm(prev => ({ ...prev, psNumber: e.target.value }))}
                          placeholder="SIH2025_XXX"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={problemForm.description}
                        onChange={(e) => setProblemForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Detailed problem description"
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="organization">Organization *</Label>
                        <Input
                          id="organization"
                          value={problemForm.organization}
                          onChange={(e) => setProblemForm(prev => ({ ...prev, organization: e.target.value }))}
                          placeholder="Ministry/Department name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          value={problemForm.department}
                          onChange={(e) => setProblemForm(prev => ({ ...prev, department: e.target.value }))}
                          placeholder="Specific department"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="category">Category *</Label>
                        <Select value={problemForm.category} onValueChange={(value) => setProblemForm(prev => ({ ...prev, category: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Software">Software</SelectItem>
                            <SelectItem value="Hardware">Hardware</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="theme">Theme</Label>
                        <Select value={problemForm.theme} onValueChange={(value) => setProblemForm(prev => ({ ...prev, theme: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select theme" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Smart City">Smart City</SelectItem>
                            <SelectItem value="Environment">Environment</SelectItem>
                            <SelectItem value="Healthcare">Healthcare</SelectItem>
                            <SelectItem value="Education">Education</SelectItem>
                            <SelectItem value="Agriculture">Agriculture</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="deadline">Deadline</Label>
                        <Input
                          id="deadline"
                          type="date"
                          value={problemForm.deadline}
                          onChange={(e) => setProblemForm(prev => ({ ...prev, deadline: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="impact">Expected Impact</Label>
                      <Textarea
                        id="impact"
                        value={problemForm.impact}
                        onChange={(e) => setProblemForm(prev => ({ ...prev, impact: e.target.value }))}
                        placeholder="What impact should this solution have?"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="expectedOutcomes">Expected Outcomes</Label>
                      <Textarea
                        id="expectedOutcomes"
                        value={problemForm.expectedOutcomes}
                        onChange={(e) => setProblemForm(prev => ({ ...prev, expectedOutcomes: e.target.value }))}
                        placeholder="What are the expected deliverables?"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="stakeholders">Stakeholders</Label>
                      <Textarea
                        id="stakeholders"
                        value={problemForm.stakeholders}
                        onChange={(e) => setProblemForm(prev => ({ ...prev, stakeholders: e.target.value }))}
                        placeholder="Who are the key stakeholders?"
                        rows={2}
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button onClick={handleCreateProblem} disabled={loading} className="flex-1">
                        {loading ? 'Creating...' : 'Create Problem Statement'}
                      </Button>
                      <Button variant="outline" onClick={() => { setShowCreateProblem(false); resetForm(); }} className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>PS Number</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Organization</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Submissions</TableHead>
                        <TableHead>Deadline</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {problems.map((problem) => (
                        <TableRow key={problem.id}>
                          <TableCell className="font-medium">{problem.psNumber}</TableCell>
                          <TableCell className="max-w-xs truncate">{problem.title}</TableCell>
                          <TableCell>{problem.organization}</TableCell>
                          <TableCell>
                            <Badge className={getCategoryColor(problem.category)}>
                              {problem.category}
                            </Badge>
                          </TableCell>
                          <TableCell>{problem.submittedIdeasCount}</TableCell>
                          <TableCell>{formatDate(problem.deadline)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Problems by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.problemsByCategory && Object.entries(analytics.problemsByCategory).map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge className={getCategoryColor(category)}>
                          {category}
                        </Badge>
                        <span className="font-medium">{count} problems</span>
                      </div>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(count / (analytics?.totalProblems || 1)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Export Data</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Export Problem Statements
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Export Alumni Data
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Export Submissions
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    Bulk Import Problems
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Users className="w-4 h-4 mr-2" />
                    Send Newsletter
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Announcement
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                User management features will be available in a future update. 
                Currently, users can self-register and manage their own profiles.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}