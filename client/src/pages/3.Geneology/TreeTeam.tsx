import { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const API_BASE_URL = "http://localhost:5000";

interface TeamMember {
  id: string;
  member_id: string;
  name: string;
  sponsor_code: string;
  sponsor_name: string;
  position: "left" | "right";
  date_of_joining: string;
  active_status: boolean;
}

const TreeWiseTeam = () => {
  const [adminData, setAdminData] = useState<TeamMember | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchId, setSearchId] = useState("");

  const fetchTeamData = async (memberId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to view the tree");
        setLoading(false);
        return;
      }

      // Get member record (either searched ID or logged-in admin)
      const memberResponse = await axios.get(`${API_BASE_URL}/members`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { member_id: memberId || 'ADMIN' }
      });

      const memberData = memberResponse.data.members[0];
      if (!memberData) {
        setError("Member record not found");
        setLoading(false);
        return;
      }

      setAdminData({
        id: memberData.id,
        member_id: memberData.member_id,
        name: memberData.name,
        sponsor_code: memberData.sponsor_code,
        sponsor_name: memberData.sponsor_name,
        position: "left", // Default position
        date_of_joining: memberData.date_of_joining,
        active_status: memberData.active_status
      });

      // Get all members sponsored by this member
      const teamResponse = await axios.get(`${API_BASE_URL}/members`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { sponsor_code: memberData.member_id }
      });

      setTeamMembers(teamResponse.data.members.map((member: any) => ({
        id: member.id,
        member_id: member.member_id,
        name: member.name,
        sponsor_code: member.sponsor_code,
        sponsor_name: member.sponsor_name,
        position: member.position?.toLowerCase() as "left" | "right",
        date_of_joining: member.date_of_joining,
        active_status: member.active_status
      })));
    } catch (err: any) {
      setError("Failed to fetch data: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      fetchTeamData(searchId);
    }
  };

  const MemberCard = ({ member, isAdmin = false }: { member: TeamMember; isAdmin?: boolean }) => {
    const bgColor = isAdmin ? "bg-purple-600" : member.position === "left" ? "bg-blue-500" : "bg-green-500";
    const statusColor = member.active_status ? "bg-green-500" : "bg-red-500";

    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="flex flex-col items-center cursor-pointer p-4 relative">
            <div className={`w-4 h-4 rounded-full ${statusColor} absolute top-2 right-2`}></div>
            <div className={`w-16 h-16 rounded-full ${bgColor} flex items-center justify-center mb-2`}>
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <div className="font-medium text-sm">{member.member_id}</div>
              <div className="text-xs text-gray-600">{member.name}</div>
              {!isAdmin && <div className="text-xs text-gray-500 capitalize">{member.position}</div>}
            </div>
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="grid gap-2">
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">{member.name}</h4>
              <p className="text-sm">ID: {member.member_id}</p>
              <p className="text-sm">Sponsor: {member.sponsor_name} ({member.sponsor_code})</p>
              <p className="text-sm">Joined: {new Date(member.date_of_joining).toLocaleDateString()}</p>
              <p className="text-sm">Status: 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${member.active_status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {member.active_status ? 'Active' : 'Inactive'}
                </span>
              </p>
              {!isAdmin && <p className="text-sm capitalize">Position: {member.position}</p>}
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  };

  const EmptySlot = ({ position }: { position: "left" | "right" }) => (
    <div className="flex flex-col items-center p-4 opacity-50">
      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
        <User className="w-8 h-8 text-gray-400" />
      </div>
      <div className="text-center mt-2">
        <div className="text-xs text-gray-500">Empty {position} slot</div>
      </div>
    </div>
  );

  return (
    <Card>
      <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white px-4 py-3 rounded-t">
        <h2 className="text-xl font-bold">Team Structure</h2>
      </div>
      <div className="p-6">
        {/* Search Form */}
        <form onSubmit={handleSubmit} className="flex items-center border border-gray-300 rounded-md overflow-hidden w-fit mb-6">
          <div className="bg-gray-100 px-4 py-2 text-gray-700 text-sm font-medium">
            Search Member ID
          </div>
          <Input
            placeholder="Enter member ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-48 border-none focus:ring-0 rounded-none"
          />
          <Button
            type="submit"
            className="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-md"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </Button>
        </form>

        {error && <div className="text-red-500 mb-4">{error}</div>}
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : adminData ? (
          <div className="bg-white p-8 rounded-lg border border-gray-200">
            <div className="flex flex-col items-center">
              {/* Only show ADMIN at center - no duplicate Avradeep */}
              <div className="mb-8 scale-110 relative">
                <MemberCard member={adminData} isAdmin />
                <div className="text-center mt-2 text-sm font-medium bg-purple-100 text-purple-800 px-2 py-1 rounded-md">
                  ADMIN
                </div>
              </div>
              
              {/* Connection lines */}
              <div className="relative w-full">
                <div className="absolute left-1/2 top-0 h-8 w-px bg-gray-300 transform -translate-x-1/2"></div>
                <div className="absolute left-1/4 right-1/4 top-8 h-px bg-gray-300"></div>
                <div className="absolute left-1/4 top-8 h-8 w-px bg-gray-300 transform -translate-x-1/2"></div>
                <div className="absolute right-1/4 top-8 h-8 w-px bg-gray-300 transform translate-x-1/2"></div>
              </div>

              {/* Team members below */}
              <div className="flex justify-center gap-16 mt-8 w-full">
                {/* Left team column */}
                <div className="flex flex-col items-center flex-1 max-w-xs">
                  <h3 className="text-sm font-medium mb-4 p-2 bg-blue-100 text-blue-800 rounded-md w-full text-center">
                    Left Team
                  </h3>
                  <div className="space-y-4 w-full">
                    {teamMembers.filter(m => m.position === "left").length > 0 ? (
                      teamMembers
                        .filter(m => m.position === "left")
                        .map(member => (
                          <MemberCard key={member.member_id} member={member} />
                        ))
                    ) : (
                      <EmptySlot position="left" />
                    )}
                  </div>
                </div>
                
                {/* Right team column */}
                <div className="flex flex-col items-center flex-1 max-w-xs">
                  <h3 className="text-sm font-medium mb-4 p-2 bg-green-100 text-green-800 rounded-md w-full text-center">
                    Right Team
                  </h3>
                  <div className="space-y-4 w-full">
                    {teamMembers.filter(m => m.position === "right").length > 0 ? (
                      teamMembers
                        .filter(m => m.position === "right")
                        .map(member => (
                          <MemberCard key={member.member_id} member={member} />
                        ))
                    ) : (
                      <EmptySlot position="right" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">No team data available</div>
        )}
      </div>
    </Card>
  );
};

export default TreeWiseTeam;