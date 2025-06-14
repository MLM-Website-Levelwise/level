
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple validation
    if (email === "admin@mlm.com" && password === "admin123") {
      localStorage.setItem("isAuthenticated", "true");
      toast({
        title: "Login Successful",
        description: "Welcome to MLM Admin Dashboard",
      });
      navigate("/dashboard");
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-white">MLM</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to your admin dashboard</p>
        </div>

        <Card className="shadow-lg border-purple-200">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-purple-700">Admin Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@mlm.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-purple-200 focus:border-purple-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-purple-200 focus:border-purple-500"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-4 text-sm text-gray-600 text-center">
              <p>Demo credentials:</p>
              <p>Email: admin@mlm.com</p>
              <p>Password: admin123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
