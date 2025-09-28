import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Building, 
  Calendar, 
  Target, 
  Users, 
  FileText, 
  Send,
  Clock,
  Award
} from 'lucide-react';

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

interface ProblemStatementDetailsProps {
  problemId: string | null;
  onBack: () => void;
}

export function ProblemStatementDetails({ problemId, onBack }: ProblemStatementDetailsProps) {
  const { user } = useAuth();
  const [problem, setProblem] = useState<ProblemStatement | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [submissionData, setSubmissionData] = useState({
    ideaTitle: '',
    description: '',
    technicalApproach: '',
    expectedImpact: '',
    teamMembers: '',
    contactEmail: ''
  });

  useEffect(() => {
    if (problemId) {
      fetchProblemDetails();
    }
  }, [problemId]);

  const fetchProblemDetails = async () => {
    if (!problemId) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-9b4de1de/problem-statements/${problemId}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProblem(data);
      } else {
        console.error('Error fetching problem details:', await response.text());
        toast.error('Failed to load problem details');
      }
    } catch (error) {
      console.error('Error fetching problem details:', error);
      toast.error('Failed to load problem details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitIdea = async () => {
    if (!user) {
      toast.error('Please login to submit an idea');
      return;
    }

    if (!submissionData.ideaTitle || !submissionData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        `https://${projectId}.supabase.co`,
        publicAnonKey
      );
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-9b4de1de/submit-idea`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            problemId: problem?.id,
            ideaData: submissionData
          }),
        }
      );

      if (response.ok) {
        toast.success('Idea submitted successfully!');
        setShowSubmissionForm(false);
        setSubmissionData({
          ideaTitle: '',
          description: '',
          technicalApproach: '',
          expectedImpact: '',
          teamMembers: '',
          contactEmail: ''
        });
        // Refresh problem details to update submission count
        fetchProblemDetails();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to submit idea');
      }
    } catch (error) {
      console.error('Error submitting idea:', error);
      toast.error('Failed to submit idea');
    } finally {
      setSubmitting(false);
    }
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

  const formatDeadline = (deadline: string) => {
    return new Date(deadline).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isDeadlinePassed = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Problem Statement Not Found</h2>
          <Button onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Problem Statements
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Problem Statements
        </Button>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{problem.title}</h1>
            <div className="flex flex-wrap items-center gap-3">
              <Badge className={getCategoryColor(problem.category)}>
                {problem.category}
              </Badge>
              <Badge variant="outline">{problem.theme}</Badge>
              <span className="text-sm text-gray-500">PS Number: {problem.psNumber}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            {!isDeadlinePassed(problem.deadline) && (
              <Dialog open={showSubmissionForm} onOpenChange={setShowSubmissionForm}>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-green-600 hover:bg-green-700">
                    <Send className="w-4 h-4 mr-2" />
                    Submit Idea
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Submit Your Idea</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="ideaTitle">Idea Title *</Label>
                      <Input
                        id="ideaTitle"
                        value={submissionData.ideaTitle}
                        onChange={(e) => setSubmissionData(prev => ({ ...prev, ideaTitle: e.target.value }))}
                        placeholder="Enter your idea title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={submissionData.description}
                        onChange={(e) => setSubmissionData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe your solution approach"
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label htmlFor="technicalApproach">Technical Approach</Label>
                      <Textarea
                        id="technicalApproach"
                        value={submissionData.technicalApproach}
                        onChange={(e) => setSubmissionData(prev => ({ ...prev, technicalApproach: e.target.value }))}
                        placeholder="Explain the technical implementation"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="expectedImpact">Expected Impact</Label>
                      <Textarea
                        id="expectedImpact"
                        value={submissionData.expectedImpact}
                        onChange={(e) => setSubmissionData(prev => ({ ...prev, expectedImpact: e.target.value }))}
                        placeholder="What impact will your solution have?"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="teamMembers">Team Members</Label>
                      <Textarea
                        id="teamMembers"
                        value={submissionData.teamMembers}
                        onChange={(e) => setSubmissionData(prev => ({ ...prev, teamMembers: e.target.value }))}
                        placeholder="List team member names and roles"
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactEmail">Contact Email</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={submissionData.contactEmail}
                        onChange={(e) => setSubmissionData(prev => ({ ...prev, contactEmail: e.target.value }))}
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button 
                        onClick={handleSubmitIdea} 
                        disabled={submitting}
                        className="flex-1"
                      >
                        {submitting ? 'Submitting...' : 'Submit Idea'}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowSubmissionForm(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
            <Button variant="outline" size="lg">
              <FileText className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Problem Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{problem.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Expected Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{problem.impact}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Expected Outcomes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{problem.expectedOutcomes}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Stakeholders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{problem.stakeholders}</p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Building className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium">{problem.organization}</p>
                  <p className="text-sm text-gray-500">{problem.department}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium">Deadline</p>
                  <p className={`text-sm ${isDeadlinePassed(problem.deadline) ? 'text-red-600' : 'text-gray-500'}`}>
                    {formatDeadline(problem.deadline)}
                    {isDeadlinePassed(problem.deadline) && ' (Expired)'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium">Submissions</p>
                  <p className="text-sm text-gray-500">{problem.submittedIdeasCount} ideas submitted</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium">Time Remaining</p>
                  <p className={`text-sm ${isDeadlinePassed(problem.deadline) ? 'text-red-600' : 'text-green-600'}`}>
                    {isDeadlinePassed(problem.deadline) 
                      ? 'Deadline passed' 
                      : `${Math.ceil((new Date(problem.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days`
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {isDeadlinePassed(problem.deadline) && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-red-700">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">Submission Closed</span>
                </div>
                <p className="text-sm text-red-600 mt-2">
                  The deadline for this problem statement has passed. No new submissions are being accepted.
                </p>
              </CardContent>
            </Card>
          )}

          {!user && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-blue-700">
                  <Users className="w-5 h-5" />
                  <span className="font-medium">Login Required</span>
                </div>
                <p className="text-sm text-blue-600 mt-2">
                  Please login to submit your idea for this problem statement.
                </p>
                <Button size="sm" className="mt-3 w-full">
                  Login / Sign Up
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}