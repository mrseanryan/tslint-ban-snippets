import { BanSnippetsRuleConfig } from "../model/BanSnippetsRuleConfig";
import { BAN_SNIPPETS_RULE_ID } from "../ruleIds";

export namespace ConfigFactory {
    export function createForBanSnippetsRule(options: any): BanSnippetsRuleConfig {
        const config = createFromArguments<BanSnippetsRuleConfig>(options, BAN_SNIPPETS_RULE_ID);

        validate(config, "banned", BAN_SNIPPETS_RULE_ID);
        config.banned.forEach(b => validate(b, "snippets", BAN_SNIPPETS_RULE_ID));

        return config;
    }

    function validate(config: any, prop: string, ruleId: string) {
        if (config[prop] === undefined) {
            throw new Error(`invalid config for rule ${ruleId} - ${prop} is missing`);
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
