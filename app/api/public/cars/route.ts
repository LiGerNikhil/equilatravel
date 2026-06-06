import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Car from '@/models/Car';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();

    const availableCars = await Car.find({ isAvailable: true })
      .sort({ createdAt: -1 })
      .lean();

    if (availableCars.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    const vendorIds = Array.from(new Set(availableCars.map((c) => c.vendorId)));

    const activeVendors = await User.find({
      _id: { $in: vendorIds },
      role: 'vendor',
      status: 'active',
    })
      .select('name email')
      .lean();

    const activeVendorMap = new Map(
      activeVendors.map((v) => [v._id.toString(), v]),
    );

    const cars = availableCars
      .filter((c) => activeVendorMap.has(c.vendorId.toString()))
      .map((c) => ({
        _id: c._id,
        carName: c.carName,
        vehicleNumber: c.vehicleNumber,
        pricePerKM: c.pricePerKM,
        isAvailable: c.isAvailable,
        images: c.images,
        features: c.features,
        vendorName: activeVendorMap.get(c.vendorId.toString())!.name,
        vendorEmail: activeVendorMap.get(c.vendorId.toString())!.email,
      }));

    return NextResponse.json(cars, { status: 200 });
  } catch (error) {
    console.error('Public cars GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available cars.' },
      { status: 500 }
    );
  }
}
