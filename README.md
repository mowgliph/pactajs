# Pacta - Contract Management Application

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.0-3ECF8E)](https://supabase.com/)

Pacta is a comprehensive contract management web application designed to streamline the lifecycle of business agreements. It serves as a digital platform for organizations to manage contracts between clients and suppliers, including tracking contract details, authorized signers, supplements (modifications), and generating various reports. The application provides role-based access control, automated notifications for expiring contracts, and a dashboard for key performance indicators.

## Key Features

- **Contracts Management**: Create, view, edit, and delete contracts with details such as contract number, title, client/supplier information, authorized signers, start/end dates, monetary amount, contract type, status, and description.
- **Clients and Suppliers**: Manage business entities involved in contracts and associate authorized signers.
- **Authorized Signers**: Handle personnel authorized to sign contracts on behalf of clients or suppliers.
- **Supplements**: Track contract modifications or amendments with approval workflows and status tracking.
- **Reports**: Comprehensive reporting system including contract status distribution, financial analysis, upcoming expirations, client/supplier analysis, supplements overview, and export capabilities.
- **Dashboard**: Overview with KPI cards, status distribution charts, and quick action buttons.
- **Notifications**: Automated alerts for expiring contracts and other events.
- **Documents**: Repository for storing contract-related documents.
- **Users Management**: User accounts with role-based permissions (editor, manager levels).
- **Audit Logging**: Change tracking system for contract operations.
- **Responsive Design**: Mobile-first approach with responsive layouts.

## Technology Stack

- **Frontend Framework**: Next.js 15 with App Router
- **UI Library**: React 19 with TypeScript
- **Styling**: Tailwind CSS with Radix UI components (shadcn/ui)
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Date Handling**: date-fns
- **Backend/Database**: Supabase (PostgREST and Supabase JS client)
- **Authentication**: Supabase Auth with JWT (jose library)
- **State Management**: React Context (AuthContext)
- **Build Tools**: Turbopack, PostCSS, ESLint

## Installation and Setup

### Prerequisites

- Node.js 18 or later
- pnpm package manager
- Supabase account and project

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/pacta.git
   cd pacta
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Set up environment variables**:
   - Copy `.env.example` to `.env.local`
   - Fill in your Supabase project details:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
     NEXTAUTH_SECRET=your_nextauth_secret
     NEXTAUTH_URL=http://localhost:3000
     ```

4. **Set up the database**:
   - Run the SQL scripts in your Supabase project to create the necessary tables and schemas.
   - Ensure PostgREST is configured for API access.

5. **Run the development server**:
   ```bash
   pnpm dev
   ```

6. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to access the application.

## Usage Guide

1. **Login**: Use your Supabase credentials to log in.
2. **Dashboard**: View KPIs, contract status, and quick actions.
3. **Manage Contracts**: Navigate to the Contracts section to create, edit, or view contracts.
4. **Reports**: Generate and export various reports from the Reports section.
5. **Users**: Manage user roles and permissions in the Users section.
6. **Notifications**: Check automated alerts in the Notifications section.

For detailed API usage, refer to the [API documentation](./src/lib/api-client.ts).

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── contracts/          # Contract management pages
│   ├── clients/            # Client management pages
│   ├── suppliers/          # Supplier management pages
│   ├── authorized-signers/ # Authorized signer pages
│   ├── supplements/        # Supplement management pages
│   ├── reports/            # Reporting pages
│   ├── dashboard/          # Dashboard page
│   ├── notifications/      # Notifications page
│   ├── documents/          # Document repository
│   ├── users/              # User management
│   └── next_api/           # API routes
├── components/             # Reusable React components
│   ├── ui/                 # shadcn/ui components
│   ├── layout/             # Layout components (AppLayout, AppSidebar)
│   ├── auth/               # Authentication components
│   └── [feature]/          # Feature-specific components
├── contexts/               # React contexts (AuthContext)
├── hooks/                  # Custom hooks (use-mobile, use-toast)
├── lib/                    # Utility libraries
│   ├── crud-operations.ts  # CRUD operations
│   ├── api-client.ts       # API client utilities
│   ├── auth.ts             # Authentication utilities
│   ├── validation-schemas.ts # Zod schemas
│   └── utils.ts            # General utilities
├── middlewares/            # Next.js middlewares
├── types/                  # TypeScript type definitions
└── ...
```

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Open a pull request.

Please ensure your code follows the project's coding standards and includes appropriate tests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel.
2. Set environment variables in Vercel dashboard matching your `.env.local`.
3. Deploy the application.

For more details, refer to the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

### Supabase Configuration

Ensure your Supabase project is set up with the required database schema and authentication configured. Use Supabase's dashboard to manage your database and API keys.
