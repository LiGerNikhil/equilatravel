import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { sendVendorStatusEmail } from '@/lib/email';

export async function GET() {
  try {
    await connectDB();

    const vendors = await User.find({ role: 'vendor' })
      .select('name email status createdAt')
      .sort({ createdAt: -1 });

    return NextResponse.json(vendors, { status: 200 });
  } catch (error) {
    console.error('Admin vendors GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vendors.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Vendor ID and status are required.' },
        { status: 400 }
      );
    }

    const validStatuses = ['active', 'inactive', 'pending'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Status must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    await connectDB();

    const vendor = await User.findOneAndUpdate(
      { _id: id, role: 'vendor' },
      { status },
      { new: true, runValidators: true }
    ).select('name email status');

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found.' },
        { status: 404 }
      );
    }

    if (status === 'active' || status === 'inactive') {
      sendVendorStatusEmail({ to: vendor.email, name: vendor.name, status }).catch(
        (err) => console.error('Vendor status email failed:', err)
      );
    }

    return NextResponse.json(
      { message: 'Vendor status updated.', vendor },
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin vendors PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update vendor.' },
      { status: 500 }
    );
  }
}
