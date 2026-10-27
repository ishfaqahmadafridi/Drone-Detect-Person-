import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import { expect, it } from "vitest";

function sourceFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(file) : /\.tsx?$/.test(file) ? [file] : [];
  });
}

it("keeps TSX types/state in central types/hooks and component indexes export-only", () => {
  const violations: string[] = [];
  for (const file of sourceFiles("src")) {
    const source = ts.createSourceFile(file, fs.readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true,
      file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    const record = (node: ts.Node, rule: string) => violations.push(`${file}:${source.getLineAndCharacterOfPosition(node.getStart()).line + 1} ${rule}`);
    const visit = (node: ts.Node) => {
      const literal = ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) ||
        ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node);
      if (!file.includes("/constants/") && literal &&
          /#[\da-fA-F]{3,8}\b|rgba?\(|(?:bg|text|border|ring|fill|stroke)-(?:slate|gray|red|blue|cyan|amber|emerald|rose|white|black)(?:-|\/|\b)/.test(node.text)) {
        record(node, "color/style outside constants");
      }
      if (!file.includes("/types/") && (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node))) record(node, "type outside src/types");
      if (file.endsWith(".tsx") && ts.isTypeLiteralNode(node)) record(node, "inline TSX type");
      if (file.endsWith(".tsx") && ts.isCallExpression(node) && /^(React\.)?use(State|Effect|Reducer|Query|Mutation)$/.test(node.expression.getText(source))) record(node, "state/effect outside hook");
      if (file.includes("/components/") && path.basename(file) === "index.tsx" && (ts.isFunctionDeclaration(node) || ts.isVariableStatement(node))) record(node, "implementation in component index");
      ts.forEachChild(node, visit);
    };
    visit(source);
  }
  expect(violations).toEqual([]);
});
