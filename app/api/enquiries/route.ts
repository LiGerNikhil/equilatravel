import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Enquiry from '@/models/Enquiry';
import Car from '@/models/Car';
import CarAssignment from '@/models/CarAssignment';
import { sendCarAssignedEmail } from '@/lib/email';

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

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, assignedCarId, assignedCarName, assignedCarNumber, assignedCarPrice } = body;

    if (!id || !assignedCarId || !assignedCarName || !assignedCarNumber) {
      return NextResponse.json({ error: 'id, assignedCarId, assignedCarName, and assignedCarNumber are required.' }, { status: 400 });
    }

    await connectDB();

    // Find the car to get vendorId
    const car = await Car.findById(assignedCarId);
    if (!car) {
      return NextResponse.json({ error: 'Car not found.' }, { status: 404 });
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      id,
      {
        status: 'assigned',
        assignedCarId,
        assignedCarName,
        assignedCarNumber,
        assignedCarPrice: assignedCarPrice || 0,
      },
      { new: true }
    );

    if (!enquiry) {
      return NextResponse.json({ error: 'Enquiry not found.' }, { status: 404 });
    }

    // Create CarAssignment record
    const assignment = await CarAssignment.create({
      carId: car._id,
      vendorId: car.vendorId,
      assignedBy: enquiry._id,
      customerName: enquiry.name,
      customerPhone: enquiry.phone,
      customerEmail: enquiry.email,
      startDate: enquiry.date,
      pickup: enquiry.pickup,
      destination: enquiry.destination,
      status: 'active',
    });

    // Update car status
    await Car.findByIdAndUpdate(assignedCarId, {
      status: 'assigned',
      currentAssignmentId: assignment._id,
    });

    // Send confirmation email if customer provided an email
    if (enquiry.email) {
      sendCarAssignedEmail({
        to: enquiry.email,
        customerName: enquiry.name,
        carName: assignedCarName,
        carNumber: assignedCarNumber,
        price: assignedCarPrice || 0,
        pickup: enquiry.pickup,
        destination: enquiry.destination,
        date: enquiry.date,
      }).catch((err) => console.error('Car assigned email failed:', err));
    }

    return NextResponse.json({ success: true, enquiry }, { status: 200 });
  } catch (error) {
    console.error('Enquiries PUT error:', error);
    return NextResponse.json({ error: 'Failed to assign car.' }, { status: 500 });
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
