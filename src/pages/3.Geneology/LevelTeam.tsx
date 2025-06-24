import { useState, useEffect } from "react";
import { FileSpreadsheet, FileText, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Member {
  id: number;
  member_id: string;
  name: string;
  sponsor_code: string;
  sponsor_name: string;
  date_of_joining: string;
  active_status: boolean;
  level?: number;
}

const LevelTeam = () => {
  const { toast } = useToast();
  const [allTeamData, setAllTeamData] = useState<Member[]>([]);
  const [filteredData, setFilteredData] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    memberCode: "",
    dateFrom: "",
    dateTo: "",
    levelNo: "All",
  });
  const [entriesPerPage, setEntriesPerPage] = useState(20);
  const [exportFormat, setExportFormat] = useState("All");

  // Fetch members and calculate levels
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(
          'http://localhost:5000/members',
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch members');
        }
        
        const data = await response.json();
        const membersWithLevels = calculateLevels(data.members);
        setAllTeamData(membersWithLevels);
        setFilteredData(membersWithLevels);
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // Calculate levels for each member
  // Update the calculateLevels function in the LevelTeam component
// Modified calculateLevels function to accept an optional rootMemberId
const calculateLevels = (members: Member[], rootMemberId?: string): Member[] => {
  const memberMap = new Map<string, Member & { level?: number }>();
  members.forEach(member => {
    memberMap.set(member.member_id, { ...member });
  });

  const getLevel = (memberId: string): number => {
    const member = memberMap.get(memberId);
    if (!member) return 0;
    
    if (member.level !== undefined) return member.level;
    
    // If this is the root member we're searching for, level is 1
    if (rootMemberId && memberId === rootMemberId) {
      member.level = 1;
      return 1;
    }
    
    // If sponsored by admin (and no root member specified), level is 1
    if (!rootMemberId && 
        (member.sponsor_name.toLowerCase().includes('admin') || 
         member.sponsor_code.toLowerCase().includes('admin'))) {
      member.level = 1;
      return 1;
    }
    
    // If sponsor not found, level is 0 (orphaned)
    const sponsor = memberMap.get(member.sponsor_code);
    if (!sponsor) {
      member.level = 0;
      return 0;
    }
    
    // Otherwise, level is sponsor's level + 1
    const sponsorLevel = getLevel(member.sponsor_code);
    member.level = sponsorLevel > 0 ? sponsorLevel + 1 : 0;
    return member.level;
  };

  members.forEach(member => {
    if (member.level === undefined) {
      member.level = getLevel(member.member_id);
    }
  });

  // If we're searching by a root member, only return their downline (level > 0)
  if (rootMemberId) {
    return members
      .filter(member => member.level && member.level > 0)
      .map(member => ({
        ...member,
        level: member.level || 0
      }));
  }

  return members.map(member => ({
    ...member,
    level: member.level || 0
  }));
};
const calculatePureDownline = (members: Member[], sponsorId: string): Member[] => {
  const memberMap = new Map<string, Member>();
  members.forEach(member => {
    memberMap.set(member.member_id, { ...member });
  });

  // Verify sponsor exists (but don't include them in results)
  if (!memberMap.has(sponsorId)) return [];

  const downlineMembers: Member[] = [];
  const queue: { memberId: string; level: number }[] = [];
  
  // Start with direct referrals (level 1)
  const directReferrals = members.filter(m => m.sponsor_code === sponsorId);
  directReferrals.forEach(ref => {
    queue.push({ memberId: ref.member_id, level: 1 });
  });

  // Breadth-first search for indirect referrals
  while (queue.length > 0) {
    const current = queue.shift()!;
    const member = memberMap.get(current.memberId);
    
    if (member) {
      downlineMembers.push({
        ...member,
        level: current.level
      });

      // Find referrals of this member
      const referrals = members.filter(m => m.sponsor_code === current.memberId);
      referrals.forEach(ref => {
        queue.push({ memberId: ref.member_id, level: current.level + 1 });
      });
    }
  }

  return downlineMembers;
};

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Modified handleSubmit function
// Modified handleSubmit function
const handleSubmit = () => {
  let filtered: Member[] = [];

  if (filters.memberCode.trim()) {
    // Search mode - show only downline of specified member
    filtered = calculatePureDownline(allTeamData, filters.memberCode);
  } else {
    // Default mode - show all with admin as root
    filtered = calculateLevels(allTeamData)
      .filter(m => !m.sponsor_name.toLowerCase().includes('admin'));
  }

  // Apply other filters (date, level, status)
  if (filters.dateFrom) {
    filtered = filtered.filter(item => {
      const itemDate = new Date(item.date_of_joining);
      const fromDate = new Date(filters.dateFrom);
      return itemDate >= fromDate;
    });
  }

  if (filters.dateTo) {
    filtered = filtered.filter(item => {
      const itemDate = new Date(item.date_of_joining);
      const toDate = new Date(filters.dateTo);
      return itemDate <= toDate;
    });
  }

  if (filters.levelNo !== "All") {
    filtered = filtered.filter(
      item => item.level === parseInt(filters.levelNo)
    );
  }

  if (exportFormat !== "All") {
    filtered = filtered.filter(
      item => item.active_status === (exportFormat === "Active")
    );
  }

  setFilteredData(filtered);
};

  const handleExport = (format: string) => {
    console.log(`Exporting data in ${format} format`);
    // Implement actual export functionality here
    toast({
      title: "Export",
      description: `Data exported in ${format} format`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading team data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
          <h1 className="text-xl font-semibold">
            List of Levelwise Team Member(s)
          </h1>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-6 border-l border-r border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Member Code/Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter member code or name"
                value={filters.memberCode}
                onChange={(e) =>
                  handleFilterChange("memberCode", e.target.value)
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date From
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange("dateTo", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Level No
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.levelNo}
                onChange={(e) => handleFilterChange("levelNo", e.target.value)}
              >
                <option value="All">All</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
            </div>

            <div>
              <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="bg-white px-6 py-4 border-l border-r border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Total Member Count */}
            <div>
              <span className="text-gray-700 font-medium">
                Total Team Member ({filteredData.length})
              </span>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-2 sm:justify-end">
              <button
                onClick={() => handleExport("excel")}
                className="bg-green-600 hover:bg-green-700 text-white p-2 rounded"
                title="Export to Excel"
              >
                <FileSpreadsheet size={16} />
              </button>

              <button
                onClick={() => handleExport("pdf")}
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded"
                title="Export to PDF"
              >
                <FileText size={16} />
              </button>

              <button
                onClick={() => handleExport("print")}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
                title="Print"
              >
                <Printer size={16} />
              </button>

              <select
                className="px-3 py-1 border border-gray-300 rounded"
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(parseInt(e.target.value))}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>

              <select
                className="px-3 py-1 border border-gray-300 rounded"
                value={exportFormat}
                onChange={(e) => {
                  setExportFormat(e.target.value);
                  handleSubmit();
                }}
              >
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="InActive">InActive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-b-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Sl No
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    DOJ
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Member Id
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Member Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Sponsor Code
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Sponsor Name
                  </th>
                  
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Level
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.slice(0, entriesPerPage).map((member, index) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {index + 1}.
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {new Date(member.date_of_joining).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {member.member_id}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {member.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {member.sponsor_code}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {member.sponsor_name}
                    </td>
                    
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          member.active_status
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {member.active_status ? "Active" : "InActive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {member.level}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelTeam;