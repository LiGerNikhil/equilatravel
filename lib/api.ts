export type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  destination: string;
  pickup?: string;
  service?: string;
  message: string;
  timestamp?: string;
  date?: string;
};

export async function fetchLeads(): Promise<Lead[]> {
  const response = await fetch("/api/leads", {
    method: "GET",
    cache: "no-store",
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || "Failed to fetch leads");
  }
  return Array.isArray(data) ? data : [];
}

export async function createLead(payload: {
  name: string;
  phone: string;
  email: string;
  destination: string;
  pickup?: string;
  service?: string;
  date?: string;
  message: string;
}): Promise<unknown> {
  const response = await fetch("/api/submit-lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || "Failed to submit lead");
  }
  return data;
}

export async function updateLead(payload: {
  id: string;
  name: string;
  phone: string;
  email: string;
  destination: string;
  pickup?: string;
  service?: string;
  date?: string;
  message: string;
}): Promise<unknown> {
  const response = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "update", ...payload }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || "Failed to update lead");
  }
  return data;
}

export async function deleteLead(id: string): Promise<unknown> {
  const response = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "delete", id }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || "Failed to delete lead");
  }
  return data;
}


