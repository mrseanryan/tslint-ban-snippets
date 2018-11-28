import * as Lint from 'tslint';
import * as ts from 'typescript';

import { ConfigFactory } from './config/ConfigFactory';
import { BannedSnippet, BanSnippetsRuleConfig } from './model/BanSnippetsRuleConfig';
import { GeneralRuleUtils } from './utils/GeneralRuleUtils';

export const BAN_SNIPPETS_RULE_ID = 'tsl-ban-snippets';

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
            const bannedCodeFound = banned.snippets.filter(
                bannedSnippet => text.indexOf(bannedSnippet) >= 0
            );

            if (bannedCodeFound.length > 0) {
                this.addFailureAtNode(
                    node.getFirstToken() || node,
                    GeneralRuleUtils.buildFailureString(
                        banned.message ||
                            `Do not use banned code '${bannedCodeFound.join("' or '")}'`,
                        BAN_SNIPPETS_RULE_ID
                    )
                );
            }
        });
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
