import { useState, useEffect } from "react";
import { FileSpreadsheet, FileText, Printer, Search } from "lucide-react";
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
  profit_sharing?: number;
  bonus?: number;
  topup_amount?: number;
  total_business?: number;
}

const LevelTeam = () => {
  const { toast } = useToast();
  const [teamData, setTeamData] = useState({
    currentMember: null as Member | null,
    teamMembers: [] as Member[],
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    levelNo: "All",
  });
  const [entriesPerPage, setEntriesPerPage] = useState(20);
  const [exportFormat, setExportFormat] = useState("All");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchTeamByMember = async (memberId: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_BASE_URL}/level-team-by-member/${memberId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Member ${memberId} not found or server error`);
      }
      
      const data = await response.json();
      
      if (!data.teamMembers || data.teamMembers.length === 0) {
        toast({
          title: "Info",
          description: `No team members found for ${memberId}`,
        });
      }
      
      setTeamData(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setTeamData({
        currentMember: null,
        teamMembers: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      fetchTeamByMember(searchTerm.trim());
    } else {
      toast({
        title: "Info",
        description: "Please enter a member ID to search",
      });
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    // Filtering is done on the already loaded data
  };

  const handleExport = (format: string) => {
    console.log(`Exporting data in ${format} format`);
    toast({
      title: "Export",
      description: `Data exported in ${format} format`,
    });
  };

  // Combine current member with team members for display
  const allTeamData = teamData.currentMember
    ? [
        {
          ...teamData.currentMember,
          doj: teamData.currentMember.date_of_joining,
          status: 'Active',
        },
        ...teamData.teamMembers,
      ]
    : [];

  // Apply filters
  let filteredData = allTeamData;

  if (filters.dateFrom) {
    filteredData = filteredData.filter((item) => {
      const itemDate = new Date(item.date_of_joining);
      const fromDate = new Date(filters.dateFrom);
      return itemDate >= fromDate;
    });
  }

  if (filters.dateTo) {
    filteredData = filteredData.filter((item) => {
      const itemDate = new Date(item.date_of_joining);
      const toDate = new Date(filters.dateTo);
      return itemDate <= toDate;
    });
  }

  if (filters.levelNo !== "All") {
    filteredData = filteredData.filter(
      (item) => item.level === parseInt(filters.levelNo)
    );
  }

  if (exportFormat !== "All") {
    filteredData = filteredData.filter(
      (item) => item.active_status === (exportFormat === "Active")
    );
  }

  // Calculate totals
  const totalProfitSharing = filteredData.reduce((sum, member) => sum + (member.profit_sharing || 0), 0);
  const totalBonus = filteredData.reduce((sum, member) => sum + (member.bonus || 0), 0);
  const totalTopup = filteredData.reduce((sum, member) => sum + (member.topup_amount || 0), 0);
  const totalBusiness = filteredData.reduce((sum, member) => sum + (member.total_business || 0), 0);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
          <h1 className="text-xl font-semibold">
            List of Levelwise Team Member(s)
          </h1>
        </div>

        {/* Search Section */}
        <div className="bg-white p-6 border-l border-r border-gray-200">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search by Member ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter member ID (e.g. PW001)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            <button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        {teamData.currentMember && (
          <div className="bg-white p-4 border-l border-r border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <h3 className="text-sm font-medium text-green-800">Profit Sharing</h3>
              <p className="text-2xl font-bold text-green-600">₹{totalProfitSharing.toFixed(2)}</p>
            </div>
            {/* <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="text-sm font-medium text-blue-800">Bonus</h3>
              <p className="text-2xl font-bold text-blue-600">₹{totalBonus.toFixed(2)}</p>
            </div> */}
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <h3 className="text-sm font-medium text-purple-800">Topup Amount</h3>
              <p className="text-2xl font-bold text-purple-600">₹{totalTopup.toFixed(2)}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
              <h3 className="text-sm font-medium text-orange-800">Total Business</h3>
              <p className="text-2xl font-bold text-orange-600">₹{totalBusiness.toFixed(2)}</p>
            </div>
          </div>
        )}

        {/* Filter Section - Only shown after search */}
        {teamData.currentMember && (
          <>
            <div className="bg-white p-6 border-l border-r border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
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
                    <option value="0">0 (Root)</option>
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
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Results Header */}
            <div className="bg-white px-6 py-4 border-l border-r border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <span className="text-gray-700 font-medium">
                    Showing team for: {teamData.currentMember.name} ({teamData.currentMember.member_id})
                  </span>
                  <span className="ml-4 text-gray-700 font-medium">
                    Total Members: {filteredData.length}
                  </span>
                </div>

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
                    onChange={(e) => setExportFormat(e.target.value)}
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
                      <th className="px-4 py-3 text-left text-sm font-medium">Sl No</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">DOJ</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Member Id</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Member Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Sponsor Code</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Sponsor Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Level</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Profit Sharing</th>
                      {/* <th className="px-4 py-3 text-left text-sm font-medium">Bonus</th> */}
                      <th className="px-4 py-3 text-left text-sm font-medium">Topup</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Total Business</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.slice(0, entriesPerPage).map((member, index) => (
                      <tr key={member.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{index + 1}.</td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {new Date(member.date_of_joining).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{member.member_id}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{member.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{member.sponsor_code}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{member.sponsor_name}</td>
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
                        <td className="px-4 py-3 text-sm text-gray-900">{member.level}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">₹{member.profit_sharing?.toFixed(2) || '0.00'}</td>
                        {/* <td className="px-4 py-3 text-sm text-gray-900">₹{member.bonus?.toFixed(2) || '0.00'}</td> */}
                        <td className="px-4 py-3 text-sm text-gray-900">₹{member.topup_amount?.toFixed(2) || '0.00'}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">₹{member.total_business?.toFixed(2) || '0.00'}</td>
                      </tr>
                    ))}
                    {/* Totals Row */}
                    <tr className="bg-gray-50 font-medium">
                      <td colSpan={8} className="px-4 py-3 text-sm text-gray-900 text-right">Totals:</td>
                      <td className="px-4 py-3 text-sm text-gray-900">₹{totalProfitSharing.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">₹{totalBonus.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">₹{totalTopup.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">₹{totalBusiness.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && !teamData.currentMember && (
          <div className="bg-white p-8 text-center border border-gray-200 rounded-b-lg">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Search for a member
            </h3>
            <p className="text-gray-500">
              Enter a member ID in the search box above to view their level-wise team
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LevelTeam;