export interface Player {
    player: string;
    href?: string;
}

export interface Game {
    game: string;
    href?: string;
}

export interface Championship {
    championship: string;
    href?: string;
}

export interface LakersData {
    Coach: string;
    Conference: string;
    Players: Player[];
    Games: Game[];
    Championships: Championship[];
}