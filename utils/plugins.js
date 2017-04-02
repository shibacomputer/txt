const {blockQuoteRule, orderedListRule, bulletListRule, codeBlockRule, headingRule,
       inputRules, allInputRules} = require("prosemirror-inputrules")
const {keymap} = require("prosemirror-keymap")
const {history} = require("prosemirror-history")
const {baseKeymap} = require("prosemirror-commands")
const {Plugin} = require("prosemirror-state")
const {dropCursor} = require("prosemirror-dropcursor")
const {buildKeymap} = require("./keymap")
exports.buildKeymap = buildKeymap

function defaultSetup(options) {
  let plugins = [
    inputRules({rules: allInputRules.concat(buildInputRules(options.schema))}),
    keymap(buildKeymap(options.schema, options.mapKeys)),
    keymap(baseKeymap),
    dropCursor()
  ]
  /* if (options.menuBar !== false)
    plugins.push(menuBar({floating: options.floatingMenu !== false,
                          content: options.menuContent || buildMenuItems(options.schema).fullMenu})) */
  if (options.history !== false)
    plugins.push(history())

  return plugins.concat(new Plugin({
    props: {
      attributes: {class: "ProseMirror-example-setup-style"}
    }
  }))
}
exports.defaultSetup = defaultSetup

function buildInputRules(schema) {
  let result = [], type
  if (type = schema.nodes.blockquote) result.push(blockQuoteRule(type))
  if (type = schema.nodes.ordered_list) result.push(orderedListRule(type))
  if (type = schema.nodes.bullet_list) result.push(bulletListRule(type))
  if (type = schema.nodes.code_block) result.push(codeBlockRule(type))
  if (type = schema.nodes.heading) result.push(headingRule(type, 6))
  return result
}
exports.buildInputRules = buildInputRules
