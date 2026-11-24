import type { Node as PMNode } from "@tiptap/pm/model"
import type { Transaction } from "@tiptap/pm/state"
import { AllSelection, NodeSelection, Selection, TextSelection } from "@tiptap/pm/state"
import { cellAround, CellSelection } from "@tiptap/pm/tables"
import { findParentNodeClosestToPos, type Editor, type NodeWithPos } from "@tiptap/react"
import { isValidPosition } from "./tiptap-schema-utils"

export function findNodeAtPosition(editor: Editor, position: number) {
  try {
    const node = editor.state.doc.nodeAt(position)
    if (!node) {
      console.warn(`No node found at position ${position}`)
      return null
    }
    return node
  } catch (error) {
    console.error(`Error getting node at position ${position}:`, error)
    return null
  }
}

/**
 * Finds the position and instance of a node in the document
 * @param props Object containing editor, node (optional), and nodePos (optional)
 * @param props.editor The Tiptap editor instance
 * @param props.node The node to find (optional if nodePos is provided)
 * @param props.nodePos The position of the node to find (optional if node is provided)
 * @returns An object with the position and node, or null if not found
 */
export function findNodePosition(props: {
  editor: Editor | null
  node?: PMNode | null
  nodePos?: number | null
}): { pos: number; node: PMNode } | null {
  const { editor, node, nodePos } = props

  if (!editor || !editor.state?.doc) return null

  // Zero is valid position
  const hasValidNode = node !== undefined && node !== null
  const hasValidPos = isValidPosition(nodePos)

  if (!hasValidNode && !hasValidPos) {
    return null
  }

  // First search for the node in the document if we have a node
  if (hasValidNode) {
    let foundPos = -1
    let foundNode: PMNode | null = null

    editor.state.doc.descendants((currentNode, pos) => {
      // TODO: Needed?
      // if (currentNode.type && currentNode.type.name === node!.type.name) {
      if (currentNode === node) {
        foundPos = pos
        foundNode = currentNode
        return false
      }
      return true
    })

    if (foundPos !== -1 && foundNode !== null) {
      return { pos: foundPos, node: foundNode }
    }
  }

  // If we have a valid position, use findNodeAtPosition
  if (hasValidPos) {
    const nodeAtPos = findNodeAtPosition(editor, nodePos!)
    if (nodeAtPos) {
      return { pos: nodePos!, node: nodeAtPos }
    }
  }

  return null
}

/**
 * Determines whether the current selection contains a node whose type matches
 * any of the provided node type names.
 * @param editor Tiptap editor instance
 * @param nodeTypeNames List of node type names to match against
 * @param checkAncestorNodes Whether to check ancestor node types up the depth chain
 */
export function isNodeTypeSelected(
  editor: Editor | null,
  nodeTypeNames: string[] = [],
  checkAncestorNodes: boolean = false
): boolean {
  if (!editor || !editor.state.selection) return false

  const { selection } = editor.state
  if (selection.empty) return false

  // Direct node selection check
  if (selection instanceof NodeSelection) {
    const selectedNode = selection.node
    return selectedNode ? nodeTypeNames.includes(selectedNode.type.name) : false
  }

  // Depth-based ancestor node check
  if (checkAncestorNodes) {
    const { $from } = selection
    for (let depth = $from.depth; depth > 0; depth--) {
      const ancestorNode = $from.node(depth)
      if (nodeTypeNames.includes(ancestorNode.type.name)) {
        return true
      }
    }
  }

  return false
}

/**
 * Check whether the current selection is fully within nodes
 * whose type names are in the provided `types` list.
 *
 * - NodeSelection → checks the selected node.
 * - Text/AllSelection → ensures all textblocks within [from, to) are allowed.
 */
export function selectionWithinConvertibleTypes(
  editor: Editor,
  types: string[] = []
): boolean {
  if (!editor || types.length === 0) return false

  const { state } = editor
  const { selection } = state
  const allowed = new Set(types)

  if (selection instanceof NodeSelection) {
    const nodeType = selection.node?.type?.name
    return !!nodeType && allowed.has(nodeType)
  }

  if (selection instanceof TextSelection || selection instanceof AllSelection) {
    let valid = true
    state.doc.nodesBetween(selection.from, selection.to, (node) => {
      if (node.isTextblock && !allowed.has(node.type.name)) {
        valid = false
        return false // stop early
      }
      return valid
    })
    return valid
  }

  return false
}

/**
 * Handles image upload with progress tracking and abort capability
 * @param file The file to upload
 * @param onProgress Optional callback for tracking upload progress
 * @param abortSignal Optional AbortSignal for cancelling the upload
 * @returns Promise resolving to the URL of the uploaded image
 */

export function updateNodesAttr<A extends string = string, V = unknown>(
  tr: Transaction,
  targets: readonly NodeWithPos[],
  attrName: A,
  next: V | ((prev: V | undefined) => V | undefined)
): boolean {
  if (!targets.length) return false

  let changed = false

  for (const { pos } of targets) {
    // Always re-read from the transaction's current doc
    const currentNode = tr.doc.nodeAt(pos)
    if (!currentNode) continue

    const prevValue = (currentNode.attrs as Record<string, unknown>)[
      attrName
    ] as V | undefined
    const resolvedNext =
      typeof next === "function"
        ? (next as (p: V | undefined) => V | undefined)(prevValue)
        : next

    if (prevValue === resolvedNext) continue

    const nextAttrs: Record<string, unknown> = { ...currentNode.attrs }
    if (resolvedNext === undefined) {
      // Remove the key entirely instead of setting null
      delete nextAttrs[attrName]
    } else {
      nextAttrs[attrName] = resolvedNext
    }

    tr.setNodeMarkup(pos, undefined, nextAttrs)
    changed = true
  }

  return changed
}

/**
 * Selects the entire content of the current block node if the selection is empty.
 * If the selection is not empty, it does nothing.
 * @param editor The Tiptap editor instance
 */
export function selectCurrentBlockContent(editor: Editor) {
  const { selection, doc } = editor.state

  if (!selection.empty) return

  const $pos = selection.$from
  let blockNode = null
  let blockPos = -1

  for (let depth = $pos.depth; depth >= 0; depth--) {
    const node = $pos.node(depth)
    const pos = $pos.start(depth)

    if (node.isBlock && node.textContent.trim()) {
      blockNode = node
      blockPos = pos
      break
    }
  }

  if (blockNode && blockPos >= 0) {
    const from = blockPos
    const to = blockPos + blockNode.nodeSize - 2 // -2 to exclude the closing tag

    if (from < to) {
      const $from = doc.resolve(from)
      const $to = doc.resolve(to)
      const newSelection = TextSelection.between($from, $to, 1)

      if (newSelection && !selection.eq(newSelection)) {
        editor.view.dispatch(editor.state.tr.setSelection(newSelection))
      }
    }
  }
}

/**
 * Retrieves all nodes of specified types from the current selection.
 * @param selection The current editor selection
 * @param allowedNodeTypes An array of node type names to look for (e.g., ["image", "table"])
 * @returns An array of objects containing the node and its position
 */
export function getSelectedNodesOfType(
  selection: Selection,
  allowedNodeTypes: string[]
): NodeWithPos[] {
  const results: NodeWithPos[] = []
  const allowed = new Set(allowedNodeTypes)

  if (selection instanceof CellSelection) {
    selection.forEachCell((node: PMNode, pos: number) => {
      if (allowed.has(node.type.name)) {
        results.push({ node, pos })
      }
    })
    return results
  }

  if (selection instanceof NodeSelection) {
    const { node, from: pos } = selection
    if (node && allowed.has(node.type.name)) {
      results.push({ node, pos })
    }
    return results
  }

  const { $anchor } = selection
  const cell = cellAround($anchor)

  if (cell) {
    const cellNode = selection.$anchor.doc.nodeAt(cell.pos)
    if (cellNode && allowed.has(cellNode.type.name)) {
      results.push({ node: cellNode, pos: cell.pos })
      return results
    }
  }

  // Fallback: find parent nodes of allowed types
  const parentNode = findParentNodeClosestToPos($anchor, (node) =>
    allowed.has(node.type.name)
  )

  if (parentNode) {
    results.push({ node: parentNode.node, pos: parentNode.pos })
  }

  return results
}
