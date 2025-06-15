import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch('http://localhost:5000/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch profile');
        
        const data = await response.json();
        setProfile({
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || ""
        });
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('http://localhost:5000/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          first_name: profile.firstName,
          last_name: profile.lastName,
          phone: profile.phone,
          address: profile.address
        })
      });
      
      if (!response.ok) throw new Error('Failed to update profile');
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfile(prev => ({ ...prev, [id]: value }));
  };

  if (isLoading) {
    return <div className="p-6">Loading profile...</div>;
  }

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-purple-700">My Profile</CardTitle>
            <CardDescription>
              Manage your personal information and account settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center mb-6">
              <div className="w-24 h-24 bg-purple-500 rounded-full flex items-center justify-center">
                <User className="h-12 w-12 text-white" />
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    value={profile.firstName} 
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    value={profile.lastName} 
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="email" 
                    type="email" 
                    value={profile.email} 
                    className="pl-10"
                    disabled
                  />
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="phone" 
                    type="tel" 
                    value={profile.phone} 
                    onChange={handleChange}
                    className="pl-10" 
                  />
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="address" 
                    value={profile.address} 
                    onChange={handleChange}
                    className="pl-10" 
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  type="submit" 
                  className="bg-purple-500 hover:bg-purple-600"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;