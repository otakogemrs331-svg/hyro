export interface SimulatedOrder {
  id: string;
  items: {
    product_id: string;
    product_name: string;
    price: number;
    quantity: number;
  }[];
  subtotal: number;
  discount_code?: string;
  discount_amount: number;
  tax: number;
  shipping: number;
  total: number;
  shipping_details: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  created_at: string;
}

// Pre-seeded list of orders to give the admin portal rich metrics out-of-the-box
const INITIAL_ORDERS: SimulatedOrder[] = [
  {
    id: "ord-1001",
    items: [
      { product_id: "prod-1", product_name: "The Silent Canopy", price: 68.00, quantity: 1 },
      { product_id: "prod-4", product_name: "Solitude at Timberline", price: 45.00, quantity: 1 }
    ],
    subtotal: 113.00,
    discount_amount: 0.00,
    tax: 9.32,
    shipping: 15.00,
    total: 137.32,
    shipping_details: {
      fullName: "William Clark",
      address: "128 Cascade Ridge Dr",
      city: "Bend",
      state: "OR",
      zip: "97701",
      country: "USA"
    },
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
  },
  {
    id: "ord-1002",
    items: [
      { product_id: "prod-3", product_name: "Wild Foraging & Alpine Botany", price: 110.00, quantity: 2 }
    ],
    subtotal: 220.00,
    discount_code: "GOLD15",
    discount_amount: 33.00,
    tax: 15.43,
    shipping: 0.00, // Free shipping (>150 before discount, or >150 total)
    total: 202.43,
    shipping_details: {
      fullName: "Meriwether Lewis",
      address: "405 Alpine Summit Rd",
      city: "Missoula",
      state: "MT",
      zip: "59801",
      country: "USA"
    },
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  }
];

let mockOrdersCache: SimulatedOrder[] = [];

const initializeCache = () => {
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem("antigravity_mock_orders");
    if (cached) {
      try {
        mockOrdersCache = JSON.parse(cached);
        return;
      } catch (e) {
        console.error("Failed to parse mock orders cache", e);
      }
    }
  }
  mockOrdersCache = [...INITIAL_ORDERS];
  saveCache();
};

const saveCache = () => {
  if (typeof window !== "undefined") {
    localStorage.setItem("antigravity_mock_orders", JSON.stringify(mockOrdersCache));
  }
};

export const getMockOrders = (): SimulatedOrder[] => {
  if (mockOrdersCache.length === 0) {
    initializeCache();
  }
  return mockOrdersCache;
};

export const addMockOrder = (order: Omit<SimulatedOrder, "id" | "created_at">): SimulatedOrder => {
  const newOrder: SimulatedOrder = {
    ...order,
    id: `ord-${1000 + getMockOrders().length + 1}`,
    created_at: new Date().toISOString()
  };
  mockOrdersCache.push(newOrder);
  saveCache();
  return newOrder;
};

// Summary metrics calculation helper for admin dashboard
export const getSalesMetrics = () => {
  const orders = getMockOrders();
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const totalOrders = orders.length;
  const averageValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  return {
    totalRevenue,
    totalOrders,
    averageValue
  };
};
