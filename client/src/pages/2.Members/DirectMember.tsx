import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Filter,
  Download,
  FileText,
  Calendar,
  User,
  UserCheck,
  DollarSign
} from "lucide-react";

interface Member {
  id: number;
  sponsor_id: string;
  sponsor_name: string;
  member_id: string;
  name: string;
  position: "Left" | "Right";
  date_of_joining: string;
  status: boolean;
  package: string;
}

interface ApiResponse {
  members: Member[];
  total: number;
}

const DirectMember: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalMembers, setTotalMembers] = useState(0);

  // Filter states
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    sponsorId: "",
    status: "",
  });

  // Constants for income calculation
  const MEMBERSHIP_PRICE = 6000;
  const ADMIN_COMMISSION_PERCENTAGE = 5;

  // Calculate income for each member
  const calculateIncome = () => {
    return (MEMBERSHIP_PRICE * ADMIN_COMMISSION_PERCENTAGE) / 100;
  };

  // Fetch members from API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `http://localhost:5000/direct-members?page=${currentPage}&limit=${itemsPerPage}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch members');
        }
        
        const data: ApiResponse = await response.json();
        setMembers(data.members);
        setTotalMembers(data.total);
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
  }, [currentPage, itemsPerPage, toast]);

  // Filter logic
  const filteredMembers = members.filter((member) => {
    const matchesDateFrom =
      !filters.dateFrom || member.date_of_joining >= filters.dateFrom;
    const matchesDateTo =
      !filters.dateTo || member.date_of_joining <= filters.dateTo;
    const matchesSponsorId =
      !filters.sponsorId ||
      member.sponsor_id.toLowerCase().includes(filters.sponsorId.toLowerCase());
    const matchesStatus = 
      filters.status === "" || 
      (filters.status === "Active" && member.status) || 
      (filters.status === "Inactive" && !member.status);

    return (
      matchesDateFrom && matchesDateTo && matchesSponsorId && matchesStatus
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(totalMembers / itemsPerPage);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      dateFrom: "",
      dateTo: "",
      sponsorId: "",
      status: "",
    });
    setCurrentPage(1);
  };

  const handleExport = (type: "excel" | "pdf") => {
    alert(`Exporting to ${type.toUpperCase()}...`);
  };

  // Get unique sponsor IDs for filter dropdown
  const uniqueSponsorIds = [
    ...new Set(members.map((member) => member.sponsor_id)),
  ].sort();

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Direct Member List
          </h1>

          {/* Top Controls */}
          <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
            {/* Stats */}
            <div className="flex gap-6 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <span className="text-gray-600">Total Members: </span>
                <span className="font-semibold text-blue-600">
                  {totalMembers}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-green-600" />
                <span className="text-gray-600">Active: </span>
                <span className="font-semibold text-green-600">
                  {members.filter((m) => m.status).length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-purple-600" />
                <span className="text-gray-600">Total Income: </span>
                <span className="font-semibold text-purple-600">
                  ₹{(members.length * calculateIncome()).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => handleExport("excel")}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Excel
              </button>
              <button
                onClick={() => handleExport("pdf")}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                PDF
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
            </div>
          </div>

          {/* Items per page */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-gray-600">Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-600">entries</span>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Date From
                  </label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) =>
                      handleFilterChange("dateFrom", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Date To
                  </label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) =>
                      handleFilterChange("dateTo", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <User className="inline w-4 h-4 mr-1" />
                    Sponsor ID
                  </label>
                  <select
                    value={filters.sponsorId}
                    onChange={(e) =>
                      handleFilterChange("sponsorId", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Sponsors</option>
                    {uniqueSponsorIds.map((sponsorId) => (
                      <option key={sponsorId} value={sponsorId}>
                        {sponsorId}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <UserCheck className="inline w-4 h-4 mr-1" />
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={clearFilters}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  Clear Filters
                </button>
                <div className="text-sm text-gray-600 flex items-center">
                  Showing {filteredMembers.length} of {totalMembers} members
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Sl No.
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Sponsor ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Sponsor Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Member ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Member Name
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium">
                  Position
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Date of Joining
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium">
                  Status
                </th>
                {/* <th className="px-4 py-3 text-center text-sm font-medium">
                  Income (₹)
                </th> */}
              </tr>
            </thead>
            <tbody>
              {filteredMembers.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No members found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member, index) => (
                  <tr
                    key={member.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-4 py-3 text-sm text-blue-600 font-medium">
                      {member.sponsor_id}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {member.sponsor_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-blue-600 font-medium">
                      {member.member_id}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                      {member.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          member.position === "Left"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {member.position}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {new Date(member.date_of_joining).toLocaleDateString(
                        "en-GB"
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          member.status
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {member.status ? "Active" : "Inactive"}
                      </span>
                    </td>
                    {/* <td className="px-4 py-3 text-sm text-center font-medium text-green-700">
                      ₹{calculateIncome().toFixed(2)}
                    </td> */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, totalMembers)} of{" "}
              {totalMembers} entries
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 border rounded text-sm ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPages > 5 && (
                <>
                  <span className="px-2 text-gray-500">...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`px-3 py-1 border rounded text-sm ${
                      currentPage === totalPages
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectMember;