# ERG Frontend - Hệ thống Notification toàn diện & Background Task Monitor

> **Reviewer:** Senior Developer & PO
> **Ngày:** 2026-03-03
> **Scope:** erg (Next.js 16+)
> **Mục tiêu:** Mọi hoạt động trên admin đều được thông báo. Tác vụ nền có monitoring dashboard.

---

## MỤC LỤC

1. [Hiện trạng & Gap Analysis](#1-hiện-trạng--gap-analysis)
2. [Thiết kế Notification System toàn diện](#2-thiết-kế-notification-system-toàn-diện)
3. [Real-time Monitoring Dashboard](#3-real-time-monitoring-dashboard)
4. [WebSocket Integration](#4-websocket-integration)
5. [Polling Fallback Mechanism](#5-polling-fallback-mechanism)
6. [Notification Components](#6-notification-components)
7. [Admin Page Integrations](#7-admin-page-integrations)
8. [Data Visualization & Analytics](#8-data-visualization--analytics)
9. [API Client Integration](#9-api-client-integration)
10. [Checklist tổng hợp](#10-checklist-tổng-hợp)

---

## 1. HIỆN TRẠNG & GAP ANALYSIS

### 1.1. Inventory các trang admin hiện tại

| # | Trang Admin | Loại Tác vụ | Notification? |
|---|-------------|-------------|---------------|
| 1 | `/admin/dashboard` | Tổng quan hệ thống | ❌ Không |
| 2 | `/admin/queue-monitor` | Queue Management | ❌ Không |
| 3 | `/admin/job-history` | Job History | ❌ Không |
| 4 | `/admin/workers` | Worker Status | ❌ Không |
| 5 | `/admin/cron-jobs` | Cron Jobs | ❌ Không |
| 6 | `/admin/system-status` | Health Check | ❌ Không |
| 7 | `/admin/settings` | Cấu hình hệ thống | ⚠️ Chỉ khi có lỗi |

### 1.2. Các loại notification cần thiết

- Real-time event notifications (SSE/WebSocket)
- Polling fallback mechanism
- Dashboard with live metrics
- Error notifications (job failures)
- Success notifications (job completions)
- System health alerts

---

## 2. THIẾT KẾ NOTIFICATION SYSTEM TOÀN DIỆN

### 2.1. Notification Architecture

```typescript
// src/lib/notification/types.ts
export interface NotificationEvent {
  id: string;
  type: 'queue' | 'worker' | 'cron' | 'system' | 'job';
  level: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  payload?: any;
  read?: boolean;
}

export interface NotificationConfig {
  autoDismiss?: boolean;
  dismissTimeout?: number;
  priority?: 'low' | 'normal' | 'high' | 'critical';
}
```

### 2.2. Notification Manager

```typescript
// src/lib/notification/manager.ts
class NotificationManager {
  private static instance: NotificationManager;
  private notifications: NotificationEvent[] = [];
  private listeners: ((event: NotificationEvent) => void)[] = [];

  private constructor() {}

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  addListener(callback: (event: NotificationEvent) => void): void {
    this.listeners.push(callback);
  }

  emit(event: NotificationEvent): void {
    this.notifications.push(event);
    this.listeners.forEach(callback => callback(event));
  }

  getNotifications(): NotificationEvent[] {
    return [...this.notifications];
  }

  markAsRead(id: string): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
    }
  }
}
```

---

## 3. REAL-TIME MONITORING DASHBOARD

### 3.1. Dashboard Component Structure

```tsx
// src/app/admin/queue-monitor/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { NotificationManager } from '@/lib/notification/manager';

export default function QueueMonitorDashboard() {
  const [queueStats, setQueueStats] = useState<QueueStats[]>([]);
  const [workers, setWorkers] = useState<WorkerStatus[]>([]);
  const [jobs, setJobs] = useState<JobHistory[]>([]);
  const [notifications, setNotifications] = useState<NotificationEvent[]>([]);

  const ws = useWebSocket('/api/ws/queue-monitor');

  useEffect(() => {
    // Subscribe to real-time updates
    if (ws) {
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleRealTimeUpdate(data);
      };
    }

    // Listen to notifications
    const notificationManager = NotificationManager.getInstance();
    notificationManager.addListener((event) => {
      setNotifications(prev => [event, ...prev]);
    });

    return () => {
      if (ws) ws.close();
    };
  }, []);

  const handleRealTimeUpdate = (data: any) => {
    switch(data.type) {
      case 'queue_stats':
        setQueueStats(data.payload);
        break;
      case 'worker_status':
        setWorkers(data.payload);
        break;
      case 'job_history':
        setJobs(data.payload);
        break;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Queue Monitoring Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Queue stats cards */}
      </div>

      {/* Workers Status */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Worker Status</h2>
        <WorkerTable workers={workers} />
      </div>

      {/* Job History */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Recent Jobs</h2>
        <JobHistoryTable jobs={jobs} />
      </div>

      {/* Notifications Panel */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Notifications</h2>
        <NotificationPanel notifications={notifications} />
      </div>
    </div>
  );
}
```

### 3.2. WebSocket Hook

```typescript
// src/hooks/useWebSocket.ts
import { useEffect, useRef } from 'react';

export function useWebSocket(url: string) {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://${window.location.host}${url}`);

    ws.onopen = () => {
      console.log('Connected to WebSocket');
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, [url]);

  return wsRef.current;
}
```

---

## 4. WEBSOCKET INTEGRATION

### 4.1. Server-Sent Events Handler

```typescript
// src/app/api/sse/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  const headers = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  };

  const response = new NextResponse(null, { headers });

  // Broadcast to specific user or all admins
  // Implementation depends on your notification system

  return response;
}
```

### 4.2. WebSocket Server Integration

```typescript
// src/lib/websocket/server.ts
import { WebSocketServer } from 'ws';

export class WebSocketServerManager {
  private wss: WebSocketServer;
  private clients: Set<WebSocket> = new Set();

  constructor() {
    this.wss = new WebSocketServer({ port: 8080 });
    this.setupListeners();
  }

  private setupListeners() {
    this.wss.on('connection', (ws) => {
      this.clients.add(ws);

      ws.on('close', () => {
        this.clients.delete(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(ws);
      });
    });
  }

  broadcast(message: any) {
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
}
```

---

## 5. POLLING FALLBACK MECHANISM

### 5.1. Polling Hook

```typescript
// src/hooks/usePolling.ts
import { useState, useEffect } from 'react';

export function usePolling<T>(
  fetchFunction: () => Promise<T>,
  interval: number = 5000,
  initialData?: T
) {
  const [data, setData] = useState<T | null>(initialData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await fetchFunction();
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, interval);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [fetchFunction, interval]);

  return { data, loading, error };
}
```

### 5.2. Fallback Notification Component

```tsx
// src/components/admin/notifications/PollingFallback.tsx
import { usePolling } from '@/hooks/usePolling';

export function PollingFallback() {
  const { data, loading, error } = usePolling(
    () => fetch('/api/notifications').then(res => res.json()),
    3000 // 3 seconds polling
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-2">
      {data?.map((notification: any) => (
        <div key={notification.id} className="p-2 bg-blue-50 border border-blue-200 rounded">
          {notification.title}: {notification.message}
        </div>
      ))}
    </div>
  );
}
```

---

## 6. NOTIFICATION COMPONENTS

### 6.1. Toast Notification

```tsx
// src/components/admin/notifications/ToastNotification.tsx
import { useEffect } from 'react';

export function ToastNotification({
  notification,
  onClose
}: {
  notification: NotificationEvent;
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getLevelClass = () => {
    switch (notification.level) {
      case 'error': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'success': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className={`fixed top-4 right-4 p-4 text-white rounded-lg shadow-lg ${getLevelClass()}`}>
      <div className="font-semibold">{notification.title}</div>
      <div className="text-sm">{notification.message}</div>
    </div>
  );
}
```

### 6.2. Notification Panel

```tsx
// src/components/admin/notifications/NotificationPanel.tsx
import { NotificationEvent } from '@/lib/notification/types';

export function NotificationPanel({ notifications }: { notifications: NotificationEvent[] }) {
  return (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {notifications.length === 0 ? (
        <div className="text-gray-500 italic">No notifications</div>
      ) : (
        notifications.map(notification => (
          <div
            key={notification.id}
            className={`p-3 rounded border ${
              notification.level === 'error' ? 'border-red-200 bg-red-50' :
              notification.level === 'warning' ? 'border-yellow-200 bg-yellow-50' :
              notification.level === 'success' ? 'border-green-200 bg-green-50' :
              'border-blue-200 bg-blue-50'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold">{notification.title}</div>
                <div className="text-sm mt-1">{notification.message}</div>
              </div>
              <div className="text-xs text-gray-500">
                {notification.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
```

---

## 7. ADMIN PAGE INTEGRATIONS

### 7.1. Queue Monitor Page

```tsx
// src/app/admin/queue-monitor/page.tsx
import { QueueMonitorDashboard } from '@/components/admin/queue/QueueMonitorDashboard';

export default function QueueMonitorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <QueueMonitorDashboard />
    </div>
  );
}
```

### 7.2. Worker Status Page

```tsx
// src/app/admin/workers/page.tsx
import { WorkerStatusDashboard } from '@/components/admin/workers/WorkerStatusDashboard';

export default function WorkerStatusPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <WorkerStatusDashboard />
    </div>
  );
}
```

### 7.3. Job History Page

```tsx
// src/app/admin/job-history/page.tsx
import { JobHistoryDashboard } from '@/components/admin/jobs/JobHistoryDashboard';

export default function JobHistoryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <JobHistoryDashboard />
    </div>
  );
}
```

---

## 8. DATA VISUALIZATION & ANALYTICS

### 8.1. Chart Components

```tsx
// src/components/admin/charts/QueueChart.tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function QueueChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="jobs" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
}
```

### 8.2. Metrics Display

```tsx
// src/components/admin/metrics/MetricCard.tsx
export function MetricCard({
  title,
  value,
  change,
  icon
}: {
  title: string;
  value: string | number;
  change?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {change}
            </p>
          )}
        </div>
        {icon && <div className="text-blue-500">{icon}</div>}
      </div>
    </div>
  );
}
```

---

## 9. API CLIENT INTEGRATION

### 9.1. Notification Service

```typescript
// src/services/admin/notification.service.ts
import { apiClient } from '@/lib/api-client';

export class NotificationService {
  static async getNotifications(userId: string) {
    return apiClient.get(`/admin/notifications?userId=${userId}`);
  }

  static async markAsRead(notificationId: string) {
    return apiClient.put(`/admin/notifications/${notificationId}/read`);
  }

  static async subscribeToEvents(userId: string) {
    // Implement subscription logic
    return new EventSource(`/api/sse?userId=${userId}`);
  }
}
```

### 9.2. Queue Service

```typescript
// src/services/admin/queue.service.ts
import { apiClient } from '@/lib/api-client';

export class QueueService {
  static async getQueueStats() {
    return apiClient.get('/admin/queue/stats');
  }

  static async getWorkerStatus() {
    return apiClient.get('/admin/workers/status');
  }

  static async getJobHistory() {
    return apiClient.get('/admin/jobs/history');
  }
}
```

---

## 10. CHECKLIST TỔNG HỢP

### 10.1. Backend Requirements

- [ ] WebSocket server implementation
- [ ] SSE endpoint for real-time updates
- [ ] Notification broadcasting mechanism
- [ ] Queue stats collection
- [ ] Worker status tracking
- [ ] Job history logging

### 10.2. Frontend Requirements

- [ ] Notification manager singleton
- [ ] WebSocket connection hook
- [ ] Polling fallback mechanism
- [ ] Dashboard components
- [ ] Notification display components
- [ ] Real-time data visualization
- [ ] Admin page integrations

### 10.3. Testing Checklist

- [ ] WebSocket connection establishment
- [ ] Real-time notification delivery
- [ ] Polling fallback functionality
- [ ] Notification persistence
- [ ] Dashboard responsiveness
- [ ] Performance optimization
- [ ] Error handling scenarios

### 10.4. Deployment Checklist

- [ ] WebSocket server deployment
- [ ] SSE endpoint availability
- [ ] Notification service integration
- [ ] CORS configuration
- [ ] Security considerations
- [ ] Performance monitoring
- [ ] Logging and debugging