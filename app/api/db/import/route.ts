import { NextResponse } from "next/server";
import { importData } from '@/lib/db-migrate';

export async function POST(req: Request) {
  if (req.method === 'POST') {
    try {
      await importData();
      return new NextResponse("Data exported successfully.", { status: 200 });
    } catch (error) {
      return new NextResponse("An error occurred while exporting data.", { status: 500 });
    }
  } else {
    return new NextResponse("Http method not allowed.", { status: 405 });
  }
}