import React, { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, Users, FileText, Trophy, Building } from 'lucide-react';

export function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [stats, setStats] = useState({
    totalAlumni: 1250,
    activeConnections: 850,
    upcomingEvents: 15,
    mentorshipPairs: 320
  });

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1689785380577-93f35f4d6bf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbHVtbmklMjBuZXR3b3JraW5nfGVufDF8fHx8MTc1ODk3OTYwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Alumni Management Platform",
      subtitle: "Connecting Past, Present & Future",
      description: "Strengthening alumni relationships through networking, mentorship, and engagement opportunities."
    },
    {
      image: "https://images.unsplash.com/photo-1565687981296-535f09db714e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RpbmclMjBoYWNrYXRob24lMjB0ZWFtfGVufDF8fHx8MTc1ODk3ODYwNXww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Mentorship Programs",
      subtitle: "Guiding Future Leaders",
      description: "Connect experienced alumni with students for career guidance and professional development."
    },
    {
      image: "https://images.unsplash.com/photo-1636293235717-7895bf07abc8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldmVudHMlMjBjb25mZXJlbmNlfGVufDF8fHx8MTc1ODk3OTYwOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Alumni Events",
      subtitle: "Building Stronger Communities",
      description: "Join exclusive events, reunions, and networking opportunities with fellow alumni."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Image Slider */}
      <section className="relative h-96 md:h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {slides[currentSlide].title}
            </h1>
            <p className="text-xl md:text-2xl mb-4">
              {slides[currentSlide].subtitle}
            </p>
            <p className="text-lg mb-8">
              {slides[currentSlide].description}
            </p>
            <div className="space-x-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Explore Alumni Directory
              </Button>
              <Button size="lg" variant="outline" className=" border-white bg-blue text-white">
                Join Alumni Network
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full"
        >
          <ChevronRight size={24} />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Alumni Platform Overview
            </h2>
            <p className="text-xl text-gray-600">
              Connecting alumni, students, and fostering lifelong relationships
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-blue-600">
                  {stats.totalAlumni}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <p className="text-gray-600">Total Alumni</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Building className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-green-600">
                  {stats.activeConnections}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <p className="text-gray-600">Active Connections</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-purple-600">
                  {stats.upcomingEvents}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <p className="text-gray-600">Upcoming Events</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-orange-600">
                  {stats.mentorshipPairs}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <p className="text-gray-600">Mentorship Pairs</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Alumni Platform Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                About Alumni Management Platform
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Our comprehensive alumni management platform strengthens relationships between institutions and their graduates, fostering lifelong connections that benefit students, alumni, and the institution. Connect, engage, and grow together.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <p className="text-gray-600">
                    <span className="font-semibold">Networking:</span> Connect with alumni across industries and locations
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <p className="text-gray-600">
                    <span className="font-semibold">Mentorship:</span> Guide students and build meaningful professional relationships
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <p className="text-gray-600">
                    <span className="font-semibold">Growth:</span> Support institutional development through engagement and giving
                  </p>
                </div>
              </div>
              <Button className="mt-8" size="lg">
                Learn More About Our Platform
              </Button>
            </div>
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1689785380577-93f35f4d6bf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbHVtbmklMjBuZXR3b3JraW5nfGVufDF8fHx8MTc1ODk3OTYwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Alumni networking and collaboration"
                className="rounded-lg shadow-xl w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Connect?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join our thriving alumni community and make lasting connections
          </p>
          <div className="space-x-4">
            <Button size="lg" variant="secondary">
              Browse Alumni Directory
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white bg-blue">
              Register as Alumni
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}