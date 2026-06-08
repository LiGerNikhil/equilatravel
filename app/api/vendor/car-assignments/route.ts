import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CarAssignment from '@/models/CarAssignment';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

async function getVendorFromRequest(request: NextRequest) {
  const vendorId = request.headers.get('x-vendor-id');
  if (!vendorId) {
    return { error: 'Unauthorized. Vendor ID is required.', status: 401 };
  }
  await connectDB();
  const vendor = await User.findOne({ _id: vendorId, role: 'vendor', status: 'active' });
  if (!vendor) {
    return { error: 'Vendor not found or account is not active.', status: 403 };
  }
  return { vendor };
}

export async function GET(request: NextRequest) {
  try {
    const result = await getVendorFromRequest(request);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');

    const filter: Record<string, unknown> = { vendorId: result.vendor._id };
    if (statusFilter) filter.status = statusFilter;

    const assignments = await CarAssignment.find(filter)
      .populate('carId', 'carName vehicleNumber pricePerKM images')
      .sort({ createdAt: -1 });

    return NextResponse.json(assignments, { status: 200 });
  } catch (error) {
    console.error('Vendor car-assignments GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch assignments.' }, { status: 500 });
  }
}
