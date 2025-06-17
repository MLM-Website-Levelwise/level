// import { useState } from "react";
// import { User } from "lucide-react";

// const TreeTeam = () => {
//   // Using the same data structure from the previous component
//   const allTeamData = [
//     {
//       id: 1,
//       memberId: "100001",
//       member: "John Admin",
//       sponsorCode: "000000",
//       sponsorName: "Root",
//       doj: "01/01/2020",
//       status: "Active",
//       level: 1,
//       leftTeam: 15,
//       rightTeam: 0,
//       leftBV: 2500,
//       rightBV: 0,
//       activeDate: "01/01/2020",
//     },
//     {
//       id: 2,
//       memberId: "100002",
//       member: "Sarah Manager",
//       sponsorCode: "100001",
//       sponsorName: "John Admin",
//       doj: "15/02/2020",
//       status: "Active",
//       level: 2,
//       leftTeam: 8,
//       rightTeam: 0,
//       leftBV: 1200,
//       rightBV: 0,
//       activeDate: "15/02/2020",
//     },
//     {
//       id: 3,
//       memberId: "100003",
//       member: "Mike Johnson",
//       sponsorCode: "100001",
//       sponsorName: "John Admin",
//       doj: "20/03/2020",
//       status: "Active",
//       level: 2,
//       leftTeam: 7,
//       rightTeam: 0,
//       leftBV: 1300,
//       rightBV: 0,
//       activeDate: "20/03/2020",
//     },
//     {
//       id: 4,
//       memberId: "100004",
//       member: "Emma Wilson",
//       sponsorCode: "100002",
//       sponsorName: "Sarah Manager",
//       doj: "10/04/2020",
//       status: "Active",
//       level: 3,
//       leftTeam: 4,
//       rightTeam: 0,
//       leftBV: 800,
//       rightBV: 0,
//       activeDate: "10/04/2020",
//     },
//     {
//       id: 5,
//       memberId: "100005",
//       member: "David Brown",
//       sponsorCode: "100002",
//       sponsorName: "Sarah Manager",
//       doj: "25/04/2020",
//       status: "InActive",
//       level: 3,
//       leftTeam: 2,
//       rightTeam: 0,
//       leftBV: 400,
//       rightBV: 0,
//       activeDate: "25/04/2020",
//     },
//     {
//       id: 6,
//       memberId: "100006",
//       member: "Lisa Davis",
//       sponsorCode: "100003",
//       sponsorName: "Mike Johnson",
//       doj: "05/05/2020",
//       status: "Active",
//       level: 3,
//       leftTeam: 3,
//       rightTeam: 0,
//       leftBV: 600,
//       rightBV: 0,
//       activeDate: "05/05/2020",
//     },
//     {
//       id: 7,
//       memberId: "100007",
//       member: "Tom Anderson",
//       sponsorCode: "100004",
//       sponsorName: "Emma Wilson",
//       doj: "15/06/2020",
//       status: "Active",
//       level: 4,
//       leftTeam: 1,
//       rightTeam: 0,
//       leftBV: 200,
//       rightBV: 0,
//       activeDate: "15/06/2020",
//     },
//     {
//       id: 8,
//       memberId: "100008",
//       member: "Anna Taylor",
//       sponsorCode: "100004",
//       sponsorName: "Emma Wilson",
//       doj: "20/06/2020",
//       status: "InActive",
//       level: 4,
//       leftTeam: 1,
//       rightTeam: 0,
//       leftBV: 150,
//       rightBV: 0,
//       activeDate: "20/06/2020",
//     },
//     {
//       id: 9,
//       memberId: "100009",
//       member: "Chris Martin",
//       sponsorCode: "100005",
//       sponsorName: "David Brown",
//       doj: "01/07/2020",
//       status: "Active",
//       level: 4,
//       leftTeam: 1,
//       rightTeam: 0,
//       leftBV: 100,
//       rightBV: 0,
//       activeDate: "01/07/2020",
//     },
//     {
//       id: 10,
//       memberId: "100010",
//       member: "Jessica Lee",
//       sponsorCode: "100006",
//       sponsorName: "Lisa Davis",
//       doj: "10/07/2020",
//       status: "Active",
//       level: 4,
//       leftTeam: 1,
//       rightTeam: 0,
//       leftBV: 300,
//       rightBV: 0,
//       activeDate: "10/07/2020",
//     },
//     {
//       id: 11,
//       memberId: "100011",
//       member: "Robert Clark",
//       sponsorCode: "100007",
//       sponsorName: "Tom Anderson",
//       doj: "15/08/2020",
//       status: "Active",
//       level: 5,
//       leftTeam: 0,
//       rightTeam: 0,
//       leftBV: 50,
//       rightBV: 0,
//       activeDate: "15/08/2020",
//     },
//     {
//       id: 12,
//       memberId: "100012",
//       member: "Maria Garcia",
//       sponsorCode: "100008",
//       sponsorName: "Anna Taylor",
//       doj: "20/08/2020",
//       status: "InActive",
//       level: 5,
//       leftTeam: 0,
//       rightTeam: 0,
//       leftBV: 25,
//       rightBV: 0,
//       activeDate: "20/08/2020",
//     },
//     {
//       id: 13,
//       memberId: "100013",
//       member: "James Wilson",
//       sponsorCode: "100009",
//       sponsorName: "Chris Martin",
//       doj: "25/08/2020",
//       status: "Active",
//       level: 5,
//       leftTeam: 0,
//       rightTeam: 0,
//       leftBV: 75,
//       rightBV: 0,
//       activeDate: "25/08/2020",
//     },
//     {
//       id: 14,
//       memberId: "100014",
//       member: "Linda Moore",
//       sponsorCode: "100010",
//       sponsorName: "Jessica Lee",
//       doj: "30/08/2020",
//       status: "Active",
//       level: 5,
//       leftTeam: 0,
//       rightTeam: 0,
//       leftBV: 100,
//       rightBV: 0,
//       activeDate: "30/08/2020",
//     },
//     {
//       id: 15,
//       memberId: "100015",
//       member: "Kevin White",
//       sponsorCode: "100011",
//       sponsorName: "Robert Clark",
//       doj: "05/09/2020",
//       status: "InActive",
//       level: 6,
//       leftTeam: 0,
//       rightTeam: 0,
//       leftBV: 0,
//       rightBV: 0,
//       activeDate: "05/09/2020",
//     },
//   ];

//   const [filteredData, setFilteredData] = useState(allTeamData);
//   const [memberIdFilter, setMemberIdFilter] = useState("");
//   const [hoveredMember, setHoveredMember] = useState(null);
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

//   const handleSubmit = () => {
//     if (memberIdFilter.trim()) {
//       const filtered = allTeamData.filter(
//         (member) =>
//           member.memberId
//             .toLowerCase()
//             .includes(memberIdFilter.toLowerCase()) ||
//           member.member.toLowerCase().includes(memberIdFilter.toLowerCase())
//       );
//       setFilteredData(filtered);
//     } else {
//       setFilteredData(allTeamData);
//     }
//   };

//   const handleMouseEnter = (member, event) => {
//     setHoveredMember(member);
//     setMousePosition({ x: event.clientX, y: event.clientY });
//   };

//   const handleMouseMove = (event) => {
//     if (hoveredMember) {
//       setMousePosition({ x: event.clientX, y: event.clientY });
//     }
//   };

//   const handleMouseLeave = () => {
//     setHoveredMember(null);
//   };

//   // Build tree structure
//   const buildTree = (data) => {
//     const memberMap = {};
//     const rootMembers = [];

//     // Create a map of all members
//     data.forEach((member) => {
//       memberMap[member.memberId] = { ...member, children: [] };
//     });

//     // Build the tree structure
//     data.forEach((member) => {
//       if (member.sponsorCode === "000000") {
//         rootMembers.push(memberMap[member.memberId]);
//       } else {
//         const sponsor = memberMap[member.sponsorCode];
//         if (sponsor) {
//           sponsor.children.push(memberMap[member.memberId]);
//         }
//       }
//     });

//     return rootMembers;
//   };

//   const renderTreeNode = (member, level = 0) => {
//     const hasChildren = member.children && member.children.length > 0;
//     const isActive = member.status === "Active";

//     return (
//       <div key={member.memberId} className="flex flex-col items-center">
//         {/* Member Node */}
//         <div className="flex flex-col items-center mb-4">
//           <div
//             className={`relative cursor-pointer transition-transform hover:scale-110`}
//             onMouseEnter={(e) => handleMouseEnter(member, e)}
//             onMouseMove={handleMouseMove}
//             onMouseLeave={handleMouseLeave}
//           >
//             <div
//               className={`w-16 h-16 rounded-full flex items-center justify-center ${
//                 isActive ? "bg-green-500" : "bg-red-500"
//               } text-white shadow-lg`}
//             >
//               <User size={32} />
//             </div>
//           </div>
//           <div className="text-center mt-2">
//             <div className="text-sm font-medium text-gray-700">
//               {member.memberId}
//             </div>
//             <div className="text-xs text-gray-500">{member.member}</div>
//           </div>
//         </div>

//         {/* Connection Line */}
//         {hasChildren && (
//           <div className="flex flex-col items-center">
//             <div className="w-px h-8 bg-gray-400"></div>
//             <div className="flex items-center">
//               <div
//                 className={`h-px bg-gray-400 ${
//                   member.children.length > 1 ? "w-32" : "w-0"
//                 }`}
//               ></div>
//             </div>
//           </div>
//         )}

//         {/* Children */}
//         {hasChildren && (
//           <div className="flex space-x-16 mt-4">
//             {member.children.map((child) => renderTreeNode(child, level + 1))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   const treeData = buildTree(filteredData);

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Filter Section */}
//         <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
//           <div className="flex items-end space-x-4">
//             <div className="flex-1">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 MemberId <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter member ID"
//                 value={memberIdFilter}
//                 onChange={(e) => setMemberIdFilter(e.target.value)}
//               />
//             </div>
//             <div>
//               <button
//                 onClick={handleSubmit}
//                 className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-md transition-colors"
//               >
//                 Submit
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Tree View */}
//         <div className="bg-white rounded-lg shadow-sm p-8 overflow-x-auto">
//           <div className="min-w-full">
//             {treeData.length > 0 ? (
//               <div className="flex justify-center">
//                 <div className="space-y-8">
//                   {treeData.map((rootMember) => renderTreeNode(rootMember))}
//                 </div>
//               </div>
//             ) : (
//               <div className="text-center py-8 text-gray-500">
//                 No members found matching your search criteria.
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Hover Tooltip */}
//         {hoveredMember && (
//           <div
//             className="fixed z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4 pointer-events-none"
//             style={{
//               left: mousePosition.x + 10,
//               top: mousePosition.y - 10,
//               transform: "translate(0, -100%)",
//             }}
//           >
//             <div className="space-y-1">
//               <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
//                 <div className="bg-yellow-100 px-2 py-1 rounded">
//                   <span className="font-medium">Name</span>
//                 </div>
//                 <div className="bg-yellow-50 px-2 py-1 rounded">
//                   {hoveredMember.member}
//                 </div>

//                 <div className="bg-yellow-100 px-2 py-1 rounded">
//                   <span className="font-medium">Date Of Join</span>
//                 </div>
//                 <div className="bg-yellow-50 px-2 py-1 rounded">
//                   {hoveredMember.doj}
//                 </div>

//                 <div className="bg-yellow-100 px-2 py-1 rounded">
//                   <span className="font-medium">Active Date</span>
//                 </div>
//                 <div className="bg-yellow-50 px-2 py-1 rounded">
//                   {hoveredMember.activeDate}
//                 </div>

//                 <div className="bg-yellow-100 px-2 py-1 rounded">
//                   <span className="font-medium">Left Team</span>
//                 </div>
//                 <div className="bg-yellow-50 px-2 py-1 rounded">
//                   {hoveredMember.leftTeam}
//                 </div>

//                 <div className="bg-yellow-100 px-2 py-1 rounded">
//                   <span className="font-medium">Right Team</span>
//                 </div>
//                 <div className="bg-yellow-50 px-2 py-1 rounded">
//                   {hoveredMember.rightTeam}
//                 </div>

//                 <div className="bg-yellow-100 px-2 py-1 rounded">
//                   <span className="font-medium">Left BV</span>
//                 </div>
//                 <div className="bg-yellow-50 px-2 py-1 rounded">
//                   {hoveredMember.leftBV}
//                 </div>

//                 <div className="bg-yellow-100 px-2 py-1 rounded">
//                   <span className="font-medium">Right BV</span>
//                 </div>
//                 <div className="bg-yellow-50 px-2 py-1 rounded">
//                   {hoveredMember.rightBV}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TreeTeam;

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface TeamMember {
  id: string;
  name: string;
  company: string;
  dateOfJoin: string;
  activeDate: string;
  leftTeam: number;
  rightTeam: number;
  leftBV: number;
  rightBV: number;
  avatar?: string;
  position: "left" | "right" | "center";
}

const TreeWiseTeam = () => {
  const [memberId, setMemberId] = useState("100001");

  const treeData: TeamMember[] = [
    {
      id: "100001",
      name: "Company 1",
      company: "Company 1",
      dateOfJoin: "04/09/2021",
      activeDate: "23/05/2025",
      leftTeam: 9,
      rightTeam: 2,
      leftBV: 1,
      rightBV: 1,
      position: "center",
    },
    {
      id: "891832",
      name: "Abc",
      company: "Company ABC",
      dateOfJoin: "15/02/2021",
      activeDate: "10/06/2025",
      leftTeam: 5,
      rightTeam: 3,
      leftBV: 2,
      rightBV: 1,
      position: "left",
    },
    {
      id: "122977",
      name: "biru",
      company: "Company Biru",
      dateOfJoin: "20/03/2021",
      activeDate: "05/07/2025",
      leftTeam: 2,
      rightTeam: 1,
      leftBV: 1,
      rightBV: 2,
      position: "right",
    },
    {
      id: "922924",
      name: "Wazir",
      company: "Company Wazir",
      dateOfJoin: "10/04/2021",
      activeDate: "15/08/2025",
      leftTeam: 1,
      rightTeam: 0,
      leftBV: 1,
      rightBV: 0,
      position: "left",
    },
    {
      id: "421098",
      name: "Tapas",
      company: "Company Tapas",
      dateOfJoin: "25/04/2021",
      activeDate: "20/09/2025",
      leftTeam: 0,
      rightTeam: 1,
      leftBV: 0,
      rightBV: 1,
      position: "right",
    },
  ];

  const handleSubmit = () => {
    console.log("Submitting search for member:", memberId);
  };

  const MemberCard = ({
    member,
    level,
  }: {
    member: TeamMember;
    level: number;
  }) => {
    const getAvatarColor = (name: string) => {
      const colors = [
        "bg-red-500",
        "bg-orange-500",
        "bg-purple-500",
        "bg-blue-500",
        "bg-green-500",
      ];
      return colors[name.length % colors.length];
    };

    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="flex flex-col items-center cursor-pointer group">
            <div
              className={`w-16 h-16 rounded-full ${getAvatarColor(
                member.name
              )} flex items-center justify-center mb-2 transition-transform group-hover:scale-110`}
            >
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <div className="font-medium text-sm">{member.id}</div>
              <div className="text-xs text-gray-600">{member.name}</div>
            </div>
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80">
          <div className="space-y-2">
            {/* <div className="flex items-center space-x-2">
              <div
                className={`w-8 h-8 rounded-full ${getAvatarColor(
                  member.name
                )} flex items-center justify-center`}
              >
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-semibold text-sm">{member.name}</div>
                <div className="text-xs text-gray-600">{member.company}</div>
              </div>
            </div> */}
            {/* <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="font-medium">Date Of Join:</span>
                <div>{member.dateOfJoin}</div>
              </div>
              <div>
                <span className="font-medium">Active Date:</span>
                <div>{member.activeDate}</div>
              </div>
              <div>
                <span className="font-medium">Left Team:</span>
                <div>{member.leftTeam}</div>
              </div>
              <div>
                <span className="font-medium">Right Team:</span>
                <div>{member.rightTeam}</div>
              </div>
              <div>
                <span className="font-medium">Left BV:</span>
                <div>{member.leftBV}</div>
              </div>
              <div>
                <span className="font-medium">Right BV:</span>
                <div>{member.rightBV}</div>
              </div>
            </div> */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <div className="bg-yellow-100 px-2 py-1 rounded">
                <span className="font-medium">Name</span>
              </div>
              <div className="bg-yellow-50 px-2 py-1 rounded">
                {member.name}
              </div>

              <div className="bg-yellow-100 px-2 py-1 rounded">
                <span className="font-medium">Date Of Join</span>
              </div>
              <div className="bg-yellow-50 px-2 py-1 rounded">
                {member.dateOfJoin}
              </div>

              <div className="bg-yellow-100 px-2 py-1 rounded">
                <span className="font-medium">Active Date</span>
              </div>
              <div className="bg-yellow-50 px-2 py-1 rounded">
                {member.activeDate}
              </div>

              <div className="bg-yellow-100 px-2 py-1 rounded">
                <span className="font-medium">Left Team</span>
              </div>
              <div className="bg-yellow-50 px-2 py-1 rounded">
                {member.leftTeam}
              </div>

              <div className="bg-yellow-100 px-2 py-1 rounded">
                <span className="font-medium">Right Team</span>
              </div>
              <div className="bg-yellow-50 px-2 py-1 rounded">
                {member.rightTeam}
              </div>

              <div className="bg-yellow-100 px-2 py-1 rounded">
                <span className="font-medium">Left BV</span>
              </div>
              <div className="bg-yellow-50 px-2 py-1 rounded">
                {member.leftBV}
              </div>

              <div className="bg-yellow-100 px-2 py-1 rounded">
                <span className="font-medium">Right BV</span>
              </div>
              <div className="bg-yellow-50 px-2 py-1 rounded">
                {member.rightBV}
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  };

  const EmptySlot = () => (
    <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
      <User className="w-8 h-8 text-gray-500" />
    </div>
  );

  return (
    <div>
      <Card>
        <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white px-4 py-3 rounded-t">
          <h2 className="text-xl font-bold">Tree Structure</h2>
        </div>

        {/* Search Form */}
        <div className="p-6 bg-gray-50 rounded-b-lg">
          {/* <CardContent className="p-6 bg-gray-50"> */}
          {/* <div className="flex items-end gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Member Id
              </label>
              <Input
                placeholder="Enter member ID"
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                className="w-48"
              />
            </div>
            <Button
              onClick={handleSubmit}
              className="bg-red-600 hover:bg-red-700 text-white px-8"
            >
              Submit
            </Button>
          </div> */}

          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-fit mb-4">
            <div className="bg-gray-100 px-4 py-2 text-gray-700 text-sm font-medium flex items-center">
              Member Id<span className="text-red-500 ml-1">*</span>
            </div>
            <Input
              placeholder="Enter member ID"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              className="w-48 border-none focus:ring-0 rounded-none"
            />
            <Button
              onClick={handleSubmit}
              className="ml-2 bg-red-600 hover:bg-red-700 text-white px-8 rounded-md"
            >
              Submit
            </Button>
          </div>

          {/* Tree Structure */}
          <div className="bg-white p-8 rounded-lg border border-gray-200">
            <div className="relative">
              {/* Level 1 - Root Node */}
              <div className="flex justify-center mb-12">
                <MemberCard member={treeData[0]} level={1} />
              </div>

              {/* Vertical line from root */}
              <div className="absolute left-[50%] top-[110px] w-[1px] h-[25px] bg-gray-400 transform -translate-x-1/"></div>

              {/* Horizontal line connecting level 2 */}
              <div className="absolute left-[350px] right-[350px] top-[135px] h-[1px] bg-gray-400"></div>

              {/* Vertical lines to level 2 nodes */}
              <div className="absolute left-[352px] top-[135px] w-[1px] h-[32px] bg-gray-400 transform -translate-x-0.5"></div>
              <div className="absolute right-[352px] top-[135px] w-[1px] h-[32px] bg-gray-400 transform translate-x-0.5"></div>

              {/* Level 2 */}
              <div className="relative h-[100px] mb-16 mt-8">
                <div className="absolute left-[352px] transform -translate-x-1/2">
                  <MemberCard member={treeData[1]} level={2} />
                </div>
                <div className="absolute right-[352px] transform translate-x-1/2">
                  <MemberCard member={treeData[2]} level={2} />
                </div>
              </div>

              {/* Vertical lines from level 2 to level 3 */}
              <div className="absolute left-[352px] top-[265px] w-[1px] h-[32px] bg-gray-400 transform -translate-x-0.5"></div>
              <div className="absolute right-[352px] top-[265px] w-[1px] h-[32px] bg-gray-400 transform translate-x-0.5"></div>

              {/* Horizontal lines for level 3 connections - Left side */}
              <div className="absolute left-[240px] top-[300px] w-[224px] h-[1px] bg-gray-400"></div>
              <div className="absolute left-[240px] top-[300px] w-[1px] h-[32px] bg-gray-400"></div>
              <div className="absolute left-[464px] top-[300px] w-[1px] h-[32px] bg-gray-400"></div>

              {/* Horizontal lines for level 3 connections - Right side */}
              <div className="absolute right-[240px] top-[300px] w-[224px] h-[1px] bg-gray-400"></div>
              <div className="absolute right-[240px] top-[300px] w-[1px] h-[32px] bg-gray-400"></div>
              <div className="absolute right-[464px] top-[300px] w-[1px] h-[32px] bg-gray-400"></div>

              {/* Level 3 */}
              <div className="relative mt-[75px] h-[100px]">
                {" "}
                <div className="absolute left-[208px]">
                  <MemberCard member={treeData[3]} level={3} />
                </div>
                <div className="absolute left-[432px]">
                  <EmptySlot />
                </div>
                <div className="absolute right-[432px]">
                  <EmptySlot />
                </div>
                <div className="absolute right-[208px]">
                  <MemberCard member={treeData[4]} level={3} />
                </div>
              </div>
            </div>
          </div>
          {/* </CardContent> */}
        </div>
      </Card>
    </div>
  );
};

export default TreeWiseTeam;
