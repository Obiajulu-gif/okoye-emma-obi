export async function extractOgImage(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PortfolioBot/1.0)",
      },
      redirect: "follow",
      next: { revalidate: 60 * 60 * 6 },
    });

    if (!response.ok) {
      return null;
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) {
      return null;
    }

    const html = await response.text();

    const metaMatch =
      html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i) ||
      html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["'][^>]*>/i);

    if (!metaMatch?.[1]) {
      return null;
    }

    return new URL(metaMatch[1], url).toString();
  } catch {
    return null;
  }
}
