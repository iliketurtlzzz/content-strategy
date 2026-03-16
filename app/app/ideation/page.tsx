"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function IdeationRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace("/create"); }, [router]);
  return null;
}
