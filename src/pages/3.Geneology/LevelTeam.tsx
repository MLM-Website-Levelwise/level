// import React, { useState } from "react";

// interface Member {
//   id: string;
//   name: string;
//   level: number;
//   sponsorId: string;
//   joiningDate: string;
//   status: string;
// }

// const dummyMembers: Member[] = [
//   // Admin's downline
//   {
//     id: "MEM001",
//     name: "Alice",
//     level: 1,
//     sponsorId: "ADMIN",
//     joiningDate: "2024-06-01",
//     status: "Active",
//   },
//   {
//     id: "MEM002",
//     name: "Bob",
//     level: 1,
//     sponsorId: "ADMIN",
//     joiningDate: "2024-06-03",
//     status: "Active",
//   },

//   // Alice's downline
//   {
//     id: "MEM003",
//     name: "Charlie",
//     level: 2,
//     sponsorId: "MEM001",
//     joiningDate: "2024-06-05",
//     status: "Active",
//   },
//   {
//     id: "MEM004",
//     name: "David",
//     level: 2,
//     sponsorId: "MEM001",
//     joiningDate: "2024-06-06",
//     status: "Inactive",
//   },

//   // Bob's downline
//   {
//     id: "MEM005",
//     name: "Eve",
//     level: 2,
//     sponsorId: "MEM002",
//     joiningDate: "2024-06-07",
//     status: "Active",
//   },

//   // Charlie's downline
//   {
//     id: "MEM006",
//     name: "Frank",
//     level: 3,
//     sponsorId: "MEM003",
//     joiningDate: "2024-06-08",
//     status: "Active",
//   },

//   // David's downline
//   {
//     id: "MEM007",
//     name: "Grace",
//     level: 3,
//     sponsorId: "MEM004",
//     joiningDate: "2024-06-09",
//     status: "Inactive",
//   },
// ];

// const LevelTeam = () => {
//   const [sponsorId, setSponsorId] = useState("");
//   const [status, setStatus] = useState("");
//   const [filteredData, setFilteredData] = useState<Member[]>(dummyMembers);

//   const filter = () => {
//     const data = dummyMembers.filter((m) => {
//       return (
//         (sponsorId === "" || m.sponsorId.includes(sponsorId)) &&
//         (status === "" || m.status === status)
//       );
//     });
//     setFilteredData(data);
//   };

//   return (
//     <div className="p-4 bg-white shadow rounded-md">
//       <h2 className="text-xl font-bold mb-4">Admin View - Level Wise Team</h2>

//       <div className="flex gap-4 mb-4 flex-wrap">
//         <input
//           type="text"
//           placeholder="Filter by Sponsor ID"
//           className="border rounded px-3 py-1 w-64"
//           value={sponsorId}
//           onChange={(e) => setSponsorId(e.target.value)}
//         />
//         <select
//           className="border rounded px-3 py-1 w-40"
//           value={status}
//           onChange={(e) => setStatus(e.target.value)}
//         >
//           <option value="">All Status</option>
//           <option value="Active">Active</option>
//           <option value="Inactive">Inactive</option>
//         </select>
//         <button
//           onClick={filter}
//           className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
//         >
//           Apply Filter
//         </button>
//       </div>

//       <table className="w-full border text-left text-sm">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="p-2 border">#</th>
//             <th className="p-2 border">Member ID</th>
//             <th className="p-2 border">Name</th>
//             <th className="p-2 border">Level</th>
//             <th className="p-2 border">Sponsor ID</th>
//             <th className="p-2 border">Joining Date</th>
//             <th className="p-2 border">Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredData.map((member, idx) => (
//             <tr key={member.id} className="hover:bg-gray-50">
//               <td className="p-2 border">{idx + 1}</td>
//               <td className="p-2 border">{member.id}</td>
//               <td className="p-2 border">{member.name}</td>
//               <td className="p-2 border">{member.level}</td>
//               <td className="p-2 border">{member.sponsorId}</td>
//               <td className="p-2 border">{member.joiningDate}</td>
//               <td className="p-2 border">{member.status}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default LevelTeam;

import React, { useState } from "react";

interface Member {
  id: string;
  name: string;
  level: number;
  sponsorId: string;
  joiningDate: string;
  status: string;
}

const dummyMembers: Member[] = [
  {
    id: "MEM001",
    name: "Alice",
    level: 1,
    sponsorId: "ADMIN",
    joiningDate: "2024-06-01",
    status: "Active",
  },
  {
    id: "MEM002",
    name: "Bob",
    level: 1,
    sponsorId: "ADMIN",
    joiningDate: "2024-06-03",
    status: "Active",
  },
  {
    id: "MEM003",
    name: "Charlie",
    level: 1,
    sponsorId: "MEM001",
    joiningDate: "2024-06-05",
    status: "Active",
  },
  {
    id: "MEM004",
    name: "David",
    level: 1,
    sponsorId: "MEM001",
    joiningDate: "2024-06-06",
    status: "Inactive",
  },
  {
    id: "MEM005",
    name: "Eve",
    level: 1,
    sponsorId: "MEM002",
    joiningDate: "2024-06-07",
    status: "Active",
  },
  {
    id: "MEM006",
    name: "Frank",
    level: 1,
    sponsorId: "MEM003",
    joiningDate: "2024-06-08",
    status: "Active",
  },
  {
    id: "MEM007",
    name: "Grace",
    level: 1,
    sponsorId: "MEM004",
    joiningDate: "2024-06-09",
    status: "Inactive",
  },
];

const LevelTeam = () => {
  const [sponsorId, setSponsorId] = useState("");
  const [status, setStatus] = useState("");
  const [level, setLevel] = useState(""); // New state for level filter
  const [filteredData, setFilteredData] = useState<Member[]>(dummyMembers);

  const filter = () => {
    const data = dummyMembers.filter((m) => {
      return (
        (sponsorId === "" || m.sponsorId.includes(sponsorId)) &&
        (status === "" || m.status === status) &&
        (level === "" || m.level === parseInt(level))
      );
    });
    setFilteredData(data);
  };

  return (
    <div className="p-4 bg-white shadow rounded-md">
      <h2 className="text-xl font-bold mb-4">Admin View - Level Wise Team</h2>

      <div className="flex gap-4 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Filter by Sponsor ID"
          className="border rounded px-3 py-1 w-64"
          value={sponsorId}
          onChange={(e) => setSponsorId(e.target.value)}
        />
        <select
          className="border rounded px-3 py-1 w-40"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <select
          className="border rounded px-3 py-1 w-32"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          <option value="">All Levels</option>
          <option value="1">Level 1</option>
          <option value="2">Level 2</option>
          <option value="3">Level 3</option>
        </select>
        <button
          onClick={filter}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Apply Filter
        </button>
      </div>

      <table className="w-full border text-left text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">#</th>
            <th className="p-2 border">Member ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Level</th>
            <th className="p-2 border">Sponsor ID</th>
            <th className="p-2 border">Joining Date</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((member, idx) => (
            <tr key={member.id} className="hover:bg-gray-50">
              <td className="p-2 border">{idx + 1}</td>
              <td className="p-2 border">{member.id}</td>
              <td className="p-2 border">{member.name}</td>
              <td className="p-2 border">{member.level}</td>
              <td className="p-2 border">{member.sponsorId}</td>
              <td className="p-2 border">{member.joiningDate}</td>
              <td className="p-2 border">{member.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LevelTeam;
