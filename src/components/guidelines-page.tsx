import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { 
  Users, 
  FileText, 
  Clock, 
  Award, 
  CheckCircle, 
  AlertTriangle, 
  Calendar,
  Target,
  Code,
  Presentation
} from 'lucide-react';

export function GuidelinesPage() {
  const eligibilityRules = [
    "Students must be enrolled in a recognized educational institution",
    "Team size should be 6 members maximum",
    "Each team must have at least one female member",
    "Students from different institutions can form a team",
    "Fresh graduates (passed out in current year) are eligible"
  ];

  const submissionGuidelines = [
    "Submit working prototype or proof of concept",
    "Prepare a technical presentation (PPT)",
    "Include proper documentation and source code",
    "Demonstrate the solution's feasibility and scalability",
    "Address the problem statement requirements clearly"
  ];

  const evaluationCriteria = [
    { criterion: "Innovation & Creativity", weight: "25%", description: "Novelty and uniqueness of the solution" },
    { criterion: "Technical Feasibility", weight: "20%", description: "Technical soundness and implementation" },
    { criterion: "Impact & Scalability", weight: "20%", description: "Potential impact and scalability of solution" },
    { criterion: "Problem Understanding", weight: "15%", description: "Clear understanding of the problem statement" },
    { criterion: "Presentation & Demo", weight: "20%", description: "Quality of presentation and demonstration" }
  ];

  const timeline = [
    { phase: "Registration Opens", date: "January 15, 2025", status: "upcoming" },
    { phase: "Idea Submission Deadline", date: "February 28, 2025", status: "upcoming" },
    { phase: "Internal Evaluation", date: "March 1-15, 2025", status: "upcoming" },
    { phase: "Selected Teams Announcement", date: "March 20, 2025", status: "upcoming" },
    { phase: "Grand Finale", date: "April 15-17, 2025", status: "upcoming" }
  ];

  const documentationRequirements = [
    "Abstract (max 500 words)",
    "Detailed project description",
    "Technical architecture diagram",
    "Implementation screenshots/videos",
    "Future scope and enhancement plans",
    "References and acknowledgments"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              SIH 2025 Guidelines
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Complete guidelines and rules for participating in Smart India Hackathon 2025
            </p>
            <Badge className="bg-white text-indigo-600 text-lg px-6 py-2">
              Read Carefully Before Participating
            </Badge>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8 bg-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>Important:</strong> These guidelines are mandatory for all participants. 
              Please read them thoroughly before registering or submitting your ideas. 
              Non-compliance may result in disqualification.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Eligibility Criteria */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Eligibility Criteria
            </h2>
            <p className="text-xl text-gray-600">
              Who can participate in Smart India Hackathon 2025
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Participant Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {eligibilityRules.map((rule, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{rule}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Important Dates & Timeline
            </h2>
            <p className="text-xl text-gray-600">
              Mark your calendar with these crucial dates
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                SIH 2025 Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {timeline.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50">
                    <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.phase}</h3>
                      <p className="text-gray-600">{item.date}</p>
                    </div>
                    <Badge variant="outline" className="text-blue-600 border-blue-600">
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Submission Guidelines */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Submission Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {submissionGuidelines.map((guideline, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Target className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{guideline}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Documentation Required
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {documentationRequirements.map((requirement, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{requirement}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Evaluation Criteria */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Evaluation Criteria
            </h2>
            <p className="text-xl text-gray-600">
              How your submissions will be evaluated by our expert jury
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Judging Parameters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {evaluationCriteria.map((criteria, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">{criteria.criterion}</h3>
                      <Badge className="bg-blue-100 text-blue-800">{criteria.weight}</Badge>
                    </div>
                    <p className="text-gray-600">{criteria.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Rules and Regulations */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Rules & Regulations
            </h2>
            <p className="text-xl text-gray-600">
              Important rules that all participants must follow
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">Do's</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p>Submit original and innovative solutions</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p>Collaborate respectfully with team members</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p>Adhere to all submission deadlines</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p>Provide proper attribution for external resources</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p>Test your solution thoroughly before submission</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-700">Don'ts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <p>Copy or plagiarize existing solutions</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <p>Submit incomplete or non-functional prototypes</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <p>Violate intellectual property rights</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <p>Miss any important deadlines</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <p>Use offensive or inappropriate content</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technical Guidelines */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Technical Guidelines
            </h2>
            <p className="text-xl text-gray-600">
              Technical specifications and requirements for your solutions
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Software Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700">
                  <li>• Use open-source technologies when possible</li>
                  <li>• Ensure cross-platform compatibility</li>
                  <li>• Include proper error handling</li>
                  <li>• Write clean, well-documented code</li>
                  <li>• Implement security best practices</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Presentation className="w-5 h-5" />
                  Presentation Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700">
                  <li>• Maximum 10 minutes presentation</li>
                  <li>• Include live demonstration</li>
                  <li>• Explain technical architecture</li>
                  <li>• Highlight innovation and impact</li>
                  <li>• Prepare for Q&A session</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Time Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700">
                  <li>• Plan your development timeline</li>
                  <li>• Allow time for testing and debugging</li>
                  <li>• Prepare presentation materials early</li>
                  <li>• Keep buffer time for unexpected issues</li>
                  <li>• Submit well before deadline</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Need Help with Guidelines?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Our support team is here to help you understand the guidelines better
          </p>
          <div className="space-y-2">
            <p className="text-lg">Email: guidelines@sih2025.gov.in</p>
            <p className="text-lg">Help Desk: +91-11-XXXX-XXXX</p>
            <p className="text-sm text-blue-100">Available Monday to Friday, 9 AM to 6 PM</p>
          </div>
        </div>
      </section>
    </div>
  );
}