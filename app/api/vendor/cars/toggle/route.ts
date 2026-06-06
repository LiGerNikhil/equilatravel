import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Car from '@/models/Car';
import User from '@/models/User';

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

export async function PATCH(request: NextRequest) {
  try {
    const result = await getVendorFromRequest(request);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    const body = await request.json();
    const { carId } = body;

    if (!carId) {
      return NextResponse.json(
        { error: 'carId is required.' },
        { status: 400 }
      );
    }

    const car = await Car.findOne({ _id: carId, vendorId: result.vendor._id });
    if (!car) {
      return NextResponse.json(
        { error: 'Car not found or does not belong to you.' },
        { status: 404 }
      );
    }

    car.isAvailable = !car.isAvailable;
    await car.save();

    return NextResponse.json(
      { message: `Car is now ${car.isAvailable ? 'available' : 'unavailable'}.`, car },
      { status: 200 }
    );
  } catch (error) {
    console.error('Vendor cars toggle error:', error);
    return NextResponse.json(
      { error: 'Failed to toggle availability.' },
      { status: 500 }
    );
  }
}
