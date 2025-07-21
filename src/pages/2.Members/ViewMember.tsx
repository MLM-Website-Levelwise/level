import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Filter,
  Download,
  FileText,
  Plus,
  Edit,
  Ban,
  UserCheck,
  FileSpreadsheet,
  Printer,
} from "lucide-react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ViewMember = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter states
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    package: "",
    memberCode: "",
    memberName: "",
    activeStatus: "",
  });

  // Fetch members from API
  // Fetch members from API
  // Update your useEffect hook with the fixed sorting
// Update your useEffect hook to fetch ALL members
useEffect(() => {
  const fetchAllMembers = async () => {
    try {
      setLoading(true);
      
      // Fetch ALL members with special header for PN1001
      const response = await fetch(`${API_BASE_URL}/all-membersi`, {
        headers: {
          'Authorization': 'PN1001' // Special token for public access
        }
      });
      
      if (!response.ok) throw new Error("Failed to fetch members");
      const membersData = await response.json();

      // Sort by joining date
      const sortedMembers = membersData.sort((a, b) => {
        const dateA = new Date(a.date_of_joining).getTime();
        const dateB = new Date(b.date_of_joining).getTime();
        return dateA - dateB;
      });

      setMembers(sortedMembers);
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

  fetchAllMembers();
}, [toast]);

  // Filter and search logic
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.member_id.includes(searchTerm) ||
      member.phone_number.includes(searchTerm) ||
      member.sponsor_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDateFrom =
      !filters.dateFrom || member.date_of_joining >= filters.dateFrom;
    const matchesDateTo =
      !filters.dateTo || member.date_of_joining <= filters.dateTo;
    const matchesPackage =
      !filters.package || member.package === filters.package;
    const matchesMemberCode =
      !filters.memberCode || member.member_id.includes(filters.memberCode);
    const matchesMemberName =
      !filters.memberName ||
      member.name.toLowerCase().includes(filters.memberName.toLowerCase());
    const matchesActiveStatus =
      !filters.activeStatus ||
      (member.active_status ? "Active" : "Inactive") === filters.activeStatus;

    return (
      matchesSearch &&
      matchesDateFrom &&
      matchesDateTo &&
      matchesPackage &&
      matchesMemberCode &&
      matchesMemberName &&
      matchesActiveStatus
    );
  });
  // Pagination logic
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMembers = filteredMembers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      dateFrom: "",
      dateTo: "",
      package: "",
      memberCode: "",
      memberName: "",
      activeStatus: "",
    });
    setCurrentPage(1);
  };

  const handleExport = (type) => {
    alert(`Exporting to ${type.toUpperCase()}...`);
  };

  const handleAddMember = () => {
    navigate("/members/add-member");
  };

 const handleUpdateStatus = async (memberId, currentStatus) => {
  try {
    const newStatus = !currentStatus; // Toggle the status

    const response = await fetch(
      `${API_BASE_URL}/members/${memberId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          active_status: newStatus,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update status");
    }

    // Update local state
    setMembers((prev) =>
      prev.map((member) =>
        member.id === memberId
          ? { ...member, active_status: newStatus }
          : member
      )
    );

    toast({
      title: "Success",
      description: `Member has been ${newStatus ? "activated" : "deactivated"}`,
    });
  } catch (error) {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
  }
};
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
    <div className=" min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 w-full text-center">
        <h1 className="text-xl font-medium text-white">View Members</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          {/* Top Controls */}
          {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search members..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap justify-end gap-2">
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
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div> */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            {/* Search */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search members..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap sm:flex-nowrap justify-start sm:justify-end gap-2">
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

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>

          {/* Items per page */}
          <div className="flex items-center gap-2">
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
            </select>
            <span className="text-sm text-gray-600">entries</span>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Package
                  </label>
                  <select
                    value={filters.package}
                    onChange={(e) =>
                      handleFilterChange("package", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Packages</option>
                    <option value="Elite">Elite</option>
                  </select>
                </div> */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Member Code
                  </label>
                  <input
                    type="text"
                    value={filters.memberCode}
                    onChange={(e) =>
                      handleFilterChange("memberCode", e.target.value)
                    }
                    placeholder="Enter member code"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Member Name
                  </label>
                  <input
                    type="text"
                    value={filters.memberName}
                    onChange={(e) =>
                      handleFilterChange("memberName", e.target.value)
                    }
                    placeholder="Enter member name"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={filters.activeStatus}
                    onChange={(e) =>
                      handleFilterChange("activeStatus", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={clearFilters}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-600 text-white">
                <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">
                  Sl No.
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">
                  DOJ
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">
                  Member Id
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap min-w-[120px]">
                  Member Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">
                  Sponsor Id
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap min-w-[120px]">
                  Sponsor Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">
                  Position
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">
                  Top-up Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">
                  Package
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">
                  Phone Number
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">
                  Password
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">
                  Active Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedMembers.map((member, index) => (
                <tr
                  key={member.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {members.findIndex((m) => m.id === member.id) + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
  {new Date(member.date_of_joining).toLocaleDateString("en-GB")}
  <br />
  <span className="text-xs text-gray-500">
    {member.created_at && new Date(member.created_at).toLocaleTimeString("en-GB", {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })}
  </span>
</td>
                  <td className="px-4 py-3 text-sm text-blue-600 font-medium">
                    {member.member_id}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {member.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-blue-600">
                    {member.sponsor_code}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {member.sponsor_name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
          {member.position || '-'}
        </td>
        <td className="px-4 py-3 text-sm text-gray-900">
          {member.topup_date ? new Date(member.topup_date).toLocaleDateString("en-GB") : '-'}
        </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        member.package === "Elite"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {member.package}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {member.phone_number}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {member.password}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        member.active_status
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {member.active_status ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          navigate(`/members/edit-member/${member.id}`)
                        }
                        className="text-blue-600 hover:text-blue-800 p-1 rounded"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    <button
  onClick={() => handleUpdateStatus(member.id, member.active_status)}
  className={`p-1 rounded ${
    member.active_status
      ? "text-red-600 hover:text-red-800"
      : "text-green-600 hover:text-green-800"
  }`}
  title={member.active_status ? "Deactivate" : "Activate"}
>
  {member.active_status ? (
    <Ban className="w-4 h-4" />
  ) : (
    <UserCheck className="w-4 h-4" />
  )}
</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + itemsPerPage, filteredMembers.length)} of{" "}
            {filteredMembers.length} entries
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border rounded text-sm ${
                  currentPage === page
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
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
      </div>
    </div>
  );
};

export default ViewMember;
