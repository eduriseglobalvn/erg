"use client"

import React from "react"
import { Button } from "@/components/cms/ui/button"
import { AlertCircle, RotateCcw } from "lucide-react"

interface ErrorBoundaryProps {
    children: React.ReactNode
    fallback?: React.ReactNode
    onReset?: () => void
}

interface ErrorBoundaryState {
    hasError: boolean
    error: Error | null
}

export class SectionErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("SectionErrorBoundary caught an error:", error, errorInfo)
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null })
        this.props.onReset?.()
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback
            }

            return (
                <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-rose-50/50 border-rose-100">
                    <div className="flex items-center gap-2 text-rose-600 mb-4">
                        <AlertCircle className="w-6 h-6" />
                        <h3 className="text-lg font-bold">Đã xảy ra lỗi</h3>
                    </div>
                    <p className="text-sm text-slate-600 mb-6 text-center max-w-md">
                        {this.state.error?.message || "Hệ thống gặp sự cố khi tải nội dung này. Vui lòng thử lại sau hoặc báo với quản kỹ thuật."}
                    </p>
                    <Button
                        onClick={this.handleReset}
                        variant="outline"
                        className="bg-white border-rose-200 text-rose-700 hover:bg-rose-50"
                    >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Thử lại
                    </Button>
                </div>
            )
        }

        return this.props.children
    }
}
