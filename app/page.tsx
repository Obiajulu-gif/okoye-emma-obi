import { PortfolioClient } from "@/components/site/portfolio-client";
import { fetchGitHubCredibility } from "@/lib/github";
import { getPortfolioData } from "@/lib/portfolio";

export const revalidate = 60 * 30;

export default async function HomePage() {
  const [data, githubStats] = await Promise.all([
    getPortfolioData(),
    fetchGitHubCredibility("Obiajulu-gif"),
  ]);

  return <PortfolioClient data={data} githubStats={githubStats} />;
}
