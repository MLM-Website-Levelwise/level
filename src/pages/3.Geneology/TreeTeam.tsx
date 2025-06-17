import { useState } from "react";
import { User } from "lucide-react";

const TreeTeam = () => {
  // Using the same data structure from the previous component
  const allTeamData = [
    {
      id: 1,
      memberId: "100001",
      member: "John Admin",
      sponsorCode: "000000",
      sponsorName: "Root",
      doj: "01/01/2020",
      status: "Active",
      level: 1,
      leftTeam: 15,
      rightTeam: 0,
      leftBV: 2500,
      rightBV: 0,
      activeDate: "01/01/2020",
    },
    {
      id: 2,
      memberId: "100002",
      member: "Sarah Manager",
      sponsorCode: "100001",
      sponsorName: "John Admin",
      doj: "15/02/2020",
      status: "Active",
      level: 2,
      leftTeam: 8,
      rightTeam: 0,
      leftBV: 1200,
      rightBV: 0,
      activeDate: "15/02/2020",
    },
    {
      id: 3,
      memberId: "100003",
      member: "Mike Johnson",
      sponsorCode: "100001",
      sponsorName: "John Admin",
      doj: "20/03/2020",
      status: "Active",
      level: 2,
      leftTeam: 7,
      rightTeam: 0,
      leftBV: 1300,
      rightBV: 0,
      activeDate: "20/03/2020",
    },
    {
      id: 4,
      memberId: "100004",
      member: "Emma Wilson",
      sponsorCode: "100002",
      sponsorName: "Sarah Manager",
      doj: "10/04/2020",
      status: "Active",
      level: 3,
      leftTeam: 4,
      rightTeam: 0,
      leftBV: 800,
      rightBV: 0,
      activeDate: "10/04/2020",
    },
    {
      id: 5,
      memberId: "100005",
      member: "David Brown",
      sponsorCode: "100002",
      sponsorName: "Sarah Manager",
      doj: "25/04/2020",
      status: "InActive",
      level: 3,
      leftTeam: 2,
      rightTeam: 0,
      leftBV: 400,
      rightBV: 0,
      activeDate: "25/04/2020",
    },
    {
      id: 6,
      memberId: "100006",
      member: "Lisa Davis",
      sponsorCode: "100003",
      sponsorName: "Mike Johnson",
      doj: "05/05/2020",
      status: "Active",
      level: 3,
      leftTeam: 3,
      rightTeam: 0,
      leftBV: 600,
      rightBV: 0,
      activeDate: "05/05/2020",
    },
    {
      id: 7,
      memberId: "100007",
      member: "Tom Anderson",
      sponsorCode: "100004",
      sponsorName: "Emma Wilson",
      doj: "15/06/2020",
      status: "Active",
      level: 4,
      leftTeam: 1,
      rightTeam: 0,
      leftBV: 200,
      rightBV: 0,
      activeDate: "15/06/2020",
    },
    {
      id: 8,
      memberId: "100008",
      member: "Anna Taylor",
      sponsorCode: "100004",
      sponsorName: "Emma Wilson",
      doj: "20/06/2020",
      status: "InActive",
      level: 4,
      leftTeam: 1,
      rightTeam: 0,
      leftBV: 150,
      rightBV: 0,
      activeDate: "20/06/2020",
    },
    {
      id: 9,
      memberId: "100009",
      member: "Chris Martin",
      sponsorCode: "100005",
      sponsorName: "David Brown",
      doj: "01/07/2020",
      status: "Active",
      level: 4,
      leftTeam: 1,
      rightTeam: 0,
      leftBV: 100,
      rightBV: 0,
      activeDate: "01/07/2020",
    },
    {
      id: 10,
      memberId: "100010",
      member: "Jessica Lee",
      sponsorCode: "100006",
      sponsorName: "Lisa Davis",
      doj: "10/07/2020",
      status: "Active",
      level: 4,
      leftTeam: 1,
      rightTeam: 0,
      leftBV: 300,
      rightBV: 0,
      activeDate: "10/07/2020",
    },
    {
      id: 11,
      memberId: "100011",
      member: "Robert Clark",
      sponsorCode: "100007",
      sponsorName: "Tom Anderson",
      doj: "15/08/2020",
      status: "Active",
      level: 5,
      leftTeam: 0,
      rightTeam: 0,
      leftBV: 50,
      rightBV: 0,
      activeDate: "15/08/2020",
    },
    {
      id: 12,
      memberId: "100012",
      member: "Maria Garcia",
      sponsorCode: "100008",
      sponsorName: "Anna Taylor",
      doj: "20/08/2020",
      status: "InActive",
      level: 5,
      leftTeam: 0,
      rightTeam: 0,
      leftBV: 25,
      rightBV: 0,
      activeDate: "20/08/2020",
    },
    {
      id: 13,
      memberId: "100013",
      member: "James Wilson",
      sponsorCode: "100009",
      sponsorName: "Chris Martin",
      doj: "25/08/2020",
      status: "Active",
      level: 5,
      leftTeam: 0,
      rightTeam: 0,
      leftBV: 75,
      rightBV: 0,
      activeDate: "25/08/2020",
    },
    {
      id: 14,
      memberId: "100014",
      member: "Linda Moore",
      sponsorCode: "100010",
      sponsorName: "Jessica Lee",
      doj: "30/08/2020",
      status: "Active",
      level: 5,
      leftTeam: 0,
      rightTeam: 0,
      leftBV: 100,
      rightBV: 0,
      activeDate: "30/08/2020",
    },
    {
      id: 15,
      memberId: "100015",
      member: "Kevin White",
      sponsorCode: "100011",
      sponsorName: "Robert Clark",
      doj: "05/09/2020",
      status: "InActive",
      level: 6,
      leftTeam: 0,
      rightTeam: 0,
      leftBV: 0,
      rightBV: 0,
      activeDate: "05/09/2020",
    },
  ];

  const [filteredData, setFilteredData] = useState(allTeamData);
  const [memberIdFilter, setMemberIdFilter] = useState("");
  const [hoveredMember, setHoveredMember] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleSubmit = () => {
    if (memberIdFilter.trim()) {
      const filtered = allTeamData.filter(
        (member) =>
          member.memberId
            .toLowerCase()
            .includes(memberIdFilter.toLowerCase()) ||
          member.member.toLowerCase().includes(memberIdFilter.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(allTeamData);
    }
  };

  const handleMouseEnter = (member, event) => {
    setHoveredMember(member);
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event) => {
    if (hoveredMember) {
      setMousePosition({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseLeave = () => {
    setHoveredMember(null);
  };

  // Build tree structure
  const buildTree = (data) => {
    const memberMap = {};
    const rootMembers = [];

    // Create a map of all members
    data.forEach((member) => {
      memberMap[member.memberId] = { ...member, children: [] };
    });

    // Build the tree structure
    data.forEach((member) => {
      if (member.sponsorCode === "000000") {
        rootMembers.push(memberMap[member.memberId]);
      } else {
        const sponsor = memberMap[member.sponsorCode];
        if (sponsor) {
          sponsor.children.push(memberMap[member.memberId]);
        }
      }
    });

    return rootMembers;
  };

  const renderTreeNode = (member, level = 0) => {
    const hasChildren = member.children && member.children.length > 0;
    const isActive = member.status === "Active";

    return (
      <div key={member.memberId} className="flex flex-col items-center">
        {/* Member Node */}
        <div className="flex flex-col items-center mb-4">
          <div
            className={`relative cursor-pointer transition-transform hover:scale-110`}
            onMouseEnter={(e) => handleMouseEnter(member, e)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center ${
                isActive ? "bg-green-500" : "bg-red-500"
              } text-white shadow-lg`}
            >
              <User size={32} />
            </div>
          </div>
          <div className="text-center mt-2">
            <div className="text-sm font-medium text-gray-700">
              {member.memberId}
            </div>
            <div className="text-xs text-gray-500">{member.member}</div>
          </div>
        </div>

        {/* Connection Line */}
        {hasChildren && (
          <div className="flex flex-col items-center">
            <div className="w-px h-8 bg-gray-400"></div>
            <div className="flex items-center">
              <div
                className={`h-px bg-gray-400 ${
                  member.children.length > 1 ? "w-32" : "w-0"
                }`}
              ></div>
            </div>
          </div>
        )}

        {/* Children */}
        {hasChildren && (
          <div className="flex space-x-16 mt-4">
            {member.children.map((child) => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const treeData = buildTree(filteredData);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Filter Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                MemberId <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter member ID"
                value={memberIdFilter}
                onChange={(e) => setMemberIdFilter(e.target.value)}
              />
            </div>
            <div>
              <button
                onClick={handleSubmit}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-md transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>

        {/* Tree View */}
        <div className="bg-white rounded-lg shadow-sm p-8 overflow-x-auto">
          <div className="min-w-full">
            {treeData.length > 0 ? (
              <div className="flex justify-center">
                <div className="space-y-8">
                  {treeData.map((rootMember) => renderTreeNode(rootMember))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No members found matching your search criteria.
              </div>
            )}
          </div>
        </div>

        {/* Hover Tooltip */}
        {hoveredMember && (
          <div
            className="fixed z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4 pointer-events-none"
            style={{
              left: mousePosition.x + 10,
              top: mousePosition.y - 10,
              transform: "translate(0, -100%)",
            }}
          >
            <div className="space-y-1">
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <div className="bg-yellow-100 px-2 py-1 rounded">
                  <span className="font-medium">Name</span>
                </div>
                <div className="bg-yellow-50 px-2 py-1 rounded">
                  {hoveredMember.member}
                </div>

                <div className="bg-yellow-100 px-2 py-1 rounded">
                  <span className="font-medium">Date Of Join</span>
                </div>
                <div className="bg-yellow-50 px-2 py-1 rounded">
                  {hoveredMember.doj}
                </div>

                <div className="bg-yellow-100 px-2 py-1 rounded">
                  <span className="font-medium">Active Date</span>
                </div>
                <div className="bg-yellow-50 px-2 py-1 rounded">
                  {hoveredMember.activeDate}
                </div>

                <div className="bg-yellow-100 px-2 py-1 rounded">
                  <span className="font-medium">Left Team</span>
                </div>
                <div className="bg-yellow-50 px-2 py-1 rounded">
                  {hoveredMember.leftTeam}
                </div>

                <div className="bg-yellow-100 px-2 py-1 rounded">
                  <span className="font-medium">Right Team</span>
                </div>
                <div className="bg-yellow-50 px-2 py-1 rounded">
                  {hoveredMember.rightTeam}
                </div>

                <div className="bg-yellow-100 px-2 py-1 rounded">
                  <span className="font-medium">Left BV</span>
                </div>
                <div className="bg-yellow-50 px-2 py-1 rounded">
                  {hoveredMember.leftBV}
                </div>

                <div className="bg-yellow-100 px-2 py-1 rounded">
                  <span className="font-medium">Right BV</span>
                </div>
                <div className="bg-yellow-50 px-2 py-1 rounded">
                  {hoveredMember.rightBV}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TreeTeam;
