import { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, ChevronLeft } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface TeamMember {
  id: number;
  member_id: string;
  name: string;
  sponsor_code: string;
  sponsor_name: string;
  position: "Left" | "Right" | "Center";
  date_of_joining: string;
  active_status: boolean;
  children?: TeamMember[];
  level?: number;
}

const MLMBinaryTree = () => {
  const [rootMember, setRootMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchId, setSearchId] = useState("");
  const [treeDepth, setTreeDepth] = useState(3);
  const [hasSearched, setHasSearched] = useState(false);
  const [memberHistory, setMemberHistory] = useState<{member: TeamMember, depth: number}[]>([]);

  const fetchTeamData = async (memberId: string, depth?: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/binary-team-by-member/${memberId}`, {
        params: { levels: depth || treeDepth }
      });

      const teamData = response.data;
      if (!teamData) throw new Error("No team data received");

      setRootMember(teamData);
      setHasSearched(true);
      
      // Add to history if it's a new search or a click on a different member
      if (!memberHistory.length || memberHistory[memberHistory.length - 1].member.member_id !== memberId) {
        setMemberHistory(prev => [...prev, {member: teamData, depth: depth || treeDepth}]);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      setMemberHistory([]); // Clear history on new search
      fetchTeamData(searchId);
    }
  };

  const handleReset = () => {
    setSearchId("");
    setRootMember(null);
    setHasSearched(false);
    setError(null);
    setMemberHistory([]);
  };

  const handleMemberClick = (memberId: string) => {
    fetchTeamData(memberId);
  };

  const handleBackClick = (index?: number) => {
    if (memberHistory.length <= 1) return;
    
    if (index !== undefined) {
      // Go back to specific point in history
      const newHistory = memberHistory.slice(0, index + 1);
      setMemberHistory(newHistory);
      setRootMember(newHistory[newHistory.length - 1].member);
      setTreeDepth(newHistory[newHistory.length - 1].depth);
    } else {
      // Go back one step
      const newHistory = [...memberHistory];
      newHistory.pop();
      setMemberHistory(newHistory);
      
      if (newHistory.length > 0) {
        setRootMember(newHistory[newHistory.length - 1].member);
        setTreeDepth(newHistory[newHistory.length - 1].depth);
      } else {
        setRootMember(null);
      }
    }
  };

  const MemberNode = ({ 
    member, 
    isRoot = false,
    onClick 
  }: { 
    member: TeamMember; 
    isRoot?: boolean;
    onClick: (memberId: string) => void;
  }) => {
    const bgColor = isRoot ? "bg-purple-600" : member.position === "Left" ? "bg-blue-500" : "bg-green-500";
    const statusColor = member.active_status ? "bg-green-500" : "bg-red-500";

    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <div 
            className="flex flex-col items-center cursor-pointer p-2 relative group"
            onClick={() => onClick(member.member_id)}
          >
            <div className={`w-3 h-3 rounded-full ${statusColor} absolute top-1 right-1`}></div>
            <div className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center mb-1 transition-all group-hover:scale-110`}>
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="text-center">
              <div className="font-medium text-xs">{member.member_id}</div>
              <div className="text-xs text-gray-600 truncate w-16">{member.name}</div>
              <div className="text-xs text-gray-400">Lvl {member.level}</div>
            </div>
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="space-y-2">
            <h4 className="font-semibold">{member.name}</h4>
            <p>ID: {member.member_id}</p>
            {member.sponsor_code && (
              <p>Sponsor: {member.sponsor_name} ({member.sponsor_code})</p>
            )}
            <p>Position: {member.position}</p>
            <p>Joined: {new Date(member.date_of_joining).toLocaleDateString()}</p>
            <p>Status: <span className={`px-2 py-1 rounded-full text-xs ${
              member.active_status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {member.active_status ? 'Active' : 'Inactive'}
            </span></p>
            <Button 
              size="sm" 
              className="mt-2 w-full"
              onClick={(e) => {
                e.stopPropagation();
                onClick(member.member_id);
              }}
            >
              View Team Structure
            </Button>
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  };

  const renderTree = (node: TeamMember | null, currentDepth = 1): JSX.Element => {
    if (!node || currentDepth > treeDepth) return <></>;

    const leftChild = node.children?.find(c => c.position === "Left");
    const rightChild = node.children?.find(c => c.position === "Right");

    return (
      <div className="flex flex-col items-center space-y-4">
        <MemberNode 
          member={node} 
          isRoot={currentDepth === 1}
          onClick={handleMemberClick}
        />
        
        {(leftChild || rightChild) && (
          <div className="flex justify-center space-x-8 mt-2">
            {/* Left branch */}
            <div className="flex flex-col items-center">
              {leftChild ? (
                <>
                  <div className="h-6 w-px bg-gray-300"></div>
                  {renderTree(leftChild, currentDepth + 1)}
                </>
              ) : currentDepth < treeDepth && (
                <div 
                  className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => {}}
                >
                  <User className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>
            
            {/* Right branch */}
            <div className="flex flex-col items-center">
              {rightChild ? (
                <>
                  <div className="h-6 w-px bg-gray-300"></div>
                  {renderTree(rightChild, currentDepth + 1)}
                </>
              ) : currentDepth < treeDepth && (
                <div 
                  className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => {}}
                >
                  <User className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="min-h-screen">
      <div className="bg-gray-800 text-white p-4 rounded-t-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {memberHistory.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleBackClick()}
                className="text-white hover:bg-gray-700"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            )}
            <h1 className="text-xl font-bold">MLM Binary Team Structure</h1>
          </div>
          
          {memberHistory.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-300">Viewing:</span>
              <span className="font-medium">{rootMember?.name} ({rootMember?.member_id})</span>
            </div>
          )}
        </div>
        
        {/* Breadcrumb navigation */}
        {memberHistory.length > 1 && (
          <div className="flex items-center gap-2 mt-2 overflow-x-auto py-2">
            {memberHistory.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                {index > 0 && <span className="text-gray-400">/</span>}
                <button
                  onClick={() => handleBackClick(index)}
                  className={`text-sm ${index === memberHistory.length - 1 ? 'font-bold text-white' : 'text-gray-300 hover:text-white'}`}
                >
                  {item.member.name} ({item.member.member_id})
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <Input
              placeholder="Enter member ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-48"
            />
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Search
            </Button>
            {hasSearched && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleReset}
              >
                Reset
              </Button>
            )}
          </form>
          
          {hasSearched && (
            <div className="flex items-center gap-2">
              <span className="text-sm">Tree Depth:</span>
              <select 
                value={treeDepth}
                onChange={(e) => {
                  const newDepth = Number(e.target.value);
                  setTreeDepth(newDepth);
                  if (rootMember) {
                    fetchTeamData(rootMember.member_id, newDepth);
                  }
                }}
                className="border rounded px-2 py-1 text-sm"
              >
                {[2, 3, 4, 5, 6].map(depth => (
                  <option key={depth} value={depth}>{depth}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800"></div>
          </div>
        ) : hasSearched ? (
          rootMember ? (
            <div className="overflow-auto p-4 bg-white rounded-lg border">
              <div className="min-w-max mx-auto">
                {renderTree(rootMember)}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No team data available for this member
            </div>
          )
        ) : (
          <div className="text-center py-12 text-gray-500">
            Enter a member ID to view their team structure
          </div>
        )}
      </div>
    </Card>
  );
};

export default MLMBinaryTree;