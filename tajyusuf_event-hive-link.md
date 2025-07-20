Here is a comprehensive technical overview of the {tajyusuf/event-hive-link} codebase with detailed architectural insights:

## Event-Hive-Link: Connecting Event Organizers and Sponsors

<document-code-reference section="Event-Hive-Link: Connecting Event Organizers and Sponsors">
{"files": [
  {
    "name": "event-hive-link/tailwind.config.ts",
    "description": "JavaScript/TypeScript implementation file containing configuration and settings",
    "file_url": "https://github.com/tajyusuf/event-hive-link/blob/main/tailwind.config.ts",
    "directory": "https:/github.com/tajyusuf/event-hive-link/blob/main"
  },
  {
    "name": "event-hive-link/src/integrations/supabase/types.ts",
    "description": "JavaScript/TypeScript implementation file",
    "file_url": "https://github.com/tajyusuf/event-hive-link/blob/main/src/integrations/supabase/types.ts",
    "directory": "https:/github.com/tajyusuf/event-hive-link/blob/main/src/integrations/supabase"
  },
  {
    "name": "event-hive-link/src/components/ui/toast.tsx",
    "description": "Implementation file",
    "file_url": "https://github.com/tajyusuf/event-hive-link/blob/main/src/components/ui/toast.tsx",
    "directory": "https:/github.com/tajyusuf/event-hive-link/blob/main/src/components/ui"
  },
  {
    "name": "event-hive-link/src/components/profile/AccountMenu.tsx",
    "description": "Implementation file",
    "file_url": "https://github.com/tajyusuf/event-hive-link/blob/main/src/components/profile/AccountMenu.tsx",
    "directory": "https:/github.com/tajyusuf/event-hive-link/blob/main/src/components/profile"
  }
]}
</document-code-reference>

Event-Hive-Link is a web application designed to facilitate connections between student event organizers and potential sponsors. The platform utilizes AI-powered matching to align events with compatible sponsors based on audience demographics, industry focus, and marketing objectives.



The application follows a React-based single-page application (SPA) architecture, leveraging Vite as the build tool and development server. Key architectural components include:

- React for the UI layer
- Supabase for backend services (authentication, database, real-time subscriptions)
- TypeScript for type-safe development
- Tailwind CSS for styling

The codebase is organized into a modular structure with clear separation of concerns:

```
src/
  components/
  contexts/
  hooks/
  integrations/
  lib/
  pages/
```

## Authentication and User Management

<document-code-reference section="Authentication and User Management">
{"files": [
  {
    "name": "event-hive-link/tailwind.config.ts",
    "description": "JavaScript/TypeScript implementation file containing configuration and settings",
    "file_url": "https://github.com/tajyusuf/event-hive-link/blob/main/tailwind.config.ts",
    "directory": "https:/github.com/tajyusuf/event-hive-link/blob/main"
  },
  {
    "name": "event-hive-link/src/integrations/supabase/types.ts",
    "description": "JavaScript/TypeScript implementation file",
    "file_url": "https://github.com/tajyusuf/event-hive-link/blob/main/src/integrations/supabase/types.ts",
    "directory": "https:/github.com/tajyusuf/event-hive-link/blob/main/src/integrations/supabase"
  },
  {
    "name": "event-hive-link/src/components/ui/toast.tsx",
    "description": "Implementation file",
    "file_url": "https://github.com/tajyusuf/event-hive-link/blob/main/src/components/ui/toast.tsx",
    "directory": "https:/github.com/tajyusuf/event-hive-link/blob/main/src/components/ui"
  },
  {
    "name": "event-hive-link/src/components/profile/AccountMenu.tsx",
    "description": "Implementation file",
    "file_url": "https://github.com/tajyusuf/event-hive-link/blob/main/src/components/profile/AccountMenu.tsx",
    "directory": "https:/github.com/tajyusuf/event-hive-link/blob/main/src/components/profile"
  }
]}
</document-code-reference>

Authentication is handled through Supabase, with a custom AuthContext provider managing the global auth state:

```typescript
// src/contexts/AuthContext.tsx
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // ... auth methods (signIn, signOut, etc.)
}
```



The application uses a Supabase PostgreSQL database with the following key tables:

- profiles: Stores user profile information
- organizer_profiles: Extended details for event organizers
- sponsor_profiles: Extended details for sponsors
- events: Stores event information
- sponsor_interests: Tracks sponsor interest in events

Database migrations are managed through SQL files in the `supabase/migrations` directory.

## User Roles and Dashboards

<document-code-reference section="User Roles and Dashboards">
{"files": [
  {
    "name": "event-hive-link/tailwind.config.ts",
    "description": "JavaScript/TypeScript implementation file containing configuration and settings",
    "file_url": "https://github.com/tajyusuf/event-hive-link/blob/main/tailwind.config.ts",
    "directory": "https:/github.com/tajyusuf/event-hive-link/blob/main"
  },
  {
    "name": "event-hive-link/src/integrations/supabase/types.ts",
    "description": "JavaScript/TypeScript implementation file",
    "file_url": "https://github.com/tajyusuf/event-hive-link/blob/main/src/integrations/supabase/types.ts",
    "directory": "https:/github.com/tajyusuf/event-hive-link/blob/main/src/integrations/supabase"
  },
  {
    "name": "event-hive-link/src/components/ui/toast.tsx",
    "description": "Implementation file",
    "file_url": "https://github.com/tajyusuf/event-hive-link/blob/main/src/components/ui/toast.tsx",
    "directory": "https:/github.com/tajyusuf/event-hive-link/blob/main/src/components/ui"
  },
  {
    "name": "event-hive-link/src/components/profile/AccountMenu.tsx",
    "description": "Implementation file",
    "file_url": "https://github.com/tajyusuf/event-hive-link/blob/main/src/components/profile/AccountMenu.tsx",
    "directory": "https:/github.com/tajyusuf/event-hive-link/blob/main/src/components/profile"
  }
]}
</document-code-reference>

The application supports two primary user roles: organizers and sponsors. Each role has a dedicated dashboard component:

- OrganizerDashboard: Allows event creation and management
- SponsorDashboard: Facilitates event discovery and interest expression

These components leverage Supabase real-time subscriptions to provide live updates:

```typescript
// src/components/dashboard/OrganizerDashboard.tsx
useEffect(() => {
  const subscription = supabase
    .from('events')
    .on('*', (payload) => {
      // Handle real-time updates
    })
    .subscribe();

  return () => {
    supabase.removeSubscription(subscription);
  };
}, []);
```

## AI-Powered Event Matching

<document-code-reference section="AI-Powered Event Matching">
{"files": [
  {
    "name": "event-hive-link/tailwind.config.ts",
    "description": "JavaScript/TypeScript implementation file containing configuration and settings",
    "file_url": "https://github.com/tajyusuf/event-hive-link/blob/main/tailwind.config.ts",
    "directory": "https:/github.com/tajyusuf/event-hive-link/blob/main"
  },
  {
    "name": "event-hive-link/src/integrations/supabase/types.ts",
    "description": "JavaScript/TypeScript implementation file",
    "file_url": "https://github.com/tajyusuf/event-hive-link/blob/main/src/integrations/supabase/types.ts",
    "directory": "https:/github.com/tajyusuf/event-hive-link/blob/main/src/integrations/supabase"
  },
  {
    "name": "event-hive-link/src/components/ui/toast.tsx",
    "description": "Implementation file",
    "file_url": "https://github.com/tajyusuf/event-hive-link/blob/main/src/components/ui/toast.tsx",
    "directory": "https:/github.com/tajyusuf/event-hive-link/blob/main/src/components/ui"
  },
  {
    "name": "event-hive-link/src/components/profile/AccountMenu.tsx",
    "description": "Implementation file",
    "file_url": "https://github.com/tajyusuf/event-hive-link/blob/main/src/components/profile/AccountMenu.tsx",
    "directory": "https:/github.com/tajyusuf/event-hive-link/blob/main/src/components/profile"
  }
]}
</document-code-reference>

While the specific implementation details of the AI matching algorithm are not visible in the provided files, the application's structure suggests a server-side matching process. The SponsorDashboard component likely queries a dedicated API endpoint to retrieve recommended events based on the sponsor's profile and preferences.



The application primarily uses React's built-in state management (useState, useEffect) for component-level state. Global state, such as authentication, is managed through the AuthContext. Data fetching and mutations are performed using Supabase client methods:

```typescript
// Example of data fetching in a dashboard component
const fetchEvents = async () => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching events:', error);
  } else {
    setEvents(data);
  }
};
```

## UI Components and Styling

<document-code-reference section="UI Components and Styling">
{"files": [
  {
    "name": "event-hive-link/tailwind.config.ts",
    "description": "JavaScript/TypeScript implementation file containing configuration and settings",
    "file_url": "https://github.com/tajyusuf/event-hive-link/blob/main/tailwind.config.ts",
    "directory": "https:/github.com/tajyusuf/event-hive-link/blob/main"
  },
  {
    "name": "event-hive-link/src/integrations/supabase/types.ts",
    "description": "JavaScript/TypeScript implementation file",
    "file_url": "https://github.com/tajyusuf/event-hive-link/blob/main/src/integrations/supabase/types.ts",
    "directory": "https:/github.com/tajyusuf/event-hive-link/blob/main/src/integrations/supabase"
  },
  {
    "name": "event-hive-link/src/components/ui/toast.tsx",
    "description": "Implementation file",
    "file_url": "https://github.com/tajyusuf/event-hive-link/blob/main/src/components/ui/toast.tsx",
    "directory": "https:/github.com/tajyusuf/event-hive-link/blob/main/src/components/ui"
  },
  {
    "name": "event-hive-link/src/components/profile/AccountMenu.tsx",
    "description": "Implementation file",
    "file_url": "https://github.com/tajyusuf/event-hive-link/blob/main/src/components/profile/AccountMenu.tsx",
    "directory": "https:/github.com/tajyusuf/event-hive-link/blob/main/src/components/profile"
  }
]}
</document-code-reference>

The application uses a custom UI component library, likely built on top of Radix UI primitives. These components are located in the `src/components/ui` directory and include elements such as buttons, cards, and form inputs. Styling is primarily handled through Tailwind CSS classes, with custom variants defined for consistency across the application.

## Deployment and Infrastructure

<document-code-reference section="Deployment and Infrastructure">
{"files": [
  {
    "name": "event-hive-link/tailwind.config.ts",
    "description": "JavaScript/TypeScript implementation file containing configuration and settings",
    "file_url": "https://github.com/tajyusuf/event-hive-link/blob/main/tailwind.config.ts",
    "directory": "https:/github.com/tajyusuf/event-hive-link/blob/main"
  },
  {
    "name": "event-hive-link/src/integrations/supabase/types.ts",
    "description": "JavaScript/TypeScript implementation file",
    "file_url": "https://github.com/tajyusuf/event-hive-link/blob/main/src/integrations/supabase/types.ts",
    "directory": "https:/github.com/tajyusuf/event-hive-link/blob/main/src/integrations/supabase"
  },
  {
    "name": "event-hive-link/src/components/ui/toast.tsx",
    "description": "Implementation file",
    "file_url": "https://github.com/tajyusuf/event-hive-link/blob/main/src/components/ui/toast.tsx",
    "directory": "https:/github.com/tajyusuf/event-hive-link/blob/main/src/components/ui"
  },
  {
    "name": "event-hive-link/src/components/profile/AccountMenu.tsx",
    "description": "Implementation file",
    "file_url": "https://github.com/tajyusuf/event-hive-link/blob/main/src/components/profile/AccountMenu.tsx",
    "directory": "https:/github.com/tajyusuf/event-hive-link/blob/main/src/components/profile"
  }
]}
</document-code-reference>

While specific deployment details are not provided in the codebase, the use of Vite as a build tool suggests a static site deployment strategy. The application likely utilizes Supabase's hosted services for backend functionality, reducing the need for custom server infrastructure.

In conclusion, Event-Hive-Link demonstrates a modern, scalable architecture leveraging React, TypeScript, and Supabase to create a responsive and real-time platform for connecting event organizers with potential sponsors. The modular structure and use of TypeScript contribute to maintainability and type safety throughout the application.
## References:
### Code:
<code-reference uuid='933e0a6d-7e2c-4ee0-978d-3d813bcf4794'>[{"file_name": "event-hive-link/src/components/ui/sidebar.tsx", "file_path": "https://github.com/tajyusuf/event-hive-link/blob/main/src/components/ui/sidebar.tsx", "markdown_link": "- [event-hive-link/src/components/ui/sidebar.tsx](https://github.com/tajyusuf/event-hive-link/blob/main/src/components/ui/sidebar.tsx)\n", "code_chunk": "const SidebarInset = React.forwardRef<\n  HTMLDivElement,\n  React.ComponentProps<\"main\">\n>(({ className, ...props }, ref) => {\n  return (\n    <main\n      ref={ref}\n      className={cn(\n        \"relative flex min-h-svh flex-1 flex-col bg-background\",\n        \"peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow\",\n        className\n      )}\n      {...props}\n    />\n  )\n})\nSidebarInset.displayName = \"SidebarInset\"\n\nconst SidebarInput = React.forwardRef<\n  React.ElementRef<typeof Input>,\n  React.ComponentProps<typeof Input>\n>(({ className, ...props }, ref) => {\n  return (\n    <Input\n      ref={ref}\n      data-sidebar=\"input\"\n      className={cn(\n        \"h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring\",\n        className\n      )}\n      {...props}\n    />\n  )\n})\nSidebarInput.displayName = \"SidebarInput\"\n\nconst SidebarHeader = React.forwardRef<\n  HTMLDivElement,\n  React.ComponentProps<\"div\">\n>(({ className, ...props }, ref) => {\n  return (\n    <div\n      ref={ref}\n      data-sidebar=\"header\"\n      className={cn(\"flex flex-col gap-2 p-2\", className)}\n      {...props}\n    />\n  )\n})\nSidebarHeader.displayName = \"SidebarHeader\"\n\nconst SidebarFooter = React.forwardRef<\n  HTMLDivElement,\n  React.ComponentProps<\"div\">\n>(({ className, ...props }, ref) => {\n  return (\n    <div\n      ref={ref}\n      data-sidebar=\"footer\"\n      className={cn(\"flex flex-col gap-2 p-2\", className)}\n      {...props}\n    />\n  )\n})\nSidebarFooter.displayName = \"SidebarFooter\"\n\nconst SidebarSeparator = React.forwardRef<\n  React.ElementRef<typeof Separator>,\n  React.ComponentProps<typeof Separator>\n>(({ className, ...props }, ref) => {\n  return (\n    <Separator\n      ref={ref}\n      data-sidebar=\"separator\"\n      className={cn(\"mx-2 w-auto bg-sidebar-border\", className)}\n      {...props}\n    />\n  )\n})\nSidebarSeparator.displayName = \"SidebarSeparator\"\n\nconst SidebarContent = React.forwardRef<\n  HTMLDivElement,\n  React.ComponentProps<\"div\">\n>(({ className, ...props }, ref) => {\n  return (\n    <div\n      ref={ref}\n      data-sidebar=\"content\"\n      className={cn(\n        \"flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden\",\n        className\n      )}\n      {...props}\n    />\n  )\n})\nSidebarContent.displayName = \"SidebarContent\"\n\nconst SidebarGroup = React.forwardRef<\n  HTMLDivElement,\n  React.ComponentProps<\"div\">\n>(({ className, ...props }, ref) => {\n  return (\n    <div\n      ref={ref}\n      data-sidebar=\"group\"\n      className={cn(\"relative flex w-full min-w-0 flex-col p-2\", className)}\n      {...props}\n    />\n  )\n})\nSidebarGroup.displayName = \"SidebarGroup\"\n\nconst SidebarGroupLabel = React.forwardRef<\n  HTMLDivElement,\n  React.ComponentProps<\"div\"> & { asChild?: boolean }\n>(({ className, asChild = false, ...props }, ref) => {\n  const Comp = asChild ? Slot : \"div\"\n\n  return (\n    <Comp\n      ref={ref}\n      data-sidebar=\"group-label\"\n      className={cn(\n        \"duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0\",\n        \"group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0\",\n        className\n      )}\n      {...props}\n    />\n  )\n})\nSidebarGroupLabel.displayName = \"SidebarGroupLabel\"\n\nconst SidebarGroupAction = React.forwardRef<\n  HTMLButtonElement,\n  React.ComponentProps<\"button\"> & { asChild?: boolean }\n>(({ className, asChild = false, ...props }, ref) => {\n  const Comp = asChild ? Slot : \"button\""}, {"file_name": "event-hive-link/src/pages/Explore.tsx", "file_path": "https://github.com/tajyusuf/event-hive-link/blob/main/src/pages/Explore.tsx", "markdown_link": "- [event-hive-link/src/pages/Explore.tsx](https://github.com/tajyusuf/event-hive-link/blob/main/src/pages/Explore.tsx)\n", "code_chunk": "import React, { useState, useEffect } from 'react';\nimport { useAuth } from '@/contexts/AuthContext';\nimport { supabase } from '@/integrations/supabase/client';\nimport { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';\nimport { Badge } from '@/components/ui/badge';\nimport { Button } from '@/components/ui/button';\nimport { Input } from '@/components/ui/input';\nimport { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';\nimport { Building2, Calendar, MapPin, Users, Globe, Heart, Eye, Search, Filter } from 'lucide-react';\nimport { useNavigate } from 'react-router-dom';\nimport { toast } from '@/hooks/use-toast';\n\ninterface Event {\n  id: string;\n  name: string;\n  description: string;\n  location: string;\n  event_date: string;\n  audience_size: number | null;\n  themes: string[] | null;\n  view_count: number;\n  organizer_id: string;\n  organizer_profiles?: {\n    club_name: string;\n    college: string;\n  };\n}\n\ninterface Sponsor {\n  id: string;\n  company_name: string;\n  industry: string;\n  website: string | null;\n  budget_range: string | null;\n  marketing_goals: string[] | null;\n  target_audience: string[] | null;\n  profiles?: {\n    full_name: string;\n  };\n}\n\nconst Explore = () => {\n  const { user } = useAuth();\n  const navigate = useNavigate();\n  const [events, setEvents] = useState<Event[]>([]);\n  const [sponsors, setSponsors] = useState<Sponsor[]>([]);\n  const [loading, setLoading] = useState(true);\n  const [searchTerm, setSearchTerm] = useState('');\n  const [selectedTheme, setSelectedTheme] = useState<string>('');\n  const [selectedIndustry, setSelectedIndustry] = useState<string>('');\n\n  useEffect(() => {\n    if (!user) {\n      navigate('/auth');\n      return;\n    }\n    fetchData();\n  }, [user, navigate]);\n\n  const fetchData = async () => {\n    try {\n      // Fetch published events with organizer info\n      const { [REMOVED_DATA_URI]\n        .from('events')\n        .select(`\n          *,\n          organizer_profiles:organizer_profiles!inner(\n            club_name,\n            college\n          )\n        `)\n        .eq('status', 'published')\n        .order('created_at', { ascending: false });\n\n      if (eventsError) throw eventsError;\n\n      // Fetch sponsors with profile info\n      const { [REMOVED_DATA_URI]\n        .from('sponsor_profiles')\n        .select(`\n          *,\n          profiles:profiles!inner(\n            full_name\n          )\n        `)\n        .order('created_at', { ascending: false });\n\n      if (sponsorsError) throw sponsorsError;\n\n      setEvents(eventsData || []);\n      setSponsors(sponsorsData || []);\n    } catch (error) {\n      console.error('Error fetching [REMOVED_DATA_URI]\n      toast({\n        title: \"Error\",\n        description: \"Failed to load explore data\",\n        variant: \"destructive\",\n      });\n    } finally {\n      setLoading(false);\n    }\n  };\n\n  const handleEventView = async (eventId: string) => {\n    try {\n      await supabase.rpc('increment_view_count', { event_id: eventId });\n      setEvents(prev => prev.map(event => \n        event.id === eventId \n          ? { ...event, view_count: event.view_count + 1 }\n          : event\n      ));\n    } catch (error) {\n      console.error('Error incrementing view count:', error);\n    }\n  };\n\n  const handleSponsorInterest = async (eventId: string) => {\n    try {\n      // Get current user's sponsor profile\n      const { [REMOVED_DATA_URI]\n        .single();\n\n      if (!profile) return;\n\n      const { [REMOVED_DATA_URI]\n        .single();"}, {"file_name": "event-hive-link/src/components/profile/AccountMenu.tsx", "file_path": "https://github.com/tajyusuf/event-hive-link/blob/main/src/components/profile/AccountMenu.tsx", "markdown_link": "- [event-hive-link/src/components/profile/AccountMenu.tsx](https://github.com/tajyusuf/event-hive-link/blob/main/src/components/profile/AccountMenu.tsx)\n", "code_chunk": "const getInitials = (name: string) => {\n    return name\n      .split(' ')\n      .map(word => word[0])\n      .join('')\n      .toUpperCase()\n      .slice(0, 2);\n  };\n\n  if (!profile) return null;\n\n  return (\n    <>\n      <DropdownMenu>\n        <DropdownMenuTrigger asChild>\n          <Button variant=\"ghost\" className=\"relative h-8 w-8 rounded-full\">\n            <Avatar className=\"h-8 w-8\">\n              <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name} />\n              <AvatarFallback>{getInitials(profile.full_name)}</AvatarFallback>\n            </Avatar>\n          </Button>\n        </DropdownMenuTrigger>\n        <DropdownMenuContent className=\"w-56\" align=\"end\" forceMount>\n          <DropdownMenuLabel className=\"font-normal\">\n            <div className=\"flex flex-col space-y-1\">\n              <p className=\"text-sm font-medium leading-none\">{profile.full_name}</p>\n              <p className=\"text-xs leading-none text-muted-foreground\">\n                {profile.email}\n              </p>\n            </div>\n          </DropdownMenuLabel>\n          <DropdownMenuSeparator />\n          <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>\n            <User className=\"mr-2 h-4 w-4\" />\n            <span>Profile</span>\n          </DropdownMenuItem>\n          <DropdownMenuItem onClick={() => navigate('/explore')}>\n            <Settings className=\"mr-2 h-4 w-4\" />\n            <span>Explore</span>\n          </DropdownMenuItem>\n          <DropdownMenuSeparator />\n          <DropdownMenuItem onClick={handleLogout}>\n            <LogOut className=\"mr-2 h-4 w-4\" />\n            <span>Log out</span>\n          </DropdownMenuItem>\n        </DropdownMenuContent>\n      </DropdownMenu>\n\n      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>\n        <DialogContent className=\"max-w-2xl max-h-[90vh] overflow-y-auto\">\n          <DialogHeader>\n            <DialogTitle className=\"flex items-center gap-2\">\n              <User className=\"h-5 w-5\" />\n              Profile Information\n            </DialogTitle>\n            <DialogDescription>\n              View and manage your account details and preferences.\n            </DialogDescription>\n          </DialogHeader>\n\n          <div className=\"space-y-6\">\n            {/* Basic Info Card */}\n            <Card>\n              <CardHeader className=\"flex flex-row items-center justify-between space-y-0 pb-3\">\n                <div>\n                  <CardTitle className=\"text-lg\">Basic Information</CardTitle>\n                  <CardDescription>Your personal account details</CardDescription>\n                </div>\n                <Button\n                  variant=\"outline\"\n                  size=\"sm\"\n                  onClick={() => setIsEditing(!isEditing)}\n                  disabled={loading}\n                >\n                  {isEditing ? <X className=\"h-4 w-4\" /> : <Edit className=\"h-4 w-4\" />}\n                  {isEditing ? 'Cancel' : 'Edit'}\n                </Button>\n              </CardHeader>\n              <CardContent className=\"space-y-4\">\n                <div className=\"flex items-center gap-4\">\n                  <Avatar className=\"h-16 w-16\">\n                    <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name} />\n                    <AvatarFallback className=\"text-lg\">\n                      {getInitials(profile.full_name)}\n                    </AvatarFallback>\n                  </Avatar>\n                  <div className=\"space-y-1\">\n                    <Badge variant=\"secondary\" className=\"capitalize\">\n                      {profile.role}\n                    </Badge>\n                    <div className=\"flex items-center gap-2 text-sm text-muted-foreground\">\n                      <Calendar className=\"h-4 w-4\" />\n                      Member since {new Date(profile.created_at).toLocaleDateString()}\n                    </div>\n                  </div>\n                </div>\n\n                <Separator />"}, {"file_name": "event-hive-link/src/components/landing/Features.tsx", "file_path": "https://github.com/tajyusuf/event-hive-link/blob/main/src/components/landing/Features.tsx", "markdown_link": "- [event-hive-link/src/components/landing/Features.tsx](https://github.com/tajyusuf/event-hive-link/blob/main/src/components/landing/Features.tsx)\n", "code_chunk": "return (\n    <section className=\"py-20 bg-background\">\n      <div className=\"container mx-auto px-4\">\n        <div className=\"text-center mb-16\">\n          <Badge variant=\"outline\" className=\"mb-4 text-primary border-primary\">\n            Platform Features\n          </Badge>\n          <h2 className=\"text-4xl font-bold mb-4\">\n            Everything You Need for\n            <span className=\"block text-primary\">Successful Sponsorships</span>\n          </h2>\n          <p className=\"text-xl text-muted-foreground max-w-2xl mx-auto\">\n            Our comprehensive platform provides all the tools needed to create meaningful connections between events and sponsors.\n          </p>\n        </div>\n        \n        <div className=\"grid md:grid-cols-2 lg:grid-cols-3 gap-8\">\n          {features.map((feature, index) => (\n            <Card \n              key={index} \n              className=\"group hover:shadow-glow transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-primary\"\n            >\n              <CardHeader>\n                <div className=\"flex items-center justify-between mb-2\">\n                  <div className=\"w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300\">\n                    <feature.icon className=\"h-6 w-6 text-white\" />\n                  </div>\n                  <Badge variant=\"secondary\" className=\"text-xs\">\n                    {feature.badge}\n                  </Badge>\n                </div>\n                <CardTitle className=\"text-lg group-hover:text-primary transition-colors\">\n                  {feature.title}\n                </CardTitle>\n              </CardHeader>\n              <CardContent>\n                <CardDescription className=\"text-sm leading-relaxed\">\n                  {feature.description}\n                </CardDescription>\n              </CardContent>\n            </Card>\n          ))}\n        </div>\n      </div>\n    </section>\n  );\n};"}, {"file_name": "event-hive-link/src/components/landing/Hero.tsx", "file_path": "https://github.com/tajyusuf/event-hive-link/blob/main/src/components/landing/Hero.tsx", "markdown_link": "- [event-hive-link/src/components/landing/Hero.tsx](https://github.com/tajyusuf/event-hive-link/blob/main/src/components/landing/Hero.tsx)\n", "code_chunk": "export const Hero = () => {\n  return (\n    <section className=\"relative min-h-screen bg-gradient-hero flex items-center justify-center overflow-hidden\">\n      {/* Background Pattern */}\n      <div className=\"absolute inset-0 bg-black/10\"></div>\n      \n      {/* Animated Background Elements */}\n      <div className=\"absolute inset-0\">\n        <div className=\"absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse\"></div>\n        <div className=\"absolute bottom-20 right-10 w-48 h-48 bg-white/10 rounded-full blur-xl animate-pulse delay-1000\"></div>\n        <div className=\"absolute top-1/2 left-1/3 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse delay-500\"></div>\n      </div>\n      \n      <div className=\"relative z-10 container mx-auto px-4 text-center text-white\">\n        <div className=\"max-w-4xl mx-auto\">\n          <div className=\"flex items-center justify-center gap-2 mb-6\">\n            <Sparkles className=\"h-8 w-8 text-primary-glow\" />\n            <span className=\"text-primary-glow font-semibold tracking-wide\">EVENTEYE</span>\n          </div>\n          \n          <h1 className=\"text-5xl md:text-7xl font-bold mb-6 leading-tight\">\n            Smart Matchmaking for\n            <span className=\"block bg-gradient-to-r from-primary-glow to-white bg-clip-text text-transparent\">\n              Events & Sponsors\n            </span>\n          </h1>\n          \n          <p className=\"text-xl md:text-2xl mb-12 text-white/90 max-w-3xl mx-auto leading-relaxed\">\n            Connect student event organizers with ideal sponsors through intelligent matching based on audience, industry, and marketing goals.\n          </p>\n          \n          <div className=\"flex flex-col sm:flex-row gap-6 justify-center items-center mb-16\">\n            <Link to=\"/auth\">\n              <Button variant=\"organizer\" size=\"xl\" className=\"group\">\n                <Users className=\"h-5 w-5\" />\n                I'm an Organizer\n                <ArrowRight className=\"h-4 w-4 group-hover:translate-x-1 transition-transform\" />\n              </Button>\n            </Link>\n            \n            <Link to=\"/auth\">\n              <Button variant=\"sponsor\" size=\"xl\" className=\"group\">\n                <Building className=\"h-5 w-5\" />\n                I'm a Sponsor\n                <ArrowRight className=\"h-4 w-4 group-hover:translate-x-1 transition-transform\" />\n              </Button>\n            </Link>\n          </div>\n          \n          {/* How It Works Preview */}\n          <div className=\"grid md:grid-cols-3 gap-8 text-center\">\n            <div className=\"bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20\">\n              <div className=\"w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4\">\n                <span className=\"text-white font-bold\">1</span>\n              </div>\n              <h3 className=\"text-lg font-semibold mb-2\">Create Profile</h3>\n              <p className=\"text-white/80 text-sm\">Set up your event or company profile with detailed information</p>\n            </div>\n            \n            <div className=\"bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20\">\n              <div className=\"w-12 h-12 bg-secondary-purple rounded-full flex items-center justify-center mx-auto mb-4\">\n                <span className=\"text-white font-bold\">2</span>\n              </div>\n              <h3 className=\"text-lg font-semibold mb-2\">Smart Matching</h3>\n              <p className=\"text-white/80 text-sm\">Our AI matches events with sponsors based on compatibility</p>\n            </div>\n            \n            <div className=\"bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20\">\n              <div className=\"w-12 h-12 bg-accent-blue rounded-full flex items-center justify-center mx-auto mb-4\">\n                <span className=\"text-white font-bold\">3</span>\n              </div>\n              <h3 className=\"text-lg font-semibold mb-2\">Connect & Deal</h3>"}, {"file_name": "event-hive-link/src/components/dashboard/EnhancedOrganizerDashboard.tsx", "file_path": "https://github.com/tajyusuf/event-hive-link/blob/main/src/components/dashboard/EnhancedOrganizerDashboard.tsx", "markdown_link": "- [event-hive-link/src/components/dashboard/EnhancedOrganizerDashboard.tsx](https://github.com/tajyusuf/event-hive-link/blob/main/src/components/dashboard/EnhancedOrganizerDashboard.tsx)\n", "code_chunk": "{/* Events Section */}\n      <div className=\"flex justify-between items-center mb-6\">\n        <h2 className=\"text-2xl font-semibold\">Your Events</h2>\n        <Button onClick={() => setShowEventForm(!showEventForm)} variant=\"gradient\">\n          <Plus className=\"h-4 w-4 mr-2\" />\n          Create Event\n        </Button>\n      </div>\n\n      {/* Event Creation Form */}\n      {showEventForm && (\n        <Card className=\"mb-6\">\n          <CardHeader>\n            <CardTitle>Create New Event</CardTitle>\n          </CardHeader>\n          <CardContent>\n            <form onSubmit={handleCreateEvent} className=\"space-y-4\">\n              <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">\n                <div className=\"space-y-2\">\n                  <Label htmlFor=\"name\">Event Name *</Label>\n                  <Input\n                    id=\"name\"\n                    value={formData.name}\n                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}\n                    placeholder=\"Tech Summit 2024\"\n                    required\n                  />\n                </div>\n                <div className=\"space-y-2\">\n                  <Label htmlFor=\"event_date\">Event Date *</Label>\n                  <Input\n                    id=\"event_date\"\n                    type=\"date\"\n                    value={formData.event_date}\n                    onChange={(e) => setFormData(prev => ({ ...prev, event_date: e.target.value }))}\n                    required\n                  />\n                </div>\n              </div>\n\n              <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">\n                <div className=\"space-y-2\">\n                  <Label htmlFor=\"location\">Location *</Label>\n                  <Input\n                    id=\"location\"\n                    value={formData.location}\n                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}\n                    placeholder=\"Main Auditorium, Campus\"\n                    required\n                  />\n                </div>\n                <div className=\"space-y-2\">\n                  <Label htmlFor=\"audience_size\">Expected Audience Size</Label>\n                  <Input\n                    id=\"audience_size\"\n                    type=\"number\"\n                    value={formData.audience_size}\n                    onChange={(e) => setFormData(prev => ({ ...prev, audience_size: e.target.value }))}\n                    placeholder=\"500\"\n                  />\n                </div>\n              </div>\n\n              <div className=\"space-y-2\">\n                <Label htmlFor=\"description\">Description *</Label>\n                <Textarea\n                  id=\"description\"\n                  value={formData.description}\n                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}\n                  placeholder=\"Describe your event, what makes it special, and why sponsors should be interested...\"\n                  rows={3}\n                  required\n                />\n              </div>\n\n              <div className=\"space-y-2\">\n                <Label htmlFor=\"themes\">Themes/Categories</Label>\n                <Input\n                  id=\"themes\"\n                  value={formData.themes}\n                  onChange={(e) => setFormData(prev => ({ ...prev, themes: e.target.value }))}\n                  placeholder=\"Technology, Innovation, Networking (comma-separated)\"\n                />\n              </div>\n\n              <div className=\"flex gap-3\">\n                <Button type=\"submit\" variant=\"gradient\">\n                  Create Event\n                </Button>\n                <Button type=\"button\" variant=\"outline\" onClick={() => setShowEventForm(false)}>\n                  Cancel\n                </Button>\n              </div>\n            </form>\n          </CardContent>\n        </Card>\n      )}"}, {"file_name": "event-hive-link/src/components/dashboard/EnhancedSponsorDashboard.tsx", "file_path": "https://github.com/tajyusuf/event-hive-link/blob/main/src/components/dashboard/EnhancedSponsorDashboard.tsx", "markdown_link": "- [event-hive-link/src/components/dashboard/EnhancedSponsorDashboard.tsx](https://github.com/tajyusuf/event-hive-link/blob/main/src/components/dashboard/EnhancedSponsorDashboard.tsx)\n", "code_chunk": "import React, { useState, useEffect } from 'react';\nimport { useAuth } from '@/contexts/AuthContext';\nimport { supabase } from '@/integrations/supabase/client';\nimport AccountMenu from '@/components/profile/AccountMenu';\nimport { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';\nimport { Button } from '@/components/ui/button';\nimport { Input } from '@/components/ui/input';\nimport { Label } from '@/components/ui/label';\nimport { Badge } from '@/components/ui/badge';\nimport { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';\nimport { toast } from 'sonner';\nimport { \n  Search,\n  Filter,\n  Heart,\n  Eye,\n  MapPin,\n  Calendar,\n  Users,\n  Building,\n  MessageCircle,\n  Star,\n  TrendingUp\n} from 'lucide-react';\n\ninterface Event {\n  id: string;\n  name: string;\n  description: string;\n  event_date: string;\n  location: string;\n  audience_size: number;\n  themes: string[];\n  view_count: number;\n  organizer_profile: {\n    club_name: string;\n    college: string;\n  };\n}\n\ninterface SponsorProfile {\n  id: string;\n  company_name: string;\n  industry: string;\n  marketing_goals: any[];\n  target_audience: any[];\n}\n\nconst SponsorDashboard = () => {\n  const [events, setEvents] = useState<Event[]>([]);\n  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);\n  const [profile, setProfile] = useState<SponsorProfile | null>(null);\n  const [interests, setInterests] = useState<string[]>([]);\n  const [searchTerm, setSearchTerm] = useState('');\n  const [selectedTheme, setSelectedTheme] = useState('');\n  const [selectedLocation, setSelectedLocation] = useState('');\n  const [loading, setLoading] = useState(true);\n\n  const { user } = useAuth();\n\n  useEffect(() => {\n    if (user) {\n      fetchProfile();\n      fetchEvents();\n      fetchInterests();\n    }\n  }, [user]);\n\n  useEffect(() => {\n    filterEvents();\n  }, [events, searchTerm, selectedTheme, selectedLocation]);\n\n  const fetchProfile = async () => {\n    if (!user) return;\n\n    try {\n      const { [REMOVED_DATA_URI]\n        .single();\n\n      if (profiles) {\n        const { [REMOVED_DATA_URI]\n          .single();\n\n        setProfile(sponsorProfile);\n      }\n    } catch (error) {\n      console.error('Error fetching profile:', error);\n    }\n  };\n\n  const fetchEvents = async () => {\n    try {\n      setLoading(true);\n      const { data: eventsData } = await supabase\n        .from('events')\n        .select(`\n          *,\n          organizer_profiles!inner(\n            club_name,\n            college\n          )\n        `)\n        .eq('status', 'published')\n        .order('created_at', { ascending: false });\n\n      const formattedEvents = eventsData?.map(event => ({\n        ...event,\n        organizer_profile: {\n          club_name: event.organizer_profiles.club_name,\n          college: event.organizer_profiles.college\n        }\n      })) || [];\n\n      setEvents(formattedEvents);\n    } catch (error) {\n      console.error('Error fetching events:', error);\n      toast.error('Failed to load events');\n    } finally {\n      setLoading(false);\n    }\n  };\n\n  const fetchInterests = async () => {\n    if (!user || !profile) return;\n\n    try {\n      const { [REMOVED_DATA_URI]\n\n      setInterests(interestsData?.map(i => i.event_id) || []);\n    } catch (error) {\n      console.error('Error fetching interests:', error);\n    }\n  };\n\n  const filterEvents = () => {\n    let filtered = events;"}, {"file_name": "event-hive-link/src/integrations/supabase/types.ts", "file_path": "https://github.com/tajyusuf/event-hive-link/blob/main/src/integrations/supabase/types.ts", "markdown_link": "- [event-hive-link/src/integrations/supabase/types.ts](https://github.com/tajyusuf/event-hive-link/blob/main/src/integrations/supabase/types.ts)\n", "code_chunk": "}\n        Insert: {\n          club_name: string\n          college: string\n          created_at?: string\n          description?: string | null\n          id?: string\n          profile_id: string\n          social_links?: Json | null\n          updated_at?: string\n        }\n        Update: {\n          club_name?: string\n          college?: string\n          created_at?: string\n          description?: string | null\n          id?: string\n          profile_id?: string\n          social_links?: Json | null\n          updated_at?: string\n        }\n        Relationships: [\n          {\n            foreignKeyName: \"organizer_profiles_profile_id_fkey\"\n            columns: [\"profile_id\"]\n            isOneToOne: false\n            referencedRelation: \"profiles\"\n            referencedColumns: [\"id\"]\n          },\n        ]\n      }\n      profiles: {\n        Row: {\n          avatar_url: string | null\n          created_at: string\n          email: string\n          full_name: string\n          id: string\n          role: Database[\"public\"][\"Enums\"][\"user_role\"]\n          updated_at: string\n          user_id: string\n        }\n        Insert: {\n          avatar_url?: string | null\n          created_at?: string\n          email: string\n          full_name: string\n          id?: string\n          role: Database[\"public\"][\"Enums\"][\"user_role\"]\n          updated_at?: string\n          user_id: string\n        }\n        Update: {\n          avatar_url?: string | null\n          created_at?: string\n          email?: string\n          full_name?: string\n          id?: string\n          role?: Database[\"public\"][\"Enums\"][\"user_role\"]\n          updated_at?: string\n          user_id?: string\n        }\n        Relationships: []\n      }\n      sponsor_interests: {\n        Row: {\n          created_at: string\n          event_id: string\n          id: string\n          sponsor_id: string\n          status: string | null\n        }\n        Insert: {\n          created_at?: string\n          event_id: string\n          id?: string\n          sponsor_id: string\n          status?: string | null\n        }\n        Update: {\n          created_at?: string\n          event_id?: string\n          id?: string\n          sponsor_id?: string\n          status?: string | null\n        }\n        Relationships: [\n          {\n            foreignKeyName: \"sponsor_interests_event_id_fkey\"\n            columns: [\"event_id\"]\n            isOneToOne: false\n            referencedRelation: \"events\"\n            referencedColumns: [\"id\"]\n          },\n          {\n            foreignKeyName: \"sponsor_interests_sponsor_id_fkey\"\n            columns: [\"sponsor_id\"]\n            isOneToOne: false\n            referencedRelation: \"sponsor_profiles\"\n            referencedColumns: [\"id\"]\n          },\n        ]\n      }\n      sponsor_profiles: {\n        Row: {\n          budget_range: string | null\n          company_name: string\n          created_at: string\n          id: string\n          industry: string\n          marketing_goals: string[] | null\n          profile_id: string\n          target_audience: string[] | null\n          updated_at: string\n          website: string | null\n        }\n        Insert: {\n          budget_range?: string | null\n          company_name: string\n          created_at?: string\n          id?: string\n          industry: string\n          marketing_goals?: string[] | null\n          profile_id: string\n          target_audience?: string[] | null\n          updated_at?: string\n          website?: string | null\n        }\n        Update: {\n          budget_range?: string | null\n          company_name?: string\n          created_at?: string\n          id?: string\n          industry?: string\n          marketing_goals?: string[] | null\n          profile_id?: string\n          target_audience?: string[] | null\n          updated_at?: string\n          website?: string | null\n        }\n        Relationships: [\n          {\n            foreignKeyName: \"sponsor_profiles_profile_id_fkey\"\n            columns: [\"profile_id\"]"}, {"file_name": "event-hive-link/src/components/profile/ProfileSetup.tsx", "file_path": "https://github.com/tajyusuf/event-hive-link/blob/main/src/components/profile/ProfileSetup.tsx", "markdown_link": "- [event-hive-link/src/components/profile/ProfileSetup.tsx](https://github.com/tajyusuf/event-hive-link/blob/main/src/components/profile/ProfileSetup.tsx)\n", "code_chunk": "{/* Sponsor Specific Fields */}\n          {role === 'sponsor' && (\n            <>\n              <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">\n                <div className=\"space-y-2\">\n                  <Label htmlFor=\"companyName\">Company Name *</Label>\n                  <Input\n                    id=\"companyName\"\n                    value={formData.companyName}\n                    onChange={(e) => handleInputChange('companyName', e.target.value)}\n                    placeholder=\"e.g., TechCorp Inc.\"\n                    required\n                  />\n                </div>\n                <div className=\"space-y-2\">\n                  <Label htmlFor=\"website\">Website</Label>\n                  <Input\n                    id=\"website\"\n                    value={formData.website}\n                    onChange={(e) => handleInputChange('website', e.target.value)}\n                    placeholder=\"https://yourcompany.com\"\n                  />\n                </div>\n              </div>\n\n              <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">\n                <div className=\"space-y-2\">\n                  <Label htmlFor=\"industry\">Industry *</Label>\n                  <Input\n                    id=\"industry\"\n                    value={formData.industry}\n                    onChange={(e) => handleInputChange('industry', e.target.value)}\n                    placeholder=\"e.g., Technology, Finance, Healthcare\"\n                    required\n                  />\n                </div>\n                <div className=\"space-y-2\">\n                  <Label htmlFor=\"budgetRange\">Budget Range</Label>\n                  <Input\n                    id=\"budgetRange\"\n                    value={formData.budgetRange}\n                    onChange={(e) => handleInputChange('budgetRange', e.target.value)}\n                    placeholder=\"e.g., $1,000 - $5,000\"\n                  />\n                </div>\n              </div>\n\n              <div className=\"space-y-2\">\n                <Label htmlFor=\"marketingGoals\">Marketing Goals</Label>\n                <Input\n                  id=\"marketingGoals\"\n                  onChange={(e) => handleArrayChange('marketingGoals', e.target.value)}\n                  placeholder=\"e.g., Brand Awareness, Lead Generation, Product Launch (comma-separated)\"\n                />\n              </div>\n\n              <div className=\"space-y-2\">\n                <Label htmlFor=\"targetAudience\">Target Audience</Label>\n                <Input\n                  id=\"targetAudience\"\n                  onChange={(e) => handleArrayChange('targetAudience', e.target.value)}\n                  placeholder=\"e.g., Students, Young Professionals, Tech Enthusiasts (comma-separated)\"\n                />\n              </div>\n            </>\n          )}\n\n          <Button \n            type=\"submit\" \n            variant=\"gradient\" \n            size=\"lg\" \n            className=\"w-full\"\n            disabled={loading}\n          >\n            {loading && <Loader2 className=\"h-4 w-4 animate-spin\" />}\n            Complete Profile Setup\n          </Button>\n        </form>\n      </CardContent>\n    </Card>\n  );\n};\n\nexport default ProfileSetup;"}]</code-reference>


## What's Next

Continue exploring the documentation with these detailed sections:

- **Getting Started**: Getting Started
- **Architecture Overview**: Architecture Overview
- **Core Technologies**: Core Technologies