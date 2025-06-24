import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, TrendingUp, Crown, DollarSign, UserCheck } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [directMembersIncome, setDirectMembersIncome] = useState<number | null>(
    null
  );

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login");
    }

    const fetchDirectMembersIncome = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5000/admin-referred-members",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch direct members");
        }

        const data = await response.json();
        const MEMBERSHIP_PRICE = 6000;
        const ADMIN_COMMISSION_PERCENTAGE = 5;
        const income =
          (data.members.length *
            MEMBERSHIP_PRICE *
            ADMIN_COMMISSION_PERCENTAGE) /
          100;
        setDirectMembersIncome(income);
      } catch (error) {
        console.error("Error fetching direct members income:", error);
        setDirectMembersIncome(0);
      }
    };

    fetchDirectMembersIncome();
  }, [navigate]);

  const cards = [
    {
      title: "Today's Joining",
      value: "0",
      icon: Users,
      bg: "bg-gradient-to-r from-blue-500 to-blue-700",
    },
    {
      title: "Total Members",
      value: "0",
      icon: Users,
      bg: "bg-gradient-to-r from-purple-500 to-purple-700",
    },
    {
      title: "Active ID",
      value: "0",
      icon: TrendingUp,
      bg: "bg-gradient-to-r from-green-500 to-green-700",
    },
    {
      title: "All Direct Members",
      value:
        directMembersIncome !== null
          ? directMembersIncome.toFixed(2)
          : "Loading...",
      icon: Crown,
      bg: "bg-gradient-to-r from-yellow-500 to-yellow-700",
      link: "/members/allDir",
    },
    {
      title: "Total Fund Generated",
      value:
        directMembersIncome !== null
          ? (directMembersIncome * 20).toFixed(2)
          : "Loading...",
      icon: DollarSign,
      bg: "bg-gradient-to-r from-pink-500 to-pink-700",
    },
  ];

  return (
    <div className="p-6 space-y-6 bg-white min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return card.link ? (
            <Link to={card.link} key={index}>
              <Card
                className={`text-white ${card.bg} shadow-lg hover:shadow-xl transition-shadow duration-300`}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-md font-medium">
                    {card.title}
                  </CardTitle>
                  <div className="p-2 rounded-full bg-white/20">
                    <Icon className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-1">{card.value}</div>
                  <CardDescription className="text-xs text-white/80">
                    {card.title}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ) : (
            <Card
              key={index}
              className={`text-white ${card.bg} shadow-lg hover:shadow-xl transition-shadow duration-300`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-md font-medium">
                  {card.title}
                </CardTitle>
                <div className="p-2 rounded-full bg-white/20">
                  <Icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">{card.value}</div>
                <CardDescription className="text-xs text-white/80">
                  {card.title}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;