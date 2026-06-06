import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Car from '@/models/Car';
import User from '@/models/User';

async function getVendorFromRequest(request: NextRequest) {
  const vendorId = request.headers.get('x-vendor-id');
  if (!vendorId) {
    return { error: 'Unauthorized. Vendor ID is required.', status: 401 };
  }
  await connectDB();
  const vendor = await User.findOne({ _id: vendorId, role: 'vendor', status: 'active' });
  if (!vendor) {
    return { error: 'Vendor not found or account is not active.', status: 403 };
  }
  return { vendor };
}

export async function GET(request: NextRequest) {
  try {
    const result = await getVendorFromRequest(request);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    const cars = await Car.find({ vendorId: result.vendor._id }).sort({ createdAt: -1 });

    return NextResponse.json(cars, { status: 200 });
  } catch (error) {
    console.error('Vendor cars GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch your cars.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const result = await getVendorFromRequest(request);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    const body = await request.json();
    const { carName, vehicleNumber, pricePerKM } = body;

    if (!carName || !vehicleNumber || pricePerKM == null) {
      return NextResponse.json(
        { error: 'carName, vehicleNumber, and pricePerKM are required.' },
        { status: 400 }
      );
    }

    const existing = await Car.findOne({ vehicleNumber });
    if (existing) {
      return NextResponse.json(
        { error: 'A car with that vehicle number already exists.' },
        { status: 409 }
      );
    }

    const car = new Car({
      vendorId: result.vendor._id,
      carName: carName.trim(),
      vehicleNumber: vehicleNumber.trim(),
      pricePerKM: Number(pricePerKM),
      isAvailable: false,
      images: body.images || [],
      features: body.features || [],
    });

    await car.save();

    return NextResponse.json(
      { message: 'Car added successfully.', car },
      { status: 201 }
    );
  } catch (error) {
    console.error('Vendor cars POST error:', error);
    return NextResponse.json(
      { error: 'Failed to add car.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const result = await getVendorFromRequest(request);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    const body = await request.json();
    const { carId, carName, vehicleNumber, pricePerKM, images, features } = body;

    if (!carId) {
      return NextResponse.json({ error: 'carId is required.' }, { status: 400 });
    }

    const car = await Car.findOne({ _id: carId, vendorId: result.vendor._id });
    if (!car) {
      return NextResponse.json(
        { error: 'Car not found or does not belong to you.' },
        { status: 404 }
      );
    }

    if (carName !== undefined) car.carName = carName.trim();
    if (vehicleNumber !== undefined) car.vehicleNumber = vehicleNumber.trim();
    if (pricePerKM !== undefined) car.pricePerKM = Number(pricePerKM);
    if (images !== undefined) car.images = images;
    if (features !== undefined) car.features = features;

    await car.save();

    return NextResponse.json(
      { message: 'Car updated successfully.', car },
      { status: 200 }
    );
  } catch (error) {
    console.error('Vendor cars PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update car.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const result = await getVendorFromRequest(request);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    const body = await request.json();
    const { carId } = body;

    if (!carId) {
      return NextResponse.json({ error: 'carId is required.' }, { status: 400 });
    }

    const car = await Car.findOneAndDelete({ _id: carId, vendorId: result.vendor._id });
    if (!car) {
      return NextResponse.json(
        { error: 'Car not found or does not belong to you.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Car deleted successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Vendor cars DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete car.' },
      { status: 500 }
    );
  }
}
