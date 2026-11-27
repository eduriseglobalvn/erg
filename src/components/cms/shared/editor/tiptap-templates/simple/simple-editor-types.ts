export interface SimpleEditorProps {
  initialContent?: string
  onEditorReady?: (editor: any) => void
  onRefine?: (text: string, prompt: string) => Promise<string | null>
  onContentChange?: (html: string) => void
  onSelectionChange?: (selection: any) => void
  title?: string
  onTitleChange?: (value: string) => void
  isRefining?: boolean
}
