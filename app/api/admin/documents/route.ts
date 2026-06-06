import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import VendorDocument from '@/models/VendorDocument';
import User from '@/models/User';

const DOC_FIELDS = ['drivingLicense', 'registrationCertificate', 'insurance', 'pollutionCertificate', 'policeVerification'] as const;

export async function GET() {
  try {
    await connectDB();

    const docs = await VendorDocument.find()
      .populate('vendorId', 'name email status')
      .sort({ updatedAt: -1 });

    return NextResponse.json(docs, { status: 200 });
  } catch (error) {
    console.error('Admin documents GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch documents.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { vendorId, field, status, rejectedReason } = body;

    if (!vendorId || !field || !DOC_FIELDS.includes(field) || !status) {
      return NextResponse.json({ error: 'vendorId, field, and status are required.' }, { status: 400 });
    }

    if (!['verified', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Status must be "verified" or "rejected".' }, { status: 400 });
    }

    const doc = await VendorDocument.findOne({ vendorId });
    if (!doc) {
      return NextResponse.json({ error: 'Vendor documents not found.' }, { status: 404 });
    }

    const current = doc[field as keyof typeof doc] as any;
    current.status = status;
    if (status === 'rejected') {
      current.rejectedReason = rejectedReason || '';
    } else {
      current.rejectedReason = '';
    }

    await doc.save();

    return NextResponse.json({ message: `Document ${status}.`, document: doc }, { status: 200 });
  } catch (error) {
    console.error('Admin documents PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update document status.' }, { status: 500 });
  }
}
