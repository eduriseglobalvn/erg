# ERG Frontend - Implementation Plan & Issues Tracking

> **Reviewer:** Senior Developer & PO
> **Ngày đánh giá:** 2026-03-04
> **Scope:** erg (Next.js 16+ Frontend)

---

## MỤC LỤC

1. [Issues tồn đọng & Bugs](#1-issues-tồn-đọng--bugs)
2. [Technical Debt](#2-technical-debt)
3. [Security Issues](#3-security-issues)
4. [Performance Issues](#4-performance-issues)
5. [Missing Features](#5-missing-features)
6. [Implementation Plan](#6-implementation-plan)
7. [Prioritization Matrix](#7-prioritization-matrix)

---

## 1. ISSUES TỒN ĐỌNG & BUGS

### 1.1. UI/UX Issues

| Issue | Severity | Location | Description |
|-------|----------|----------|-------------|
| Responsive layout broken on mobile | 🔴 Critical | `@admin/[locale]/posts/page.tsx` | Table columns overflow on small screens |
| Loading states missing | 🟡 Medium | Multiple components | Components don't show loading indicators during API calls |
| Form validation UX poor | 🟡 Medium | All form components | Validation errors appear abruptly without smooth transitions |
| Dark mode inconsistencies | 🟢 Low | Various components | Some components don't respect dark mode toggle |

### 1.2. API Integration Issues

| Issue | Severity | Location | Description |
|-------|----------|----------|-------------|
| No request cancellation | 🔴 Critical | `services/api-client.ts` | Long-running requests can't be cancelled, causing memory leaks |
| Missing error handling | 🟡 Medium | `hooks/useApiQuery.ts` | Network errors not properly handled in custom hooks |
| Race conditions | 🔴 Critical | `@admin/[locale]/posts/edit/[id]/page.tsx` | Concurrent updates can overwrite each other |
| Inconsistent response handling | 🟡 Medium | Multiple services | Different error response formats not normalized |

### 1.3. State Management Issues

| Issue | Severity | Location | Description |
|-------|----------|----------|-------------|
| Excessive re-renders | 🟡 Medium | `contexts/PostContext.tsx` | Context updates trigger unnecessary child re-renders |
| Global state pollution | 🟡 Medium | `stores/` | Zustand stores share data across unrelated components |
| Missing loading states | 🟢 Low | Form components | Forms don't show submission loading state |

---

## 2. TECHNICAL DEBT

### 2.1. Code Quality Issues

| Issue | Severity | Location | Description |
|-------|----------|----------|-------------|
| Duplicated utility functions | 🟡 Medium | Multiple files | Same helper functions copied across files |
| Magic strings in components | 🟢 Low | Multiple components | Hardcoded values instead of constants |
| Large component files | 🟡 Medium | `@admin/[locale]/dashboard/page.tsx` | Component >500 lines, hard to maintain |
| Inconsistent naming | 🟢 Low | Various files | Mixed naming conventions (camelCase/PascalCase) |

### 2.2. Architecture Issues

| Issue | Severity | Location | Description |
|-------|----------|----------|-------------|
| Tight coupling | 🟡 Medium | `components/admin/` | Components too dependent on specific API responses |
| Missing abstraction layers | 🟡 Medium | `services/` | Direct API calls scattered everywhere |
| No proper error boundaries | 🟡 Medium | App structure | Unhandled errors crash entire sections |

---

## 3. SECURITY ISSUES

### 3.1. Client-side Vulnerabilities

| Issue | Severity | Location | Description |
|-------|----------|----------|-------------|
| XSS potential in HTML rendering | 🔴 Critical | `components/PostContent.tsx` | Raw HTML content rendered without sanitization |
| Insufficient input validation | 🟡 Medium | All form inputs | Client-side validation only, no additional checks |
| Session management weak | 🔴 Critical | `contexts/AuthContext.tsx` | Tokens stored in localStorage, vulnerable to XSS |
| Sensitive data exposure | 🟡 Medium | Debug logs | API responses logged in production builds |

### 3.2. API Security

| Issue | Severity | Location | Description |
|-------|----------|----------|-------------|
| Missing request headers | 🟡 Medium | `lib/api-client.ts` | No proper headers for authentication verification |
| No request signing | 🟡 Medium | API calls | Requests can potentially be replayed |

---

## 4. PERFORMANCE ISSUES

### 4.1. Rendering Performance

| Issue | Severity | Location | Description |
|-------|----------|----------|-------------|
| Heavy components on initial load | 🟡 Medium | `@admin/[locale]/dashboard/page.tsx` | Too many components render on initial load |
| Unoptimized images | 🟡 Medium | All image components | Images not properly sized/responsive |
| Lack of virtualization | 🔴 Critical | Posts table | Large datasets cause performance issues |
| Unnecessary re-renders | 🟡 Medium | Multiple components | Components re-render without prop changes |

### 4.2. Network Performance

| Issue | Severity | Location | Description |
|-------|----------|----------|-------------|
| No data caching | 🟡 Medium | `services/` | Same data fetched repeatedly |
| Large payload transfers | 🟡 Medium | API responses | Unnecessary data included in responses |
| No progressive loading | 🟡 Medium | Data tables | Entire datasets loaded at once |

---

## 5. MISSING FEATURES

### 5.1. User Experience

| Feature | Priority | Location | Description |
|---------|----------|----------|-------------|
| Keyboard navigation | 🟡 Medium | Admin panel | Full keyboard accessibility missing |
| Advanced search/filter | 🟡 Medium | Posts management | Limited search capabilities |
| Bulk operations | 🟡 Medium | Posts table | Cannot perform bulk actions |
| Offline support | 🟢 Low | Entire app | No offline functionality |

### 5.2. Admin Functionality

| Feature | Priority | Location | Description |
|---------|----------|----------|-------------|
| Audit logs | 🔴 Critical | Admin panel | No tracking of admin actions |
| Role-based UI | 🟡 Medium | Navigation | UI doesn't fully reflect role permissions |
| Activity monitoring | 🟡 Medium | Dashboard | No real-time activity indicators |

---

## 6. IMPLEMENTATION PLAN

### Phase 1: Critical Security Fixes (Week 1-2)
- [x] Fix XSS vulnerabilities in HTML rendering
- [x] Improve session management (tokens in httpOnly cookies)
- [x] Add proper error boundaries
- [x] Fix race conditions in concurrent updates

### Phase 2: Performance Improvements (Week 3-4)
- [x] Implement virtualization for large lists
- [x] Add caching layer for API responses
- [x] Optimize image loading and sizing
- [x] Reduce bundle size

### Phase 3: Bug Fixes (Week 5-6)
- [x] Fix responsive layout issues
- [x] Implement proper loading states
- [x] Resolve form validation UX issues
- [x] Address API integration issues

### Phase 4: New Features (Week 7-8)
- [ ] Add audit logging
- [x] Implement bulk operations
- [x] Enhance search/filter capabilities
- [ ] Add advanced admin controls

### Phase 5: Technical Debt (Week 9-10)
- [x] Refactor large components
- [x] Standardize naming conventions
- [x] Consolidate duplicated utilities
- [x] Improve architecture patterns

---

## 7. PRIORITIZATION MATRIX

### 🔴 CRITICAL (Immediate attention required)
- XSS vulnerabilities
- Race conditions
- Session management
- Virtualization for performance
- Audit logs

### 🟡 MEDIUM (Address in near term)
- Responsive layout fixes
- API error handling
- Form validation UX
- Bulk operations
- Advanced search

### 🟢 LOW (Address when capacity allows)
- Dark mode consistency
- Naming standardization
- Minor UI improvements
- Offline support

---

## 8. RISK ASSESSMENT

### High Risk Items
- Security vulnerabilities: Could lead to data breaches
- Race conditions: Could cause data corruption
- Performance issues: Could make app unusable

### Medium Risk Items
- Missing features: Could affect user productivity
- Technical debt: Could slow down future development

### Mitigation Strategies
- Security: Regular security audits and code reviews
- Performance: Continuous monitoring and profiling
- Features: Prioritize based on user feedback