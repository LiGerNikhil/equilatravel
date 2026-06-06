import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, role } = body;

    if (!id || !role) {
      return NextResponse.json({ error: 'ID and role are required.' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findById(id).select('role status');

    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    if (user.role !== role) {
      return NextResponse.json({ error: 'Role mismatch.' }, { status: 403 });
    }

    if (role === 'vendor' && user.status !== 'active') {
      return NextResponse.json(
        { error: 'Vendor account is not active.' },
        { status: 403 }
      );
    }

    return NextResponse.json({ valid: true }, { status: 200 });
  } catch (error) {
    console.error('Verify API error:', error);
    return NextResponse.json({ error: 'Verification failed.' }, { status: 500 });
  }
}
