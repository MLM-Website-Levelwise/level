
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Lock, Bell, Shield, Eye } from "lucide-react";

const Settings = () => {
  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-purple-700">Settings</CardTitle>
            <CardDescription>
              Manage your account preferences and security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Password Section */}
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Password & Security
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <Button className="bg-purple-500 hover:bg-purple-600">Update Password</Button>
              </div>
            </div>

            <Separator />

            {/* Notifications Section */}
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-600">Receive notifications via email</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Transaction Alerts</p>
                    <p className="text-sm text-gray-600">Get alerts for new transactions</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">System Updates</p>
                    <p className="text-sm text-gray-600">Updates about system maintenance</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>

            <Separator />

            {/* Privacy Section */}
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Security
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-600">Add an extra layer of security</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Login Activity Tracking</p>
                    <p className="text-sm text-gray-600">Monitor your account access</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
