import { readFileSync, existsSync } from "fs";
import { join } from "path";

interface Tool {
  slug: string;
  name: string;
  category: string;
  url: string;
  description: string;
  pricing: string;
  affiliate_url: string;
  tags: string[];
  scores: {
    github_repos: number;
    qiita_mentions: number;
    composite: number;
  };
  rank: number;
  last_updated: string;
}

interface Rankings {
  generated_at: string;
  total_tools: number;
  rankings: Tool[];
}

function loadRankings(): Rankings {
  // Try multiple paths for compatibility between local dev and Vercel
  const candidates = [
    join(process.cwd(), "public", "rankings.json"),
    join(process.cwd(), "..", "data", "rankings.json"),
  ];
  for (const p of candidates) {
    if (existsSync(p)) {
      return JSON.parse(readFileSync(p, "utf-8"));
    }
  }
  // Inline fallback data if no file found
  return { generated_at: new Date().toISOString(), total_tools: 0, rankings: [] };
}

const CATEGORY_COLORS: Record<string, string> = {
  "AI Assistant": "bg-blue-100 text-blue-800",
  "AI Code Editor": "bg-green-100 text-green-800",
  "AI Image Generation": "bg-purple-100 text-purple-800",
  "AI Video": "bg-red-100 text-red-800",
  "AI Audio": "bg-yellow-100 text-yellow-800",
  "AI Marketing": "bg-orange-100 text-orange-800",
  "AI Productivity": "bg-teal-100 text-teal-800",
  "AI Search": "bg-indigo-100 text-indigo-800",
  "AI UI Generator": "bg-pink-100 text-pink-800",
  "AI App Builder": "bg-cyan-100 text-cyan-800",
};

function ScoreBar({ score, max }: { score: number; max: number }) {
  const pct = max > 0 ? Math.min((score / max) * 100, 100) : 0;
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function Home() {
  const data = loadRankings();
  const maxScore = Math.max(...data.rankings.map((t) => t.scores.composite), 1);
  const categories = [...new Set(data.rankings.map((t) => t.category))].sort();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              AI Tools Ranking
            </h1>
            <p className="text-sm text-gray-500">
              Developer community mentions-based ranking
            </p>
          </div>
          <div className="text-right text-xs text-gray-400">
            <p>Updated: {new Date(data.generated_at).toLocaleDateString("ja-JP")}</p>
            <p>{data.total_tools} tools tracked</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <span
              key={cat}
              className={`px-3 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[cat] || "bg-gray-100 text-gray-800"}`}
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Rankings */}
        <div className="space-y-4">
          {data.rankings.map((tool) => (
            <div
              key={tool.slug}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                {/* Rank */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                  {tool.rank}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <a
                      href={tool.affiliate_url || tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      {tool.name}
                    </a>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[tool.category] || "bg-gray-100 text-gray-800"}`}
                    >
                      {tool.category}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">
                    {tool.description}
                  </p>
                  <p className="text-gray-500 text-xs mb-3">
                    {tool.pricing}
                  </p>

                  {/* Score bar */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <ScoreBar score={tool.scores.composite} max={maxScore} />
                    </div>
                    <span className="text-sm font-medium text-gray-700 w-16 text-right">
                      {tool.scores.composite} pts
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {tool.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="flex-shrink-0">
                  <a
                    href={tool.affiliate_url || tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Try it
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200 text-center text-gray-400 text-sm">
          <p>
            Rankings based on developer community mentions across GitHub, Qiita, and social media.
          </p>
          <p className="mt-2">
            Data updated daily. Some links may be affiliate links.
          </p>
        </footer>
      </main>
    </div>
  );
}
