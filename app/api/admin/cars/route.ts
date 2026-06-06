import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Car from '@/models/Car';

export async function GET() {
  try {
    await connectDB();
    const cars = await Car.find({})
      .populate('vendorId', 'name email')
      .sort({ createdAt: -1 });
    return NextResponse.json(cars, { status: 200 });
  } catch (error) {
    console.error('Admin cars GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch cars.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { carId, isAvailable } = body;

    if (!carId || typeof isAvailable !== 'boolean') {
      return NextResponse.json({ error: 'carId and isAvailable are required.' }, { status: 400 });
    }

    await connectDB();

    const car = await Car.findByIdAndUpdate(
      carId,
      { isAvailable },
      { new: true }
    );

    if (!car) {
      return NextResponse.json({ error: 'Car not found.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Car availability updated.', car }, { status: 200 });
  } catch (error) {
    console.error('Admin cars PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update car.' }, { status: 500 });
  }
}
