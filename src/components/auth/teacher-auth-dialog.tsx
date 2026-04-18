"use client"

import { useState } from "react"
import { Sparkles } from "lucide-react"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/admin/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/admin/ui/tabs"
import { LoginForm } from "@/components/auth/login-form"
import { SignupForm } from "@/components/auth/signup-form"

interface TeacherAuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TeacherAuthDialog({ open, onOpenChange }: TeacherAuthDialogProps) {
  const [tab, setTab] = useState<"login" | "signup">("login")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-1.5rem)] overflow-hidden border-slate-200 p-0 sm:max-w-5xl" showCloseButton={true}>
        <div className="grid md:grid-cols-[1.05fr_minmax(0,1fr)]">
          <div className="relative hidden overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.2),_transparent_36%),linear-gradient(145deg,#00008b_0%,#1d4ed8_45%,#cc0022_100%)] p-10 text-white md:flex md:flex-col">
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(2,6,23,0.18)_100%)]" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-white/80">
                <Sparkles className="h-3.5 w-3.5" />
                Teacher Hub Access
              </div>
              <h2 className="mt-8 max-w-md text-4xl font-black leading-tight">
                Cổng dành riêng cho giảng viên ERG.
              </h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-white/78">
                Đăng nhập bằng email nội bộ hoặc Google để truy cập kho học liệu, bài giảng và không gian làm việc của giáo viên.
              </p>

              <div className="mt-10 space-y-4">
                {[
                  "Đăng nhập thường và Google dùng cùng một phiên hệ thống.",
                  "Tài khoản mới có thể đăng ký ngay trong hộp thoại này.",
                  "Sau khi xác thực, bạn sẽ quay lại đúng Teacher Hub hiện tại.",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/15 bg-white/8 px-4 py-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-white" />
                    <p className="text-sm leading-6 text-white/85">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-8">
            <DialogHeader className="sr-only">
              <DialogTitle>Xác thực Teacher Hub</DialogTitle>
              <DialogDescription>Đăng nhập hoặc đăng ký tài khoản giáo viên</DialogDescription>
            </DialogHeader>

            <Tabs value={tab} onValueChange={(value) => setTab(value as "login" | "signup")} className="w-full">
              <TabsList className="grid w-full grid-cols-2 rounded-full bg-slate-100 p-1">
                <TabsTrigger value="login" className="rounded-full text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-[#00008b]">
                  Đăng nhập
                </TabsTrigger>
                <TabsTrigger value="signup" className="rounded-full text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-[#00008b]">
                  Đăng ký
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-6">
                <LoginForm
                  embedded
                  title="Đăng nhập Teacher Hub"
                  description="Sử dụng email nội bộ hoặc Google để vào cổng giảng viên."
                  onSwitchToSignup={() => setTab("signup")}
                  googleCallbackUrl="/auth/google/callback"
                />
              </TabsContent>

              <TabsContent value="signup" className="mt-6">
                <SignupForm
                  embedded
                  title="Đăng ký tài khoản giảng viên"
                  description="Tạo tài khoản mới để truy cập kho học liệu và công cụ nội bộ."
                  onSwitchToLogin={() => setTab("login")}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
