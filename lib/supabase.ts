// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY! // cần key có quyền "service role" để ghi file
);

export async function loadTransactions(bucket: string, filePath: string) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .download(filePath);

  if (error) {
    if (error.message.includes("not found")) {
      return { transactions: [] }; // chưa có file thì khởi tạo
    }
    throw error;
  }

  const text = await data.text();
  return JSON.parse(text);
}

export async function saveTransactions(
  data: any,
  bucket: string,
  filePath: string
) {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, JSON.stringify(data), {
      upsert: true,
      contentType: "application/json",
    });
  if (error) throw error;
}
