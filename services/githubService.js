const GITHUB_API_BASE = 'https://api.github.com';

function parsePullRequestUrl(url) {
  const regex = /github\.com\/(.*?)\/(.*?)\/pull\/(\d+)/i;
  const match = url.match(regex);
  if (!match) {
    throw new Error('GitHub PR URL inválida. Use o formato https://github.com/owner/repo/pull/123');
  }

  return {
    owner: match[1],
    repo: match[2],
    pullNumber: match[3],
  };
}

async function getPRDetails(url) {
  const { owner, repo, pullNumber } = parsePullRequestUrl(url);

  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'taskmaster-mcp',
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/pulls/${pullNumber}`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Erro ao consultar PR no GitHub (${response.status}): ${body}`);
  }

  const data = await response.json();
  return {
    id: data.id,
    number: data.number,
    title: data.title,
    state: data.state,
    author: data.user?.login,
    html_url: data.html_url,
    merged: Boolean(data.merged_at),
  };
}

module.exports = {
  getPRDetails,
};
