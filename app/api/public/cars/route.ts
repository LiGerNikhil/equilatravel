import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Car from '@/models/Car';

export async function GET() {
  try {
    await connectDB();

    const cars = await Car.aggregate([
      { $match: { isAvailable: true } },
      {
        $lookup: {
          from: 'users',
          localField: 'vendorId',
          foreignField: '_id',
          as: 'vendor',
        },
      },
      { $unwind: '$vendor' },
      { $match: { 'vendor.status': 'active' } },
      {
        $project: {
          carName: 1,
          vehicleNumber: 1,
          pricePerKM: 1,
          isAvailable: 1,
          images: 1,
          features: 1,
          vendorName: '$vendor.name',
          vendorEmail: '$vendor.email',
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    return NextResponse.json(cars, { status: 200 });
  } catch (error) {
    console.error('Public cars GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available cars.' },
      { status: 500 }
    );
  }
}
