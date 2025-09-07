'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Zap, Clock, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useRef } from 'react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
      {/* Navigation */}
      <nav
        className="border-b border-white/20 sticky top-0 z-50"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.1)',
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">ContractGPT</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button
                  className="bg-black hover:bg-gray-800 text-white border-0 shadow-lg"
                  style={{
                    backgroundColor: '#000000',
                    color: 'white',
                    border: 'none',
                    boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1f2937';
                    e.currentTarget.style.boxShadow = '0 6px 20px 0 rgba(0, 0, 0, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#000000';
                    e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(0, 0, 0, 0.3)';
                  }}
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="secondary" className="mb-6">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                </motion.div>
                AI-Powered Contract Generation
              </Badge>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Generate Professional
              <motion.span
                className="text-blue-600"
                animate={{
                  color: ['#2563eb', '#7c3aed', '#2563eb'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{
                  color: '#2563eb',
                }}
              >
                {' '}
                Contracts
              </motion.span>
              <br />
              in Seconds
            </motion.h1>

            <motion.p
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Transform your client requests into legally sound, professional contracts using
              advanced AI. No legal expertise required.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link href="/auth/signup">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-black hover:bg-gray-800 text-white border-0 shadow-lg"
                    style={{
                      backgroundColor: '#000000',
                      color: 'white',
                      border: 'none',
                      boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.3)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#1f2937';
                      e.currentTarget.style.boxShadow = '0 6px 20px 0 rgba(0, 0, 0, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#000000';
                      e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(0, 0, 0, 0.3)';
                    }}
                  >
                    Start Generating Contracts
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </motion.div>
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Video Demo Section */}
            <div className="max-w-4xl mx-auto mb-16">
              <motion.div
                className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border border-white/20 shadow-xl rounded-lg"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.5)',
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="aspect-video overflow-hidden relative">
                  {/* Video Element */}
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover pointer-events-none"
                    muted
                    loop
                    preload="metadata"
                    style={{
                      transform: 'scale(1.1)',
                      objectPosition: 'center center',
                    }}
                  >
                    <source src="/ContractGPT_demo.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </motion.div>

              {/* Video Description */}
              <div className="text-center mt-6">
                <p className="text-muted-foreground">
                  <strong>Demo Video:</strong> Transforms a simple client request into a
                  professional contract in under 10 seconds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Why ContractGPT?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Features designed to save you time and keep your work professional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Zap,
                title: 'Fast & Simple',
                description: 'Generate a complete draft in minutes.',
                color: 'text-teal-600',
              },
              {
                icon: FileText,
                title: 'Structured & Clear',
                description: 'Organized with standard sections like scope, payment, and terms.',
                color: 'text-blue-600',
              },
              {
                icon: CheckCircle,
                title: 'Customizable',
                description: 'Edit any part before sharing with your client.',
                color: 'text-indigo-600',
              },
              {
                icon: Clock,
                title: 'Time-Saving',
                description: 'Skip hours of formatting and drafting.',
                color: 'text-slate-600',
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    whileHover={{
                      y: -8,
                      transition: { type: 'spring', stiffness: 300, damping: 20 },
                    }}
                  >
                    <Card
                      className="text-center hover:shadow-lg transition-all duration-300 h-full border border-white/20"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.2)',
                      }}
                    >
                      <CardHeader>
                        <motion.div
                          className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                          style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.1)',
                          }}
                          whileHover={{
                            rotate: [0, -10, 10, 0],
                            scale: 1.1,
                            transition: { duration: 0.5 },
                          }}
                        >
                          <Icon className={`w-6 h-6 ${feature.color}`} strokeWidth={2} />
                        </motion.div>
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to generate your professional contract
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: FileText,
                title: 'Describe Your Project',
                description:
                  "Simply paste your client's request or describe your project requirements",
              },
              {
                icon: Zap,
                title: 'AI Generates Contract',
                description:
                  'Our AI analyzes your requirements and creates a comprehensive contract',
              },
              {
                icon: CheckCircle,
                title: 'Edit, Download & Use',
                description: 'Review, customize if needed, and download your professional contract',
              },
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.1)',
                    }}
                    whileHover={{
                      scale: 1.1,
                      rotate: [0, -5, 5, 0],
                      transition: { duration: 0.5 },
                    }}
                  >
                    <motion.div
                      animate={{
                        y: [0, -2, 0],
                        transition: {
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.3,
                          ease: 'easeInOut',
                        },
                      }}
                    >
                      <Icon className="w-8 h-8 text-primary" strokeWidth={2} />
                    </motion.div>
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100">
        <div className="container mx-auto text-center">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Ready to Transform Your Contract Process?
          </motion.h2>
          <motion.p
            className="text-xl mb-8 max-w-2xl mx-auto opacity-90"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Join professionals who are already saving time and creating better contracts
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link href="/auth/signup">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Button
                  size="lg"
                  className="bg-black hover:bg-gray-800 text-white border-0 shadow-lg"
                  style={{
                    backgroundColor: '#000000',
                    color: 'white',
                    border: 'none',
                    boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1f2937';
                    e.currentTarget.style.boxShadow = '0 6px 20px 0 rgba(0, 0, 0, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#000000';
                    e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(0, 0, 0, 0.3)';
                  }}
                >
                  Get Started Free
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </motion.div>
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border bg-muted/20">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">ContractGPT</span>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6">
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms and Conditions
              </Link>
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <a
                href="mailto:hi@aaravkhanduja.com"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </a>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 ContractGPT. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
