'use client'; // Mark as client component for Framer Motion
  import { motion, AnimatePresence } from 'framer-motion'; // For animations and presence
  import { Coffee, Briefcase, Folder, FileText, Mail, Twitter, Linkedin } from 'lucide-react';
  import { Button } from '@/components/ui/button';
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // shadcn/ui components
  import { useState } from 'react';
  import Link from 'next/link';

  const MotionSection = motion.section as React.ComponentType<{
    initial?: { opacity: number; y?: number };
    animate?: { opacity: number; y?: number };
    transition?: { duration: number };
    className?: string;
    children: React.ReactNode;
  }>;

  const MotionDiv = motion.div as React.ComponentType<{
    key?: string | number;
    initial?: { opacity: number; y?: number };
    animate?: { opacity: number; y?: number };
    exit?: { opacity: number; y?: number };
    transition?: { duration: number; delay?: number };
    whileHover?: { scale: number; boxShadow: string };
    className?: string;
    children: React.ReactNode;
  }>;

  export default function Home() {
    const [showPortfolio, setShowPortfolio] = useState(true);

    return (
      <div className="min-h-screen flex flex-col p-4 bg-gradient-to-b from-navy-900/10 to-white text-black" style={{ scrollBehavior: 'smooth' }}>
        {/* Hero Section with Navy Background */}
        <MotionSection
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center gap-6 py-12 bg-navy-700"
        >
          <h1 className="text-3xl sm:text-4xl font-bold max-w-xl text-teal-700">
            Free Portfolios, CVs, and Cover Letters for Students
          </h1>
          <p className="text-base sm:text-lg max-w-md text-teal-600">
            Powered by $5 coffees! Create professional documents in minutes—support us to
            keep it free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-teal-600 text-white hover:bg-teal-700 focus:ring-2 focus:ring-teal-500"
              asChild
            >
              <Link href="/cv">Build Your CV</Link>
            </Button>
            <Button
              size="lg"
              className="bg-teal-600 text-white hover:bg-teal-700 focus:ring-2 focus:ring-teal-500"
              asChild
            >
              <Link href="/cl">Build Your Cover Letter</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-teal-500 text-teal-700 hover:bg-teal-50 hover:text-teal-700 focus:ring-2 focus:ring-teal-500 animate-pulse"
            >
              <Coffee className="h-5 w-5 mr-2" data-testid="coffee-icon" />
              <a href="https://buymeacoffee.com/placeholder">Donate $5</a>
            </Button>
          </div>

          {/* Interactive Demo */}
          <div className="mt-8 w-full max-w-2xl">
            <div className="flex justify-center gap-4 mb-4">
              <Button
                variant={showPortfolio ? 'default' : 'outline'}
                className="bg-teal-500 text-white hover:bg-teal-600"
                onClick={() => setShowPortfolio(true)}
              >
                <Folder className="h-5 w-5 mr-2" /> Portfolio
              </Button>
              <Button
                variant={showPortfolio ? 'outline' : 'default'}
                className="border-teal-500 text-teal-500 hover:bg-teal-50"
                onClick={() => setShowPortfolio(false)}
              >
                <Briefcase className="h-5 w-5 mr-2" /> CV
              </Button>
              <Button
                variant={showPortfolio ? 'outline' : 'default'}
                className="border-teal-500 text-teal-500 hover:bg-teal-50"
                onClick={() => setShowPortfolio(false)} // Reuse CV toggle for simplicity; adjust if needed
              >
                <FileText className="h-5 w-5 mr-2" /> Cover Letter
              </Button>
            </div>
            <AnimatePresence mode="wait">
              {showPortfolio ? (
                <MotionDiv
                  key="portfolio"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white/90 p-6 rounded-lg shadow-lg text-black"
                >
                  <h2 className="text-xl font-semibold mb-2">Portfolio Preview</h2>
                  <p>Showcase your projects with a stunning GitHub Pages layout.</p>
                </MotionDiv>
              ) : (
                <MotionDiv
                  key="cv-cl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white/90 p-6 rounded-lg shadow-lg text-black"
                >
                  <h2 className="text-xl font-semibold mb-2">{showPortfolio ? 'Portfolio Preview' : 'CV/Cover Letter Preview'}</h2>
                  <p>Build a professional {showPortfolio ? 'portfolio' : 'CV or cover letter'} tailored for your career goals.</p>
                </MotionDiv>
              )}
            </AnimatePresence>
          </div>
        </MotionSection>

        {/* Features with Hover Effects */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8 max-w-screen-xl mx-auto">
          {[
            { title: 'Portfolio', icon: Folder, desc: 'Showcase your projects on GitHub Pages', href: '/create' },
            { title: 'CV', icon: Briefcase, desc: 'Build a professional CV with ease', href: '/cv' },
            { title: 'Cover Letter', icon: FileText, desc: 'Craft a standout cover letter', href: '/cl' },
          ].map((feature, index) => (
            <MotionDiv
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ scale: 1.05, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
              className="transition-all duration-300"
            >
              <Card className="h-full bg-white border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-black">
                    <feature.icon className="h-6 w-6 text-teal-600" />
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm sm:text-base text-black">{feature.desc}</p>
                  <Button
                    variant="link"
                    className="text-teal-600 hover:text-teal-700 mt-2 p-0 h-auto"
                    asChild
                  >
                    <Link href={feature.href}>Get Started</Link>
                  </Button>
                </CardContent>
              </Card>
            </MotionDiv>
          ))}
        </section>

        {/* Donation Section */}
        <MotionSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gray-50 border-t border-slate-200 py-12 text-center"
        >
          <h2 className="text-2xl font-semibold text-black mb-4">
            Support with a $5 Coffee
          </h2>
          <p className="text-base text-black mb-6 max-w-md mx-auto">
            Every $5 donation buys us a coffee to keep this platform free for students. Join
            the community!
          </p>
          <div className="w-full max-w-md mx-auto">
            <div className="mb-4">
              <p className="text-sm text-black">
                Goal: 100 coffees | Raised: 25 coffees
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className="bg-teal-600 h-2.5 rounded-full"
                  style={{ width: '25%' }} // 25/100 = 25%
                ></div>
              </div>
            </div>
            <Button
              size="lg"
              className="bg-teal-600 text-white hover:bg-teal-700"
            >
              <Coffee className="h-5 w-5 mr-2" />
              <a href="https://buymeacoffee.com/placeholder" target="_blank" rel="noopener noreferrer">
                Donate $5
              </a>
            </Button>
          </div>
        </MotionSection>

        {/* Contact Section */}
        <MotionSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-navy-700 py-12"
        >
          <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-teal-700">Get in Touch</h2>
              <p className="text-teal-600">
                We’re here to help with any questions or support needs.
              </p>
              <div className="space-y-2">
                <p className="flex items-center gap-2 text-teal-500">
                  <Mail className="h-5 w-5" /> Email: support@xaiportfolio.com
                </p>
                <a
                  href="https://twitter.com/xaiportfolio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-teal-500 hover:text-teal-400"
                >
                  <Twitter className="h-5 w-5" /> Twitter
                </a>
                <a
                  href="https://linkedin.com/company/xaiportfolio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-teal-500 hover:text-teal-400"
                >
                  <Linkedin className="h-5 w-5" /> LinkedIn
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-teal-700">Send Us a Message</h2>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full p-2 bg-gray-100 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-teal-500"
                  aria-label="Your Name"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full p-2 bg-gray-100 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-teal-500"
                  aria-label="Your Email"
                />
                <textarea
                  placeholder="Your Message"
                  className="w-full p-2 bg-gray-100 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-teal-500 h-24"
                  aria-label="Your Message"
                />
                <Button
                  size="lg"
                  className="bg-teal-600 text-white hover:bg-teal-700 w-full"
                >
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </MotionSection>

        {/* FAQ Section */}
        <MotionSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gray-50 py-12"
        >
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-2xl font-semibold text-teal-700 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                {
                  question: 'How do I create a portfolio?',
                  answer: 'Click "Get Started" and follow the prompts to build your portfolio on GitHub Pages.',
                },
                {
                  question: 'Is this service free?',
                  answer: 'Yes, it’s free, supported by $5 coffee donations to keep it running.',
                },
                {
                  question: 'Can I customize my CV?',
                  answer: 'Yes, you can tailor your CV with our easy-to-use editor.',
                },
                {
                  question: 'How do I create a cover letter?',
                  answer: 'Use our cover letter builder by selecting "Cover Letter" to craft a professional letter.',
                },
              ].map((faq, index) => (
                <MotionDiv
                  key={index.toString()}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="bg-white p-4 rounded-lg shadow"
                >
                  <h3 className="text-lg font-semibold text-teal-600">{faq.question}</h3>
                  <p className="text-black mt-2">{faq.answer}</p>
                </MotionDiv>
              ))}
            </div>
          </div>
        </MotionSection>

        {/* Testimonials Section */}
        <MotionSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white py-12"
        >
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-2xl font-semibold text-teal-700 mb-6">What Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  quote: 'This platform made building my portfolio so easy—highly recommend!',
                  name: 'Jane Doe',
                  role: 'Computer Science Student',
                },
                {
                  quote: 'The CV editor is intuitive and professional. Saved me hours!',
                  name: 'John Smith',
                  role: 'Engineering Graduate',
                },
                {
                  quote: 'Amazing support and free access—thanks to the coffee donations!',
                  name: 'Alice Johnson',
                  role: 'Design Student',
                },
                {
                  quote: 'The cover letter tool helped me land my first interview!',
                  name: 'Mike Brown',
                  role: 'Business Student',
                },
              ].map((testimonial, index) => (
                <MotionDiv
                  key={index.toString()}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="transition-all duration-300"
                >
                  <Card className="h-full bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <CardContent>
                      <p className="text-black mb-4 italic">&quot;{testimonial.quote}&quot;</p>
                      <p className="text-teal-600 font-semibold">{testimonial.name}</p>
                      <p className="text-gray-500 text-sm">{testimonial.role}</p>
                    </CardContent>
                  </Card>
                </MotionDiv>
              ))}
            </div>
          </div>
        </MotionSection>
      </div>
    );
  }