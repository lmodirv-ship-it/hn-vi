import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Film, Download, Loader2 } from "lucide-react";

const FN_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/share-video`;

interface SharedVideo {
  url: string;
  title: string;
  resolution: string | null;
  created_at: string;
}

export default function Share() {
  const { token } = useParams();
  const { t } = useTranslation();
  const [data, setData] = useState<SharedVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const res = await fetch(`${FN_BASE}?token=${encodeURIComponent(token)}`, {
          headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
        });
        if (!res.ok) throw new Error(await res.text());
        setData(await res.json());
      } catch (e: any) {
        setError(e.message || "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md gradient-primary">
            <Film className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold font-['Space_Grotesk']">FilmForge</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-6">
        {loading ? (
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        ) : error || !data ? (
          <div className="glass-card rounded-2xl p-10 max-w-md text-center">
            <Film className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg font-semibold mb-2">{t("share.not_found")}</p>
            <Link to="/" className="text-primary text-sm hover:underline">FilmForge →</Link>
          </div>
        ) : (
          <div className="w-full max-w-4xl">
            <h1 className="text-3xl font-bold font-['Space_Grotesk'] mb-4 text-center">{data.title}</h1>
            <div className="rounded-2xl overflow-hidden bg-black border border-border shadow-2xl shadow-primary/10">
              <video src={data.url} controls autoPlay className="w-full aspect-video bg-black" />
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <span>{data.resolution} · {new Date(data.created_at).toLocaleDateString()}</span>
              <a href={data.url} download>
                <Button size="sm" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  {t("share.download")}
                </Button>
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}