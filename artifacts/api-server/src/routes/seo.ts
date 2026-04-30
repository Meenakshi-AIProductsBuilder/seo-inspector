import { Router, type IRouter } from "express";
import { AnalyzeSeoBody, AnalyzeSeoResponse } from "@workspace/api-zod";
import { analyzeSeo } from "../lib/seo-analyzer";

const router: IRouter = Router();

router.post("/seo/analyze", async (req, res): Promise<void> => {
  const parsed = AnalyzeSeoBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { url } = parsed.data;

  try {
    const result = await analyzeSeo(url);
    const validated = AnalyzeSeoResponse.parse(result);
    res.json(validated);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to analyze URL";
    req.log.warn({ url, err }, "SEO analysis failed");
    res.status(422).json({ error: message });
  }
});

export default router;
