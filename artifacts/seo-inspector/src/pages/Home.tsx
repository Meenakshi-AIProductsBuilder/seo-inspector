import { useState, useEffect } from "react";
import { Search, Activity, Globe, LayoutTemplate, MessageSquare, TerminalSquare, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { useAnalyzeSeo } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

// Assume we have these components implemented below
import { ScoreGauge } from "../components/seo/ScoreGauge";
import { GooglePreview } from "../components/seo/GooglePreview";
import { OpenGraphPreview } from "../components/seo/OpenGraphPreview";
import { TwitterPreview } from "../components/seo/TwitterPreview";
import { TagChecksList } from "../components/seo/TagChecksList";
import { RawTagsTable } from "../components/seo/RawTagsTable";

export default function Home() {
  const [url, setUrl] = useState("");
  const analyzeSeo = useAnalyzeSeo();

  const handleAnalyze = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!url) return;
    
    // Add protocol if missing
    let targetUrl = url;
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = `https://${targetUrl}`;
      setUrl(targetUrl);
    }
    
    analyzeSeo.mutate({ data: { url: targetUrl } });
  };

  const handleExampleClick = (example: string) => {
    setUrl(example);
    analyzeSeo.mutate({ data: { url: example } });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <Activity className="w-5 h-5" />
            <h1 className="font-mono font-bold tracking-tight text-lg">SEO_INSPECTOR</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 container max-w-6xl mx-auto px-4 py-8 flex flex-col gap-8">
        
        {/* Search Bar */}
        <section className="flex flex-col items-center justify-center py-12 px-4 border border-border/50 rounded-xl bg-card/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
          <h2 className="text-3xl font-bold mb-6 text-center tracking-tight">Audit any URL with precision.</h2>
          <form onSubmit={handleAnalyze} className="w-full max-w-2xl relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
            <Input
              data-testid="input-url"
              className="w-full h-14 pl-12 pr-32 text-lg bg-background border-border/50 focus-visible:ring-primary font-mono placeholder:text-muted-foreground/50 rounded-lg shadow-sm"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Button 
              data-testid="button-analyze"
              type="submit" 
              className="absolute right-2 h-10 px-6 font-bold tracking-wide"
              disabled={analyzeSeo.isPending || !url}
            >
              {analyzeSeo.isPending ? "SCANNING..." : "ANALYZE"}
            </Button>
          </form>

          {!analyzeSeo.data && !analyzeSeo.isPending && (
            <div className="mt-8 flex items-center gap-3 text-sm text-muted-foreground font-mono">
              <span>Try:</span>
              {["github.com", "stripe.com", "vercel.com"].map(example => (
                <button 
                  key={example}
                  onClick={() => handleExampleClick(`https://${example}`)}
                  className="hover:text-primary transition-colors underline decoration-border underline-offset-4"
                >
                  {example}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Loading State */}
        {analyzeSeo.isPending && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
            <div className="col-span-1 border border-border/50 rounded-xl p-6 bg-card/30 h-64"></div>
            <div className="col-span-3 border border-border/50 rounded-xl p-6 bg-card/30 h-64"></div>
            <div className="col-span-4 border border-border/50 rounded-xl p-6 bg-card/30 h-96"></div>
          </div>
        )}

        {/* Error State */}
        {analyzeSeo.isError && (
          <div className="border border-destructive/30 bg-destructive/10 text-destructive rounded-xl p-8 flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-2">Analysis Failed</h3>
              <p className="text-destructive/80 font-mono text-sm">{analyzeSeo.error?.error || "Could not fetch or analyze the provided URL. Make sure it's accessible."}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {analyzeSeo.data && (
          <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* Score Overview */}
              <div className="lg:col-span-1">
                <Card className="h-full border-border/50 bg-card/30 shadow-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Health Score</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center py-6 gap-6">
                    <ScoreGauge score={analyzeSeo.data.score.overall} size="lg" />
                    
                    <div className="w-full space-y-4 mt-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">General</span>
                        <span className="font-mono font-bold text-foreground">{analyzeSeo.data.score.general}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Open Graph</span>
                        <span className="font-mono font-bold text-foreground">{analyzeSeo.data.score.openGraph}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Twitter</span>
                        <span className="font-mono font-bold text-foreground">{analyzeSeo.data.score.twitter}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Previews */}
              <div className="lg:col-span-3">
                <Card className="h-full border-border/50 bg-card/30 shadow-none">
                  <CardHeader>
                    <CardTitle className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Visual Previews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="google" className="w-full">
                      <TabsList className="mb-6 bg-background/50 border border-border/50">
                        <TabsTrigger value="google" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"><Globe className="w-4 h-4 mr-2" /> Google</TabsTrigger>
                        <TabsTrigger value="social" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"><LayoutTemplate className="w-4 h-4 mr-2" /> Open Graph</TabsTrigger>
                        <TabsTrigger value="twitter" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"><MessageSquare className="w-4 h-4 mr-2" /> Twitter/X</TabsTrigger>
                      </TabsList>
                      <TabsContent value="google" className="mt-0">
                        <GooglePreview data={analyzeSeo.data.googlePreview} />
                      </TabsContent>
                      <TabsContent value="social" className="mt-0">
                        <OpenGraphPreview data={analyzeSeo.data.openGraphPreview} />
                      </TabsContent>
                      <TabsContent value="twitter" className="mt-0">
                        <TwitterPreview data={analyzeSeo.data.twitterPreview} />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Tag Checks */}
            <Card className="border-border/50 bg-card/30 shadow-none">
              <CardHeader>
                <CardTitle className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Tag Diagnostics</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="general" className="w-full">
                  <TabsList className="mb-6 bg-background/50 border border-border/50">
                    <TabsTrigger value="general" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">General</TabsTrigger>
                    <TabsTrigger value="technical" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Technical</TabsTrigger>
                    <TabsTrigger value="og" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Open Graph</TabsTrigger>
                    <TabsTrigger value="twitter" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Twitter</TabsTrigger>
                  </TabsList>
                  <TabsContent value="general" className="mt-0">
                    <TagChecksList checks={analyzeSeo.data.generalChecks} />
                  </TabsContent>
                  <TabsContent value="technical" className="mt-0">
                    <TagChecksList checks={analyzeSeo.data.technicalChecks} />
                  </TabsContent>
                  <TabsContent value="og" className="mt-0">
                    <TagChecksList checks={analyzeSeo.data.openGraphChecks} />
                  </TabsContent>
                  <TabsContent value="twitter" className="mt-0">
                    <TagChecksList checks={analyzeSeo.data.twitterChecks} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Raw Tags */}
            <Accordion type="single" collapsible className="border border-border/50 rounded-xl bg-card/30 px-6">
              <AccordionItem value="raw-tags" className="border-none">
                <AccordionTrigger className="hover:no-underline py-6">
                  <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground uppercase tracking-wider">
                    <TerminalSquare className="w-4 h-4" />
                    Raw Meta Tags
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <RawTagsTable tags={analyzeSeo.data.rawTags} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>

          </div>
        )}
      </main>
    </div>
  );
}
