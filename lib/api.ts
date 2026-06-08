export type Enquiry = {
  _id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  pickup: string;
  destination: string;
  date: string;
  message: string;
  status: 'pending' | 'assigned' | 'completed';
  assignedCarId?: string;
  assignedCarName?: string;
  assignedCarNumber?: string;
  assignedCarPrice?: number;
  createdAt: string;
};

export async function fetchEnquiries(): Promise<Enquiry[]> {
  const res = await fetch("/api/enquiries", { cache: "no-store" });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Failed to fetch enquiries");
  return Array.isArray(data) ? data : [];
}

export async function submitEnquiry(payload: {
  name: string;
  phone: string;
  email?: string;
  service?: string;
  pickup?: string;
  destination?: string;
  date?: string;
  message?: string;
}): Promise<unknown> {
  const res = await fetch("/api/enquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Failed to submit enquiry");
  return data;
}

export type Vendor = {
  _id: string;
  name: string;
  email: string;
  status: "pending" | "active" | "inactive";
  createdAt: string;
};

export type AdminCar = {
  _id: string;
  carName: string;
  vehicleNumber: string;
  pricePerKM: number;
  isAvailable: boolean;
  images: string[];
  features: string[];
  vendorId: {
    _id: string;
    name: string;
    email: string;
  };
};

export async function fetchVendors(): Promise<Vendor[]> {
  const res = await fetch("/api/admin/vendors", { cache: "no-store" });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Failed to fetch vendors");
  return Array.isArray(data) ? data : [];
}

export async function updateVendorStatus(id: string, status: string): Promise<unknown> {
  const res = await fetch("/api/admin/vendors", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Failed to update vendor");
  return data;
}

export async function fetchAdminCars(): Promise<AdminCar[]> {
  const res = await fetch("/api/admin/cars", { cache: "no-store" });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Failed to fetch cars");
  return Array.isArray(data) ? data : [];
}

export async function toggleAdminCar(carId: string, isAvailable: boolean): Promise<unknown> {
  const res = await fetch("/api/admin/cars", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ carId, isAvailable }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Failed to update car");
  return data;
}

export type VendorCar = {
  _id: string;
  carName: string;
  vehicleNumber: string;
  pricePerKM: number;
  isAvailable: boolean;
  status: 'available' | 'booked' | 'assigned';
  images: string[];
  features: string[];
  isBooked?: boolean;
  booking?: {
    customerName: string;
    date: string;
    pickup: string;
    destination: string;
    status: string;
  } | null;
};

export type CarAssignment = {
  _id: string;
  carId: {
    _id: string;
    carName: string;
    vehicleNumber: string;
    pricePerKM: number;
    images?: string[];
  };
  vendorId: {
    _id: string;
    name: string;
    email: string;
  };
  assignedBy: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  startDate: string;
  endDate?: string;
  pickup?: string;
  destination?: string;
  status: 'active' | 'completed';
  createdAt: string;
};

export async function fetchVendorCars(vendorId: string): Promise<VendorCar[]> {
  const res = await fetch("/api/vendor/cars", {
    headers: { "x-vendor-id": vendorId },
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Failed to fetch cars");
  return Array.isArray(data) ? data : [];
}

export async function createVendorCar(
  vendorId: string,
  payload: { carName: string; vehicleNumber: string; pricePerKM: number; images?: string[]; features?: string[] }
): Promise<unknown> {
  const res = await fetch("/api/vendor/cars", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-vendor-id": vendorId },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Failed to add car");
  return data;
}

export async function updateVendorCar(
  vendorId: string,
  carId: string,
  payload: { carName?: string; vehicleNumber?: string; pricePerKM?: number; images?: string[]; features?: string[] }
): Promise<unknown> {
  const res = await fetch("/api/vendor/cars", {
    method: "PUT",
    headers: { "Content-Type": "application/json", "x-vendor-id": vendorId },
    body: JSON.stringify({ carId, ...payload }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Failed to update car");
  return data;
}

export async function deleteVendorCar(vendorId: string, carId: string): Promise<unknown> {
  const res = await fetch("/api/vendor/cars", {
    method: "DELETE",
    headers: { "Content-Type": "application/json", "x-vendor-id": vendorId },
    body: JSON.stringify({ carId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Failed to delete car");
  return data;
}

export type PublicCar = {
  _id: string;
  carName: string;
  vehicleNumber: string;
  pricePerKM: number;
  isAvailable: boolean;
  images: string[];
  features: string[];
  vendorName: string;
};

export async function fetchPublicCars(): Promise<PublicCar[]> {
  const res = await fetch("/api/public/cars", { cache: "no-store" });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Failed to fetch cars");
  return Array.isArray(data) ? data : [];
}

export async function toggleCarAvailability(
  vendorId: string,
  carId: string
): Promise<unknown> {
  const res = await fetch("/api/vendor/cars/toggle", {
    method: "PATCH",
    headers: { "Content-Type": "application/json", "x-vendor-id": vendorId },
    body: JSON.stringify({ carId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Failed to toggle availability");
  return data;
}

export async function fetchAdminAssignments(filters?: { carId?: string; vendorId?: string; status?: string }): Promise<CarAssignment[]> {
  const raw = localStorage.getItem("equila_admin_session");
  if (!raw) throw new Error("Not authenticated");
  const session = JSON.parse(raw);
  const params = new URLSearchParams();
  if (filters?.carId) params.set('carId', filters.carId);
  if (filters?.vendorId) params.set('vendorId', filters.vendorId);
  if (filters?.status) params.set('status', filters.status);
  const qs = params.toString();
  const res = await fetch(`/api/admin/car-assignments${qs ? `?${qs}` : ''}`, {
    headers: { "x-admin-id": session.id },
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Failed to fetch assignments");
  return Array.isArray(data) ? data : [];
}

export async function createCarAssignment(payload: {
  carId: string;
  vendorId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  startDate?: string;
  endDate?: string;
  pickup?: string;
  destination?: string;
}): Promise<unknown> {
  const raw = localStorage.getItem("equila_admin_session");
  if (!raw) throw new Error("Not authenticated");
  const session = JSON.parse(raw);
  const res = await fetch("/api/admin/car-assign", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-admin-id": session.id },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Failed to assign car");
  return data;
}

export async function fetchVendorAssignments(vendorId: string, status?: string): Promise<CarAssignment[]> {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  const qs = params.toString();
  const res = await fetch(`/api/vendor/car-assignments${qs ? `?${qs}` : ''}`, {
    headers: { "x-vendor-id": vendorId },
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Failed to fetch assignments");
  return Array.isArray(data) ? data : [];
}
