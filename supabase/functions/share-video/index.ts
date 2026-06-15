// Public share-video edge function: returns a signed URL for an exported
// video by share token, only if the export row is marked public.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    if (!token) return json({ error: "missing token" }, 400);

    const sb = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: row, error } = await sb
      .from("exports")
      .select("id, video_url, is_public, share_token, resolution, created_at, project_id")
      .eq("share_token", token)
      .eq("is_public", true)
      .maybeSingle();
    if (error) throw error;
    if (!row || !row.video_url) return json({ error: "not found" }, 404);

    const { data: signed, error: sErr } = await sb.storage
      .from("exports")
      .createSignedUrl(row.video_url, 3600);
    if (sErr) throw sErr;

    // Try to fetch project title for nicer display
    const { data: proj } = await sb
      .from("projects")
      .select("title")
      .eq("id", row.project_id)
      .maybeSingle();

    return json({
      url: signed.signedUrl,
      title: proj?.title ?? "FilmForge Video",
      resolution: row.resolution,
      created_at: row.created_at,
    });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}