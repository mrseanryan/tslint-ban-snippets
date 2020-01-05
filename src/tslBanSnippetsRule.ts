import * as Lint from "tslint";
import * as ts from "typescript";

import { ConfigFactory } from "./config/ConfigFactory";
import { BannedSnippet, BanSnippetsRuleConfig } from "./model/BanSnippetsRuleConfig";
import { BAN_SNIPPETS_RULE_ID } from "./ruleIds";
import { GeneralRuleUtils } from "./utils/GeneralRuleUtils";

export class Rule extends Lint.Rules.AbstractRule {
    apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const config = ConfigFactory.createForBanSnippetsRule(this.getOptions());

        return this.applyWithFunction<BanSnippetsRuleConfig>(sourceFile, walk, config);
    }
}

const walk = (ctx: Lint.WalkContext<BanSnippetsRuleConfig>) => {
    return ts.forEachChild(ctx.sourceFile, checkNode);

    function checkNode(node: ts.Node): void {
        if (
            [
                ts.SyntaxKind.ReturnStatement,
                ts.SyntaxKind.BinaryExpression,
                ts.SyntaxKind.CallExpression,
                ts.SyntaxKind.DebuggerStatement
            ].includes(node.kind)
        ) {
            visitSomeNode(node as ts.CallExpression, ctx);
        }

        return ts.forEachChild(node, checkNode);
    }
};

function visitSomeNode(node: ts.Node, ctx: Lint.WalkContext<BanSnippetsRuleConfig>) {
    const text = node.getText();

    const relevantBanned = getRelevantBanned(ctx);

    relevantBanned.forEach(banned => {
        if (banned.snippets) {
            checkBannedSnippet(banned.snippets, text, node, ctx, banned.message);
        } else if (banned.regexSnippets) {
            checkRegexBannedSnippet(banned.regexSnippets, text, node, ctx, banned.message);
        } else {
            throw new Error("Invalid config? No snippets and no regex-snippets");
        }
    });
}

function checkBannedSnippet(
    snippets: string[],
    text: string,
    node: ts.Node,
    ctx: Lint.WalkContext<BanSnippetsRuleConfig>,
    message?: string
) {
    const bannedCodeFound = snippets.filter(bannedSnippet => text.indexOf(bannedSnippet) >= 0);

    if (bannedCodeFound.length > 0) {
        failRule(node, bannedCodeFound, ctx, message);
    }
}

function checkRegexBannedSnippet(
    regexSnippets: string[],
    text: string,
    node: ts.Node,
    ctx: Lint.WalkContext<BanSnippetsRuleConfig>,
    message?: string
) {
    const bannedCodeFound = regexSnippets.filter(regexSnippet => {
        const regex = new RegExp(regexSnippet);

        return regex.test(text);
    });

    if (bannedCodeFound.length > 0) {
        failRule(node, bannedCodeFound, ctx, message);
    }
}

function failRule(
    node: ts.Node,
    bannedCodeFound: string[],
    ctx: Lint.WalkContext<BanSnippetsRuleConfig>,
    message?: string
) {
    const failureNode = node.getFirstToken() || node;

    ctx.addFailureAtNode(
        failureNode,
        GeneralRuleUtils.buildFailureString(
            message || `Do not use banned code '${bannedCodeFound.join("' or '")}'.`,
            BAN_SNIPPETS_RULE_ID
        )
    );
}

function getRelevantBanned(ctx: Lint.WalkContext<BanSnippetsRuleConfig>): BannedSnippet[] {
    const sourceFilePath = ctx.sourceFile.fileName;

    return ctx.options.banned.filter(
        b =>
            (!b.includePaths || GeneralRuleUtils.isFileInPaths(sourceFilePath, b.includePaths)) &&
            (!b.excludePaths || !GeneralRuleUtils.isFileInPaths(sourceFilePath, b.excludePaths))
    );
}
