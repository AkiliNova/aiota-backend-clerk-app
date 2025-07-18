import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";
import { getAuth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET() {
  const events = await prisma.aiEvent.findMany({
    orderBy: { timestamp: "desc" },
    take: 5,
    include: {
      camera: { include: { zone: true } },
    },
  });

  const totalCount = await prisma.aiEvent.count();

  return Response.json({
    success: true,
    data: {
      events,
      totalCount,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Received alert:', body);

    const {
      camera_id,
      event,
      timestamp,
      description,
      severity
    } = body;

    const savedEvent = await prisma.aiEvent.create({
      data: {
        cameraId: parseInt(camera_id), // must be valid Camera.id
        eventType: event,              // must be valid enum EventType
        timestamp: new Date(timestamp),
        description: description || '',
        severity: severity || 1,
        tenantId: body.tenantId || 'default-tenant', // provide a valid tenantId
        label: body.label || '',                     // provide a label or empty string
        confidence: body.confidence || 0,            // provide a confidence value
        detectedAt: body.detectedAt ? new Date(body.detectedAt) : new Date(), // provide detectedAt or now
        mediaUrl: body.mediaUrl || ''                // provide mediaUrl or empty string
      }
    });

    console.log('Saved event:', savedEvent);

    return NextResponse.json(
      { success: true, message: 'Alert saved', data: savedEvent },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error saving alert:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, message: 'Invalid request', errorMessage },
      { status: 400 }
    );
  }
}
