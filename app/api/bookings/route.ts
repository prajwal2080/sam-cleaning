import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { ensureBookingIndexes, getDb } from "../../../lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_DURATION_MINUTES = 120;
const WORK_START_MIN = 8 * 60;
const WORK_END_MIN = 20 * 60;

type BookingDoc = {
  _id?: ObjectId;
  serviceDateYmd: string; // YYYY-MM-DD
  serviceDateDisplay?: string; // original dd/mm/yyyy from flatpickr
  serviceTime?: string;
  startMin: number; // minutes since midnight
  endMin: number; // minutes since midnight
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

function hhmmToMinutes(value: string) {
  if (!/^\d{2}:\d{2}$/.test(value)) return null;
  const [hhRaw, mmRaw] = value.split(":");
  const hh = Number.parseInt(hhRaw, 10);
  const mm = Number.parseInt(mmRaw, 10);
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null;
  if (hh < 0 || hh > 23 || mm < 0 || mm > 59) return null;
  return hh * 60 + mm;
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
      .collection<Pick<BookingDoc, "serviceDateYmd" | "startMin" | "endMin">>(
        "bookings"
      )
      .find(query)
      .project({ serviceDateYmd: 1, startMin: 1, endMin: 1 })
      .toArray();

    const bookings = docs
      .filter(
        (d) =>
          typeof d.serviceDateYmd === "string" &&
          isYmd(d.serviceDateYmd) &&
          typeof (d as any).startMin === "number" &&
          typeof (d as any).endMin === "number"
      )
      .map((d) => ({
        serviceDateYmd: d.serviceDateYmd,
        startMin: (d as any).startMin as number,
        endMin: (d as any).endMin as number,
      }));

    const dates = Array.from(new Set(bookings.map((b) => b.serviceDateYmd)));

    return NextResponse.json({ dates, bookings });
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

    const serviceTime = pickString(formData, "serviceTime");
    if (!serviceTime) {
      return NextResponse.json(
        { error: "Missing serviceTime" },
        { status: 400 }
      );
    }

    const startMin = hhmmToMinutes(serviceTime);
    if (startMin === null) {
      return NextResponse.json(
        { error: "Invalid serviceTime format" },
        { status: 400 }
      );
    }

    const endMin = startMin + DEFAULT_DURATION_MINUTES;

    if (startMin < WORK_START_MIN || endMin > WORK_END_MIN) {
      return NextResponse.json(
        { error: "Selected time is not available." },
        { status: 400 }
      );
    }

    const overlap = await db.collection<Pick<BookingDoc, "_id">>("bookings").findOne(
      {
        serviceDateYmd,
        startMin: { $lt: endMin },
        endMin: { $gt: startMin },
      },
      { projection: { _id: 1 } }
    );

    if (overlap) {
      return NextResponse.json(
        { error: "That time is already booked." },
        { status: 409 }
      );
    }

    const doc: BookingDoc = {
      serviceDateYmd,
      serviceDateDisplay,
      serviceTime,
      startMin,
      endMin,
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
      startMin,
      endMin,
    });
  } catch (err: any) {
    if (err && typeof err === "object" && err.code === 11000) {
      return NextResponse.json(
        { error: "That time is already booked." },
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
