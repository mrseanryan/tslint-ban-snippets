export type BanSnippetsRuleConfig = {
    banned: BannedSnippet[];
};

export type BannedSnippet = {
    snippets: string[];
    message?: string;
    includePaths?: string[];
    excludePaths?: string[];
};
