import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-9b4de1de/health", (c) => {
  return c.json({ status: "ok" });
});

// Auth middleware for protected routes
async function requireAuth(c: any, next: any) {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  c.set('user', user);
  await next();
}

// Auth endpoints
app.post("/make-server-9b4de1de/auth/signup", async (c) => {
  try {
    const { email, password, userData } = await c.req.json();
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: userData,
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });
    
    if (error) {
      console.log(`Signup error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }
    
    // Store additional user data in KV store
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email: data.user.email,
      role: userData.role || 'Student',
      ...userData,
      createdAt: new Date().toISOString()
    });
    
    return c.json({ user: data.user });
  } catch (error) {
    console.log(`Signup error: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Problem Statements endpoints
app.get("/make-server-9b4de1de/problem-statements", async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '10');
    const search = c.req.query('search') || '';
    const category = c.req.query('category') || '';
    const theme = c.req.query('theme') || '';
    
    // Get all problem statements
    const allProblems = await kv.getByPrefix('problem:');
    
    let filteredProblems = allProblems.filter(item => {
      const problem = item.value;
      const matchesSearch = !search || 
        problem.title?.toLowerCase().includes(search.toLowerCase()) ||
        problem.organization?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !category || problem.category === category;
      const matchesTheme = !theme || problem.theme === theme;
      
      return matchesSearch && matchesCategory && matchesTheme;
    });
    
    const total = filteredProblems.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProblems = filteredProblems.slice(startIndex, endIndex);
    
    return c.json({
      problems: paginatedProblems.map(item => item.value),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.log(`Error fetching problem statements: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.get("/make-server-9b4de1de/problem-statements/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const problem = await kv.get(`problem:${id}`);
    
    if (!problem) {
      return c.json({ error: 'Problem statement not found' }, 404);
    }
    
    return c.json(problem);
  } catch (error) {
    console.log(`Error fetching problem statement: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.post("/make-server-9b4de1de/problem-statements", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const userData = await kv.get(`user:${user.id}`);
    
    if (userData?.role !== 'Admin') {
      return c.json({ error: 'Access denied' }, 403);
    }
    
    const problemData = await c.req.json();
    const id = crypto.randomUUID();
    
    const problem = {
      id,
      ...problemData,
      submittedIdeasCount: 0,
      createdAt: new Date().toISOString(),
      createdBy: user.id
    };
    
    await kv.set(`problem:${id}`, problem);
    
    return c.json(problem);
  } catch (error) {
    console.log(`Error creating problem statement: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Alumni endpoints
app.get("/make-server-9b4de1de/alumni", async (c) => {
  try {
    const allAlumni = await kv.getByPrefix('alumni:');
    return c.json(allAlumni.map(item => item.value));
  } catch (error) {
    console.log(`Error fetching alumni: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.get("/make-server-9b4de1de/alumni/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const alumni = await kv.get(`alumni:${id}`);
    
    if (!alumni) {
      return c.json({ error: 'Alumni not found' }, 404);
    }
    
    return c.json(alumni);
  } catch (error) {
    console.log(`Error fetching alumni profile: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.post("/make-server-9b4de1de/alumni", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const alumniData = await c.req.json();
    
    const alumni = {
      id: crypto.randomUUID(),
      userId: user.id,
      ...alumniData,
      createdAt: new Date().toISOString()
    };
    
    await kv.set(`alumni:${alumni.id}`, alumni);
    
    return c.json(alumni);
  } catch (error) {
    console.log(`Error creating alumni profile: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Idea submissions endpoints
app.post("/make-server-9b4de1de/submit-idea", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const { problemId, ideaData } = await c.req.json();
    
    const id = crypto.randomUUID();
    const submission = {
      id,
      problemId,
      userId: user.id,
      ...ideaData,
      status: 'submitted',
      submittedAt: new Date().toISOString()
    };
    
    await kv.set(`submission:${id}`, submission);
    
    // Update problem statement submitted ideas count
    const problem = await kv.get(`problem:${problemId}`);
    if (problem) {
      problem.submittedIdeasCount = (problem.submittedIdeasCount || 0) + 1;
      await kv.set(`problem:${problemId}`, problem);
    }
    
    return c.json(submission);
  } catch (error) {
    console.log(`Error submitting idea: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Contact form endpoint
app.post("/make-server-9b4de1de/contact", async (c) => {
  try {
    const contactData = await c.req.json();
    const id = crypto.randomUUID();
    
    const contact = {
      id,
      ...contactData,
      submittedAt: new Date().toISOString()
    };
    
    await kv.set(`contact:${id}`, contact);
    
    return c.json({ message: 'Contact form submitted successfully' });
  } catch (error) {
    console.log(`Error submitting contact form: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Analytics endpoint for admin
app.get("/make-server-9b4de1de/analytics", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const userData = await kv.get(`user:${user.id}`);
    
    if (userData?.role !== 'Admin') {
      return c.json({ error: 'Access denied' }, 403);
    }
    
    const [users, alumni, events, donations] = await Promise.all([
      kv.getByPrefix('user:'),
      kv.getByPrefix('alumni:'),
      kv.getByPrefix('event:'),
      kv.getByPrefix('donation:')
    ]);
    
    const alumniByIndustry = alumni.reduce((acc, item) => {
      if (item.value && item.value.industry) {
        const industry = item.value.industry || 'Other';
        acc[industry] = (acc[industry] || 0) + 1;
      }
      return acc;
    }, {});
    
    const totalDonationAmount = donations.reduce((sum, item) => {
      return sum + (item.value?.amount || 0);
    }, 0);
    
    return c.json({
      totalUsers: users.length,
      totalAlumni: alumni.length,
      totalEvents: events.length,
      totalDonations: totalDonationAmount,
      alumniByIndustry,
      recentActivity: {
        newAlumni: alumni.filter(item => {
          const createdDate = new Date(item.value?.createdAt || 0);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return createdDate > thirtyDaysAgo;
        }).length,
        newEvents: events.filter(item => item.value?.isActive).length,
        totalFundsRaised: totalDonationAmount,
        activeMentorships: 0 // Will be calculated when mentorship data is available
      }
    });
  } catch (error) {
    console.log(`Error fetching analytics: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Events endpoints
app.get("/make-server-9b4de1de/events", async (c) => {
  try {
    const allEvents = await kv.getByPrefix('event:');
    return c.json(allEvents.map(item => item.value));
  } catch (error) {
    console.log(`Error fetching events: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.post("/make-server-9b4de1de/events", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const eventData = await c.req.json();
    
    const event = {
      id: crypto.randomUUID(),
      ...eventData,
      registeredCount: 0,
      isRegistered: false,
      createdAt: new Date().toISOString(),
      isActive: true
    };
    
    await kv.set(`event:${event.id}`, event);
    
    return c.json(event);
  } catch (error) {
    console.log(`Error creating event: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.post("/make-server-9b4de1de/events/:id/register", requireAuth, async (c) => {
  try {
    const eventId = c.req.param('id');
    const { userId } = await c.req.json();
    
    const event = await kv.get(`event:${eventId}`);
    if (!event) {
      return c.json({ error: 'Event not found' }, 404);
    }
    
    // Create registration record
    const registrationId = crypto.randomUUID();
    await kv.set(`registration:${registrationId}`, {
      id: registrationId,
      eventId,
      userId,
      registeredAt: new Date().toISOString()
    });
    
    // Update event registration count
    event.registeredCount = (event.registeredCount || 0) + 1;
    await kv.set(`event:${eventId}`, event);
    
    return c.json({ message: 'Registration successful' });
  } catch (error) {
    console.log(`Error registering for event: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Mentorship endpoints
app.get("/make-server-9b4de1de/mentors", async (c) => {
  try {
    const allMentors = await kv.getByPrefix('mentor:');
    return c.json(allMentors.map(item => item.value));
  } catch (error) {
    console.log(`Error fetching mentors: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.post("/make-server-9b4de1de/mentorship-requests", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const { mentorId, menteeId, message } = await c.req.json();
    
    const request = {
      id: crypto.randomUUID(),
      mentorId,
      menteeId,
      mentorName: 'Mentor Name', // In real app, fetch from mentor data
      menteeName: user.user_metadata?.name || user.email,
      message,
      status: 'pending',
      createdAt: new Date().toISOString(),
      expertise: 'General'
    };
    
    await kv.set(`mentorship-request:${request.id}`, request);
    
    return c.json(request);
  } catch (error) {
    console.log(`Error creating mentorship request: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.get("/make-server-9b4de1de/mentorship-requests/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    const allRequests = await kv.getByPrefix('mentorship-request:');
    const userRequests = allRequests.filter(item => 
      item.value.mentorId === userId || item.value.menteeId === userId
    );
    return c.json(userRequests.map(item => item.value));
  } catch (error) {
    console.log(`Error fetching mentorship requests: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.get("/make-server-9b4de1de/mentorship-pairs/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    const allPairs = await kv.getByPrefix('mentorship-pair:');
    const userPairs = allPairs.filter(item => 
      item.value.mentorId === userId || item.value.menteeId === userId
    );
    return c.json(userPairs.map(item => item.value));
  } catch (error) {
    console.log(`Error fetching mentorship pairs: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.patch("/make-server-9b4de1de/mentorship-requests/:id", requireAuth, async (c) => {
  try {
    const requestId = c.req.param('id');
    const { status } = await c.req.json();
    
    const request = await kv.get(`mentorship-request:${requestId}`);
    if (!request) {
      return c.json({ error: 'Request not found' }, 404);
    }
    
    request.status = status;
    await kv.set(`mentorship-request:${requestId}`, request);
    
    // If accepted, create mentorship pair
    if (status === 'accepted') {
      const pair = {
        id: crypto.randomUUID(),
        mentorId: request.mentorId,
        menteeId: request.menteeId,
        mentorName: request.mentorName,
        menteeName: request.menteeName,
        startDate: new Date().toISOString(),
        status: 'active',
        goals: 'Career development and guidance',
        meetings: 0
      };
      await kv.set(`mentorship-pair:${pair.id}`, pair);
    }
    
    return c.json({ message: `Request ${status}` });
  } catch (error) {
    console.log(`Error updating mentorship request: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Donations endpoints
app.get("/make-server-9b4de1de/campaigns", async (c) => {
  try {
    const allCampaigns = await kv.getByPrefix('campaign:');
    return c.json(allCampaigns.map(item => item.value));
  } catch (error) {
    console.log(`Error fetching campaigns: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.get("/make-server-9b4de1de/donations", async (c) => {
  try {
    const allDonations = await kv.getByPrefix('donation:');
    return c.json(allDonations.map(item => item.value));
  } catch (error) {
    console.log(`Error fetching donations: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.get("/make-server-9b4de1de/donation-stats", async (c) => {
  try {
    const [campaigns, donations] = await Promise.all([
      kv.getByPrefix('campaign:'),
      kv.getByPrefix('donation:')
    ]);
    
    const totalRaised = donations.reduce((sum, item) => sum + item.value.amount, 0);
    const totalDonors = new Set(donations.map(item => item.value.donorName)).size;
    const activeCampaigns = campaigns.filter(item => item.value.isActive).length;
    
    return c.json({
      totalRaised,
      totalDonors,
      activeCampaigns,
      myDonations: 0 // In real app, filter by user
    });
  } catch (error) {
    console.log(`Error fetching donation stats: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.post("/make-server-9b4de1de/donations", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const donationData = await c.req.json();
    
    const donation = {
      id: crypto.randomUUID(),
      ...donationData,
      date: new Date().toISOString()
    };
    
    await kv.set(`donation:${donation.id}`, donation);
    
    // Update campaign raised amount
    const campaign = await kv.get(`campaign:${donationData.campaignId}`);
    if (campaign) {
      campaign.raised = (campaign.raised || 0) + donationData.amount;
      campaign.donorCount = (campaign.donorCount || 0) + 1;
      await kv.set(`campaign:${donationData.campaignId}`, campaign);
    }
    
    return c.json(donation);
  } catch (error) {
    console.log(`Error processing donation: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Communication endpoints
app.get("/make-server-9b4de1de/announcements", async (c) => {
  try {
    const allAnnouncements = await kv.getByPrefix('announcement:');
    return c.json(allAnnouncements.map(item => item.value));
  } catch (error) {
    console.log(`Error fetching announcements: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.post("/make-server-9b4de1de/announcements", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const announcementData = await c.req.json();
    
    const announcement = {
      id: crypto.randomUUID(),
      ...announcementData,
      authorRole: 'Admin',
      createdAt: new Date().toISOString(),
      isPinned: false,
      readBy: []
    };
    
    await kv.set(`announcement:${announcement.id}`, announcement);
    
    return c.json(announcement);
  } catch (error) {
    console.log(`Error creating announcement: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.get("/make-server-9b4de1de/forum-posts", async (c) => {
  try {
    const allPosts = await kv.getByPrefix('forum-post:');
    return c.json(allPosts.map(item => item.value));
  } catch (error) {
    console.log(`Error fetching forum posts: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.post("/make-server-9b4de1de/forum-posts", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const postData = await c.req.json();
    
    const post = {
      id: crypto.randomUUID(),
      ...postData,
      replies: 0,
      likes: 0,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      isLiked: false
    };
    
    await kv.set(`forum-post:${post.id}`, post);
    
    return c.json(post);
  } catch (error) {
    console.log(`Error creating forum post: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.post("/make-server-9b4de1de/forum-posts/:id/like", requireAuth, async (c) => {
  try {
    const postId = c.req.param('id');
    const { userId } = await c.req.json();
    
    const post = await kv.get(`forum-post:${postId}`);
    if (!post) {
      return c.json({ error: 'Post not found' }, 404);
    }
    
    post.likes = (post.likes || 0) + 1;
    post.isLiked = true;
    await kv.set(`forum-post:${postId}`, post);
    
    return c.json({ message: 'Post liked' });
  } catch (error) {
    console.log(`Error liking post: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Connection endpoints
app.post("/make-server-9b4de1de/connections", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const { fromUserId, toUserId, message } = await c.req.json();
    
    const connection = {
      id: crypto.randomUUID(),
      fromUserId,
      toUserId,
      message,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    await kv.set(`connection:${connection.id}`, connection);
    
    return c.json(connection);
  } catch (error) {
    console.log(`Error creating connection: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// User profile endpoint
app.get("/make-server-9b4de1de/user-profile", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const userData = await kv.get(`user:${user.id}`);
    
    if (!userData) {
      return c.json({ 
        role: 'Alumni',
        name: user.user_metadata?.name || user.email
      });
    }
    
    return c.json(userData);
  } catch (error) {
    console.log(`Error fetching user profile: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Initialize sample data
app.post("/make-server-9b4de1de/init-sample-data", async (c) => {
  try {
    // Check if data already exists
    const existingAlumni = await kv.getByPrefix('alumni:');
    if (existingAlumni.length > 0) {
      return c.json({ message: 'Sample data already exists' });
    }
    
    // Create sample alumni data
    const sampleAlumni = [
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        gradYear: 2020,
        degree: 'Computer Science',
        company: 'Google',
        position: 'Senior Software Engineer',
        location: 'San Francisco, CA',
        industry: 'Technology',
        skills: ['React', 'Node.js', 'Python', 'Machine Learning'],
        bio: 'Passionate about building scalable web applications and mentoring young developers.',
        isAvailableForMentorship: true,
        experience: [
          {
            company: 'Google',
            position: 'Senior Software Engineer',
            duration: '2022 - Present',
            description: 'Leading development of cloud infrastructure tools'
          }
        ],
        achievements: ['Google Cloud Certified Architect', 'Tech Women Leadership Award'],
        interests: ['AI/ML', 'Open Source', 'Mentoring'],
        joinedDate: '2020-06-01',
        lastActive: '2024-01-15'
      },
      {
        id: '2',
        name: 'Michael Chen',
        email: 'michael.chen@example.com',
        gradYear: 2018,
        degree: 'Business Administration',
        company: 'McKinsey & Company',
        position: 'Senior Consultant',
        location: 'New York, NY',
        industry: 'Consulting',
        skills: ['Strategy', 'Data Analysis', 'Project Management', 'Leadership'],
        bio: 'Strategy consultant helping companies drive digital transformation.',
        isAvailableForMentorship: true,
        experience: [
          {
            company: 'McKinsey & Company',
            position: 'Senior Consultant',
            duration: '2020 - Present',
            description: 'Leading strategic consulting projects for Fortune 500 clients'
          }
        ],
        achievements: ['MBA from Wharton', 'Strategy Excellence Award'],
        interests: ['Digital Strategy', 'Entrepreneurship', 'Venture Capital'],
        joinedDate: '2018-05-15',
        lastActive: '2024-01-10'
      }
    ];
    
    for (const alumni of sampleAlumni) {
      await kv.set(`alumni:${alumni.id}`, alumni);
    }
    
    // Create sample mentors
    const sampleMentors = [
      {
        id: '1',
        name: 'Sarah Johnson',
        position: 'Senior Software Engineer',
        company: 'Google',
        industry: 'Technology',
        expertise: ['React', 'Node.js', 'Python', 'Machine Learning'],
        experience: 6,
        rating: 4.9,
        totalMentees: 12,
        bio: 'Passionate about building scalable web applications and mentoring young developers.',
        availability: 'available',
        location: 'San Francisco, CA'
      },
      {
        id: '2',
        name: 'Michael Chen',
        position: 'Senior Consultant',
        company: 'McKinsey & Company',
        industry: 'Consulting',
        expertise: ['Strategy', 'Data Analysis', 'Project Management', 'Leadership'],
        experience: 8,
        rating: 4.8,
        totalMentees: 8,
        bio: 'Strategy consultant helping companies drive digital transformation.',
        availability: 'available',
        location: 'New York, NY'
      }
    ];
    
    for (const mentor of sampleMentors) {
      await kv.set(`mentor:${mentor.id}`, mentor);
    }
    
    // Create sample campaigns
    const sampleCampaigns = [
      {
        id: '1',
        title: 'New Computer Lab Initiative',
        description: 'Help us build a state-of-the-art computer lab for students to learn coding and technology skills.',
        goal: 50000,
        raised: 32500,
        donorCount: 45,
        category: 'education',
        organizer: 'Alumni Association',
        createdAt: '2024-01-01',
        deadline: '2024-12-31',
        isActive: true
      },
      {
        id: '2',
        title: 'Scholarship Fund for Underserved Students',
        description: 'Support deserving students who need financial assistance to pursue their education.',
        goal: 100000,
        raised: 68750,
        donorCount: 128,
        category: 'scholarship',
        organizer: 'Alumni Association',
        createdAt: '2024-01-01',
        deadline: '2024-12-31',
        isActive: true
      }
    ];
    
    for (const campaign of sampleCampaigns) {
      await kv.set(`campaign:${campaign.id}`, campaign);
    }
    
    // Create sample events
    const sampleEvents = [
      {
        id: '1',
        title: 'Annual Alumni Reunion 2024',
        description: 'Join us for our annual reunion celebration with networking, dinner, and entertainment.',
        date: '2024-06-15',
        time: '18:00',
        location: 'Grand Ballroom, City Hotel',
        type: 'reunion',
        capacity: 200,
        registeredCount: 156,
        organizer: 'Alumni Association',
        isRegistered: false,
        registrationDeadline: '2024-06-10',
        price: 75
      },
      {
        id: '2',
        title: 'Tech Career Workshop',
        description: 'Learn about the latest trends in technology careers and get tips from industry experts.',
        date: '2024-03-20',
        time: '14:00',
        location: 'University Tech Center',
        type: 'workshop',
        capacity: 50,
        registeredCount: 32,
        organizer: 'Tech Alumni Group',
        isRegistered: false,
        registrationDeadline: '2024-03-18',
        price: 0
      }
    ];
    
    for (const event of sampleEvents) {
      await kv.set(`event:${event.id}`, event);
    }
    
    return c.json({ message: 'Sample data initialized successfully' });
  } catch (error) {
    console.log(`Error initializing sample data: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

Deno.serve(app.fetch);