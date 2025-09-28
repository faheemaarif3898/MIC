import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Search, HelpCircle, Users, FileText, Award, Calendar } from 'lucide-react';

export function FAQsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const faqCategories = [
    {
      id: 'general',
      title: 'General Information',
      icon: <HelpCircle className="w-5 h-5" />,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'registration',
      title: 'Registration & Teams',
      icon: <Users className="w-5 h-5" />,
      color: 'bg-green-100 text-green-800'
    },
    {
      id: 'submission',
      title: 'Submission Process',
      icon: <FileText className="w-5 h-5" />,
      color: 'bg-purple-100 text-purple-800'
    },
    {
      id: 'evaluation',
      title: 'Evaluation & Awards',
      icon: <Award className="w-5 h-5" />,
      color: 'bg-orange-100 text-orange-800'
    },
    {
      id: 'timeline',
      title: 'Timeline & Deadlines',
      icon: <Calendar className="w-5 h-5" />,
      color: 'bg-red-100 text-red-800'
    }
  ];

  const faqs = [
    {
      category: 'general',
      question: 'What is Smart India Hackathon?',
      answer: 'Smart India Hackathon (SIH) is a nationwide innovation initiative by the Government of India to provide students with a platform to solve pressing problems and foster a culture of product innovation and problem-solving.'
    },
    {
      category: 'general',
      question: 'Who can participate in SIH 2025?',
      answer: 'Students enrolled in recognized educational institutions across India can participate. This includes undergraduate, postgraduate, and polytechnic students. Fresh graduates who passed out in the current year are also eligible.'
    },
    {
      category: 'general',
      question: 'Is there any participation fee?',
      answer: 'No, participation in Smart India Hackathon is completely free. There are no registration fees or any other charges for participating students.'
    },
    {
      category: 'registration',
      question: 'What is the maximum team size?',
      answer: 'Each team can have a maximum of 6 members. Teams with fewer members are also allowed, but the maximum limit is 6 students per team.'
    },
    {
      category: 'registration',
      question: 'Can students from different institutions form a team?',
      answer: 'Yes, students from different institutions can collaborate and form a team. However, each team must designate one institution as the primary institution for administrative purposes.'
    },
    {
      category: 'registration',
      question: 'Is it mandatory to have a female team member?',
      answer: 'Yes, each team must have at least one female member. This is to promote gender diversity and inclusive participation in the hackathon.'
    },
    {
      category: 'registration',
      question: 'Can I change my team after registration?',
      answer: 'Minor changes in team composition may be allowed before the idea submission deadline, subject to approval. However, major changes or complete team restructuring may not be permitted.'
    },
    {
      category: 'submission',
      question: 'What should our idea submission include?',
      answer: 'Your idea submission should include a detailed description of your solution, technical approach, expected impact, feasibility analysis, and implementation plan. Visual aids like diagrams or mockups are encouraged.'
    },
    {
      category: 'submission',
      question: 'Do we need a working prototype for initial submission?',
      answer: 'For the initial idea submission, a working prototype is not mandatory. However, you should have a clear technical approach and implementation plan. Working prototypes are required for the final presentation.'
    },
    {
      category: 'submission',
      question: 'Can we work on multiple problem statements?',
      answer: 'Each team can submit ideas for multiple problem statements, but it\'s recommended to focus on one problem statement to ensure quality and depth in your solution.'
    },
    {
      category: 'submission',
      question: 'What file formats are accepted for submissions?',
      answer: 'You can submit your ideas in PDF format. Supporting materials can be in various formats including images (JPG, PNG), videos (MP4), and documents (PDF, DOC). File size limits apply.'
    },
    {
      category: 'evaluation',
      question: 'How are the submissions evaluated?',
      answer: 'Submissions are evaluated based on innovation & creativity (25%), technical feasibility (20%), impact & scalability (20%), problem understanding (15%), and presentation quality (20%).'
    },
    {
      category: 'evaluation',
      question: 'Who are the judges for SIH 2025?',
      answer: 'The jury consists of experts from government departments, industry professionals, academicians, and successful entrepreneurs with relevant expertise in the problem domains.'
    },
    {
      category: 'evaluation',
      question: 'What are the prizes and recognition?',
      answer: 'Winners receive cash prizes, certificates, mentorship opportunities, and potential internship/job offers. The exact prize amounts vary by category and will be announced during the event.'
    },
    {
      category: 'timeline',
      question: 'When is the registration deadline?',
      answer: 'Registration typically opens in January and the idea submission deadline is usually in late February. Check the official timeline for exact dates for SIH 2025.'
    },
    {
      category: 'timeline',
      question: 'Can I submit my idea after the deadline?',
      answer: 'No, late submissions are not accepted. Make sure to submit your idea well before the deadline to avoid any technical issues or last-minute problems.'
    },
    {
      category: 'timeline',
      question: 'When will the selected teams be announced?',
      answer: 'Selected teams are typically announced 2-3 weeks after the idea submission deadline. All teams will be notified via email and the results will be published on the official website.'
    },
    {
      category: 'general',
      question: 'How can I get updates about SIH 2025?',
      answer: 'Follow the official SIH website, social media channels, and register for email updates. Your institution\'s SPOC (Single Point of Contact) will also provide regular updates.'
    },
    {
      category: 'general',
      question: 'Can international students participate?',
      answer: 'SIH is primarily for Indian students enrolled in Indian institutions. International students studying in Indian institutions may be eligible - check with your institution\'s SPOC for clarification.'
    },
    {
      category: 'submission',
      question: 'Do we retain intellectual property rights?',
      answer: 'Yes, teams retain the intellectual property rights to their innovations. However, there may be agreements for the government to use the solutions for public benefit - details will be provided during registration.'
    },
    {
      category: 'evaluation',
      question: 'Will there be mentorship during the development phase?',
      answer: 'Selected teams often get access to mentors from industry and government organizations. Alumni mentors are also available through our alumni portal for guidance and support.'
    }
  ];

  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedFAQs = faqCategories.map(category => ({
    ...category,
    faqs: filteredFAQs.filter(faq => faq.category === category.id)
  }));

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Find answers to common questions about Smart India Hackathon 2025
            </p>
            <Badge className="bg-white text-purple-600 text-lg px-6 py-2">
              Everything You Need to Know
            </Badge>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for questions or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-6 text-lg border-2 border-gray-200 focus:border-purple-500"
            />
          </div>
          <p className="text-center text-gray-600 mt-4">
            Can't find what you're looking for? Contact our support team for help.
          </p>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {faqCategories.map((category) => (
              <Badge key={category.id} className={`${category.color} px-4 py-2 text-sm font-medium`}>
                <span className="flex items-center gap-2">
                  {category.icon}
                  {category.title}
                </span>
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {groupedFAQs.map((category) => (
            category.faqs.length > 0 && (
              <div key={category.id} className="mb-12">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${category.color.replace('text-', 'bg-').replace('800', '100')}`}>
                        {category.icon}
                      </div>
                      {category.title}
                      <Badge variant="outline" className="ml-auto">
                        {category.faqs.length} questions
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="space-y-2">
                      {category.faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`${category.id}-${index}`} className="border rounded-lg px-4">
                          <AccordionTrigger className="text-left hover:no-underline">
                            <span className="font-medium">{faq.question}</span>
                          </AccordionTrigger>
                          <AccordionContent className="text-gray-700 leading-relaxed">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            )
          ))}

          {filteredFAQs.length === 0 && searchTerm && (
            <Card>
              <CardContent className="p-12 text-center">
                <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No results found
                </h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find any FAQs matching your search. Try using different keywords or browse by category.
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Clear search and view all FAQs
                </button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Quick Tips Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Quick Tips for Success
            </h2>
            <p className="text-xl text-gray-600">
              Pro tips from previous SIH winners and mentors
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Build a Diverse Team</h3>
                <p className="text-gray-600 text-sm">
                  Include members with complementary skills - technical, design, business, and domain expertise.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Understand the Problem</h3>
                <p className="text-gray-600 text-sm">
                  Thoroughly read and understand the problem statement. Research the domain and stakeholders.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Focus on Impact</h3>
                <p className="text-gray-600 text-sm">
                  Demonstrate how your solution addresses the problem and creates real-world impact.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Still Have Questions?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Our support team is here to help you succeed in SIH 2025
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="font-semibold text-lg mb-2">Email Support</h3>
              <p className="text-purple-100">support@sih2025.gov.in</p>
              <p className="text-sm text-purple-200">Response within 24 hours</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Help Desk</h3>
              <p className="text-purple-100">+91-11-XXXX-XXXX</p>
              <p className="text-sm text-purple-200">Mon-Fri, 9 AM to 6 PM</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Live Chat</h3>
              <p className="text-purple-100">Available on website</p>
              <p className="text-sm text-purple-200">Business hours only</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}