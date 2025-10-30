# Developer Documentation

This document provides comprehensive technical information for developers working on the To-Do App project.

## Table of Contents
- [Development Environment Setup](#development-environment-setup)
- [Architecture Overview](#architecture-overview)
- [Technology Stack Details](#technology-stack-details)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Frontend Components](#frontend-components)
- [Authentication Flow](#authentication-flow)
- [Development Workflow](#development-workflow)
- [Building and Testing](#building-and-testing)
- [Code Style and Standards](#code-style-and-standards)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## Development Environment Setup

### Prerequisites
- **Node.js**: Version 20.x or higher (LTS recommended)
- **Package Manager**: npm, yarn, pnpm, or bun
- **Git**: For version control
- **Code Editor**: VS Code recommended with the following extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript Language Features

### Initial Setup

1. **Clone the repository**:
```bash
git clone https://github.com/wbrous/todo-app.git
cd todo-app
```

2. **Install dependencies**:
```bash
npm install
# or your preferred package manager
```

3. **Environment Variables**:
Create a `.env.local` file in the root directory:
```env
# Convex Backend
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
CONVEX_DEPLOY_KEY=your_deploy_key

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

4. **Set up Convex**:
```bash
npx convex dev
```
This will initialize your Convex backend and create the necessary database tables.

5. **Set up Clerk**:
- Create a Clerk application at [clerk.com](https://clerk.com)
- Configure the application URLs:
  - Sign-in URL: `/auth/login`
  - Sign-up URL: `/auth/signup`
- Copy the API keys to your `.env.local`

6. **Start the development server**:
```bash
npm run dev
```

## Architecture Overview

### Application Architecture

The To-Do App follows a modern, serverless architecture:

```
┌─────────────────────────────────────────────────────────┐
│                      Client (Browser)                    │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Next.js 16 (React 19 + App Router)       │  │
│  │  ┌────────────────────────────────────────────┐  │  │
│  │  │  UI Components (shadcn/ui + Radix UI)      │  │  │
│  │  └────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   Authentication Layer                   │
│                    (Clerk Auth)                          │
└─────────────────────────────────────────────────────────┘
                            │
                            │ JWT Tokens
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    Backend Services                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │            Convex Real-time Backend              │  │
│  │  ┌────────────────────────────────────────────┐  │  │
│  │  │  Mutations  │  Queries  │  Database        │  │  │
│  │  └────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Key Architectural Principles

1. **Server Components by Default**: Utilizes Next.js App Router with React Server Components for optimal performance
2. **Client Components Where Needed**: Interactive components use `"use client"` directive
3. **Real-time Data Sync**: Convex provides automatic real-time updates across clients
4. **Type Safety**: End-to-end TypeScript with generated types from Convex schema
5. **Atomic Operations**: Backend mutations ensure data consistency
6. **Authentication-First**: All data operations require valid authentication

## Technology Stack Details

### Frontend Technologies

#### Next.js 16
- **App Router**: File-system based routing with React Server Components
- **Turbopack**: Next-generation bundler for faster builds
- **Middleware**: Route protection and authentication checks
- **Image Optimization**: Automatic image optimization with next/image

#### React 19
- **Server Components**: Reduced bundle size and improved performance
- **Suspense**: Better loading states and streaming
- **Concurrent Rendering**: Improved responsiveness

#### TypeScript 5
- **Strict Mode**: Enabled for maximum type safety
- **Path Aliases**: `@/` for clean imports
- **Generated Types**: Convex automatically generates TypeScript types

#### Tailwind CSS 4
- **Utility-First**: Rapid UI development with utility classes
- **Custom Configuration**: Extended theme with project-specific colors
- **PostCSS**: Optimized CSS processing
- **JIT Mode**: Just-in-Time compilation for optimal bundle size

#### shadcn/ui
- **Component Library**: Beautiful, accessible components
- **Customizable**: Full control over component styles
- **Radix UI Foundation**: Built on accessible primitives
- **Copy-Paste Architecture**: Components are part of your codebase

### Backend Technologies

#### Convex
- **Real-time Database**: Automatic synchronization across clients
- **TypeScript SDK**: Type-safe backend functions
- **Serverless**: No infrastructure management required
- **ACID Transactions**: Guaranteed data consistency
- **Reactive Queries**: Automatic UI updates on data changes

#### Authentication (Clerk)
- **JWT-based**: Secure token authentication
- **Social Logins**: Support for OAuth providers (if configured)
- **Session Management**: Automatic session handling
- **User Management**: Complete user lifecycle management

## Project Structure

```
todo-app/
├── .github/                 # GitHub configuration
│   └── workflows/          # CI/CD workflows
├── app/                    # Next.js App Router
│   ├── app/               # Protected application routes
│   │   ├── layout.tsx    # App layout with sidebar
│   │   ├── page.tsx      # Dashboard/home page
│   │   ├── todo/         # Todo management
│   │   │   └── page.tsx  # Todo page component
│   │   └── calendar/     # Calendar view
│   │       └── page.tsx  # Calendar component (coming soon)
│   ├── auth/             # Authentication routes
│   │   ├── login/       # Login page (Clerk sign-in)
│   │   └── signup/      # Signup page (Clerk sign-up)
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Landing page
│   ├── globals.css      # Global styles
│   └── favicon.ico      # App icon
├── components/            # React components
│   ├── ui/              # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── checkbox.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── app-sidebar.tsx  # Application sidebar navigation
│   ├── ConvexClientProvider.tsx
│   ├── theme-provider.tsx
│   └── welcome-empty-state.tsx
├── convex/               # Convex backend
│   ├── _generated/      # Generated types (do not edit)
│   │   ├── api.d.ts
│   │   ├── dataModel.d.ts
│   │   └── server.d.ts
│   ├── schema.ts        # Database schema definition
│   ├── auth.config.ts   # Clerk authentication config
│   ├── todoLists.ts     # Task list operations
│   │   ├── getTaskList  # Query: Fetch user's lists
│   │   ├── createTaskList # Mutation: Create new list
│   │   ├── modifyTaskList # Mutation: Update list
│   │   └── deleteTaskList # Mutation: Delete list
│   └── todoItems.ts     # Task item operations
│       ├── getItems     # Query: Fetch list items
│       ├── createTask   # Mutation: Create new task
│       ├── modifyTask   # Mutation: Update task
│       └── deleteTask   # Mutation: Delete task
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
│   └── utils.ts         # Helper functions (cn, etc.)
├── public/              # Static assets
│   ├── next.svg
│   └── vercel.svg
├── .gitignore           # Git ignore rules
├── components.json      # shadcn/ui configuration
├── eslint.config.mjs    # ESLint configuration
├── middleware.ts        # Next.js middleware (auth protection)
├── next.config.ts       # Next.js configuration
├── package.json         # Dependencies and scripts
├── postcss.config.mjs   # PostCSS configuration
├── tailwind.config.ts   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
├── README.md            # User documentation
└── DEVELOPERS.md        # This file
```

## Database Schema

### Schema Definition
Location: `convex/schema.ts`

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  todoList: defineTable({
    ownerId: v.string(),     // User's Clerk token identifier
    name: v.string(),         // List name (e.g., "Personal", "Work")
  }),
  todoItem: defineTable({
    listId: v.id("todoList"),      // Reference to parent list
    title: v.string(),              // Task title
    description: v.string(),        // Task description
    createdAt: v.optional(v.string()), // Creation timestamp
    dueDate: v.string(),            // Due date (ISO string)
    completed: v.boolean(),         // Completion status
    ownerId: v.string(),            // User's Clerk token identifier
  }),
});
```

### Data Model Relationships

```
todoList (1) ──< (N) todoItem
    │                   │
    │                   │
    └─── ownerId        └─── ownerId
    └─── listId
```

- Each `todoList` belongs to one user (identified by `ownerId`)
- Each `todoItem` belongs to one `todoList` (via `listId`)
- Each `todoItem` also has an `ownerId` for additional security
- Users can have multiple lists
- Lists can have multiple items

### Indexes
Currently, no explicit indexes are defined. Convex automatically optimizes queries. Future enhancements may include:
- Index on `ownerId` for faster user queries
- Index on `listId` for faster item lookups
- Compound index on `ownerId + completed` for filtered queries

## API Documentation

### Backend Functions (Convex)

All backend functions are located in the `convex/` directory and are automatically exposed as API endpoints.

#### todoLists.ts

##### `getTaskList` (Query)
Fetches all task lists for the authenticated user.

**Parameters**: None

**Returns**:
```typescript
{
  code: 200 | 401 | 400 | 500,
  success: boolean,
  taskLists?: Array<{
    _id: Id<"todoList">,
    ownerId: string,
    name: string,
    _creationTime: number
  }>,
  error?: string,
  errorId?: string,
  timestamp?: string
}
```

**Example Usage**:
```typescript
const taskLists = useQuery(api.todoLists.getTaskList);
```

##### `createTaskList` (Mutation)
Creates a new task list.

**Parameters**:
```typescript
{
  name: string  // List name
}
```

**Returns**:
```typescript
{
  code: 200 | 401 | 400 | 409 | 500,
  success: boolean,
  taskListId?: Id<"todoList">,
  error?: string,
  errorId?: string,
  timestamp?: string
}
```

**Error Codes**:
- `401`: Unauthorized (not authenticated)
- `409`: Task list with same name already exists
- `500`: Internal server error

**Example Usage**:
```typescript
const createList = useMutation(api.todoLists.createTaskList);
await createList({ name: "My New List" });
```

##### `modifyTaskList` (Mutation)
Updates an existing task list.

**Parameters**:
```typescript
{
  id: Id<"todoList">,
  name: string  // New name
}
```

**Returns**: Same structure as `createTaskList`

##### `deleteTaskList` (Mutation)
Deletes a task list (does not cascade to items).

**Parameters**:
```typescript
{
  id: Id<"todoList">
}
```

**Returns**:
```typescript
{
  code: 200 | 401 | 403 | 404 | 500,
  success: boolean,
  error?: string,
  errorId?: string,
  timestamp?: string
}
```

#### todoItems.ts

##### `getItems` (Query)
Fetches all items for a specific task list.

**Parameters**:
```typescript
{
  taskListId: Id<"todoList">
}
```

**Returns**:
```typescript
{
  code: 200 | 401 | 404 | 500,
  success: boolean,
  todoItems?: Array<{
    _id: Id<"todoItem">,
    listId: Id<"todoList">,
    title: string,
    description: string,
    createdAt?: string,
    dueDate: string,
    completed: boolean,
    ownerId: string,
    _creationTime: number
  }>,
  error?: string,
  errorId?: string,
  timestamp?: string
}
```

##### `createTask` (Mutation)
Creates a new task item.

**Parameters**:
```typescript
{
  listId: Id<"todoList">,
  title: string,
  description: string,
  dueDate: string  // ISO date string
}
```

**Returns**:
```typescript
{
  code: 200 | 401 | 404 | 500,
  success: boolean,
  taskItemId?: Id<"todoItem">,
  error?: string,
  errorId?: string,
  timestamp?: string
}
```

##### `modifyTask` (Mutation)
Updates an existing task.

**Parameters**:
```typescript
{
  taskId: Id<"todoItem">,
  title?: string,
  description?: string,
  dueDate?: string
}
```

**Note**: All fields are optional; only provided fields will be updated.

##### `deleteTask` (Mutation)
Deletes a task item.

**Parameters**:
```typescript
{
  taskId: Id<"todoItem">
}
```

### Authentication

All backend functions include authentication checks:
1. Verify user identity via Clerk JWT
2. Extract `tokenIdentifier` from identity
3. Check ownership of resources (lists/items must belong to user)

## Frontend Components

### Page Components

#### `/app/app/todo/page.tsx`
Main todo management interface.

**Features**:
- List selector dropdown
- Quick-add task input
- Task list with edit/delete functionality
- Separated active and completed tasks
- Real-time updates via Convex queries

**State Management**:
- `selectedListId`: Currently active list
- `editingTaskId`: Task being edited
- `expandedTaskId`: Task with expanded details

#### `/app/auth/login/[[...rest]]/page.tsx`
Clerk-powered login page using catch-all routes for handling OAuth callbacks.

### UI Components

All UI components are located in `components/ui/` and follow the shadcn/ui pattern:

- **button.tsx**: Configurable button with variants
- **input.tsx**: Text input with consistent styling
- **textarea.tsx**: Multi-line text input
- **checkbox.tsx**: Accessible checkbox component
- **dialog.tsx**: Modal dialog for forms
- **popover.tsx**: Floating content container
- **select.tsx**: Dropdown select menu
- **tabs.tsx**: Tabbed interface component
- **badge.tsx**: Status indicators
- **separator.tsx**: Visual divider

### Custom Components

#### `components/ConvexClientProvider.tsx`
Wraps the app with Convex React client, providing real-time capabilities.

```typescript
'use client';
import { ConvexProvider, ConvexReactClient } from "convex/react";
```

#### `components/theme-provider.tsx`
Manages light/dark theme with next-themes.

#### `components/app-sidebar.tsx`
Application navigation sidebar with links to different sections.

## Authentication Flow

### Overview

```
1. User visits protected route
        ↓
2. Middleware checks auth status
        ↓
3. If not authenticated → Redirect to /auth/login
        ↓
4. User signs in with Clerk
        ↓
5. Clerk issues JWT token
        ↓
6. Token stored in cookies
        ↓
7. Convex validates JWT on each request
        ↓
8. User accesses protected resources
```

### Implementation Details

#### Middleware (`middleware.ts`)
Protects routes using Clerk's `clerkMiddleware`:
```typescript
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

#### Convex Authentication (`convex/auth.config.ts`)
Configures Convex to validate Clerk JWTs:
```typescript
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: "convex",
    },
  ],
};
```

#### Protected Queries/Mutations
Every backend function checks authentication:
```typescript
const identity = await ctx.auth.getUserIdentity();
if (!identity) {
  return { code: 401, success: false, error: "Unauthorized" };
}
```

## Development Workflow

### Branch Strategy
- `main`: Production-ready code
- Feature branches: `feature/feature-name`
- Bug fixes: `bugfix/issue-description`

### Commit Message Convention
Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Example: `feat: add task priority levels`

### Development Process

1. **Create a branch**:
```bash
git checkout -b feature/your-feature-name
```

2. **Make changes and test locally**:
```bash
npm run dev
# Test your changes
```

3. **Lint your code**:
```bash
npm run lint
```

4. **Build the project**:
```bash
npm run build
```

5. **Commit changes**:
```bash
git add .
git commit -m "feat: add your feature description"
```

6. **Push and create PR**:
```bash
git push origin feature/your-feature-name
```

### Hot Module Replacement (HMR)

Next.js with Turbopack provides instant HMR:
- React components update without losing state
- CSS changes apply immediately
- Backend functions require Convex dev server restart

## Building and Testing

### Available Scripts

```json
{
  "dev": "next dev --turbopack",      // Start dev server with Turbopack
  "build": "next build --turbopack",  // Production build
  "start": "next start",              // Start production server
  "lint": "eslint"                    // Run ESLint
}
```

### Development Build
```bash
npm run dev
```
Starts development server on `http://localhost:3000` with:
- Hot module replacement
- Turbopack for fast rebuilds
- Source maps
- Detailed error messages

### Production Build
```bash
npm run build
npm run start
```

Build process:
1. TypeScript compilation
2. React Server Components bundling
3. Client-side JavaScript optimization
4. CSS minification
5. Image optimization
6. Static page generation

### Linting
```bash
npm run lint
```

ESLint checks for:
- TypeScript errors
- React best practices
- Next.js specific rules
- Unused imports
- Code formatting issues

### Type Checking
```bash
npx tsc --noEmit
```

Runs TypeScript compiler in check mode without emitting files.

## Code Style and Standards

### TypeScript Guidelines

1. **Use strict types**: Avoid `any`
```typescript
// Bad
const data: any = fetchData();

// Good
const data: TaskList = fetchData();
```

2. **Use interfaces for object shapes**:
```typescript
interface Task {
  id: string;
  title: string;
  completed: boolean;
}
```

3. **Use type inference when obvious**:
```typescript
// TypeScript can infer this
const count = 5;

// Explicit type needed here
const items: Task[] = [];
```

### React Guidelines

1. **Prefer functional components**: Use hooks over class components
2. **Component naming**: PascalCase for components
3. **Use descriptive prop names**: Make intent clear
4. **Destructure props**: Improves readability
5. **Use TypeScript for props**: Define prop types

Example:
```typescript
interface TodoItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ task, onToggle, onDelete }: TodoItemProps) {
  // Component logic
}
```

### CSS/Tailwind Guidelines

1. **Use Tailwind utility classes**: Prefer utilities over custom CSS
2. **Use `cn()` helper for conditional classes**:
```typescript
import { cn } from "@/lib/utils";

<div className={cn(
  "base-classes",
  isActive && "active-classes",
  isPending && "pending-classes"
)} />
```

3. **Group related classes**: Improve readability
```typescript
<div className={cn(
  // Layout
  "flex items-center gap-2",
  // Sizing
  "w-full h-12 px-4",
  // Styling
  "rounded-lg border bg-background",
  // Interactive
  "hover:bg-accent transition-colors"
)} />
```

### Convex Backend Guidelines

1. **Always validate authentication**
2. **Return consistent response structures**:
```typescript
{
  code: number,
  success: boolean,
  data?: any,
  error?: string,
  errorId?: string,
  timestamp?: string
}
```

3. **Check resource ownership** before operations
4. **Use descriptive error IDs**: Makes debugging easier
5. **Wrap operations in try-catch**: Handle unexpected errors

## Deployment

### Vercel Deployment (Recommended)

1. **Connect Repository**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel auto-detects Next.js configuration

2. **Configure Environment Variables**:
   - Add all variables from `.env.local`
   - Set variables in Vercel dashboard
   - Variables are encrypted at rest

3. **Deploy**:
   - Push to `main` branch triggers deployment
   - Vercel builds and deploys automatically
   - Preview deployments for feature branches

### Convex Deployment

1. **Deploy Convex Backend**:
```bash
npx convex deploy
```

2. **Update Environment**:
   - Copy production `NEXT_PUBLIC_CONVEX_URL`
   - Add to Vercel environment variables
   - Redeploy frontend

### Environment-Specific Configuration

**Development**:
- Uses `.env.local`
- Convex dev environment
- Clerk test mode

**Production**:
- Uses Vercel environment variables
- Convex production environment
- Clerk production mode

## Troubleshooting

### Common Issues

#### Convex Connection Issues
**Problem**: "Failed to connect to Convex"

**Solution**:
1. Verify `NEXT_PUBLIC_CONVEX_URL` is set correctly
2. Check Convex deployment status: `npx convex dev`
3. Ensure Convex backend is deployed: `npx convex deploy`

#### Authentication Errors
**Problem**: "Unauthorized" errors

**Solution**:
1. Verify Clerk API keys are set
2. Check auth configuration in `convex/auth.config.ts`
3. Ensure middleware is properly configured
4. Clear browser cookies and re-login

#### Build Failures
**Problem**: TypeScript errors during build

**Solution**:
1. Run `npx tsc --noEmit` to see all errors
2. Check for missing dependencies
3. Verify all imports are correct
4. Regenerate Convex types: `npx convex dev`

#### Hot Reload Not Working
**Problem**: Changes don't reflect immediately

**Solution**:
1. Restart dev server
2. Clear `.next` cache: `rm -rf .next`
3. Check for syntax errors in terminal
4. Verify file is within `app/` or `components/`

### Performance Optimization

1. **Use React.memo** for expensive components
2. **Implement virtual scrolling** for long lists
3. **Optimize images** with next/image
4. **Code splitting** with dynamic imports:
```typescript
const Calendar = dynamic(() => import('./calendar'), { ssr: false });
```

5. **Reduce Convex query frequency** with debouncing

## Contributing

### Getting Started

1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Make your changes
5. Test thoroughly
6. Submit a pull request

### Pull Request Guidelines

1. **Description**: Explain what and why
2. **Testing**: Describe how you tested
3. **Screenshots**: Include for UI changes
4. **Breaking Changes**: Document any breaking changes
5. **Documentation**: Update docs if needed

### Code Review Process

1. Automated checks must pass (linting, build)
2. At least one approval required
3. Address reviewer feedback
4. Squash commits before merging

### Areas for Contribution

- **New Features**: Task categories, priorities, filters
- **UI Improvements**: Animations, accessibility
- **Performance**: Optimization, caching
- **Documentation**: Tutorials, examples
- **Testing**: Unit tests, E2E tests
- **Bug Fixes**: Check GitHub issues

## Additional Resources

### Official Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Convex Documentation](https://docs.convex.dev)
- [Clerk Documentation](https://clerk.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

### Learning Resources
- [React Server Components](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)
- [Next.js App Router](https://nextjs.org/docs/app)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Convex Tutorials](https://docs.convex.dev/tutorial)

### Community
- [Next.js Discord](https://nextjs.org/discord)
- [Convex Discord](https://convex.dev/community)
- [GitHub Discussions](https://github.com/wbrous/todo-app/discussions)

## Support

For questions or issues:
1. Check this documentation
2. Search existing GitHub issues
3. Ask in GitHub Discussions
4. Create a new issue with detailed information

---

**Last Updated**: 2025-10-30

**Maintainers**: Repository owners and contributors

**Version**: 0.1.0
