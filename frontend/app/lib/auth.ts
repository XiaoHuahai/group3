// 认证相关的工具函数
import type { UserInfo } from './api';

export const auth = {
  // 保存token和用户信息
  setToken: (token: string, user?: UserInfo) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
      if (user) {
        localStorage.setItem('userInfo', JSON.stringify(user));
      }
      // 触发自定义事件，通知其他组件更新
      window.dispatchEvent(new Event('authStateChange'));
    }
  },

  // 获取token
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  },

  // 获取用户信息
  getUserInfo: (): UserInfo | null => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('userInfo');
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch {
          return null;
        }
      }
    }
    return null;
  },

  // 清除token和用户信息
  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userInfo');
      // 触发自定义事件，通知其他组件更新
      window.dispatchEvent(new Event('authStateChange'));
    }
  },

  // 检查是否已登录
  isAuthenticated: (): boolean => {
    return auth.getToken() !== null;
  },

  // 登出
  logout: () => {
    auth.removeToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/auth';
    }
  },
};
