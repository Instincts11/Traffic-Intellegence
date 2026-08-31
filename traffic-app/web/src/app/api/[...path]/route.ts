import { proxyFlask } from "@/lib/flask";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Ctx = { params: Promise<{ path: string[] }> };

async function handle(request: Request, ctx: Ctx) {
  const { path } = await ctx.params;
  return proxyFlask(request, `/api/${path.join("/")}`);
}

export const GET = handle;
export const POST = handle;
export const OPTIONS = handle;
