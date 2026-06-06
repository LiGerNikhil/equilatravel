import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import VendorDocument from '@/models/VendorDocument';
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

const DOC_FIELDS = ['drivingLicense', 'registrationCertificate', 'insurance', 'pollutionCertificate', 'policeVerification'] as const;

export async function GET(request: NextRequest) {
  try {
    const result = await getVendorFromRequest(request);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    let doc = await VendorDocument.findOne({ vendorId: result.vendor._id });

    if (!doc) {
      doc = new VendorDocument({ vendorId: result.vendor._id });
      await doc.save();
    }

    return NextResponse.json(doc, { status: 200 });
  } catch (error) {
    console.error('Vendor documents GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch documents.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const result = await getVendorFromRequest(request);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    const body = await request.json();
    const { field, documentNumber, files } = body;

    if (!field || !DOC_FIELDS.includes(field)) {
      return NextResponse.json({ error: 'Invalid document field.' }, { status: 400 });
    }

    let doc = await VendorDocument.findOne({ vendorId: result.vendor._id });
    if (!doc) {
      doc = new VendorDocument({ vendorId: result.vendor._id });
    }

    const current = doc[field as keyof typeof doc] as any;
    if (documentNumber !== undefined) current.documentNumber = documentNumber;
    if (files !== undefined) current.files = [...(current.files || []), ...files];
    if (current.status === 'rejected') {
      current.status = 'pending';
      current.rejectedReason = '';
    }

    await doc.save();

    return NextResponse.json({ message: 'Document updated.', document: doc }, { status: 200 });
  } catch (error) {
    console.error('Vendor documents POST error:', error);
    return NextResponse.json({ error: 'Failed to update documents.' }, { status: 500 });
  }
}
