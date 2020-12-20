import { TextlintRuleModule } from '@textlint/types';
import { tokenize } from "kuromojin";

// https://github.com/MosasoM/inappropriate-words-ja
const inappropriateWords = [
    'ios',
    'IOS'
]

const module: TextlintRuleModule = (context) => {
    const { getSource, report, RuleError, Syntax } = context;

    return {
      async [Syntax.Str](node) {
        const text = getSource(node);
        const tokens = await tokenize(text);

        tokens.forEach(({ surface_form, word_position }) => {
          if (!inappropriateWords.includes(surface_form)) {
            return;
          }

          const index = word_position - 1;

          const ruleError = new RuleError(
            `不適切表現「${surface_form}」が含まれています。`,
            { index }
          );

          report(node, ruleError);
        });
      }
    }
  };
  export default module;
