import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";
import { getAuth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET() {
  const events = await prisma.surveillanceEvent.findMany({
    orderBy: { timestamp: "desc" },
    take: 5,
    include: {
      camera: { include: { zone: true } },
    },
  });

  const totalCount = await prisma.surveillanceEvent.count();

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

    const savedEvent = await prisma.surveillanceEvent.create({
      data: {
        cameraId: parseInt(camera_id), // must be valid Camera.id
        eventType: event,              // must be valid enum EventType
        timestamp: new Date(timestamp),
        description: description || '',
        severity: severity || 1
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
