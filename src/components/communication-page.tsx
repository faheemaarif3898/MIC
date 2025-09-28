import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { MessageSquare, Send, Users, Bell, Mail, Plus, Search, Filter, Pin } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';

interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  authorRole: string;
  createdAt: string;
  isPinned: boolean;
  category: string;
  readBy: string[];
}

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  category: string;
  tags: string[];
  replies: number;
  likes: number;
  createdAt: string;
  lastActivity: string;
  isLiked: boolean;
}

interface NewsletterSubscription {
  id: string;
  email: string;
  subscribed: boolean;
  preferences: string[];
}

export function CommunicationPage() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('announcements');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // New announcement/post form
  const [newContent, setNewContent] = useState({
    title: '',
    content: '',
    category: 'general',
    tags: '',
  });

  useEffect(() => {
    fetchAnnouncements();
    fetchForumPosts();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-9b4de1de/announcements`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchForumPosts = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-9b4de1de/forum-posts`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setForumPosts(data);
      }
    } catch (error) {
      console.error('Error fetching forum posts:', error);
    }
  };

  const handleCreateContent = async () => {
    if (!user || !newContent.title || !newContent.content) return;

    const endpoint = activeTab === 'announcements' ? 'announcements' : 'forum-posts';
    
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-9b4de1de/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          ...newContent,
          authorId: user.id,
          author: user.name || user.email,
          tags: newContent.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        }),
      });

      if (response.ok) {
        toast.success(`${activeTab === 'announcements' ? 'Announcement' : 'Post'} created successfully!`);
        setIsCreateModalOpen(false);
        setNewContent({ title: '', content: '', category: 'general', tags: '' });
        if (activeTab === 'announcements') {
          fetchAnnouncements();
        } else {
          fetchForumPosts();
        }
      } else {
        toast.error('Failed to create content');
      }
    } catch (error) {
      console.error('Error creating content:', error);
      toast.error('Error creating content');
    }
  };

  const handleLikePost = async (postId: string) => {
    if (!user) return;

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-9b4de1de/forum-posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (response.ok) {
        fetchForumPosts();
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      general: 'bg-gray-100 text-gray-800',
      events: 'bg-blue-100 text-blue-800',
      careers: 'bg-green-100 text-green-800',
      networking: 'bg-purple-100 text-purple-800',
      academic: 'bg-orange-100 text-orange-800',
      social: 'bg-pink-100 text-pink-800',
    };
    return colors[category] || colors.general;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredContent = (items: any[]) => {
    return items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Communication Hub</h1>
              <p className="mt-2 text-gray-600">Stay connected with announcements, discussions, and updates</p>
            </div>
            {(user?.role === 'Admin' || user?.role === 'Alumni') && (
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create {activeTab === 'announcements' ? 'Announcement' : 'Post'}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      Create New {activeTab === 'announcements' ? 'Announcement' : 'Forum Post'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={newContent.title}
                        onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                        placeholder="Enter title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        value={newContent.content}
                        onChange={(e) => setNewContent({ ...newContent, content: e.target.value })}
                        placeholder="Enter content"
                        rows={6}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select value={newContent.category} onValueChange={(value) => setNewContent({ ...newContent, category: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="events">Events</SelectItem>
                            <SelectItem value="careers">Careers</SelectItem>
                            <SelectItem value="networking">Networking</SelectItem>
                            <SelectItem value="academic">Academic</SelectItem>
                            <SelectItem value="social">Social</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {activeTab === 'forum' && (
                        <div>
                          <Label htmlFor="tags">Tags (comma-separated)</Label>
                          <Input
                            id="tags"
                            value={newContent.tags}
                            onChange={(e) => setNewContent({ ...newContent, tags: e.target.value })}
                            placeholder="e.g., career, networking, advice"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end space-x-3">
                      <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateContent}>
                        Create {activeTab === 'announcements' ? 'Announcement' : 'Post'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
            <TabsTrigger value="forum">Discussion Forum</TabsTrigger>
            <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
          </TabsList>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="events">Events</SelectItem>
                <SelectItem value="careers">Careers</SelectItem>
                <SelectItem value="networking">Networking</SelectItem>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="social">Social</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <TabsContent value="announcements" className="space-y-6">
            <div className="space-y-4">
              {filteredContent(announcements).length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No announcements found.</p>
                </div>
              ) : (
                filteredContent(announcements).map((announcement) => (
                  <Card key={announcement.id} className={announcement.isPinned ? 'border-blue-200 bg-blue-50' : ''}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {announcement.isPinned && <Pin className="w-4 h-4 text-blue-600" />}
                            <Badge className={getCategoryColor(announcement.category)}>
                              {announcement.category.charAt(0).toUpperCase() + announcement.category.slice(1)}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg">{announcement.title}</CardTitle>
                          <div className="flex items-center space-x-2 text-sm text-gray-600 mt-2">
                            <span>By {announcement.author}</span>
                            <span>•</span>
                            <span>{formatDate(announcement.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 whitespace-pre-wrap">{announcement.content}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="forum" className="space-y-6">
            <div className="space-y-4">
              {filteredContent(forumPosts).length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No forum posts found.</p>
                </div>
              ) : (
                filteredContent(forumPosts).map((post) => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className={getCategoryColor(post.category)}>
                              {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                            </Badge>
                            {post.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <CardTitle className="text-lg">{post.title}</CardTitle>
                          <div className="flex items-center space-x-2 text-sm text-gray-600 mt-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs">
                                {post.author.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span>By {post.author}</span>
                            <span>•</span>
                            <span>{formatDate(post.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4 line-clamp-3">{post.content}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            {post.replies} replies
                          </span>
                          <span>Last activity: {formatDate(post.lastActivity)}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLikePost(post.id)}
                          className={post.isLiked ? 'text-red-600' : 'text-gray-600'}
                        >
                          ❤️ {post.likes}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="newsletter" className="space-y-6">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader className="text-center">
                  <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <CardTitle className="text-2xl">Alumni Newsletter</CardTitle>
                  <p className="text-gray-600">
                    Stay updated with the latest news, events, and opportunities from our alumni community.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">What you'll receive:</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                        <span className="text-sm">Monthly alumni spotlights and success stories</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                        <span className="text-sm">Upcoming events and networking opportunities</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                        <span className="text-sm">Career opportunities and job postings</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                        <span className="text-sm">Institution news and achievements</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <div className="flex space-x-3">
                      <Input 
                        placeholder="Enter your email address"
                        type="email"
                        className="flex-1"
                      />
                      <Button>
                        <Send className="w-4 h-4 mr-2" />
                        Subscribe
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      You can unsubscribe at any time. We respect your privacy.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}