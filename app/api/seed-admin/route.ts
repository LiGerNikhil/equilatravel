import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST() {
  try {
    await connectDB();

    const existing = await User.findOne({ email: 'info@equilatravel.com' });
    if (existing) {
      return NextResponse.json(
        { message: 'Admin user already exists.', email: existing.email, role: existing.role },
        { status: 200 }
      );
    }

    const hashedPassword = await bcrypt.hash('Kamit07@SD', 10);

    const admin = new User({
      name: 'Equila Admin',
      email: 'info@equilatravel.com',
      password: hashedPassword,
      role: 'admin',
      status: 'active',
    });

    await admin.save();

    return NextResponse.json(
      { message: 'Admin user created successfully.', email: admin.email, role: admin.role },
      { status: 201 }
    );
  } catch (error) {
    console.error('Seed admin error:', error);
    return NextResponse.json(
      { error: 'Failed to seed admin user.' },
      { status: 500 }
    );
  }
}
