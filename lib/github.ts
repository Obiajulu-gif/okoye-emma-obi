import { createHash } from "node:crypto";

import type { GitHubCredibilityStats, ProjectAutoMetadata } from "@/types/portfolio";

type GitHubRepoCandidate = {
  name: string;
  fullName: string;
  ownerLogin: string;
  stars: number;
  pushedAt?: string;
  description?: string;
  homepage?: string;
  topics: string[];
  primaryLanguage?: string;
  url: string;
};

type ResolvedProjectMetadata = {
  repoName: string;
  autoMetadata: ProjectAutoMetadata;
  needsRepo: boolean;
  needsImage: boolean;
};

const DEFAULT_REVALIDATE = 60 * 60 * 6;
const GITHUB_API = "https://api.github.com";
const GITHUB_GRAPHQL = "https://api.github.com/graphql";

const githubToken = process.env.GITHUB_TOKEN;

function normalizeName(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, "");
}

function levenshtein(a: string, b: string) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const matrix = Array.from({ length: b.length + 1 }, () => new Array<number>(a.length + 1));

  for (let i = 0; i <= b.length; i += 1) matrix[i][0] = i;
  for (let j = 0; j <= a.length; j += 1) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i += 1) {
    for (let j = 1; j <= a.length; j += 1) {
      const cost = b[i - 1] === a[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }

  return matrix[b.length][a.length];
}

function similarityScore(a: string, b: string) {
  const normalizedA = normalizeName(a);
  const normalizedB = normalizeName(b);
  const maxLen = Math.max(normalizedA.length, normalizedB.length, 1);
  const distance = levenshtein(normalizedA, normalizedB);
  return 1 - distance / maxLen;
}

async function githubFetch<T>(
  input: string,
  init?: RequestInit,
): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("Accept", "application/vnd.github+json");
  headers.set("User-Agent", "okoye-emma-obi-portfolio");

  if (githubToken) {
    headers.set("Authorization", `Bearer ${githubToken}`);
  }

  const response = await fetch(input, {
    ...init,
    headers,
    next: { revalidate: DEFAULT_REVALIDATE },
  });

  if (!response.ok) {
    throw new Error(`GitHub request failed (${response.status}) for ${input}`);
  }

  return (await response.json()) as T;
}

async function githubGraphql<T>(query: string, variables: Record<string, unknown>) {
  if (!githubToken) {
    throw new Error("GITHUB_TOKEN missing for GraphQL");
  }

  const response = await fetch(GITHUB_GRAPHQL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${githubToken}`,
      "User-Agent": "okoye-emma-obi-portfolio",
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: DEFAULT_REVALIDATE },
  });

  if (!response.ok) {
    throw new Error(`GitHub GraphQL failed (${response.status})`);
  }

  const payload = (await response.json()) as {
    data?: T;
    errors?: Array<{ message: string }>;
  };

  if (payload.errors?.length) {
    throw new Error(payload.errors.map((err) => err.message).join("; "));
  }

  if (!payload.data) {
    throw new Error("Empty GraphQL response");
  }

  return payload.data;
}

async function getUserOrganizations(username: string): Promise<string[]> {
  try {
    const orgs = await githubFetch<Array<{ login: string }>>(
      `${GITHUB_API}/users/${username}/orgs?per_page=100`,
    );
    return orgs.map((org) => org.login.toLowerCase());
  } catch {
    return [];
  }
}

function mapRestRepo(repo: {
  name: string;
  full_name: string;
  stargazers_count: number;
  pushed_at?: string;
  description?: string;
  homepage?: string;
  owner?: { login: string };
  language?: string;
  html_url: string;
  topics?: string[];
}): GitHubRepoCandidate {
  return {
    name: repo.name,
    fullName: repo.full_name,
    ownerLogin: repo.owner?.login ?? "",
    stars: repo.stargazers_count,
    pushedAt: repo.pushed_at,
    description: repo.description ?? "",
    homepage: repo.homepage ?? "",
    topics: repo.topics ?? [],
    primaryLanguage: repo.language ?? "",
    url: repo.html_url,
  };
}

async function searchReposWithRest(projectName: string): Promise<GitHubRepoCandidate[]> {
  const q = encodeURIComponent(`${projectName} in:name`);
  const result = await githubFetch<{
    items: Array<{
      name: string;
      full_name: string;
      stargazers_count: number;
      pushed_at?: string;
      description?: string;
      homepage?: string;
      owner?: { login: string };
      language?: string;
      html_url: string;
      topics?: string[];
    }>;
  }>(`${GITHUB_API}/search/repositories?q=${q}&per_page=30&sort=updated`);

  return result.items.map(mapRestRepo);
}

async function searchReposWithGraphql(projectName: string): Promise<GitHubRepoCandidate[]> {
  type GraphQlResult = {
    search: {
      nodes: Array<{
        name: string;
        nameWithOwner: string;
        stargazerCount: number;
        pushedAt?: string;
        description?: string;
        homepageUrl?: string;
        url: string;
        owner?: { login: string };
        primaryLanguage?: { name: string };
        repositoryTopics?: { nodes: Array<{ topic: { name: string } }> };
      }>;
    };
  };

  const query = `
    query($searchQuery: String!) {
      search(query: $searchQuery, type: REPOSITORY, first: 30) {
        nodes {
          ... on Repository {
            name
            nameWithOwner
            stargazerCount
            pushedAt
            description
            homepageUrl
            url
            owner { login }
            primaryLanguage { name }
            repositoryTopics(first: 10) {
              nodes { topic { name } }
            }
          }
        }
      }
    }
  `;

  const data = await githubGraphql<GraphQlResult>(query, {
    searchQuery: `${projectName} in:name sort:updated-desc`,
  });

  return data.search.nodes.map((repo) => ({
    name: repo.name,
    fullName: repo.nameWithOwner,
    ownerLogin: repo.owner?.login ?? "",
    stars: repo.stargazerCount,
    pushedAt: repo.pushedAt,
    description: repo.description ?? "",
    homepage: repo.homepageUrl ?? "",
    topics: repo.repositoryTopics?.nodes.map((item) => item.topic.name) ?? [],
    primaryLanguage: repo.primaryLanguage?.name,
    url: repo.url,
  }));
}

async function isContributor(fullName: string, username: string): Promise<boolean> {
  try {
    const contributors = await githubFetch<Array<{ login?: string }>>(
      `${GITHUB_API}/repos/${fullName}/contributors?per_page=100`,
    );

    return contributors.some(
      (contributor) => contributor.login?.toLowerCase() === username.toLowerCase(),
    );
  } catch {
    return false;
  }
}

function rankCandidate(
  candidate: GitHubRepoCandidate,
  projectName: string,
  username: string,
  orgs: string[],
  contributor: boolean,
): number {
  const similarity = similarityScore(projectName, candidate.name);
  const normalizedProject = normalizeName(projectName);
  const normalizedCandidate = normalizeName(candidate.name);
  const ownerLower = candidate.ownerLogin.toLowerCase();

  let score = similarity * 100;

  if (normalizedProject === normalizedCandidate) {
    score += 35;
  }

  if (ownerLower === username.toLowerCase()) {
    score += 70;
  }

  if (orgs.includes(ownerLower)) {
    score += 30;
  }

  if (contributor) {
    score += 25;
  }

  score += Math.min(candidate.stars, 250) * 0.3;

  if (candidate.pushedAt) {
    const ageDays = Math.max(
      1,
      Math.floor((Date.now() - new Date(candidate.pushedAt).getTime()) / (1000 * 60 * 60 * 24)),
    );
    score += Math.max(0, 12 - ageDays / 30);
  }

  return score;
}

function buildOgImageUrl(fullName: string) {
  const hash = createHash("sha256").update(fullName).digest("hex").slice(0, 24);
  return `https://opengraph.githubassets.com/${hash}/${fullName}`;
}

async function isImageReachable(url: string) {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      next: { revalidate: DEFAULT_REVALIDATE },
    });

    if (!res.ok) {
      return false;
    }

    const type = res.headers.get("content-type") || "";
    return type.includes("image") || url.includes("opengraph.githubassets.com");
  } catch {
    return false;
  }
}

function resolveMaybeRelativeReadmeImage(fullName: string, url: string) {
  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  const cleaned = url.replace(/^\.\//, "").replace(/^\//, "");
  return `https://raw.githubusercontent.com/${fullName}/HEAD/${cleaned}`;
}

async function extractReadmeImage(fullName: string): Promise<string | undefined> {
  try {
    const headers = new Headers({
      Accept: "application/vnd.github.raw+json",
      "User-Agent": "okoye-emma-obi-portfolio",
    });
    if (githubToken) {
      headers.set("Authorization", `Bearer ${githubToken}`);
    }

    const response = await fetch(`${GITHUB_API}/repos/${fullName}/readme`, {
      headers,
      next: { revalidate: DEFAULT_REVALIDATE },
    });

    if (!response.ok) {
      return undefined;
    }

    const markdown = await response.text();

    const markdownMatches = [...markdown.matchAll(/!\[[^\]]*\]\(([^)\s]+)[^)\n]*\)/g)].map(
      (match) => match[1],
    );
    const htmlMatches = [...markdown.matchAll(/<img[^>]*src=["']([^"']+)["'][^>]*>/gi)].map(
      (match) => match[1],
    );

    const all = [...markdownMatches, ...htmlMatches]
      .map((url) => resolveMaybeRelativeReadmeImage(fullName, url))
      .filter(Boolean);

    const preferred =
      all.find((url) => /preview|screenshot|hero|cover|demo|ui/i.test(url)) || all[0];

    if (!preferred) {
      return undefined;
    }

    if (await isImageReachable(preferred)) {
      return preferred;
    }

    return undefined;
  } catch {
    return undefined;
  }
}

async function extractCommonAssetImage(fullName: string): Promise<string | undefined> {
  const candidates = [
    "public/preview.png",
    "public/hero.png",
    "public/screenshot.png",
    "assets/preview.png",
    "assets/hero.png",
    "docs/preview.png",
    "preview.png",
    "hero.png",
  ];

  for (const path of candidates) {
    try {
      const data = await githubFetch<{
        download_url?: string;
      }>(`${GITHUB_API}/repos/${fullName}/contents/${path}`);

      if (data.download_url && (await isImageReachable(data.download_url))) {
        return data.download_url;
      }
    } catch {
      // ignore and continue
    }
  }

  return undefined;
}

export async function resolveProjectFromGitHub(
  projectName: string,
  username = "Obiajulu-gif",
): Promise<ResolvedProjectMetadata> {
  const orgs = await getUserOrganizations(username);

  let candidates: GitHubRepoCandidate[] = [];

  try {
    candidates = githubToken
      ? await searchReposWithGraphql(projectName)
      : await searchReposWithRest(projectName);
  } catch {
    try {
      candidates = await searchReposWithRest(projectName);
    } catch {
      candidates = [];
    }
  }

  if (!candidates.length) {
    return {
      repoName: projectName,
      autoMetadata: {
        fetchedAt: new Date().toISOString(),
      },
      needsRepo: true,
      needsImage: true,
    };
  }

  const topCandidates = candidates.slice(0, 6);

  const contributorFlags = await Promise.all(
    topCandidates.map(async (candidate) => {
      if (candidate.ownerLogin.toLowerCase() === username.toLowerCase()) {
        return true;
      }

      return isContributor(candidate.fullName, username);
    }),
  );

  const ranked = topCandidates
    .map((candidate, index) => ({
      candidate,
      score: rankCandidate(candidate, projectName, username, orgs, contributorFlags[index]),
    }))
    .sort((a, b) => b.score - a.score);

  const best = ranked[0]?.candidate;

  if (!best) {
    return {
      repoName: projectName,
      autoMetadata: {
        fetchedAt: new Date().toISOString(),
      },
      needsRepo: true,
      needsImage: true,
    };
  }

  const ogImage = buildOgImageUrl(best.fullName);
  let heroImageUrl: string | undefined;

  if (await isImageReachable(ogImage)) {
    heroImageUrl = ogImage;
  } else {
    heroImageUrl = (await extractReadmeImage(best.fullName)) || (await extractCommonAssetImage(best.fullName));
  }

  return {
    repoName: projectName,
    autoMetadata: {
      githubUrl: best.url,
      description: best.description,
      tags: best.topics,
      languages: best.primaryLanguage ? [best.primaryLanguage] : [],
      homepage: best.homepage,
      heroImageUrl,
      fetchedAt: new Date().toISOString(),
    },
    needsRepo: false,
    needsImage: !heroImageUrl,
  };
}

async function fetchAllOwnerRepos(username: string) {
  const repos: Array<{ stargazers_count: number }> = [];

  for (let page = 1; page <= 10; page += 1) {
    const pageData = await githubFetch<Array<{ stargazers_count: number }>>(
      `${GITHUB_API}/users/${username}/repos?per_page=100&page=${page}&type=owner&sort=updated`,
    );

    repos.push(...pageData);

    if (pageData.length < 100) {
      break;
    }
  }

  return repos;
}

function isoDaysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

function parseNumber(value: string | undefined) {
  if (!value) return 0;
  const digits = value.replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}

async function fetchContributionsLastYear(username: string) {
  try {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 365);

    const url = `https://github.com/users/${username}/contributions?from=${from
      .toISOString()
      .slice(0, 10)}&to=${to.toISOString().slice(0, 10)}`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "okoye-emma-obi-portfolio",
      },
      next: { revalidate: DEFAULT_REVALIDATE },
    });

    if (!response.ok) {
      return 0;
    }

    const body = await response.text();
    const exactMatch = body.match(/([\d,]+)\s+contributions?\s+in\s+the\s+last\s+year/i);
    if (exactMatch?.[1]) {
      return parseNumber(exactMatch[1]);
    }

    const titleMatch = body.match(/data-level="\d"[^>]*>\s*<title>\s*([\d,]+)\s+contributions?/i);
    if (titleMatch?.[1]) {
      return parseNumber(titleMatch[1]);
    }

    return 0;
  } catch {
    return 0;
  }
}

export async function fetchGitHubCredibility(
  username = "Obiajulu-gif",
): Promise<GitHubCredibilityStats> {
  try {
    if (githubToken) {
      type GraphData = {
        user: {
          followers: { totalCount: number };
          repositories: {
            totalCount: number;
            nodes: Array<{ stargazerCount: number }>;
            pageInfo: { hasNextPage: boolean; endCursor?: string };
          };
          contributionsCollection: {
            totalCommitContributions: number;
            contributionCalendar: {
              totalContributions: number;
            };
          };
        };
        mergedPrs: {
          issueCount: number;
        };
      };

      const query = `
        query($login: String!, $from: DateTime!, $to: DateTime!, $mergedQuery: String!) {
          user(login: $login) {
            followers { totalCount }
            repositories(first: 100, ownerAffiliations: OWNER, isFork: false, orderBy: {field: UPDATED_AT, direction: DESC}) {
              totalCount
              nodes { stargazerCount }
              pageInfo { hasNextPage endCursor }
            }
            contributionsCollection(from: $from, to: $to) {
              totalCommitContributions
              contributionCalendar {
                totalContributions
              }
            }
          }
          mergedPrs: search(query: $mergedQuery, type: ISSUE, first: 1) {
            issueCount
          }
        }
      `;

      const from = isoDaysAgo(365);
      const to = new Date().toISOString();

      const data = await githubGraphql<GraphData>(query, {
        login: username,
        from,
        to,
        mergedQuery: `type:pr author:${username} is:merged merged:>=${from.slice(0, 10)}`,
      });

      const totalStars = data.user.repositories.nodes.reduce(
        (sum, repo) => sum + repo.stargazerCount,
        0,
      );

      return {
        username,
        publicRepos: data.user.repositories.totalCount,
        followers: data.user.followers.totalCount,
        totalStars,
        approxCommitsLastYear: data.user.contributionsCollection.totalCommitContributions,
        mergedPrsLastYear: data.mergedPrs.issueCount,
        contributionsLastYear:
          data.user.contributionsCollection.contributionCalendar.totalContributions,
        activitySummary: {
          pushEvents: data.user.contributionsCollection.totalCommitContributions,
          pullRequests: data.mergedPrs.issueCount,
          issues: 0,
          starsGiven: 0,
        },
        source: "graphql",
        updatedAt: new Date().toISOString(),
      };
    }

    const user = await githubFetch<{
      public_repos: number;
      followers: number;
    }>(`${GITHUB_API}/users/${username}`);

    const repos = await fetchAllOwnerRepos(username);
    const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);

    const events: Array<{
      type: string;
      created_at: string;
      payload?: { size?: number };
    }> = [];

    for (let page = 1; page <= 10; page += 1) {
      const pageEvents = await githubFetch<Array<{
        type: string;
        created_at: string;
        payload?: { size?: number };
      }>>(`${GITHUB_API}/users/${username}/events/public?per_page=100&page=${page}`);

      if (!pageEvents.length) {
        break;
      }

      events.push(...pageEvents);

      const oldest = pageEvents[pageEvents.length - 1];
      if (new Date(oldest.created_at).getTime() < Date.now() - 365 * 24 * 60 * 60 * 1000) {
        break;
      }
    }

    const oneYearAgo = Date.now() - 365 * 24 * 60 * 60 * 1000;
    const withinYear = events.filter((event) => new Date(event.created_at).getTime() >= oneYearAgo);

    const pushCommitCount = withinYear
      .filter((event) => event.type === "PushEvent")
      .reduce((sum, event) => sum + (event.payload?.size || 1), 0);

    const contributionsLastYear = await fetchContributionsLastYear(username);

    const oldestTrackedEvent = withinYear.length
      ? new Date(withinYear[withinYear.length - 1].created_at).getTime()
      : 0;
    const coverageDays = oldestTrackedEvent
      ? Math.max(1, Math.round((Date.now() - oldestTrackedEvent) / (1000 * 60 * 60 * 24)))
      : 0;

    const estimatedFromContributions = contributionsLastYear
      ? Math.round(contributionsLastYear * 0.55)
      : 0;
    const approxCommits = coverageDays >= 300
      ? pushCommitCount
      : Math.max(pushCommitCount, estimatedFromContributions);

    const merged = await githubFetch<{ total_count: number }>(
      `${GITHUB_API}/search/issues?q=${encodeURIComponent(
        `type:pr author:${username} is:merged merged:>=${new Date(oneYearAgo)
          .toISOString()
          .slice(0, 10)}`,
      )}&per_page=1`,
    );

    return {
      username,
      publicRepos: user.public_repos,
      followers: user.followers,
      totalStars,
      approxCommitsLastYear: approxCommits,
      mergedPrsLastYear: merged.total_count,
      contributionsLastYear,
      activitySummary: {
        pushEvents: withinYear.filter((event) => event.type === "PushEvent").length,
        pullRequests: withinYear.filter((event) => event.type === "PullRequestEvent").length,
        issues: withinYear.filter((event) => event.type === "IssuesEvent").length,
        starsGiven: withinYear.filter((event) => event.type === "WatchEvent").length,
      },
      source: "rest",
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return {
      username,
      publicRepos: 0,
      followers: 0,
      totalStars: 0,
      approxCommitsLastYear: 0,
      mergedPrsLastYear: 0,
      activitySummary: {
        pushEvents: 0,
        pullRequests: 0,
        issues: 0,
        starsGiven: 0,
      },
      source: "fallback",
      updatedAt: new Date().toISOString(),
    };
  }
}
