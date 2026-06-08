import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import CarAssignment from '@/models/CarAssignment';

async function getAdminFromRequest(request: NextRequest) {
  const adminId = request.headers.get('x-admin-id');
  if (!adminId) {
    return { error: 'Unauthorized.', status: 401 };
  }
  await connectDB();
  const admin = await User.findOne({ _id: adminId, role: 'admin' });
  if (!admin) {
    return { error: 'Admin not found.', status: 403 };
  }
  return { admin };
}

export async function GET(request: NextRequest) {
  try {
    const result = await getAdminFromRequest(request);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    const { searchParams } = new URL(request.url);
    const carId = searchParams.get('carId');
    const vendorId = searchParams.get('vendorId');
    const status = searchParams.get('status');

    const filter: Record<string, unknown> = {};
    if (carId) filter.carId = carId;
    if (vendorId) filter.vendorId = vendorId;
    if (status) filter.status = status;

    const assignments = await CarAssignment.find(filter)
      .populate('carId', 'carName vehicleNumber pricePerKM')
      .populate('vendorId', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json(assignments, { status: 200 });
  } catch (error) {
    console.error('Admin car-assignments GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch assignments.' }, { status: 500 });
  }
}
