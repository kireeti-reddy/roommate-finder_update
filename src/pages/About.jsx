
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";

const About = () => {
  const { isAuthenticated } = useAuth();

  const steps = [
    {
      number: 1,
      title: "Create Your Profile",
      description: "Sign up and tell us about your lifestyle, preferences, and what you're looking for in a roommate or living space.",
      image: "https://images.unsplash.com/photo-1575330741514-f0e0f434a4ca",
      alt: "Person filling out profile information"
    },
    {
      number: 2,
      title: "Browse Matches",
      description: "Our algorithm matches you with compatible roommates and living spaces based on your preferences and compatibility scores.",
      image: "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3",
      alt: "Person looking at matches on a laptop"
    },
    {
      number: 3,
      title: "Connect Safely",
      description: "Chat with potential matches through our secure messaging system to discuss details before making decisions.",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
      alt: "People messaging each other"
    },
    {
      number: 4,
      title: "Meet & Confirm",
      description: "Meet potential roommates in person (we provide safety guidelines) and finalize your living arrangements.",
      image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21",
      alt: "People meeting and shaking hands"
    }
  ];

  const faqs = [
    {
      question: "How does the matching algorithm work?",
      answer: "Our proprietary matching algorithm analyzes over 20 different compatibility factors, including lifestyle preferences, sleeping habits, cleanliness standards, and social preferences to find your most compatible roommates."
    },
    {
      question: "Is there a fee to use RoommateMatch?",
      answer: "Basic matching and browsing is free! We offer premium features like advanced filters, priority messaging, and verified profile badges for a small monthly subscription."
    },
    {
      question: "How do you verify users?",
      answer: "We offer optional identity verification that checks government ID, education credentials, and employment details. Users with verified profiles display a verification badge."
    },
    {
      question: "Can landlords use this platform?",
      answer: "Yes! We have special tools for property owners to list rooms and find compatible tenants, including credit score integration and rental history verification."
    },
    {
      question: "What safety measures do you have in place?",
      answer: "We provide secure in-app messaging, user reviews, identity verification options, and comprehensive safety guidelines for meeting potential roommates."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isAuthenticated={isAuthenticated} />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">How RoommateMatch Works</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            We make finding the perfect roommate simple, safe, and personalized to your unique preferences.
          </p>
        </div>
      </div>

      {/* Steps Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Our Simple Process</h2>
          
          {steps.map((step, index) => (
            <div key={index} className={`flex flex-col md:flex-row items-center mb-16 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
              <div className="md:w-1/2 p-4">
                <img 
                  src={step.image} 
                  alt={step.alt} 
                  className="rounded-lg shadow-lg w-full h-64 object-cover"
                />
              </div>
              <div className="md:w-1/2 p-4">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <span className="text-primary font-bold text-xl">{step.number}</span>
                </div>
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600 text-lg">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="mb-6 bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-secondary to-orange-500 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to find your perfect match?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of people who've found their ideal living situation through our platform
          </p>
          <Link to={isAuthenticated ? "/preferences" : "/register"}>
            <Button size="lg" className="bg-white text-secondary hover:bg-gray-100">
              {isAuthenticated ? "Update Preferences" : "Get Started Now"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
