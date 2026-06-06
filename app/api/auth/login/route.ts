import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    if (
      user.role === 'vendor' &&
      (user.status === 'pending' || user.status === 'inactive')
    ) {
      return NextResponse.json(
        {
          error:
            'Your vendor account is currently inactive or pending admin approval.',
        },
        { status: 403 }
      );
    }

    const sessionPayload = {
      id: user._id,
      email: user.email,
      role: user.role,
      status: user.status,
    };

    return NextResponse.json(
      {
        message: 'Login successful.',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        },
        session: sessionPayload,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'Login failed. Please try again later.' },
      { status: 500 }
    );
  }
}
