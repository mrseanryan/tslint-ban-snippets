import { BanSnippetsRuleConfig } from "../model/BanSnippetsRuleConfig";
import { BAN_SNIPPETS_RULE_ID } from "../ruleIds";

const SNIPPETS_PROP = "snippets";
const REGEX_SNIPPETS_PROP = "regexSnippets";

export namespace ConfigFactory {
    export function createForBanSnippetsRule(options: any): BanSnippetsRuleConfig {
        const config = createFromArguments<BanSnippetsRuleConfig>(options, BAN_SNIPPETS_RULE_ID);

        validate(config, "banned", BAN_SNIPPETS_RULE_ID);
        config.banned.forEach(b => validateSnippetsList(b, BAN_SNIPPETS_RULE_ID));

        return config;
    }

    function validate(config: any, prop: string, ruleId: string) {
        if (!hasProp(config, prop)) {
            throw new Error(`invalid config for rule ${ruleId} - ${prop} is missing`);
        }
    }

    function hasProp(config: any, prop: string): boolean {
        return config[prop] !== undefined;
    }

    function validateSnippetsList(config: any, ruleId: string) {
        // either snippets OR regexSnippets is required
        const hasSnippets = hasProp(config, SNIPPETS_PROP);
        const hasRegexSnippets = hasProp(config, REGEX_SNIPPETS_PROP);

        const isValid = hasSnippets || hasRegexSnippets;

        const hasBoth = hasSnippets && hasRegexSnippets;

        if (!isValid || hasBoth) {
            throw new Error(
                `invalid config for rule ${ruleId} - either ${SNIPPETS_PROP} or ${REGEX_SNIPPETS_PROP} must be set`
            );
        }
    }

    function createFromArguments<T>(options: any, ruleId: string): T {
        const args = options.ruleArguments;

        if (args.length !== 1) {
            throw new Error(
                `tslint rule is misconfigured (${ruleId}) - options.ruleArguments length is ${
                    args.length
                }`
            );
        }

        const config: T = args[0];

        return config;
    }
}
