"use client"

import { cn } from "@/lib/utils"
import { VisualPostEditorBlockLibrary } from "./visual-post-editor-block-library"
import { VisualPostEditorCanvas } from "./visual-post-editor-canvas"
import { VisualPostEditorHeader } from "./visual-post-editor-header"
import { VisualPostEditorSidePanel } from "./visual-post-editor-side-panel"
import { useVisualPostEditorController } from "./use-visual-post-editor-controller"
import type { VisualPostEditorWorkspaceProps } from "./visual-post-editor-types"

export function VisualPostEditorWorkspaceShell(props: VisualPostEditorWorkspaceProps) {
    const controller = useVisualPostEditorController(props)
    const sharedProps = { ...props, ...controller }

    return (
        <div className="relative flex h-[calc(100vh-4rem)] w-full flex-col overflow-hidden bg-white">
            <VisualPostEditorHeader {...sharedProps} />
            <div className={cn("grid min-h-0 flex-1 gap-0 transition-[grid-template-columns] duration-300", controller.showBlocks ? "grid-cols-[280px_minmax(0,1fr)]" : "grid-cols-[0px_minmax(0,1fr)]")}>
                <VisualPostEditorBlockLibrary {...sharedProps} />
                <VisualPostEditorCanvas {...sharedProps} />
            </div>
            <VisualPostEditorSidePanel {...sharedProps} />
        </div>
    )
}
