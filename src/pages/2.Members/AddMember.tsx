// import React, { useState } from 'react'

// const AddMember = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     dateOfJoining: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
//     mobileNo: '',
//     emailId: '',
//     sponsorCode: '',
//     sponsorName: '',
//     position: ''
//   })

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }))
//   }

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     console.log('Form submitted:', formData)
//   }

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'F2') {
//       e.preventDefault()
//       handleSubmit(e as any)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-200">
//       {/* Header */}
//       <div className="bg-purple-600 text-white px-6 py-4">
//         <h1 className="text-xl font-medium">Membership Form</h1>
//       </div>

//       <div className="p-6">
//         <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//           <form onSubmit={handleSubmit} onKeyDown={handleKeyPress}>
//             {/* Personal Details Section */}
//             <div className="mb-4">
//               <h2 className="text-2xl font-medium text-blue-600 mb-3">Personal Details</h2>

//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {/* Name */}
//                 <div>
//                   <label className="block text-gray-700 text-sm mb-2">
//                     Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                     required
//                   />
//                 </div>

//                 {/* Date of Joining */}
//                 <div>
//                   <label className="block text-gray-700 text-sm mb-2">
//                     Date of Joining <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="date"
//                     name="dateOfJoining"
//                     value={formData.dateOfJoining}
//                     onChange={handleInputChange}
//                     min={new Date().toISOString().split('T')[0]}
//                     max={new Date().toISOString().split('T')[0]}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                     required
//                   />
//                 </div>

//                 {/* Mobile No */}
//                 <div>
//                   <label className="block text-gray-700 text-sm mb-2">
//                     Mobile No <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="tel"
//                     name="mobileNo"
//                     value={formData.mobileNo}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                     required
//                   />
//                 </div>

//                 {/* Email Id */}
//                 <div>
//                   <label className="block text-gray-700 text-sm mb-2">
//                     Email Id
//                   </label>
//                   <input
//                     type="email"
//                     name="emailId"
//                     value={formData.emailId}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Joining Details Section */}
//             <div className="mb-6">
//               <h2 className="text-2xl font-medium text-red-600 mb-4">Joining Details</h2>

//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//                 {/* Sponsor Code */}
//                 <div>
//                   <label className="block text-gray-700 text-sm mb-2">
//                     Sponsor Code <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="sponsorCode"
//                     value={formData.sponsorCode}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                     required
//                   />
//                 </div>

//                 {/* Sponsor Name */}
//                 <div>
//                   <label className="block text-gray-700 text-sm mb-2">
//                     Sponsor Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="sponsorName"
//                     value={formData.sponsorName}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Position
//               <div className="max-w-md">
//                 <label className="block text-gray-700 text-sm mb-2">
//                   Position <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   name="position"
//                   value={formData.position}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
//                   required
//                 >
//                   <option value="">Select</option>
//                   <option value="left">Left</option>
//                   <option value="right">Right</option>
//                 </select>
//               </div> */}

//             </div>

//             {/* Submit Button */}
//             <div className="flex justify-center">
//               <button
//                 type="submit"
//                 className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-8 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
//               >
//                 Submit (F2)
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default AddMember

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const AddMember = () => {
  const [formData, setFormData] = useState({
    name: "",
    dateOfJoining: new Date().toISOString().split("T")[0],
    mobileNo: "",
    emailId: "",
    sponsorCode: "",
    sponsorName: "",
    position: "",
    panNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Form submitted:", formData);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "F2") {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="bg-purple-600 text-white px-6 py-5 rounded-t-xl">
          <h1 className="text-2xl font-semibold">Membership Registration</h1>
          {/* <p className="text-sm">
            Please fill in the details to register a new member.
          </p> */}
        </div>

        <form
          onSubmit={handleSubmit}
          onKeyDown={handleKeyPress}
          className="p-6 space-y-6"
        >
          {/* Personal Details */}
          <div>
            <h2 className="text-xl font-semibold text-blue-600 mb-4">
              Personal Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Date of Joining *
                </label>
                <input
                  type="date"
                  name="dateOfJoining"
                  value={formData.dateOfJoining}
                  onChange={handleInputChange}
                  min={formData.dateOfJoining}
                  max={formData.dateOfJoining}
                  className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Mobile No *
                </label>
                <input
                  type="tel"
                  name="mobileNo"
                  value={formData.mobileNo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Email ID
                </label>
                <input
                  type="email"
                  name="emailId"
                  value={formData.emailId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Joining Details */}
          <div>
            <h2 className="text-xl font-semibold text-red-600 mb-4">
              Joining Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Sponsor Code *
                </label>
                <input
                  type="text"
                  name="sponsorCode"
                  value={formData.sponsorCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Sponsor Name *
                </label>
                <input
                  type="text"
                  name="sponsorName"
                  value={formData.sponsorName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Position *
                </label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md border-gray-300 bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
                >
                  <option value="">Select Position</option>
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </select>
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div>
            <h2 className="text-xl font-semibold text-purple-700 mb-4">
              Account Security
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-sm font-medium mb-1">
                  Password *
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md border-gray-300 pr-10 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-9 right-3 text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="text-center pt-6">
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-8 py-3 rounded-lg shadow-lg transition"
            >
              Submit (F2)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMember;
