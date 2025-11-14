import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 添加请求拦截器，自动添加token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器，处理401错误和网络错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 处理网络错误（后端未运行或连接失败）
    if (!error.response && error.request) {
      error.code = 'ECONNREFUSED';
      error.message = 'Network Error';
    }
    
    if (error.response?.status === 401) {
      // Token过期或无效，清除本地存储并跳转到登录页
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userInfo');
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface UserInfo {
  _id: string;
  email: string;
  name?: string;
  roles?: string[];
}

export interface LoginResponse {
  accessToken: string;
  user: UserInfo;
}

export interface RegisterResponse {
  _id: string;
  email: string;
  name?: string;
  roles?: string[];
}

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>('/auth/register', data);
    return response.data;
  },
};

// 文章相关接口
export interface Article {
  _id: string;
  title: string;
  authors: string[];
  journalOrConference?: string;
  publicationYear?: number;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  status?: string;
  submitter?: string;
  createdAt?: string;
  updatedAt?: string;
  analysis?: {
    practice: string;
    claim: string;
    outcome: string;
    researchMethod?: string;
    participantType?: string;
    summary?: string;
  };
}

export interface CreateArticleRequest {
  title: string;
  authors: string[];
  journalOrConference?: string;
  publicationYear?: number;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
}

export interface SearchArticlesRequest {
  searchTerm?: string;
  title?: string;
  author?: string;
  practice?: string;
  claim?: string;
  outcome?: string;
  researchMethod?: string;
  participantType?: string;
  yearFrom?: number;
  yearTo?: number;
}

// 用户统计接口
export interface UserStats {
  total: number;
  byRole: Record<string, number>;
}

export const statsApi = {
  getUserStats: async (): Promise<UserStats> => {
    const response = await api.get<UserStats>('/stats/users');
    return response.data;
  },
};

// 用户管理接口
export interface UpdateUserRolesRequest {
  roles: string[];
}

export const usersApi = {
  // 获取所有用户（仅管理员）
  getAll: async (): Promise<UserInfo[]> => {
    const response = await api.get<UserInfo[]>('/users');
    return response.data;
  },

  // 获取单个用户（仅管理员）
  getById: async (id: string): Promise<UserInfo> => {
    const response = await api.get<UserInfo>(`/users/${id}`);
    return response.data;
  },

  // 更新用户角色（仅管理员）
  updateRoles: async (id: string, roles: string[]): Promise<UserInfo> => {
    const response = await api.patch<UserInfo>(`/users/${id}/roles`, { roles });
    return response.data;
  },
};

export const articlesApi = {
  // 创建文章
  create: async (data: CreateArticleRequest): Promise<Article> => {
    const response = await api.post<Article>('/articles/submit', data);
    return response.data;
  },

  // 获取我的文章列表
  getMine: async (): Promise<Article[]> => {
    const response = await api.get<Article[]>('/articles/mine');
    return response.data;
  },

  // 获取单个文章
  getById: async (id: string): Promise<Article> => {
    const response = await api.get<Article>(`/articles/${id}`);
    return response.data;
  },

  // 更新文章
  update: async (id: string, data: CreateArticleRequest): Promise<Article> => {
    const response = await api.patch<Article>(`/articles/${id}`, data);
    return response.data;
  },

  // 删除文章
  delete: async (id: string): Promise<void> => {
    await api.delete(`/articles/${id}`);
  },

  // 搜索文章
  search: async (params: SearchArticlesRequest): Promise<Article[]> => {
    const response = await api.get<Article[]>('/articles/search', { params });
    return response.data;
  },

  // 获取待审核文章列表（Moderator/Admin）
  getPendingModeration: async (): Promise<Article[]> => {
    const response = await api.get<Article[]>('/articles/moderation/pending');
    return response.data;
  },

  // 审核文章（Moderator/Admin）
  moderate: async (id: string, decision: 'approve' | 'reject', note?: string): Promise<Article> => {
    const response = await api.patch<Article>(`/articles/${id}/moderate`, {
      decision,
      note
    });
    return response.data;
  },
};
