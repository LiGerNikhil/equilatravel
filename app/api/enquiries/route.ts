import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Enquiry from '@/models/Enquiry';

export async function GET() {
  try {
    await connectDB();
    const enquiries = await Enquiry.find({}).sort({ createdAt: -1 });
    return NextResponse.json(enquiries, { status: 200 });
  } catch (error) {
    console.error('Enquiries GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch enquiries.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, service, pickup, destination, date, message } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone are required.' }, { status: 400 });
    }

    await connectDB();

    const enquiry = await Enquiry.create({
      name,
      phone,
      email: email || '',
      service: service || '',
      pickup: pickup || '',
      destination: destination || '',
      date: date || '',
      message: message || '',
    });

    return NextResponse.json({ success: true, enquiry }, { status: 201 });
  } catch (error) {
    console.error('Enquiries POST error:', error);
    return NextResponse.json({ error: 'Failed to submit enquiry.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Enquiry ID is required.' }, { status: 400 });
    }

    await connectDB();

    const enquiry = await Enquiry.findByIdAndDelete(id);

    if (!enquiry) {
      return NextResponse.json({ error: 'Enquiry not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Enquiry deleted.' }, { status: 200 });
  } catch (error) {
    console.error('Enquiries DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete enquiry.' }, { status: 500 });
  }
}
