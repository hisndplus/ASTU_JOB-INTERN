# CareerBridge — Technical Documentation

> A dual-role Job & Internship Finder mobile application built with React Native, Expo, and TypeScript.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Architecture](#4-architecture)
5. [Authentication System](#5-authentication-system)
6. [User Roles](#6-user-roles)
7. [Navigation & Routing](#7-navigation--routing)
8. [Screens Reference](#8-screens-reference)
   - [Auth Screens](#auth-screens)
   - [Job Seeker Screens](#job-seeker-screens)
   - [Employer Screens](#employer-screens)
9. [Data Layer](#9-data-layer)
   - [Data Models](#data-models)
   - [Services](#services)
   - [Hooks](#hooks)
   - [Context](#context)
10. [Design System](#10-design-system)
    - [Colors](#colors)
    - [Typography](#typography)
    - [Spacing & Radius](#spacing--radius)
    - [Shadows](#shadows)
11. [Configuration](#11-configuration)
12. [Workflow Analysis Module](#12-workflow-analysis-module)
13. [Storage Strategy](#13-storage-strategy)
14. [Component Library](#14-component-library)
15. [Known Limitations & Future Roadmap](#15-known-limitations--future-roadmap)

---

## 1. Project Overview

**CareerBridge** is a mobile-first job and internship finder application that serves two distinct user types:

| Role | Description |
|------|-------------|
| **Job Seeker** | Browse listings, filter by category/type, apply with cover letter and resume, track application status |
| **Job Poster (Employer)** | Post job openings, manage active listings, review and update applicant statuses |

### Key Features

- Role-differentiated signup (Seeker vs. Employer) — no email verification required
- Search & filter jobs by keyword, category, type, and experience level
- Application submission with cover letter and resume upload simulation
- Employer dashboard: create listings, view applicants, update pipeline status
- Built-in **Workflow Analysis** panel identifying 4 critical job-search inefficiencies
- Fully offline-capable using `AsyncStorage` for local persistence
- 8 pre-seeded mock job listings and 4 mock applicants for demonstration

---

## 2. Tech Stack

| Technology | Version / Package | Purpose |
|---|---|---|
| React Native | via Expo SDK | Core mobile framework |
| Expo | Latest | Build toolchain, OTA updates |
| Expo Router | File-based routing | Navigation |
| TypeScript | Strict mode | Type safety |
| AsyncStorage | `@react-native-async-storage/async-storage` | Local data persistence |
| expo-image | Latest | Optimized image rendering |
| react-native-safe-area-context | Latest | Notch / safe area handling |
| @expo/vector-icons (MaterialIcons) | Latest | Icon set |

---

## 3. Project Structure

```
careerbridge/
├── app/                          # Expo Router pages
│   ├── _layout.tsx               # Root layout — AlertProvider, SafeAreaProvider, AuthProvider
│   ├── index.tsx                 # Entry point — redirects based on auth state & role
│   ├── auth/
│   │   ├── signup.tsx            # Role-selection + registration form
│   │   └── login.tsx             # Email/password login
│   ├── (seeker)/                 # Job Seeker tab group
│   │   ├── _layout.tsx           # Seeker bottom tab navigator
│   │   ├── index.tsx             # Browse Jobs (search + filter)
│   │   ├── applications.tsx      # My Applications tracker
│   │   ├── analysis.tsx          # Workflow Analysis & Insights
│   │   └── profile.tsx           # Seeker profile + resume upload
│   ├── (employer)/               # Employer tab group
│   │   ├── _layout.tsx           # Employer bottom tab navigator
│   │   ├── index.tsx             # My Job Listings dashboard
│   │   ├── post-job.tsx          # Create new job posting form
│   │   ├── applicants.tsx        # Applicant review + status management
│   │   └── account.tsx           # Company account settings
│   ├── (tabs)/
│   │   └── _layout.tsx           # Template placeholder tab layout
│   └── job-detail.tsx            # Full job detail page (modal-style)
│
├── contexts/
│   └── AuthContext.tsx            # Global auth state (user, loading, actions)
│
├── hooks/
│   ├── useAuth.ts                 # Consumer hook for AuthContext
│   └── useJobs.ts                 # Hooks: useJobs, useApplications, useApplicants
│
├── services/
│   ├── authService.ts             # AsyncStorage auth CRUD (signUp, signIn, signOut, updateUser)
│   ├── jobService.ts              # AsyncStorage job/application CRUD
│   └── mockData.ts                # Seed data + TypeScript interfaces
│
├── components/
│   ├── ui/
│   │   ├── Button.tsx             # Reusable Button (primary/outline/ghost, sizes, loading)
│   │   └── Badge.tsx              # Status/category badge chip
│   ├── feature/
│   │   ├── JobCard.tsx            # Job listing card component
│   │   └── ApplicationCard.tsx    # Application tracker card component
│   └── index.ts                   # Barrel export
│
├── constants/
│   ├── theme.ts                   # Colors, Spacing, Radius, FontSize, FontWeight, Shadow
│   └── config.ts                  # App name, categories, types, statuses, workflow data
│
└── assets/
    └── images/
        ├── onboarding-hero.png    # AI-generated onboarding hero (9:16)
        └── empty-jobs.png         # Empty state illustration (4:3)
```

---

## 4. Architecture

CareerBridge follows a strict **Services → Hooks → Components** layered architecture.

```
┌─────────────────────────────────────┐
│           app/ (Pages)              │  ← UI entry points, routing, layout
├─────────────────────────────────────┤
│         components/                 │  ← Stateless UI rendering, consumes hooks
├─────────────────────────────────────┤
│           hooks/                    │  ← State management + business logic (no JSX)
├─────────────────────────────────────┤
│          contexts/                  │  ← Global state (AuthContext)
├─────────────────────────────────────┤
│          services/                  │  ← Pure data operations (AsyncStorage, no React)
└─────────────────────────────────────┘
```

### Layer Responsibilities

| Layer | Files | Rules |
|-------|-------|-------|
| **Pages** | `app/**/*.tsx` | UI entry, navigation, calls hooks |
| **Components** | `components/**` | Pure UI, imports from `hooks/` only |
| **Hooks** | `hooks/*.ts` | State + logic, no JSX, consumes services |
| **Contexts** | `contexts/*.tsx` | Global state providers, placed in `_layout.tsx` |
| **Services** | `services/*.ts` | Pure async functions, no React imports |

---

## 5. Authentication System

Authentication is **mock/local** — no email verification required, no backend server. All data is persisted to the device via `AsyncStorage`.

### Storage Keys

| Key | Content |
|-----|---------|
| `careerbridge_auth` | Currently logged-in `User` object (JSON) |
| `careerbridge_users` | Array of all registered `User` objects (JSON) |

### Auth Flow

```
App Launch
    │
    ▼
app/index.tsx → useAuth() checks loading state
    │
    ├── loading = true  → Show spinner
    │
    ├── user = null     → Redirect to /auth/signup
    │
    └── user exists     ┬── role === 'employer' → /(employer)
                        └── role === 'seeker'   → /(seeker)
```

### `authService.ts` API

```typescript
signUp(name, email, password, role, company?) → Promise<User>
signIn(email, password)                        → Promise<User>
signOut()                                      → Promise<void>
getCurrentUser()                               → Promise<User | null>
updateUser(updates: Partial<User>)             → Promise<User>
```

**Note:** Password validation is minimal (length ≥ 6). Passwords are stored as plain text in AsyncStorage (mock only — not production-safe).

### `AuthContext` Exposed API

```typescript
user: User | null          // Current authenticated user
loading: boolean           // Initial load state
login(email, password)     // Sign in existing user
register(name, email, password, role, company?)  // Create new account
logout()                   // Clear session
refreshUser()              // Re-read from AsyncStorage
updateProfile(updates)     // Partial update current user
```

---

## 6. User Roles

### Job Seeker (`role: 'seeker'`)

Navigates the `(seeker)` tab group with 4 tabs:

| Tab | Screen | Feature |
|-----|--------|---------|
| Browse | `(seeker)/index.tsx` | Search jobs, filter by category/type, featured strip |
| Applications | `(seeker)/applications.tsx` | View submitted applications + status |
| Insights | `(seeker)/analysis.tsx` | Workflow analysis, inefficiencies, stats |
| Profile | `(seeker)/profile.tsx` | Edit profile, upload resume, sign out |

### Job Poster / Employer (`role: 'employer'`)

Navigates the `(employer)` tab group with 4 tabs:

| Tab | Screen | Feature |
|-----|--------|---------|
| My Jobs | `(employer)/index.tsx` | View all posted listings, summary stats |
| Post Job | `(employer)/post-job.tsx` | Create new job listing form |
| Applicants | `(employer)/applicants.tsx` | Review applicants, update status |
| Account | `(employer)/account.tsx` | Edit company profile, sign out |

---

## 7. Navigation & Routing

Built entirely with **Expo Router** (file-based routing).

### Route Map

```
/                        → app/index.tsx         (auto-redirect)
/auth/signup             → app/auth/signup.tsx
/auth/login              → app/auth/login.tsx
/(seeker)                → app/(seeker)/index.tsx
/(seeker)/applications   → app/(seeker)/applications.tsx
/(seeker)/analysis       → app/(seeker)/analysis.tsx
/(seeker)/profile        → app/(seeker)/profile.tsx
/(employer)              → app/(employer)/index.tsx
/(employer)/post-job     → app/(employer)/post-job.tsx
/(employer)/applicants   → app/(employer)/applicants.tsx
/(employer)/account      → app/(employer)/account.tsx
/job-detail              → app/job-detail.tsx       (headerShown: true)
```

### Layout Stack (`app/_layout.tsx`)

```tsx
<AlertProvider>           // Cross-platform alert support
  <SafeAreaProvider>      // Notch/safe-area handling
    <AuthProvider>        // Global auth context
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth/signup" />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="(seeker)" />
        <Stack.Screen name="(employer)" />
        <Stack.Screen name="job-detail" options={{ headerShown: true }} />
      </Stack>
    </AuthProvider>
  </SafeAreaProvider>
</AlertProvider>
```

---

## 8. Screens Reference

### Auth Screens

#### `app/auth/signup.tsx` — Sign Up

**Role Selection (required first step)**

| Option | `role` value | Extra Field |
|--------|-------------|-------------|
| Job Seeker | `'seeker'` | — |
| Job Poster | `'employer'` | Company Name (required) |

**Form Fields:** Full Name · (Company Name if employer) · Email · Password (min 6 chars)

**On success:** Redirects to `/(employer)` or `/(seeker)` based on selected role.

---

#### `app/auth/login.tsx` — Sign In

**Form Fields:** Email · Password

**On success:** Fetches current user from AsyncStorage, redirects by role.

---

### Job Seeker Screens

#### `app/(seeker)/index.tsx` — Browse Jobs

- **Search bar**: filters jobs by title, company, or location (client-side)
- **Category filter**: horizontal chip strip (All, Technology, Design, Marketing, Finance, Healthcare, Education, Engineering, Sales, Operations)
- **Type filter**: horizontal chip strip (All, Full-time, Part-time, Internship, Contract, Remote)
- **Featured strip**: horizontally scrollable cards for `job.featured === true`
- **Job FlatList**: all filtered results via `JobCard` component
- **Empty state**: illustration + message when no results match

---

#### `app/(seeker)/applications.tsx` — My Applications

- Displays submitted applications via `ApplicationCard` components
- Status filter chips: All · Pending · Reviewed · Interview · Offer · Rejected
- Status color coding:

| Status | Color |
|--------|-------|
| Pending | Gray/Neutral |
| Reviewed | Amber/Warning |
| Interview | Blue |
| Offer | Green/Success |
| Rejected | Red/Error |

---

#### `app/(seeker)/analysis.tsx` — Workflow Analysis

See full reference in [Section 12](#12-workflow-analysis-module).

---

#### `app/(seeker)/profile.tsx` — Profile

- Avatar with initials, name, email, role badge
- **Resume Upload**: simulates file upload (mock), stores filename in user profile
- **Editable fields**: Job Title, Location, Bio, Skills (comma-separated)
- Skills displayed as pill tags in view mode
- Save changes persist via `updateProfile()` → `updateUser()` → AsyncStorage
- Sign Out with confirmation alert

---

#### `app/job-detail.tsx` — Job Detail

Accessed via `router.push('/job-detail')` with params. Displays:
- Company logo initials, title, company, location, salary
- Remote badge, type badge, experience level
- Full description
- Requirements list
- **Apply Button** → opens bottom-sheet modal with cover letter textarea + resume attachment
- Prevents duplicate applications (checked against existing applications list)

---

### Employer Screens

#### `app/(employer)/index.tsx` — My Job Listings

- Header with company name greeting + **Post Job** shortcut button
- Summary stat row: Active Listings · Total Applicants · Interviews
- `FlatList` of employer's own job postings (`EmployerJobCard`)
- Each card shows: title, location, type, applicant count, posted date, salary, delete button
- Delete with confirmation alert → `removeJob()` → AsyncStorage update

---

#### `app/(employer)/post-job.tsx` — Post a Job

**Form Sections:**

| Section | Fields |
|---------|--------|
| Basic Information | Job Title *, Location *, Salary *, Application Deadline, Remote toggle |
| Job Type | Chip selection: Full-time / Part-time / Internship / Contract / Remote |
| Category | Chip selection: 9 categories |
| Experience Level | Chip selection: Entry / Mid / Senior / Lead / Manager |
| Job Details | Description (textarea) *, Requirements (one per line, textarea) |

**On submit:** Creates job via `createJob()`, adds to AsyncStorage, alerts success, navigates to My Jobs.

---

#### `app/(employer)/applicants.tsx` — Applicant Review

- Total applicants count in header
- **Job filter** bar (visible when 2+ unique jobs have applicants)
- Each applicant card: avatar initials, name, email, job applied for, experience, date, status badge
- Tap → bottom-sheet modal shows:
  - Full applicant details
  - Resume filename
  - Full cover letter
  - **Status Update** chip grid: Pending / Reviewed / Interview / Offer / Rejected
  - Status persists via `updateApplicantStatus()` → AsyncStorage

---

#### `app/(employer)/account.tsx` — Company Account

- Company logo (initials), name, email, role badge
- **Editable fields**: Company Name, Your Title/Role, Company Location, Company Description
- **Quick Actions**: View Listings / Post a Job / Review Applicants (navigation shortcuts)
- Sign Out with confirmation alert

---

## 9. Data Layer

### Data Models

#### `User` (`services/authService.ts`)

```typescript
interface User {
  id: string;           // Random alphanumeric ID
  name: string;         // Full name
  email: string;        // Unique, case-insensitive
  role: 'seeker' | 'employer';
  company?: string;     // Employers only
  title?: string;       // Job title / role
  location?: string;
  bio?: string;
  skills?: string[];    // Seeker only
  resumeName?: string;  // Seeker only — simulated filename
  createdAt: string;    // ISO timestamp
}
```

#### `Job` (`services/mockData.ts`)

```typescript
interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;      // 2-char initials abbreviation
  location: string;
  type: string;             // 'Full-time' | 'Part-time' | 'Internship' | 'Contract' | 'Remote'
  category: string;         // From JOB_CATEGORIES config
  salary: string;
  description: string;
  requirements: string[];
  postedDate: string;       // 'YYYY-MM-DD'
  deadline: string;         // 'YYYY-MM-DD'
  experience: string;       // From EXPERIENCE_LEVELS config
  remote: boolean;
  employerId: string;
  applicantsCount: number;
  featured: boolean;
}
```

#### `Application` (`services/mockData.ts`)

```typescript
interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  appliedDate: string;    // 'YYYY-MM-DD'
  status: string;         // From APPLICATION_STATUSES config
  coverLetter: string;
  resumeName: string;
}
```

#### `Applicant` (`services/mockData.ts`)

```typescript
interface Applicant {
  id: string;
  name: string;
  email: string;
  jobId: string;
  jobTitle: string;
  appliedDate: string;
  status: string;
  resumeName: string;
  coverLetter: string;
  experience: string;     // e.g. '5 years'
}
```

---

### Services

#### `services/authService.ts`

Pure AsyncStorage operations for user accounts.

| Function | Description |
|----------|-------------|
| `signUp(name, email, password, role, company?)` | Creates user, checks for duplicate email, persists to `careerbridge_users`, sets session |
| `signIn(email, password)` | Finds user by email, sets session (no password hash check — mock) |
| `signOut()` | Removes `careerbridge_auth` key |
| `getCurrentUser()` | Reads `careerbridge_auth` from storage |
| `updateUser(updates)` | Merges updates into current user, saves to both session and users array |

---

#### `services/jobService.ts`

| Function | Description |
|----------|-------------|
| `getJobs()` | Returns all jobs; seeds from `MOCK_JOBS` on first call |
| `getJobsByEmployer(employerId)` | Filters jobs by `employerId` |
| `getJobById(id)` | Finds a single job by ID |
| `createJob(job)` | Prepends new job to list, generates ID + postedDate |
| `deleteJob(jobId)` | Removes job by ID from storage |
| `getApplications(seekerId)` | Returns seeker's applications; seeds from `MOCK_APPLICATIONS` on first call |
| `submitApplication(seekerId, job, coverLetter, resumeName)` | Creates application, checks duplicate, prepends to seeker's list |
| `getApplicants(employerId)` | Returns applicants for employer; seeds from `MOCK_APPLICANTS` on first call |
| `updateApplicantStatus(employerId, applicantId, status)` | Updates applicant status in storage |

**Storage Keys Pattern:**
- Jobs: `careerbridge_jobs`
- Applications: `careerbridge_applications_<seekerId>`
- Applicants: `careerbridge_applicants_<employerId>`

---

### Hooks

#### `hooks/useAuth.ts`

```typescript
function useAuth(): AuthContextType
// Throws if used outside <AuthProvider>
```

Exposes all `AuthContext` values: `user`, `loading`, `login`, `register`, `logout`, `refreshUser`, `updateProfile`.

---

#### `hooks/useJobs.ts` — Three Hooks

**`useJobs()`**

```typescript
{
  jobs: Job[];
  loading: boolean;
  error: string | null;
  fetchJobs(): Promise<void>;               // All public jobs
  fetchEmployerJobs(employerId): Promise<void>;  // Employer's own listings
  postJob(job): Promise<Job>;
  removeJob(jobId): Promise<void>;
}
```

**`useApplications()`**

```typescript
{
  applications: Application[];
  loading: boolean;
  fetchApplications(seekerId): Promise<void>;
  apply(seekerId, job, coverLetter, resumeName): Promise<Application>;
}
```

**`useApplicants()`**

```typescript
{
  applicants: Applicant[];
  loading: boolean;
  fetchApplicants(employerId): Promise<void>;
  updateStatus(employerId, applicantId, status): Promise<void>;
}
```

---

### Context

#### `contexts/AuthContext.tsx`

`AuthProvider` wraps the entire app in `_layout.tsx`. On mount, loads session from AsyncStorage via `getCurrentUser()`. Exposes actions that call service functions and update local React state.

```tsx
// Usage in any component:
import { useAuth } from '@/hooks/useAuth';
const { user, login, register, logout } = useAuth();
```

---

## 10. Design System

All design tokens are defined in `constants/theme.ts`.

### Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#0f4c75` | Headers, primary buttons, active states |
| `primaryLight` | `#1b6ca8` | Hover/pressed states |
| `primaryDark` | `#0a3254` | Dark variant |
| `accent` | `#1b9aaa` | Active tabs, secondary CTAs, highlights |
| `accentLight` | `#2ab5c7` | Accent hover |
| `success` | `#22c55e` | Offer status, success states |
| `warning` | `#f59e0b` | Reviewed status, warnings |
| `error` | `#ef4444` | Rejected status, errors, PDF icon |
| `background` | `#f0f4f8` | Page background |
| `surface` | `#ffffff` | Cards, modals, inputs |
| `surfaceAlt` | `#e8f0f7` | Alternate surface |
| `border` | `#dde6ef` | Card borders, dividers |
| `text` | `#1e293b` | Primary text |
| `textSecondary` | `#475569` | Secondary/descriptive text |
| `textMuted` | `#94a3b8` | Placeholders, captions |
| `tabBar` | `#0a2744` | Bottom tab bar background |
| `tabBarBorder` | `#1a3a5c` | Tab bar top border |
| `overlay` | `rgba(15,76,117,0.08)` | Subtle tinted backgrounds |

---

### Typography

```typescript
FontSize = { xs: 12, sm: 14, md: 16, lg: 18, xl: 20, xxl: 24, hero: 30 }
FontWeight = { regular: '400', medium: '500', semibold: '600', bold: '700' }
```

---

### Spacing & Radius

```typescript
Spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 }  // 8pt grid
Radius  = { sm: 8, md: 12, lg: 16, xl: 24, full: 999 }
```

---

### Shadows

```typescript
Shadow.sm  // elevation: 2 — Cards, inputs
Shadow.md  // elevation: 4 — Avatars, floating elements
Shadow.lg  // elevation: 8 — Modals, sheets
```

All shadow colors use `#0f4c75` (primary) for brand-consistent depth.

---

## 11. Configuration

All app-level constants live in `constants/config.ts`.

```typescript
APP_NAME = 'CareerBridge'

JOB_CATEGORIES = [
  'All', 'Technology', 'Design', 'Marketing', 'Finance',
  'Healthcare', 'Education', 'Engineering', 'Sales', 'Operations'
]

JOB_TYPES = ['All', 'Full-time', 'Part-time', 'Internship', 'Contract', 'Remote']

EXPERIENCE_LEVELS = ['Entry Level', 'Mid Level', 'Senior', 'Lead', 'Manager']

APPLICATION_STATUSES = ['Pending', 'Reviewed', 'Interview', 'Offer', 'Rejected']

WORKFLOW_INEFFICIENCIES = [ ... ]  // See Section 12
```

---

## 12. Workflow Analysis Module

Located at `app/(seeker)/analysis.tsx`, the Insights tab provides a structured analysis of current job-search workflow inefficiencies — embedded directly in the app.

### Current Job Search Flow Map

A 7-step visual flow chart showing each stage of the job-search process with its critical pain point:

| Step | Stage | Pain Point |
|------|-------|------------|
| 1 | Discover Jobs | Platform fragmentation |
| 2 | Research Company | Scattered info |
| 3 | Prepare CV/Cover | Manual repetition |
| 4 | Submit Application | Form re-entry fatigue |
| 5 | Wait for Response | Zero visibility |
| 6 | Interview | Poor scheduling |
| 7 | Receive Offer | 42-day avg. delay |

### Major Inefficiencies Identified

| # | Title | Severity | Impact | Solution |
|---|-------|----------|--------|----------|
| 1 | **Fragmented Job Discovery** | High | 73% miss relevant jobs due to platform fragmentation | Unified smart feed with AI-powered relevance ranking |
| 2 | **Manual Application Re-entry** | Critical | 60% abandon mid-application due to form fatigue | One-time profile + smart autofill + universal CV export |
| 3 | **Zero Feedback Loop** | High | Seekers waste 8+ hrs following up with zero insight | Real-time status updates + automated notifications |
| 4 | **Employer Screening Bottleneck** | Medium | 42-day avg. time-to-hire, $4,700+ cost per hire | Skill-match scoring + structured screening workflows |

### Summary Statistics

| Metric | Value |
|--------|-------|
| Weekly job search time | 11 hrs |
| Average time-to-hire | 42 days |
| Application abandonment rate | 60% |
| Cost per hire (employer) | $4,700 |

---

## 13. Storage Strategy

All data is stored locally using `@react-native-async-storage/async-storage`. There is no backend server.

| Storage Key | Type | Contents |
|-------------|------|----------|
| `careerbridge_auth` | `User` | Active session user object |
| `careerbridge_users` | `User[]` | All registered accounts |
| `careerbridge_jobs` | `Job[]` | All job listings (seeded from MOCK_JOBS) |
| `careerbridge_applications_<seekerId>` | `Application[]` | Per-seeker applications |
| `careerbridge_applicants_<employerId>` | `Applicant[]` | Per-employer applicant list |

### Seeding Behavior

Each data collection seeds from its corresponding mock data array **only once** — on the first `AsyncStorage.getItem()` call that returns `null`. Subsequent calls use the persisted data.

---

## 14. Component Library

### `components/ui/Button.tsx`

```typescript
<Button
  label="Submit"
  onPress={() => {}}
  variant="primary"   // 'primary' | 'outline' | 'ghost'
  size="md"           // 'sm' | 'md' | 'lg'
  loading={false}
  disabled={false}
  fullWidth={false}
  style={...}         // Optional override
/>
```

### `components/ui/Badge.tsx`

```typescript
<Badge
  label="Pending"
  variant="neutral"   // 'primary' | 'neutral' | 'success' | 'warning' | 'error' | 'interview'
  size="sm"           // 'sm' | 'md'
/>
```

### `components/feature/JobCard.tsx`

Renders a single job listing card. Props: `job: Job`, `onPress: () => void`.

Displays: Company logo initials · Title · Company · Location · Type badge · Category badge · Salary · Remote indicator · Applicant count.

### `components/feature/ApplicationCard.tsx`

Renders a single application in the tracker. Props: `application: Application`.

Displays: Company initials · Job title · Company · Applied date · Status badge (color-coded).

---

## 15. Known Limitations & Future Roadmap

### Current Limitations

| Area | Limitation |
|------|------------|
| **Authentication** | No real password hashing — mock only, not production-safe |
| **Resume Upload** | Simulated only — no actual file picker or storage integration |
| **Cross-device sync** | Data lives only on the local device (AsyncStorage) |
| **Real-time updates** | No live notifications or push alerts |
| **Search** | Client-side filtering only — no server-side search or ranking |
| **Employer ↔ Seeker** | No real application flow between accounts — applicants list uses mock seed data |

### Recommended Next Steps

| Priority | Feature | Implementation |
|----------|---------|----------------|
| 🔴 High | Connect real backend | Enable OnSpace Cloud → migrate to Supabase auth + PostgreSQL |
| 🔴 High | Real resume upload | Integrate OnSpace Cloud Storage with `expo-document-picker` |
| 🟡 Medium | Push notifications | `expo-notifications` for application status changes |
| 🟡 Medium | In-app messaging | Real-time chat between employer and applicant post-application |
| 🟡 Medium | Employer analytics | Charts for applications per job, status distribution (react-native-chart-kit) |
| 🟢 Low | Job bookmarks | Save/unsave jobs with local persistence |
| 🟢 Low | Advanced search | Full-text search, salary range slider, location radius |
| 🟢 Low | Onboarding flow | Animated welcome screens using onboarding-hero.png |

---

*Documentation generated for CareerBridge v1.0 — May 2026*
