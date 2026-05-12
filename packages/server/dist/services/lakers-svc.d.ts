import { LakersData } from "../models/lakers";
declare function index(): Promise<LakersData[]>;
declare function get(id: string): Promise<LakersData | null>;
declare function create(json: LakersData): Promise<LakersData>;
declare function update(id: String, lakersData: LakersData): Promise<LakersData>;
declare function remove(id: String): Promise<void>;
declare const _default: {
    index: typeof index;
    get: typeof get;
    create: typeof create;
    update: typeof update;
    remove: typeof remove;
};
export default _default;
