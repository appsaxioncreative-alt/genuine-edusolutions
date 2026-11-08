"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { startTracker, pageView, linkUser } from "@/lib/tracker";
import { useAuth } from "@/context/AuthContext";

export default function Tracker() {
  const pathname = usePathname();
  const { user } = useAuth();
  useEffect(() => { startTracker(); }, []);
  useEffect(() => { pageView(pathname); }, [pathname]);
  useEffect(() => { if (user) linkUser(user.uid); }, [user]);
  return null;
}
