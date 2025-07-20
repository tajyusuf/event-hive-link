import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  MessageSquare, 
  FileText, 
  BarChart3, 
  Filter, 
  Shield,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react';

export const Features = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Matching",
      description: "Advanced algorithms match events with sponsors based on audience demographics, industry alignment, and marketing objectives.",
      badge: "Smart"
    },
    {
      icon: MessageSquare,
      title: "Direct Communication",
      description: "Built-in messaging system enables seamless communication between organizers and sponsors.",
      badge: "Connect"
    },
    {
      icon: FileText,
      title: "Pitch Deck Management",
      description: "Upload, share, and manage sponsorship pitch decks with secure file handling.",
      badge: "Professional"
    },
    {
      icon: Filter,
      title: "Advanced Filtering",
      description: "Sponsors can filter events by category, location, audience size, and engagement metrics.",
      badge: "Precision"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Track event performance, sponsor interest, and engagement metrics in real-time.",
      badge: "Insights"
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Enterprise-grade security ensures your data and communications remain protected.",
      badge: "Trusted"
    },
    {
      icon: Zap,
      title: "Quick Setup",
      description: "Get started in minutes with our streamlined onboarding process.",
      badge: "Fast"
    },
    {
      icon: Target,
      title: "Targeted Outreach",
      description: "Reach the right sponsors for your events with precision targeting.",
      badge: "Focused"
    },
    {
      icon: TrendingUp,
      title: "Success Tracking",
      description: "Monitor sponsorship success rates and optimize your approach over time.",
      badge: "Growth"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-primary border-primary">
            Platform Features
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            Everything You Need for
            <span className="block text-primary">Successful Sponsorships</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our comprehensive platform provides all the tools needed to create meaningful connections between events and sponsors.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-glow transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-primary"
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};