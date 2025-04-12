
import { useState, useEffect } from "react";
import { ratingService } from "@/services/ratingService";

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

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  pendingKyc: number;
  totalOrders: number;
  completedOrders: number;
  totalCommission: number;
}

// Mock data generator
const generateMockData = () => {
  const regions = ["North", "South", "East", "West", "Central"];
  const statuses = ['pending', 'accepted', 'in_transit', 'delivered', 'completed', 'cancelled'] as const;
  
  const users: User[] = [];
  const orders: Order[] = [];
  
  // Generate 50 users
  for (let i = 0; i < 50; i++) {
    const userId = `user-${i + 1}`;
    const region = regions[Math.floor(Math.random() * regions.length)];
    const joinDate = new Date();
    joinDate.setDate(joinDate.getDate() - Math.floor(Math.random() * 365));
    
    users.push({
      id: userId,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      region,
      joinDate,
      kycVerified: Math.random() > 0.3,
      phone: `+1234567${i.toString().padStart(4, '0')}`,
      rating: {
        average: Math.floor(Math.random() * 5) + 1,
        count: Math.floor(Math.random() * 50)
      },
      orderHistory: []
    });
    
    // Generate 1-5 orders for each user
    const numOrders = Math.floor(Math.random() * 5) + 1;
    for (let j = 0; j < numOrders; j++) {
      const orderDate = new Date();
      orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 180));
      
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const amount = Math.floor(Math.random() * 500) + 50;
      const commission = amount * 0.1; // 10% commission
      
      const order: Order = {
        id: `order-${users.length}-${j}`,
        userId,
        status,
        amount,
        commission,
        date: orderDate,
        region
      };
      
      orders.push(order);
    }
  }
  
  // Associate orders with users
  users.forEach(user => {
    user.orderHistory = orders.filter(order => order.userId === user.id);
  });
  
  return { users, orders };
};

export const useManagerDashboard = (selectedRegion: string) => {
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    pendingKyc: 0,
    totalOrders: 0,
    completedOrders: 0,
    totalCommission: 0
  });

  useEffect(() => {
    // In a real app, this would fetch from an API
    const { users, orders } = generateMockData();
    
    // Filter by region if needed
    const filteredUsers = selectedRegion === "all" 
      ? users 
      : users.filter(user => user.region === selectedRegion);
    
    const filteredOrders = selectedRegion === "all"
      ? orders
      : orders.filter(order => order.region === selectedRegion);
    
    // Calculate statistics
    const pendingKyc = filteredUsers.filter(user => !user.kycVerified).length;
    const completedOrders = filteredOrders.filter(order => order.status === 'completed').length;
    const totalCommission = filteredOrders
      .filter(order => order.status === 'completed')
      .reduce((sum, order) => sum + order.commission, 0);
    
    // Users with at least one order in the last 30 days are considered active
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activeUsers = filteredUsers.filter(user => {
      return user.orderHistory.some(order => order.date >= thirtyDaysAgo);
    }).length;
    
    setUsers(filteredUsers);
    setOrders(filteredOrders);
    setStats({
      totalUsers: filteredUsers.length,
      activeUsers,
      pendingKyc,
      totalOrders: filteredOrders.length,
      completedOrders,
      totalCommission
    });
  }, [selectedRegion]);

  return { users, orders, stats };
};
