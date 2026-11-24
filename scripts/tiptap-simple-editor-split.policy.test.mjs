import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { test } from "node:test"

const root = new URL("../", import.meta.url)
const simpleRoot = new URL("src/components/cms/shared/editor/tiptap-templates/simple/", root)

const read = (path) => readFile(new URL(path, root), "utf8")
const readSimple = (path) => readFile(new URL(path, simpleRoot), "utf8")
const lines = (source) => source.trimEnd().split(/\r?\n/u).length

test("Simple Editor exposes small facades and cohesive owners", async () => {
  const [facade, shell, extensions, toolbar, sectionBlock, imageTextBlock, utilsFacade] = await Promise.all([
    readSimple("simple-editor.tsx"),
    readSimple("simple-editor-shell.tsx"),
    readSimple("simple-editor-extensions.ts"),
    readSimple("simple-editor-toolbar.tsx"),
    readSimple("erg-section-block.tsx"),
    readSimple("image-text-block.tsx"),
    read("src/lib/tiptap-utils.ts"),
  ])

  assert.ok(lines(facade) < 250, `simple-editor facade has ${lines(facade)} lines`)
  assert.ok(lines(utilsFacade) < 250, `tiptap-utils facade has ${lines(utilsFacade)} lines`)
  assert.match(facade, /SimpleEditor/)
  assert.match(shell, /EditorContent/)
  assert.match(toolbar, /MainToolbarContent/)
  assert.match(sectionBlock, /ergSectionBlock/)
  assert.match(imageTextBlock, /imageTextBlock/)
  assert.doesNotMatch(shell, /Node\.create\(/)

  for (const extensionName of [
    "StarterKit",
    "TextAlign",
    "TaskList",
    "TaskItem",
    "Highlight",
    "ImageNode",
    "ImageUploadNode",
    "ErgSectionBlock",
    "ImageTextBlock",
    "FontSize",
  ]) {
    assert.match(extensions, new RegExp(`\\b${extensionName}\\b`), `${extensionName} must remain composed`)
  }
})

test("content lifecycle, default paste and upload wiring stay explicit", async () => {
  const [shell, extensions] = await Promise.all([
    readSimple("simple-editor-shell.tsx"),
    readSimple("simple-editor-extensions.ts"),
  ])

  assert.match(shell, /content:\s*initialContent/)
  assert.match(shell, /onUpdate/)
  assert.match(shell, /editorProps/)
  assert.doesNotMatch(shell, /handlePaste\s*:/, "default Tiptap paste behavior must not be intercepted")
  assert.match(extensions, /handleImageUpload/)
  assert.match(extensions, /MAX_FILE_SIZE/)
})

test("tiptap-utils remains a stable compatibility facade", async () => {
  const facade = await read("src/lib/tiptap-utils.ts")
  assert.deepEqual(
    facade.trim().split(/\r?\n/u),
    [
      'export * from "./tiptap-shortcut-utils"',
      'export * from "./tiptap-schema-utils"',
      'export * from "./tiptap-selection-utils"',
      'export * from "./tiptap-image-upload"',
      'export * from "./tiptap-url-utils"',
    ],
  )

  const owners = await Promise.all([
    read("src/lib/tiptap-shortcut-utils.ts"),
    read("src/lib/tiptap-schema-utils.ts"),
    read("src/lib/tiptap-selection-utils.ts"),
    read("src/lib/tiptap-image-upload.ts"),
    read("src/lib/tiptap-url-utils.ts"),
  ])
  const exports = owners.join("\n")
  for (const name of [
    "MAX_FILE_SIZE", "MAC_SYMBOLS", "SR_ONLY", "cn", "isMac", "formatShortcutKey",
    "parseShortcutKeys", "isMarkInSchema", "isNodeInSchema", "focusNextNode",
    "isValidPosition", "isExtensionAvailable", "findNodeAtPosition", "findNodePosition",
    "isNodeTypeSelected", "selectionWithinConvertibleTypes", "handleImageUpload", "isAllowedUri",
    "sanitizeUrl", "updateNodesAttr", "selectCurrentBlockContent", "getSelectedNodesOfType",
  ]) assert.match(exports, new RegExp(`\\bexport (?:const|function) ${name}\\b`), `${name} export drifted`)
})
