import { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

const API_BASE_URL = "http://localhost:5000";

interface TeamMember {
  id: number;
  member_id: string;
  name: string;
  sponsor_code: string;
  sponsor_name: string;
  position: "Left" | "Right";
  date_of_joining: string;
  active_status: boolean;
  left?: TeamMember | null;
  right?: TeamMember | null;
  level?: number;
}

const MLMBinaryTree = () => {
  const [rootMember, setRootMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchId, setSearchId] = useState("");
  const [treeDepth, setTreeDepth] = useState(4);

  // Build MLM tree from sponsor relationships
  const buildMLMTree = (members: TeamMember[], rootId: string): TeamMember | null => {
    const memberMap = new Map<string, TeamMember>();
    
    // Create virtual admin node if needed
    if (rootId === '100001' && !members.some(m => m.member_id === '100001')) {
      memberMap.set('100001', {
        id: 0,
        member_id: '100001',
        name: 'Admin',
        sponsor_code: '',
        sponsor_name: 'System',
        position: 'Left',
        date_of_joining: new Date().toISOString(),
        active_status: true,
        left: null,
        right: null,
        level: 1
      });
    }

    // Create all nodes from API data
    members.forEach(member => {
      memberMap.set(member.member_id, { 
        ...member, 
        left: null, 
        right: null,
        level: 0
      });
    });

    // Build tree relationships
    members.forEach(member => {
      const parent = memberMap.get(member.sponsor_code);
      if (parent) {
        if (member.position === "Left") {
          parent.left = memberMap.get(member.member_id) || null;
        } else {
          parent.right = memberMap.get(member.member_id) || null;
        }
      }
    });

    // Calculate levels starting from root
    const calculateLevels = (node: TeamMember | null, level: number) => {
      if (!node) return;
      node.level = level;
      calculateLevels(node.left, level + 1);
      calculateLevels(node.right, level + 1);
    };

    const root = memberMap.get(rootId);
    if (root) {
      calculateLevels(root, 1);
      return root;
    }
    return null;
  };

  const fetchTeamData = async (memberId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required");

      // Get all members
      const response = await axios.get(`${API_BASE_URL}/members`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 1000 }
      });

      const allMembers = response.data.members;
      const rootId = memberId || '100001'; // Default to admin

      // Check if searched member exists (except for admin)
      if (rootId !== '100001' && !allMembers.some(m => m.member_id === rootId)) {
        throw new Error(`Member ${rootId} not found in database`);
      }

      // Build the tree structure
      const tree = buildMLMTree(allMembers, rootId);
      if (!tree) throw new Error("Failed to build team structure");
      
      setRootMember(tree);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) fetchTeamData(searchId);
  };

  const MemberNode = ({ member, isRoot = false }: { member: TeamMember; isRoot?: boolean }) => {
    const bgColor = isRoot ? "bg-purple-600" : member.position === "Left" ? "bg-blue-500" : "bg-green-500";
    const statusColor = member.active_status ? "bg-green-500" : "bg-red-500";

    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="flex flex-col items-center cursor-pointer p-2 relative">
            <div className={`w-3 h-3 rounded-full ${statusColor} absolute top-1 right-1`}></div>
            <div className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center mb-1`}>
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
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  };

  const renderTree = (node: TeamMember | null, currentDepth: number): JSX.Element => {
    if (!node || currentDepth > treeDepth) return <></>;

    return (
      <div className="flex flex-col items-center space-y-4">
        <MemberNode member={node} isRoot={currentDepth === 1} />
        
        {(node.left || node.right) && (
          <div className="flex justify-center space-x-8 mt-2">
            {/* Left branch */}
            <div className="flex flex-col items-center">
              {node.left ? (
                <>
                  <div className="h-6 w-px bg-gray-300"></div>
                  {renderTree(node.left, currentDepth + 1)}
                </>
              ) : currentDepth < treeDepth && (
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>
            
            {/* Right branch */}
            <div className="flex flex-col items-center">
              {node.right ? (
                <>
                  <div className="h-6 w-px bg-gray-300"></div>
                  {renderTree(node.right, currentDepth + 1)}
                </>
              ) : currentDepth < treeDepth && (
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
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
        <h1 className="text-xl font-bold">MLM Binary Team Structure</h1>
      </div>
      
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex items-center border rounded-md overflow-hidden">
            <Input
              placeholder="Enter member ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-48 border-none focus:ring-0"
            />
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 rounded-none">
              Search
            </Button>
          </form>
          
          <div className="flex items-center gap-2">
            <span className="text-sm">Tree Depth:</span>
            <select 
              value={treeDepth}
              onChange={(e) => setTreeDepth(Number(e.target.value))}
              className="border rounded px-2 py-1 text-sm"
            >
              {[2, 3, 4, 5, 6].map(depth => (
                <option key={depth} value={depth}>{depth}</option>
              ))}
            </select>
          </div>
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800"></div>
          </div>
        ) : rootMember ? (
          <div className="overflow-auto p-4 bg-white rounded-lg border">
            <div className="min-w-max mx-auto">
              {renderTree(rootMember, 1)}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No team data available
          </div>
        )}
      </div>
    </Card>
  );
};

export default MLMBinaryTree;