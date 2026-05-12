import { NBAData } from "../models/nba";
declare function index(): Promise<NBAData[]>;
declare function get(id: string): Promise<NBAData | null>;
declare function create(json: NBAData): Promise<NBAData>;
declare function update(id: String, nbaData: NBAData): Promise<NBAData>;
declare function remove(id: String): Promise<void>;
declare const _default: {
    index: typeof index;
    get: typeof get;
    create: typeof create;
    update: typeof update;
    remove: typeof remove;
};
export default _default;
