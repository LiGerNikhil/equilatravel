import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Car from '@/models/Car';
import User from '@/models/User';
import CarAssignment from '@/models/CarAssignment';
import { sendCarAssignedEmail } from '@/lib/email';

async function getAdminFromRequest(request: NextRequest) {
  const adminId = request.headers.get('x-admin-id');
  if (!adminId) {
    return { error: 'Unauthorized.', status: 401 };
  }
  await connectDB();
  const admin = await User.findOne({ _id: adminId, role: 'admin' });
  if (!admin) {
    return { error: 'Admin not found.', status: 403 };
  }
  return { admin };
}

export async function POST(request: NextRequest) {
  try {
    const result = await getAdminFromRequest(request);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    const body = await request.json();
    const { carId, vendorId, customerName, customerPhone, customerEmail, startDate, endDate, pickup, destination } = body;

    if (!carId || !vendorId || !customerName || !customerPhone) {
      return NextResponse.json(
        { error: 'carId, vendorId, customerName, and customerPhone are required.' },
        { status: 400 }
      );
    }

    const car = await Car.findOne({ _id: carId, vendorId });
    if (!car) {
      return NextResponse.json({ error: 'Car not found for this vendor.' }, { status: 404 });
    }

    if (car.status !== 'available') {
      return NextResponse.json({ error: 'Car is not available for assignment.' }, { status: 409 });
    }

    const assignment = await CarAssignment.create({
      carId: car._id,
      vendorId: car.vendorId,
      assignedBy: result.admin._id,
      customerName,
      customerPhone,
      customerEmail: customerEmail || '',
      startDate: startDate || '',
      endDate: endDate || '',
      pickup: pickup || '',
      destination: destination || '',
      status: 'active',
    });

    await Car.findByIdAndUpdate(carId, {
      status: 'assigned',
      currentAssignmentId: assignment._id,
    });

    if (customerEmail) {
      sendCarAssignedEmail({
        to: customerEmail,
        customerName,
        carName: car.carName,
        carNumber: car.vehicleNumber,
        price: car.pricePerKM,
        pickup: pickup || '',
        destination: destination || '',
        date: startDate || '',
      }).catch((err) => console.error('Car assigned email failed:', err));
    }

    return NextResponse.json(
      { success: true, assignment, car: { ...car.toObject(), status: 'assigned', currentAssignmentId: assignment._id } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Admin car-assign POST error:', error);
    return NextResponse.json({ error: 'Failed to assign car.' }, { status: 500 });
  }
}
