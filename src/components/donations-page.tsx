import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Heart, DollarSign, Target, TrendingUp, Gift, CreditCard, History, Trophy } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';

interface Campaign {
  id: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  donorCount: number;
  category: string;
  image?: string;
  deadline?: string;
  organizer: string;
  createdAt: string;
  isActive: boolean;
}

interface Donation {
  id: string;
  campaignId: string;
  campaignTitle: string;
  amount: number;
  donorName: string;
  message?: string;
  isAnonymous: boolean;
  date: string;
}

interface DonationStats {
  totalRaised: number;
  totalDonors: number;
  activeCampaigns: number;
  myDonations: number;
}

export function DonationsPage() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState<DonationStats>({
    totalRaised: 0,
    totalDonors: 0,
    activeCampaigns: 0,
    myDonations: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('campaigns');
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [donationMessage, setDonationMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    fetchCampaigns();
    fetchDonations();
    fetchStats();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-9b4de1de/campaigns`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDonations = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-9b4de1de/donations`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setDonations(data);
      }
    } catch (error) {
      console.error('Error fetching donations:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-9b4de1de/donation-stats`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching donation stats:', error);
    }
  };

  const handleDonate = async () => {
    if (!user || !selectedCampaign || !donationAmount) return;

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-9b4de1de/donations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          campaignId: selectedCampaign.id,
          amount: parseFloat(donationAmount),
          donorId: user.id,
          donorName: isAnonymous ? 'Anonymous' : (user.name || user.email),
          message: donationMessage,
          isAnonymous,
        }),
      });

      if (response.ok) {
        toast.success('Thank you for your donation!');
        setIsDonateModalOpen(false);
        setDonationAmount('');
        setDonationMessage('');
        setIsAnonymous(false);
        setSelectedCampaign(null);
        fetchCampaigns();
        fetchDonations();
        fetchStats();
      } else {
        toast.error('Failed to process donation');
      }
    } catch (error) {
      console.error('Error processing donation:', error);
      toast.error('Error processing donation');
    }
  };

  const getProgressPercentage = (raised: number, goal: number) => {
    return Math.min((raised / goal) * 100, 100);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      education: 'bg-blue-100 text-blue-800',
      infrastructure: 'bg-green-100 text-green-800',
      scholarship: 'bg-purple-100 text-purple-800',
      research: 'bg-orange-100 text-orange-800',
      emergency: 'bg-red-100 text-red-800',
      general: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors.general;
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
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Alumni Giving</h1>
            <p className="mt-2 text-gray-600">Support your alma mater and make a lasting impact</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="text-center p-6">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-green-600">
                {formatCurrency(stats.totalRaised)}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-gray-600">Total Raised</p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-blue-600">
                {stats.totalDonors}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-gray-600">Total Donors</p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-purple-600">
                {stats.activeCampaigns}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-gray-600">Active Campaigns</p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Gift className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-orange-600">
                {formatCurrency(stats.myDonations)}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-gray-600">My Contributions</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="campaigns">Active Campaigns</TabsTrigger>
            <TabsTrigger value="donors">Recent Donors</TabsTrigger>
            <TabsTrigger value="history">My Donations</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.filter(campaign => campaign.isActive).map((campaign) => (
                <Card key={campaign.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <ImageWithFallback
                      src={campaign.image || `https://images.unsplash.com/photo-1557804506-669a67965ba0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbHVtbmklMjBuZXR3b3JraW5nfGVufDF8fHx8MTc1ODk3ODYwOXww&ixlib=rb-4.1.0&q=80&w=400`}
                      alt={campaign.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className={getCategoryColor(campaign.category)}>
                        {campaign.category.charAt(0).toUpperCase() + campaign.category.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">{campaign.title}</CardTitle>
                    <p className="text-sm text-gray-600 line-clamp-3">{campaign.description}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">{formatCurrency(campaign.raised)} raised</span>
                        <span className="text-gray-600">of {formatCurrency(campaign.goal)}</span>
                      </div>
                      <Progress value={getProgressPercentage(campaign.raised, campaign.goal)} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">{campaign.donorCount} donors</p>
                    </div>
                    
                    {campaign.deadline && (
                      <div className="text-sm text-gray-600">
                        Deadline: {new Date(campaign.deadline).toLocaleDateString()}
                      </div>
                    )}
                    
                    <Button
                      onClick={() => {
                        setSelectedCampaign(campaign);
                        setIsDonateModalOpen(true);
                      }}
                      className="w-full"
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Donate Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {campaigns.filter(campaign => campaign.isActive).length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No active campaigns at the moment.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="donors" className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Recent Donations</h2>
              
              {donations.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No donations yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {donations.slice(0, 20).map((donation) => (
                    <Card key={donation.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <Heart className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold">{donation.donorName}</h3>
                                <p className="text-sm text-gray-600">donated to {donation.campaignTitle}</p>
                              </div>
                            </div>
                            {donation.message && (
                              <p className="text-gray-700 text-sm mb-2 ml-13">"{donation.message}"</p>
                            )}
                            <p className="text-xs text-gray-500 ml-13">
                              {new Date(donation.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-600">
                              {formatCurrency(donation.amount)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">My Donation History</h2>
              
              {user ? (
                donations.filter(donation => donation.donorName === (user.name || user.email)).length === 0 ? (
                  <div className="text-center py-12">
                    <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">You haven't made any donations yet.</p>
                    <Button onClick={() => setActiveTab('campaigns')}>
                      View Campaigns
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {donations
                      .filter(donation => donation.donorName === (user.name || user.email))
                      .map((donation) => (
                        <Card key={donation.id}>
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold">{donation.campaignTitle}</h3>
                                <p className="text-sm text-gray-600">
                                  Donated on {new Date(donation.date).toLocaleDateString()}
                                </p>
                                {donation.message && (
                                  <p className="text-sm text-gray-700 mt-1">"{donation.message}"</p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-green-600">
                                  {formatCurrency(donation.amount)}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                )
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Please log in to view your donation history.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Donation Modal */}
        <Dialog open={isDonateModalOpen} onOpenChange={setIsDonateModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Make a Donation</DialogTitle>
            </DialogHeader>
            {selectedCampaign && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="font-semibold">{selectedCampaign.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {formatCurrency(selectedCampaign.raised)} raised of {formatCurrency(selectedCampaign.goal)} goal
                  </p>
                  <Progress 
                    value={getProgressPercentage(selectedCampaign.raised, selectedCampaign.goal)} 
                    className="h-2 mt-2" 
                  />
                </div>
                
                <div>
                  <Label htmlFor="amount">Donation Amount</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="amount"
                      type="number"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      placeholder="0.00"
                      className="pl-10"
                      min="1"
                      step="0.01"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                  {[25, 50, 100, 250].map(amount => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => setDonationAmount(amount.toString())}
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>
                
                <div>
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Textarea
                    id="message"
                    value={donationMessage}
                    onChange={(e) => setDonationMessage(e.target.value)}
                    placeholder="Leave a message of support..."
                    rows={3}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="anonymous" className="text-sm">
                    Make this donation anonymous
                  </Label>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setIsDonateModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleDonate} 
                    disabled={!donationAmount || parseFloat(donationAmount) <= 0}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Donate {donationAmount && formatCurrency(parseFloat(donationAmount))}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}