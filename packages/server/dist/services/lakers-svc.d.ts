import { LakersData } from "../models/lakers";
declare function index(): Promise<LakersData[]>;
declare function get(id: string): Promise<LakersData | null>;
declare const _default: {
    index: typeof index;
    get: typeof get;
};
export default _default;
