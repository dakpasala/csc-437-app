export interface TeamTheme {
    name: string;
    lightColor: string;
    darkColor: string;
}

const defaultTheme: TeamTheme = {
    name: "NBA Teams",
    lightColor: "#FDB927",
    darkColor: "#552583"
};

const teamThemes: Record<string, TeamTheme> = {
    hawks: { name: "Atlanta Hawks", lightColor: "#E03A3E", darkColor: "#26282A" },
    celtics: { name: "Boston Celtics", lightColor: "#BA9653", darkColor: "#007A33" },
    nets: { name: "Brooklyn Nets", lightColor: "#FFFFFF", darkColor: "#000000" },
    hornets: { name: "Charlotte Hornets", lightColor: "#00788C", darkColor: "#1D1160" },
    bulls: { name: "Chicago Bulls", lightColor: "#CE1141", darkColor: "#000000" },
    cavs: { name: "Cleveland Cavaliers", lightColor: "#FFB81C", darkColor: "#6F263D" },
    cavaliers: { name: "Cleveland Cavaliers", lightColor: "#FFB81C", darkColor: "#6F263D" },
    mavericks: { name: "Dallas Mavericks", lightColor: "#B8C4CA", darkColor: "#00538C" },
    mavs: { name: "Dallas Mavericks", lightColor: "#B8C4CA", darkColor: "#00538C" },
    nuggets: { name: "Denver Nuggets", lightColor: "#FEC524", darkColor: "#0E2240" },
    pistons: { name: "Detroit Pistons", lightColor: "#C8102E", darkColor: "#1D42BA" },
    warriors: { name: "Golden State Warriors", lightColor: "#FFC72C", darkColor: "#1D428A" },
    rockets: { name: "Houston Rockets", lightColor: "#CE1141", darkColor: "#000000" },
    pacers: { name: "Indiana Pacers", lightColor: "#FDBB30", darkColor: "#002D62" },
    clippers: { name: "LA Clippers", lightColor: "#C8102E", darkColor: "#1D428A" },
    lakers: { name: "Los Angeles Lakers", lightColor: "#FDB927", darkColor: "#552583" },
    grizzlies: { name: "Memphis Grizzlies", lightColor: "#5D76A9", darkColor: "#12173F" },
    heat: { name: "Miami Heat", lightColor: "#F9A01B", darkColor: "#98002E" },
    bucks: { name: "Milwaukee Bucks", lightColor: "#EEE1C6", darkColor: "#00471B" },
    timberwolves: { name: "Minnesota Timberwolves", lightColor: "#78BE20", darkColor: "#0C2340" },
    wolves: { name: "Minnesota Timberwolves", lightColor: "#78BE20", darkColor: "#0C2340" },
    pelicans: { name: "New Orleans Pelicans", lightColor: "#C8102E", darkColor: "#0C2340" },
    knicks: { name: "New York Knicks", lightColor: "#F58426", darkColor: "#006BB6" },
    thunder: { name: "Oklahoma City Thunder", lightColor: "#F05133", darkColor: "#007AC1" },
    magic: { name: "Orlando Magic", lightColor: "#C4CED4", darkColor: "#0077C0" },
    sixers: { name: "Philadelphia 76ers", lightColor: "#ED174C", darkColor: "#006BB6" },
    "76ers": { name: "Philadelphia 76ers", lightColor: "#ED174C", darkColor: "#006BB6" },
    suns: { name: "Phoenix Suns", lightColor: "#E56020", darkColor: "#1D1160" },
    "trail-blazers": { name: "Portland Trail Blazers", lightColor: "#E03A3E", darkColor: "#000000" },
    blazers: { name: "Portland Trail Blazers", lightColor: "#E03A3E", darkColor: "#000000" },
    kings: { name: "Sacramento Kings", lightColor: "#63727A", darkColor: "#5A2D81" },
    spurs: { name: "San Antonio Spurs", lightColor: "#C4CED4", darkColor: "#000000" },
    raptors: { name: "Toronto Raptors", lightColor: "#CE1141", darkColor: "#000000" },
    jazz: { name: "Utah Jazz", lightColor: "#F9A01B", darkColor: "#002B5C" },
    wizards: { name: "Washington Wizards", lightColor: "#E31837", darkColor: "#002B5C" }
};

const teamAliases: Record<string, string> = {
    "atlanta-hawks": "hawks",
    "boston-celtics": "celtics",
    "brooklyn-nets": "nets",
    "charlotte-hornets": "hornets",
    "chicago-bulls": "bulls",
    "cleveland-cavaliers": "cavs",
    "dallas-mavericks": "mavericks",
    "denver-nuggets": "nuggets",
    "detroit-pistons": "pistons",
    "golden-state-warriors": "warriors",
    "houston-rockets": "rockets",
    "indiana-pacers": "pacers",
    "la-clippers": "clippers",
    "los-angeles-clippers": "clippers",
    "los-angeles-lakers": "lakers",
    "memphis-grizzlies": "grizzlies",
    "miami-heat": "heat",
    "milwaukee-bucks": "bucks",
    "minnesota-timberwolves": "timberwolves",
    "new-orleans-pelicans": "pelicans",
    "new-york-knicks": "knicks",
    "oklahoma-city-thunder": "thunder",
    "orlando-magic": "magic",
    "philadelphia-76ers": "76ers",
    "phoenix-suns": "suns",
    "portland-trail-blazers": "trail-blazers",
    "sacramento-kings": "kings",
    "san-antonio-spurs": "spurs",
    "toronto-raptors": "raptors",
    "utah-jazz": "jazz",
    "washington-wizards": "wizards"
};

function normalizeTeamId(teamId?: string) {
    if (!teamId) return "";

    const normalized = teamId
        .trim()
        .toLowerCase()
        .replace(/['.]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/-\d+$/g, "")
        .replace(/^-|-$/g, "");

    return teamAliases[normalized] || normalized;
}

export function getTeamTheme(teamId?: string): TeamTheme {
    return teamThemes[normalizeTeamId(teamId)] || defaultTheme;
}

export function applyTeamTheme(teamId?: string) {
    const theme = getTeamTheme(teamId);
    const isDarkMode = document.body.classList.contains("dark-mode");

    document.body.dataset.team = normalizeTeamId(teamId) || "nba";
    document.body.style.setProperty("--team-light-color", theme.lightColor);
    document.body.style.setProperty("--team-dark-color", theme.darkColor);
    document.body.style.setProperty("--color-background-header", theme.darkColor);
    document.body.style.setProperty("--color-background-card", isDarkMode ? theme.darkColor : theme.lightColor);
    document.body.style.setProperty("--color-accent", isDarkMode ? theme.lightColor : theme.darkColor);
    document.body.style.setProperty("--color-text-first-heading", theme.lightColor);
    document.body.style.setProperty("--color-text-second-heading", isDarkMode ? theme.lightColor : theme.darkColor);
    document.body.style.setProperty("--team-name", `"${theme.name}"`);
}
