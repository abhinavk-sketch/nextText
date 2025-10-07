import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set("pathname", request.nextUrl.pathname);
  const country = request.headers.get("cf-ipcountry");
  console.log("country", country);


  const xfwd = request.headers.get("x-forwarded-for");
  const ip = xfwd ? xfwd.split(",")[0].trim() : (request.headers.get("x-real-ip") || "");
  if (ip){
    // response.cookies.set("client_ip", ip, { httpOnly: true, path: "/" });
    console.log("ip", ip);
  }
  const vercelCountry = request.headers.get("x-vercel-ip-country");
  const vercelRegion = request.headers.get("x-vercel-ip-country-region");
  const vercelCity = request.headers.get("x-vercel-ip-city");
  const vercelLatitude = request.headers.get("x-vercel-ip-latitude");
  const vercelLongitude = request.headers.get("x-vercel-ip-longitude");
  const vercelTimezone = request.headers.get("x-vercel-ip-timezone");

  // Log Vercel geolocation data
  console.log("Vercel Geo:", {
    country: vercelCountry,
    region: vercelRegion,
    city: vercelCity,
    latitude: vercelLatitude,
    longitude: vercelLongitude,
    timezone: vercelTimezone,
    ip: ip
  });

  if (vercelCountry) {
    response.cookies.set("user-country", vercelCountry, { 
      httpOnly: false, 
      path: "/",
      sameSite: "lax"
    });
  }
  
  if (vercelCity) {
    response.cookies.set("user-city", vercelCity, { 
      httpOnly: false, 
      path: "/",
      sameSite: "lax"
    });
  }

  if (vercelRegion) {
    response.cookies.set("user-region", vercelRegion, { 
      httpOnly: false, 
      path: "/",
      sameSite: "lax"
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
