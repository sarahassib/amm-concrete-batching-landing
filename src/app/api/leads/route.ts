import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

/* =====================================================
   POST /api/leads
   Receives a lead from the landing page form and stores
   it in the Supabase `leads` table.
   ===================================================== */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { type, fullName, company, phone, email, city, plantType, requestType, projectStage, productService, position, experience, message, confirmation } = body;

    if (!type || !fullName || !phone || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("leads")
      .insert({
        type,
        full_name: fullName,
        company: company || null,
        phone,
        email,
        city: city || null,
        plant_type: plantType || null,
        request_type: requestType || null,
        project_stage: projectStage || null,
        product_service: productService || null,
        position: position || null,
        experience: experience || null,
        message: message || null,
        confirmation: confirmation || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to save lead" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, lead: data }, { status: 201 });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/* =====================================================
   GET /api/leads
   Returns all leads. Requires valid admin_token cookie.
   ===================================================== */
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("admin_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json(
        { error: "Failed to fetch leads" },
        { status: 500 }
      );
    }

    return NextResponse.json({ leads: data }, { status: 200 });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
