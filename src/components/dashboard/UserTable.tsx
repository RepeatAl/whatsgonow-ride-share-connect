
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Phone, Mail, Search, Plus, Minus } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  region: string;
  joinDate: Date;
  kycVerified: boolean;
  phone: string;
  rating: {
    average: number;
    count: number;
  };
  orderHistory: Order[];
}

interface Order {
  id: string;
  userId: string;
  status: 'pending' | 'accepted' | 'in_transit' | 'delivered' | 'completed' | 'cancelled';
  amount: number;
  commission: number;
  date: Date;
  region: string;
}

interface UserTableProps {
  users: User[];
}

export const UserTable = ({ users }: UserTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const filteredUsers = users.filter((user) => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpand = (userId: string) => {
    if (expandedUser === userId) {
      setExpandedUser(null);
    } else {
      setExpandedUser(userId);
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-500";
    if (rating >= 3.5) return "text-blue-500";
    if (rating >= 2.5) return "text-yellow-500";
    return "text-red-500";
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold">Active Users</h2>
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableCaption>List of users in the selected region</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Contact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <>
                  <TableRow key={user.id} className={expandedUser === user.id ? "border-b-0" : ""}>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => toggleExpand(user.id)}
                      >
                        {expandedUser === user.id ? 
                          <Minus className="h-4 w-4" /> : 
                          <Plus className="h-4 w-4" />
                        }
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.region}</TableCell>
                    <TableCell>{formatDate(user.joinDate)}</TableCell>
                    <TableCell>
                      {user.kycVerified ? (
                        <span className="inline-flex items-center text-green-600">
                          <BadgeCheck className="h-4 w-4 mr-1" /> Verified
                        </span>
                      ) : (
                        <Button size="sm" variant="outline" className="text-xs h-7">
                          Verify KYC
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className={`font-medium ${getRatingColor(user.rating.average)}`}>
                          {user.rating.average.toFixed(1)}
                        </span>
                        <span className="text-muted-foreground ml-1">
                          ({user.rating.count})
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="icon" variant="ghost" title={user.phone}>
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" title={user.email}>
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {expandedUser === user.id && (
                    <TableRow>
                      <TableCell colSpan={7} className="bg-muted/30 px-6 py-4">
                        <div>
                          <h4 className="font-medium mb-2">Order History</h4>
                          {user.orderHistory.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No orders yet</p>
                          ) : (
                            <div className="space-y-2">
                              {user.orderHistory.map((order) => (
                                <div key={order.id} className="text-sm grid grid-cols-4 gap-2">
                                  <div>{order.id}</div>
                                  <div>{formatDate(order.date)}</div>
                                  <div className="capitalize">{order.status.replace('_', ' ')}</div>
                                  <div>${order.amount.toFixed(2)}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
