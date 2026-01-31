import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, httpClient } from '@/services';
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

            if (data && data.accessToken) {
                // Lưu tokens vào localStorage
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);

                if (data.user) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                    if (data.user.id) localStorage.setItem('userId', data.user.id);
                }

                // Ghi nhớ email nếu user chọn
                if (variables.rememberMe) {
                    localStorage.setItem('rememberedEmail', variables.email);
                } else {
                    localStorage.removeItem('rememberedEmail');
                }

                // Fetch session data để lấy permissions
                try {
                    const sessionRes: any = await httpClient('/sessions/current', {
                        method: 'GET',
                        requireAuth: true,
                    });
                    const sessionData = sessionRes.data || sessionRes;

                    if (sessionData.user) {
                        localStorage.setItem('user', JSON.stringify(sessionData.user));

                        if (sessionData.accessControl) {
                            const permissions = sessionData.accessControl.permissions || [];
                            const roles = sessionData.accessControl.roles || [];

                            localStorage.setItem('permissions', JSON.stringify(permissions));
                            localStorage.setItem('roles', JSON.stringify(roles));
                        }
                    }

                    // Invalidate auth queries để re-fetch
                    queryClient.invalidateQueries({ queryKey: ['auth'] });

                    toast.success('Đăng nhập thành công!');

                    // Delay để browser kịp hiện popup "Lưu mật khẩu"
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 500);
                } catch (e) {
                    console.error('Failed to fetch session:', e);
                    window.location.href = '/';
                }
            } else {
                throw new Error('Không nhận được Token từ máy chủ');
            }
        },
        onError: (error: any) => {
            const errorMessage = error.message || '';
            const lowered = errorMessage.toLowerCase();

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
