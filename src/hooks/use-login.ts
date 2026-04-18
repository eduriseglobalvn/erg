import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/services';
import { RateLimitError } from '@/services/http-client';
import { toast } from 'sonner';

interface LoginDto {
    email: string;
    password: string;
    rememberMe?: boolean;
}

/**
 * Custom hook cho Login mutation với TanStack Query
 * Tự động invalidate auth cache sau khi login thành công
 */
export function useLoginMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: LoginDto) => {
            const res = await authApi.login(data);
            return res;
        },
        onSuccess: async (res: any, variables) => {
            const data = res.data || res;

            if (data) {
                // Access token và Refresh token đã được Next.js proxy set qua HttpOnly cookies.
                // Đồng thời proxy cũng set flag "isLoggedIn=true" (non-HttpOnly) để client check.
                queryClient.invalidateQueries({ queryKey: ['auth'] });
                toast.success('Đăng nhập thành công!');

                setTimeout(() => {
                    const sessionData = res?.data || res;
                    const isCompleted = sessionData?.user?.isProfileCompleted;
                    if (isCompleted === false) {
                        window.location.href = '/onboarding';
                    } else {
                        window.location.href = '/';
                    }
                }, 250);
            } else {
                throw new Error('Không nhận được Token từ máy chủ');
            }
        },
        onError: (error: any) => {
            const errorMessage = error.message || '';
            const lowered = errorMessage.toLowerCase();

            // Xử lý 429 Rate Limit (BE trả khi đăng nhập sai quá nhiều lần)
            if (error instanceof RateLimitError || error.status === 429) {
                const retrySec = error.retryAfterSec ?? error.data?.retryAfter ?? 60;
                toast.error(
                    `Đã đăng nhập sai quá nhiều lần. Vui lòng thử lại sau ${retrySec} giây.`,
                    { duration: Infinity }
                );
                return;
            }

            // Xử lý lỗi 403 Account not activated
            if (
                lowered.includes('not activated') ||
                lowered.includes('account is not activated') ||
                lowered.includes('actived') ||
                lowered.includes('403')
            ) {
                toast.warning('Tài khoản chưa kích hoạt. Vui lòng nhập mã PIN đã được gửi tới email để kích hoạt.');
                return; // Không show error toast
            }

            toast.error(errorMessage || 'Email hoặc mật khẩu không chính xác');
        }
    });
}
