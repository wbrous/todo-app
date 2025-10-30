# To-Do App

A modern, feature-rich task management application built with cutting-edge web technologies. This application provides an intuitive interface for managing your daily tasks, organizing them into lists, and tracking your productivity.

## Overview

The To-Do App is a full-stack web application that combines the power of Next.js for the frontend with Convex for real-time backend functionality. It features secure user authentication, real-time data synchronization, and a beautiful, responsive user interface.

## Key Features

### Task Management
- **Create and Organize Tasks**: Add tasks with titles, descriptions, and due dates
- **Multiple Task Lists**: Organize your tasks into separate lists for different projects or contexts
- **Task Details**: Add rich descriptions and set due dates for each task
- **Quick Task Entry**: Rapidly add tasks with a streamlined quick-add interface

### User Experience
- **Real-Time Synchronization**: Changes are instantly reflected across all your devices
- **Intuitive Interface**: Clean, modern UI built with shadcn/ui components
- **Dark Mode Support**: Automatic theme switching based on system preferences
- **Responsive Design**: Seamlessly works on desktop, tablet, and mobile devices

### Authentication & Security
- **Secure Authentication**: User authentication powered by Clerk
- **Protected Data**: Each user's tasks are private and secure
- **Multi-User Support**: Each user has their own isolated workspace

### Organization
- **Task Lists**: Create multiple lists to organize tasks by project, category, or priority
- **Task Status**: Mark tasks as complete or incomplete
- **Due Dates**: Set and track task deadlines
- **Visual Indicators**: Clear visual cues for task status and due dates

## Technology Stack

### Frontend
- **Next.js 16**: React framework with App Router and Turbopack for blazing-fast builds
- **React 19**: Latest React features for optimal performance
- **TypeScript**: Type-safe development for better code quality
- **Tailwind CSS 4**: Utility-first CSS framework for rapid UI development
- **shadcn/ui**: Beautiful, accessible component library built on Radix UI

### Backend
- **Convex**: Real-time backend-as-a-service for instant data synchronization
- **Clerk**: Authentication and user management platform

### UI Components
- **Radix UI**: Unstyled, accessible component primitives
- **Lucide Icons**: Modern, consistent icon set
- **Tabler Icons**: Additional icon options
- **Sonner**: Elegant toast notifications

## Getting Started

### Prerequisites
- Node.js 20 or higher
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/wbrous/todo-app.git
cd todo-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add your configuration:
```env
NEXT_PUBLIC_CONVEX_URL=your_convex_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

### Creating Your First List
1. Sign in or create an account
2. Click the "Create List" button
3. Give your list a name (e.g., "Personal", "Work", "Shopping")
4. Start adding tasks to your list

### Adding Tasks
1. Select a task list from the dropdown
2. Use the quick-add input at the top to add a task
3. Press Enter or click the + button
4. Tasks are automatically assigned a due date of tomorrow

### Managing Tasks
- **Edit**: Click the edit icon on any task to modify its details
- **Complete**: Check the checkbox to mark a task as complete
- **Delete**: Click the trash icon to remove a task
- **View Details**: Click on a task to see its full description and due date

### Organizing Lists
- Switch between lists using the list selector dropdown
- Create new lists as needed for different projects
- Delete lists you no longer need (tasks within will be removed)

## Deployment

### Vercel (Recommended)
This application is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Configure environment variables in the Vercel dashboard
4. Deploy

### Other Platforms
The application can be deployed on any platform that supports Next.js applications:
- AWS Amplify
- Netlify
- Railway
- DigitalOcean App Platform

Ensure you configure the environment variables properly on your chosen platform.

## Project Structure

```
todo-app/
├── app/                    # Next.js App Router pages
│   ├── app/               # Protected app routes
│   │   ├── todo/         # Todo page component
│   │   └── calendar/     # Calendar view (coming soon)
│   ├── auth/             # Authentication pages
│   └── layout.tsx        # Root layout with providers
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   └── ...              # Custom components
├── convex/              # Convex backend functions
│   ├── schema.ts        # Database schema
│   ├── todoLists.ts     # Task list operations
│   └── todoItems.ts     # Task item operations
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
└── public/             # Static assets
```

## Support

For bug reports and feature requests, please open an issue on the [GitHub repository](https://github.com/wbrous/todo-app/issues).

## License

This project is licensed under the terms specified in the repository.

---

<sub>**For developers**: See [DEVELOPERS.md](./DEVELOPERS.md) for technical documentation and development guidelines.</sub>
