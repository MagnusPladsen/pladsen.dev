const REPO_ORDER = 'privacy: PUBLIC, ownerAffiliations: OWNER, orderBy: { field: PUSHED_AT, direction: DESC }';

export const SNAPSHOT_QUERY = `
query Snapshot($login: String!) {
  user(login: $login) {
    repositories(first: 100, ${REPO_ORDER}) {
      nodes {
        name
        url
        description
        isFork
        stargazerCount
        createdAt
        pushedAt
        primaryLanguage { name color }
        latestRelease { tagName publishedAt url }
      }
    }
    recent: repositories(first: 6, ${REPO_ORDER}) {
      nodes {
        name
        defaultBranchRef {
          target {
            ... on Commit {
              history(first: 6) {
                nodes { oid abbreviatedOid message messageHeadline committedDate additions deletions url }
              }
            }
          }
        }
      }
    }
    contributionsCollection {
      contributionCalendar { weeks { contributionDays { date contributionCount } } }
    }
  }
}`;
