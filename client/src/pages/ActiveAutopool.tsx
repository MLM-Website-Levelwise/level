
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ActiveAutopool = () => {
  const [amount, setAmount] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const tableHeaders = [
    "Sl",
    "Member ID",
    "Member Name", 
    "Autopool Activate Date"
  ];

  const handleSendAmount = () => {
    console.log("Sending amount:", amount);
    // Add logic to handle amount sending
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="bg-red-600 text-white">
          <CardTitle className="text-xl font-bold">Autopool Members</CardTitle>
        </CardHeader>
        <CardContent className="p-6 bg-yellow-50">
          {/* Amount input section */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-3">
              <Input
                placeholder="enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-64"
              />
              <Button 
                onClick={handleSendAmount}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              >
                Send Amount
              </Button>
            </div>
          </div>

          {/* Export buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button variant="outline" size="sm">Copy</Button>
            <Button variant="outline" size="sm">CSV</Button>
            <Button variant="outline" size="sm">Excel</Button>
            <Button variant="outline" size="sm">PDF</Button>
            <Button variant="outline" size="sm">Print</Button>
          </div>

          {/* Search */}
          <div className="flex justify-end mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">Search:</span>
              <Input
                placeholder=""
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>

          {/* Table */}
          <div className="border border-gray-300 rounded">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  {tableHeaders.map((header, index) => (
                    <TableHead key={index} className="border-r border-gray-300 last:border-r-0 text-black font-medium">
                      <div className="flex items-center gap-1">
                        {header}
                        <span className="text-xs">↕</span>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={tableHeaders.length} className="text-center py-8 text-gray-500">
                    No data available in table
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <span>Showing 0 to 0 of 0 entries</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActiveAutopool;
