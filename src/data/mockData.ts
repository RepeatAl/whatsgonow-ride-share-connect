
export interface Transport {
  id: string;
  from: string;
  to: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  driverId: string;
  driver: {
    name: string;
    rating: number;
    totalRides: number;
    avatar: string;
    verified: boolean;
  };
  vehicle: {
    type: "car" | "van" | "bike" | "public_transport";
    model: string;
    capacity: string;
  };
  status: "upcoming" | "in_progress" | "completed";
  availableSpace: {
    weight: number; // in kg
    dimensions: string; // e.g. "30x40x50 cm"
  };
}

export interface TransportRequest {
  id: string;
  title: string;
  description: string;
  pickupLocation: string;
  deliveryLocation: string;
  pickupTimeWindow: {
    start: string;
    end: string;
  };
  deliveryTimeWindow: {
    start: string;
    end: string;
  };
  itemDetails: {
    weight: number; // in kg
    dimensions: string;
    category: string;
    photos: string[];
    value: number; // in currency
  };
  status: "pending" | "matched" | "in_transit" | "delivered";
  budget: number;
  requesterId: string;
  requester: {
    name: string;
    rating: number;
    avatar: string;
    verified: boolean;
  };
  createdAt: string;
}

export const mockTransports: Transport[] = [
  {
    id: "t1",
    from: "Berlin",
    to: "Munich",
    date: "2025-04-15",
    departureTime: "08:00",
    arrivalTime: "14:00",
    price: 25,
    driverId: "d1",
    driver: {
      name: "Max Müller",
      rating: 4.8,
      totalRides: 56,
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      verified: true
    },
    vehicle: {
      type: "car",
      model: "VW Golf",
      capacity: "Medium trunk space"
    },
    status: "upcoming",
    availableSpace: {
      weight: 10,
      dimensions: "60x40x30 cm"
    }
  },
  {
    id: "t2",
    from: "Hamburg",
    to: "Cologne",
    date: "2025-04-16",
    departureTime: "10:30",
    arrivalTime: "15:45",
    price: 20,
    driverId: "d2",
    driver: {
      name: "Lisa Schmidt",
      rating: 4.9,
      totalRides: 122,
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      verified: true
    },
    vehicle: {
      type: "car",
      model: "Audi A4",
      capacity: "Large trunk space"
    },
    status: "upcoming",
    availableSpace: {
      weight: 15,
      dimensions: "80x50x40 cm"
    }
  },
  {
    id: "t3",
    from: "Frankfurt",
    to: "Stuttgart",
    date: "2025-04-14",
    departureTime: "13:00",
    arrivalTime: "16:30",
    price: 18,
    driverId: "d3",
    driver: {
      name: "Thomas Weber",
      rating: 4.6,
      totalRides: 37,
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
      verified: true
    },
    vehicle: {
      type: "van",
      model: "Mercedes Sprinter",
      capacity: "Very large space"
    },
    status: "upcoming",
    availableSpace: {
      weight: 50,
      dimensions: "150x100x120 cm"
    }
  },
  {
    id: "t4",
    from: "Dresden",
    to: "Leipzig",
    date: "2025-04-17",
    departureTime: "09:15",
    arrivalTime: "11:00",
    price: 12,
    driverId: "d4",
    driver: {
      name: "Anna Becker",
      rating: 4.7,
      totalRides: 28,
      avatar: "https://randomuser.me/api/portraits/women/22.jpg",
      verified: false
    },
    vehicle: {
      type: "car",
      model: "Toyota Prius",
      capacity: "Small trunk space"
    },
    status: "upcoming",
    availableSpace: {
      weight: 8,
      dimensions: "50x30x20 cm"
    }
  },
  {
    id: "t5",
    from: "Dusseldorf",
    to: "Dortmund",
    date: "2025-04-16",
    departureTime: "14:45",
    arrivalTime: "16:15",
    price: 10,
    driverId: "d5",
    driver: {
      name: "Julia Hoffmann",
      rating: 5.0,
      totalRides: 76,
      avatar: "https://randomuser.me/api/portraits/women/63.jpg",
      verified: true
    },
    vehicle: {
      type: "car",
      model: "BMW 3 Series",
      capacity: "Medium trunk space"
    },
    status: "upcoming",
    availableSpace: {
      weight: 12,
      dimensions: "60x45x35 cm"
    }
  }
];

export const mockRequests: TransportRequest[] = [
  {
    id: "r1",
    title: "Office supplies delivery",
    description: "Need to transport a box of office supplies including documents and a small printer.",
    pickupLocation: "Berlin, Alexanderplatz",
    deliveryLocation: "Berlin, Kreuzberg",
    pickupTimeWindow: {
      start: "2025-04-15 10:00",
      end: "2025-04-15 14:00"
    },
    deliveryTimeWindow: {
      start: "2025-04-15 12:00",
      end: "2025-04-15 18:00"
    },
    itemDetails: {
      weight: 7,
      dimensions: "40x30x25 cm",
      category: "Electronics & Office",
      photos: ["https://images.unsplash.com/photo-1588515724527-074a7a56616c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"],
      value: 300
    },
    status: "pending",
    budget: 15,
    requesterId: "u1",
    requester: {
      name: "Martin Fischer",
      rating: 4.7,
      avatar: "https://randomuser.me/api/portraits/men/42.jpg",
      verified: true
    },
    createdAt: "2025-04-13 09:23"
  },
  {
    id: "r2",
    title: "Handmade furniture delivery",
    description: "Small handmade coffee table. Carefully packaged and ready for transport.",
    pickupLocation: "Munich, Schwabing",
    deliveryLocation: "Munich, Bogenhausen",
    pickupTimeWindow: {
      start: "2025-04-16 12:00",
      end: "2025-04-16 17:00"
    },
    deliveryTimeWindow: {
      start: "2025-04-16 14:00",
      end: "2025-04-16 20:00"
    },
    itemDetails: {
      weight: 15,
      dimensions: "80x60x40 cm",
      category: "Furniture",
      photos: ["https://images.unsplash.com/photo-1592078615290-cdcc7b61f2a1?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"],
      value: 450
    },
    status: "pending",
    budget: 25,
    requesterId: "u2",
    requester: {
      name: "Sophie Wagner",
      rating: 4.9,
      avatar: "https://randomuser.me/api/portraits/women/56.jpg",
      verified: true
    },
    createdAt: "2025-04-12 16:45"
  },
  {
    id: "r3",
    title: "Guitar transport",
    description: "Acoustic guitar in hardcase. Needs careful handling.",
    pickupLocation: "Hamburg, St. Pauli",
    deliveryLocation: "Hamburg, Altona",
    pickupTimeWindow: {
      start: "2025-04-14 18:00",
      end: "2025-04-14 20:00"
    },
    deliveryTimeWindow: {
      start: "2025-04-14 19:00",
      end: "2025-04-14 22:00"
    },
    itemDetails: {
      weight: 4,
      dimensions: "110x40x15 cm",
      category: "Musical Instruments",
      photos: ["https://images.unsplash.com/photo-1558098329-a11cff621064?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"],
      value: 800
    },
    status: "matched",
    budget: 18,
    requesterId: "u3",
    requester: {
      name: "Leon Schulz",
      rating: 4.5,
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      verified: false
    },
    createdAt: "2025-04-12 11:30"
  }
];
