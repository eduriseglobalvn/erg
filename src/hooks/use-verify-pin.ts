import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, httpClient } from '@/services';
import { RateLimitError } from '@/services/http-client';
import { toast } from 'sonner';

interface VerifyPinDto {
    email: string;
    pin: string;
}

interface ResendPinDto {
    email: string;
}

/**
 * Hook cho OTP verification (activation)
 */
export function useVerifyPinMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: VerifyPinDto) => {
            const res = await authApi.verifyPin(data);
            return res;
        },
        onSuccess: async (res: any) => {
            // Session tokens da duoc proxy set qua HttpOnly cookies.
            // Chi giu lai mot it user metadata khong nhay cam de UI co the hien nhanh.
            if (res?.user?.id) {
                localStorage.setItem('userId', res.user.id);
                if (res.user) localStorage.setItem('user', JSON.stringify(res.user));
            }

            toast.success('Kích hoạt thành công!');

            // Gọi /sessions/current để lấy permissions
            try {
                const sessionRes: any = await httpClient('/sessions/current', {
                    method: 'GET',
                    requireAuth: true,
                });
                const sessionData = sessionRes.data || sessionRes;

                if (sessionData.user) {
                    localStorage.setItem('user', JSON.stringify(sessionData.user));
                }

                // Invalidate auth cache
                queryClient.invalidateQueries({ queryKey: ['auth'] });

                // ISSUE 1 FIX: Check isProfileCompleted → redirect phù hợp
                const isCompleted = sessionData?.user?.isProfileCompleted;
                if (isCompleted === false) {
                    window.location.href = '/onboarding';
                } else {
                    window.location.href = '/';
                }
            } catch (e) {
                console.error('Failed to fetch session:', e);
                window.location.href = '/';
            }
        },
        onError: (error: any) => {
            // Handle 429 rate limit
            if (error instanceof RateLimitError || error.status === 429) {
                const retrySec = error.retryAfterSec ?? error.data?.retryAfter ?? 60;
                toast.error(`Quá nhiều yêu cầu. Vui lòng thử lại sau ${retrySec} giây.`, { duration: Infinity });
                return;
            }
            toast.error(error.message || 'Mã xác thực không chính xác');
        }
    });
}

/**
 * Hook cho nút "Gửi lại mã PIN"
 */
export function useResendPinMutation() {
    return useMutation({
        mutationFn: async (email: string) => {
            await authApi.resendPin(email);
        },
        onSuccess: () => {
            toast.success('Đã gửi lại mã PIN mới');
        },
        onError: (error: any) => {
            // Handle 429 rate limit
            if (error instanceof RateLimitError || error.status === 429) {
                const retrySec = error.retryAfterSec ?? error.data?.retryAfter ?? 60;
                toast.error(`Quá nhiều yêu cầu. Vui lòng thử lại sau ${retrySec} giây.`, { duration: Infinity });
                return;
            }
            toast.error(error.message || 'Không thể gửi lại mã');
        }
    });
}

/**
 * Hook cho reset password
 */
export function useResetPasswordMutation() {
    return useMutation({
        mutationFn: async (data: { email: string; pin: string; newPassword: string }) => {
            await authApi.resetPassword(data);
        },
        onSuccess: () => {
            toast.success('Mật khẩu đã được thay đổi thành công!');
            // BE sẽ revoke tất cả sessions → redirect về login với message
            setTimeout(() => {
                window.location.href = '/auth/login?reason=password_changed';
            }, 1500);
        },
        onError: (error: any) => {
            // Handle 429 rate limit
            if (error instanceof RateLimitError || error.status === 429) {
                const retrySec = error.retryAfterSec ?? error.data?.retryAfter ?? 60;
                toast.error(`Quá nhiều yêu cầu. Vui lòng thử lại sau ${retrySec} giây.`, { duration: Infinity });
                return;
            }
            toast.error(error.message || 'Đổi mật khẩu thất bại');
        }
    });
}
