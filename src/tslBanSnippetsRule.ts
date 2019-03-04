import * as Lint from "tslint";
import * as ts from "typescript";

import { ConfigFactory } from "./config/ConfigFactory";
import { BannedSnippet, BanSnippetsRuleConfig } from "./model/BanSnippetsRuleConfig";
import { BAN_SNIPPETS_RULE_ID } from "./ruleIds";
import { GeneralRuleUtils } from "./utils/GeneralRuleUtils";

export class Rule extends Lint.Rules.AbstractRule {
    apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const config = ConfigFactory.createForBanSnippetsRule(this.getOptions());

        const walker = new StatementsWalker(sourceFile, this.getOptions(), config);
        this.applyWithWalker(walker);

        return walker.getFailures();
    }
}

class StatementsWalker extends Lint.RuleWalker {
    constructor(
        sourceFile: ts.SourceFile,
        options: Lint.IOptions,
        private config: BanSnippetsRuleConfig
    ) {
        super(sourceFile, options);
    }

    visitReturnStatement(node: ts.ReturnStatement) {
        this.visitSomeNode(node);
    }

    protected visitBinaryExpression(node: ts.BinaryExpression) {
        this.visitSomeNode(node);

        super.visitBinaryExpression(node);
    }

    protected visitCallExpression(node: ts.CallExpression) {
        this.visitSomeNode(node);

        super.visitCallExpression(node);
    }

    protected visitDebuggerStatement(node: ts.Statement) {
        this.visitSomeNode(node);

        super.visitDebuggerStatement(node);
    }

    private visitSomeNode(node: ts.Node) {
        const text = node.getText();

        const relevantBanned = this.getRelevantBanned();

        relevantBanned.forEach(banned => {
            if (banned.snippets) {
                this.checkBannedSnippet(banned.snippets, text, node, banned.message);
            } else if (banned.regexSnippets) {
                this.checkRegexBannedSnippet(banned.regexSnippets, text, node, banned.message);
            } else {
                throw new Error("Invalid config? No snippets and no regex-snippets");
            }
        });
    }

    private checkBannedSnippet(snippets: string[], text: string, node: ts.Node, message?: string) {
        const bannedCodeFound = snippets.filter(bannedSnippet => text.indexOf(bannedSnippet) >= 0);

        if (bannedCodeFound.length > 0) {
            this.failRule(node, bannedCodeFound, message);
        }
    }

    private checkRegexBannedSnippet(
        regexSnippets: string[],
        text: string,
        node: ts.Node,
        message?: string
    ) {
        const bannedCodeFound = regexSnippets.filter(regexSnippet => {
            const regex = new RegExp(regexSnippet);

            return regex.test(text);
        });

        if (bannedCodeFound.length > 0) {
            this.failRule(node, bannedCodeFound, message);
        }
    }

    private failRule(node: ts.Node, bannedCodeFound: string[], message?: string) {
        const failureNode = node.getFirstToken() || node;

        this.addFailureAtNode(
            failureNode,
            GeneralRuleUtils.buildFailureString(
                message || `Do not use banned code '${bannedCodeFound.join("' or '")}'.`,
                BAN_SNIPPETS_RULE_ID
            )
        );
    }

    private getRelevantBanned(): BannedSnippet[] {
        const sourceFilePath = this.getSourceFile().fileName;

        return this.config.banned.filter(
            b =>
                (!b.includePaths ||
                    GeneralRuleUtils.isFileInPaths(sourceFilePath, b.includePaths)) &&
                (!b.excludePaths || !GeneralRuleUtils.isFileInPaths(sourceFilePath, b.excludePaths))
        );
    }
}
