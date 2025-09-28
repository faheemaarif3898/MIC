import React from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Target, Users, Lightbulb, Award, Calendar, Globe, GraduationCap, Handshake, DollarSign } from 'lucide-react';

export function AboutPage() {
  const objectives = [
    {
      icon: <GraduationCap className="w-6 h-6" />,
      title: "Centralized Data",
      description: "Create a reliable system to manage alumni information securely in one place."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Engagement",
      description: "Enable stronger alumni-institution bonds through communication and events."
    },
    {
      icon: <Handshake className="w-6 h-6" />,
      title: "Mentorship & Careers",
      description: "Connect alumni with students for mentorship, internships, and guidance."
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Fundraising",
      description: "Unlock alumni potential for donations, sponsorships, and institutional growth."
    }
  ];

  const timeline = [
    {
      year: "Before",
      title: "Fragmented Data",
      description: "Alumni contacts scattered across WhatsApp, emails, and outdated records."
    },
    {
      year: "Now",
      title: "Centralized Platform",
      description: "Institutions adopt alumni management platforms to streamline engagement."
    },
    {
      year: "Future",
      title: "Global Network",
      description: "Seamless collaboration between alumni, students, and faculty worldwide."
    }
  ];

  const statistics = [
    { number: "10,000+", label: "Alumni Profiles" },
    { number: "500+", label: "Active Mentors" },
    { number: "200+", label: "Events Organized" },
    { number: "₹5Cr+", label: "Funds Raised" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About Our Alumni Platform
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              A centralized system designed to preserve connections, foster mentorship, and strengthen the bond between alumni and institutions.
            </p>
            <Badge className="bg-white text-blue-600 text-lg px-6 py-2">
              Building Lifelong Relationships
            </Badge>
          </div>
        </div>
      </section>

      {/* What is Alumni Platform Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                What is the Alumni Management System?
              </h2>
              <div className="space-y-4 text-lg text-gray-700">
                <p>
                  It is a centralized digital platform to manage alumni data, career updates, and long-term engagement with the institution.
                </p>
                <p>
                  Alumni can connect, mentor students, share opportunities, and contribute to institutional growth through this platform.
                </p>
                <p>
                  By bridging gaps in communication, it ensures stronger community building and sustainable partnerships with alumni.
                </p>
              </div>
            </div>
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80"
                alt="Alumni networking and collaboration"
                className="rounded-lg shadow-xl w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Objectives Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Objectives
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Building a future-ready alumni ecosystem with clear goals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {objectives.map((objective, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4 text-blue-600">
                    {objective.icon}
                  </div>
                  <CardTitle className="text-xl">{objective.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{objective.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Impact by Numbers
            </h2>
            <p className="text-xl text-blue-100">
              See the growing reach and outcomes of our alumni platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {statistics.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Journey Timeline
            </h2>
            <p className="text-xl text-gray-600">
              From fragmented data to a connected alumni network.
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-blue-200 h-full"></div>
            <div className="space-y-12">
              {timeline.map((event, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  <div className={`w-full lg:w-5/12 ${index % 2 === 0 ? 'lg:pr-8 lg:text-right' : 'lg:pl-8'}`}>
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <Badge className="mb-3">{event.year}</Badge>
                        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                        <p className="text-gray-600">{event.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="w-8 h-8 bg-blue-600 rounded-full border-4 border-white shadow-md flex-shrink-0 mx-auto lg:mx-0 z-10"></div>
                  <div className="w-full lg:w-5/12"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Globe className="w-6 h-6 text-blue-600" />
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-lg leading-relaxed">
                  To build a global alumni community that fosters collaboration, lifelong engagement, and institutional growth.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-green-600" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-lg leading-relaxed">
                  To strengthen alumni-institution bonds by providing a centralized, secure, and interactive platform for communication, mentorship, and support.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
