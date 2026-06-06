import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Car from '@/models/Car';
import VendorDocument from '@/models/VendorDocument';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const vendor = await User.findOne({ _id: params.id, role: 'vendor' })
      .select('name email status createdAt');

    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found.' }, { status: 404 });
    }

    const cars = await Car.find({ vendorId: params.id }).sort({ createdAt: -1 });
    const documents = await VendorDocument.findOne({ vendorId: params.id });

    return NextResponse.json({ vendor, cars, documents }, { status: 200 });
  } catch (error) {
    console.error('Vendor detail GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch vendor details.' }, { status: 500 });
  }
}
