import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, TrendingUp, Wallet, Target, Gift, Crown, FileText } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [directMembersIncome, setDirectMembersIncome] = useState<number | null>(null);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login");
    }

    // Fetch direct members income data
    const fetchDirectMembersIncome = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          'http://localhost:5000/admin-referred-members',
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch direct members');
        }
        
        const data = await response.json();
        const MEMBERSHIP_PRICE = 6000;
        const ADMIN_COMMISSION_PERCENTAGE = 5;
        const income = (data.members.length * MEMBERSHIP_PRICE * ADMIN_COMMISSION_PERCENTAGE) / 100;
        setDirectMembersIncome(income);
      } catch (error) {
        console.error('Error fetching direct members income:', error);
        setDirectMembersIncome(0);
      }
    };

    fetchDirectMembersIncome();
  }, [navigate]);

  const stats = [
    {
      title: "Today Joining",
      value: "0",
      icon: Users,
      description: "New members today",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Last 7 Days Joining", 
      value: "0",
      icon: Users,
      description: "New members this week",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Total Members",
      value: "29",
      icon: Users,
      description: "All registered members",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Active Members",
      value: "5",
      icon: TrendingUp,
      description: "Currently active members",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Current E-Wallet Balance",
      value: "52,540.00",
      icon: Wallet,
      description: "Total wallet balance",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    {
      title: "Total Sponsor Amount",
      value: "725.00",
      icon: DollarSign,
      description: "Total sponsor earnings",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    },
    {
      title: "Total Matching Amount",
      value: "2625.00",
      icon: Target,
      description: "Total matching bonus",
      color: "text-pink-600",
      bgColor: "bg-pink-50"
    },
    {
      title: "All Direct Members",
      value: directMembersIncome !== null ? directMembersIncome.toFixed(2) : "Loading...",
      icon: Crown,
      description: "Autopool earnings",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      link: "/members/allDir"
    },
    {
      title: "Total Royalty Amount",
      value: "",
      icon: Crown,
      description: "Royalty earnings",
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "Total Cashback Amount",
      value: "964.00",
      icon: Gift,
      description: "Cashback earnings",
      color: "text-teal-600",
      bgColor: "bg-teal-50"
    },
    {
      title: "Total TDS Amount",
      value: "25.80",
      icon: FileText,
      description: "TDS deductions",
      color: "text-gray-600",
      bgColor: "bg-gray-50"
    },
    {
      title: "Payout Balance",
      value: "",
      icon: DollarSign,
      description: "Available payout",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Today Withdraw Request",
      value: "",
      icon: FileText,
      description: "Withdrawal requests today",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome to your MLM admin dashboard</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          stat.link ? (
            <Link to={stat.link} key={index}>
              <Card className="hover:shadow-lg transition-shadow duration-200 border-purple-100 hover:border-purple-300 cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value || "0"}
                  </div>
                  <CardDescription className="text-xs text-gray-500">
                    {stat.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ) : (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200 border-purple-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value || "0"}
                </div>
                <CardDescription className="text-xs text-gray-500">
                  {stat.description}
                </CardDescription>
              </CardContent>
            </Card>
          )
        ))}
      </div>
    </div>
  );
};

export default Dashboard;