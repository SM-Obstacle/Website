"use server";

import { redirect } from "next/navigation";

export async function searchMappack(formData: FormData) {
  const mxId = formData.get("mappack-search-mx-id");
  if (!mxId) return;
  redirect(`/mappack/${mxId}`);
}
