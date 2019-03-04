export type BanSnippetsRuleConfig = {
    banned: BannedSnippet[];
};

export type BannedSnippet = {
    // either snippets OR regexSnippets is required
    snippets?: string[];
    regexSnippets?: string[];
    message?: string;
    includePaths?: string[];
    excludePaths?: string[];
};
