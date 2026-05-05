import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { ensureBookingIndexes, getDb } from "../../../lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type BookingDoc = {
  _id?: ObjectId;
  serviceDateYmd: string; // YYYY-MM-DD
  serviceDateDisplay?: string; // original dd/mm/yyyy from flatpickr
  serviceTime?: string;
  serviceType?: string;
  frequency?: string;
  rooms?: string;
  bedrooms?: string;
  bathrooms?: string;
  propertyType?: string;
  approxSf?: string;
  zipCode?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  address?: string;
  createdAt: Date;
};

function isYmd(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function ddmmyyyyToYmd(serviceDate: string) {
  const parts = serviceDate.split("/").map((p) => p.trim());
  if (parts.length !== 3) return null;
  const [dd, mm, yyyy] = parts;
  if (!dd || !mm || !yyyy) return null;
  const ymd = `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  return isYmd(ymd) ? ymd : null;
}

function pickString(formData: FormData, key: string) {
  const raw = formData.get(key);
  if (typeof raw !== "string") return undefined;
  const trimmed = raw.trim();
  return trimmed ? trimmed : undefined;
}

export async function GET(request: Request) {
  try {
    await ensureBookingIndexes();
    const db = await getDb();

    const url = new URL(request.url);
    const from = url.searchParams.get("from") || undefined;
    const to = url.searchParams.get("to") || undefined;

    const query: Record<string, unknown> = {};
    const dateRange: Record<string, string> = {};
    if (from && isYmd(from)) dateRange.$gte = from;
    if (to && isYmd(to)) dateRange.$lte = to;
    if (Object.keys(dateRange).length > 0) {
      query.serviceDateYmd = dateRange;
    }

    const docs = await db
      .collection<Pick<BookingDoc, "serviceDateYmd">>("bookings")
      .find(query)
      .project({ serviceDateYmd: 1 })
      .toArray();

    const dates = docs
      .map((d) => d.serviceDateYmd)
      .filter((d): d is string => typeof d === "string" && isYmd(d));

    return NextResponse.json({ dates });
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error("GET /api/bookings failed:", err);

    if (err && typeof err === "object" && err.syscall === "querySrv") {
      return NextResponse.json(
        {
          error:
            "MongoDB SRV DNS lookup failed (querySrv). If you're using a mongodb+srv URI, switch to a standard mongodb:// URI (see .env.example).",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await ensureBookingIndexes();
    const db = await getDb();

    const formData = await request.formData();

    const serviceDateDisplay = pickString(formData, "serviceDate");
    if (!serviceDateDisplay) {
      return NextResponse.json(
        { error: "Missing serviceDate" },
        { status: 400 }
      );
    }

    const serviceDateYmd = ddmmyyyyToYmd(serviceDateDisplay);
    if (!serviceDateYmd) {
      return NextResponse.json(
        { error: "Invalid serviceDate format" },
        { status: 400 }
      );
    }

    const doc: BookingDoc = {
      serviceDateYmd,
      serviceDateDisplay,
      serviceTime: pickString(formData, "serviceTime"),
      serviceType: pickString(formData, "serviceType"),
      frequency: pickString(formData, "frequency"),
      rooms: pickString(formData, "rooms"),
      bedrooms: pickString(formData, "bedrooms"),
      bathrooms: pickString(formData, "bathrooms"),
      propertyType: pickString(formData, "propertyType"),
      approxSf: pickString(formData, "approxSf"),
      zipCode: pickString(formData, "zipCode"),
      fullName: pickString(formData, "fullName"),
      phone: pickString(formData, "phone"),
      email: pickString(formData, "email"),
      address: pickString(formData, "address"),
      createdAt: new Date(),
    };

    const result = await db.collection<BookingDoc>("bookings").insertOne(doc);

    return NextResponse.json({
      ok: true,
      bookingId: result.insertedId.toString(),
      serviceDateYmd,
    });
  } catch (err: any) {
    if (err && typeof err === "object" && err.code === 11000) {
      return NextResponse.json(
        { error: "That date is already booked." },
        { status: 409 }
      );
    }

    if (err && typeof err === "object" && err.syscall === "querySrv") {
      return NextResponse.json(
        {
          error:
            "MongoDB SRV DNS lookup failed (querySrv). If you're using a mongodb+srv URI, switch to a standard mongodb:// URI (see .env.example).",
        },
        { status: 503 }
      );
    }

    // eslint-disable-next-line no-console
    console.error("POST /api/bookings failed:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
