# Taxidia Back Office - React Admin Panel

A comprehensive admin panel built with React, Redux Toolkit, and TypeScript, featuring user management, analytics, and system administration capabilities.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Application                    │
├─────────────────────────────────────────────────────────┤
│  Redux Store              │  React Router              │
│  ├── authSlice           │  ├── /login                │
│  ├── usersSlice          │  ├── /dashboard            │
│  ├── agentsSlice         │  ├── /users                │
│  ├── providersSlice      │  ├── /agents                │
│  ├── commissionsSlice    │  ├── /providers             │
│  ├── contentSlice        │  ├── /commissions           │
│  ├── supportSlice        │  ├── /content               │
│  └── analyticsSlice      │  ├── /support               │
│                          │  └── /analytics             │
└─────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

### 3. Development Server

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173)

## 📁 Project Structure

```
src/
├── app/                   # Application entry point
├── components/            # Reusable components
│   ├── layout/          # Layout components
│   │   ├── DashboardLayout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── ImpersonationBanner.tsx
│   └── ui/              # shadcn/ui components
├── pages/                # Page components
│   ├── LoginPage.tsx
│   ├── SelectAccountPage.tsx
│   ├── DashboardPage.tsx
│   ├── UsersPage.tsx
│   ├── AgentsPage.tsx
│   ├── ProvidersPage.tsx
│   ├── CommissionsPage.tsx
│   ├── ContentPage.tsx
│   ├── SupportPage.tsx
│   └── AnalyticsPage.tsx
├── lib/                  # Utilities and configuration
│   ├── api/             # API client
│   ├── store/           # Redux store and slices
│   ├── validation/      # Zod schemas
│   └── utils.ts         # Utility functions
└── tests/               # E2E tests
    └── e2e/
```

## 🔐 Authentication

### JWT Authentication Flow

```typescript
// 1. System Login
const { mutate: login } = useLogin();
await login({ 
  email: 'admin@taxidia.com', 
  password: 'password' 
});

// 2. Account Selection
const { mutate: selectAccount } = useSelectAccount();
await selectAccount({ account_id: 1 });

// 3. Impersonation (Super Admin only)
const { mutate: impersonate } = useImpersonate();
await impersonate({ 
  user_id: 123, 
  reason: 'Customer support' 
});
```

### State Management

```typescript
// Redux store structure
interface RootState {
  auth: AuthState;
  users: UsersState;
  agents: AgentsState;
  providers: ProvidersState;
  commissions: CommissionsState;
  content: ContentState;
  support: SupportState;
  analytics: AnalyticsState;
}
```

## 🏨 Core Features

### 1. Dashboard

```typescript
// Dashboard with KPIs and charts
export function DashboardPage() {
  const { dashboardStats, providerPerformance, bookingTrends } = 
    useSelector((state: RootState) => state.analytics);
  
  return (
    <div className="space-y-6">
      <KPICards stats={dashboardStats} />
      <ChartsSection trends={bookingTrends} />
      <ProviderPerformanceTable data={providerPerformance} />
    </div>
  );
}
```

**Dashboard Features:**
- **KPI Cards**: Bookings, revenue, conversion rate, active users
- **Interactive Charts**: Booking trends, revenue by provider
- **Provider Performance**: Response times, success rates
- **Real-time Updates**: Live data refresh
- **Export Functionality**: CSV and PDF export

### 2. User Management

```typescript
// User management with CRUD operations
export function UsersPage() {
  const { users, isLoading } = useSelector((state: RootState) => state.users);
  const dispatch = useDispatch();
  
  const handleCreateUser = async (userData: CreateUserData) => {
    await dispatch(createUser(userData));
  };
  
  return (
    <div>
      <DataTable 
        data={users}
        columns={userColumns}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
      />
      <CreateUserModal onSubmit={handleCreateUser} />
    </div>
  );
}
```

**User Management Features:**
- **CRUD Operations**: Create, read, update, delete users
- **Role Assignment**: Assign roles and permissions
- **Status Management**: Activate/deactivate users
- **Bulk Operations**: Mass user operations
- **Search & Filter**: Advanced filtering capabilities

### 3. Agent Management

```typescript
// Agent hierarchy management
export function AgentsPage() {
  const { agents } = useSelector((state: RootState) => state.agents);
  
  return (
    <div>
      <AgentTreeView agents={agents} />
      <AgentBalanceManagement />
      <AgentCommissionSettings />
    </div>
  );
}
```

**Agent Features:**
- **Hierarchy Management**: Tree structure with parent-child relationships
- **Balance Management**: Credit/debit operations
- **Commission Settings**: Agent-specific commission rates
- **Performance Tracking**: Booking and revenue metrics

### 4. Provider Management

```typescript
// Provider configuration and monitoring
export function ProvidersPage() {
  const { providers } = useSelector((state: RootState) => state.providers);
  
  return (
    <div>
      <ProviderList providers={providers} />
      <ProviderSettings />
      <ProviderHealthMonitoring />
    </div>
  );
}
```

**Provider Features:**
- **Toggle Providers**: Enable/disable providers
- **Settings Configuration**: API credentials and endpoints
- **Health Monitoring**: Response times and success rates
- **Merge Policy**: Single vs multi-provider mode

### 5. Commission Management

```typescript
// Commission rules and overrides
export function CommissionsPage() {
  const { commissions } = useSelector((state: RootState) => state.commissions);
  
  return (
    <div>
      <GlobalCommissionSettings />
      <AccountOverrides />
      <UserOverrides />
      <CommissionHistory />
    </div>
  );
}
```

**Commission Features:**
- **Global Settings**: System-wide commission rates
- **Account Overrides**: Account-specific rates
- **User Overrides**: Individual user rates
- **Effective Dates**: Time-based rule application
- **History Tracking**: Commission rule changes

### 6. Content Management

```typescript
// Content and ads management
export function ContentPage() {
  return (
    <div>
      <Tabs>
        <TabsContent value="blogs">
          <BlogManagement />
        </TabsContent>
        <TabsContent value="destinations">
          <DestinationManagement />
        </TabsContent>
        <TabsContent value="packages">
          <PackageManagement />
        </TabsContent>
        <TabsContent value="ads">
          <AdManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

**Content Features:**
- **Blog Management**: Create and manage blog posts
- **Destination Management**: Travel destination content
- **Package Management**: Multi-hotel deals
- **Ad Management**: Advertisement campaigns

### 7. Support System

```typescript
// Support ticket management
export function SupportPage() {
  const { tickets, cannedResponses } = useSelector(
    (state: RootState) => state.support
  );
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <TicketList tickets={tickets} />
      <ChatConsole />
      <CannedResponses responses={cannedResponses} />
    </div>
  );
}
```

**Support Features:**
- **Ticket Management**: Create, assign, and resolve tickets
- **Real-time Chat**: WebSocket-based communication
- **Canned Responses**: Quick response templates
- **Agent Assignment**: Automatic and manual assignment

### 8. Analytics & Reporting

```typescript
// Analytics dashboard
export function AnalyticsPage() {
  const { 
    dashboardStats, 
    providerPerformance, 
    bookingTrends 
  } = useSelector((state: RootState) => state.analytics);
  
  return (
    <div>
      <DateRangePicker />
      <MetricsGrid stats={dashboardStats} />
      <ChartsSection trends={bookingTrends} />
      <ExportButtons />
    </div>
  );
}
```

**Analytics Features:**
- **Date Range Filtering**: Custom time periods
- **KPI Metrics**: Key performance indicators
- **Interactive Charts**: Data visualization
- **Export Options**: CSV and PDF reports

## 🎨 UI/UX Features

### Design System

```typescript
// Tailwind CSS with custom design tokens
const theme = {
  colors: {
    primary: 'hsl(var(--primary))',
    secondary: 'hsl(var(--secondary))',
    accent: 'hsl(var(--accent))',
    destructive: 'hsl(var(--destructive))',
  },
  spacing: {
    'sidebar': '16rem', // 256px
    'header': '4rem',   // 64px
  },
};
```

### Component Library

- **shadcn/ui**: Accessible, customizable components
- **Radix UI**: Headless UI primitives
- **Lucide Icons**: Consistent iconography
- **Recharts**: Data visualization components

### Responsive Design

```typescript
// Mobile-first responsive design
<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
  <div className="lg:col-span-1">
    <Sidebar />
  </div>
  <div className="lg:col-span-3">
    <MainContent />
  </div>
</div>
```

## 🧪 Testing

### E2E Tests (Playwright)

```typescript
// Authentication flow test
test('should complete login and account selection', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[type="email"]', 'admin@taxidia.com');
  await page.fill('input[type="password"]', 'password');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/select-account/);
});
```

### Test Structure

```
tests/
├── e2e/
│   ├── auth.spec.ts           # Authentication tests
│   ├── dashboard.spec.ts      # Dashboard tests
│   ├── users.spec.ts          # User management tests
│   └── impersonation.spec.ts  # Impersonation tests
└── playwright.config.ts       # Playwright configuration
```

### Running Tests

```bash
# Install Playwright
npx playwright install

# Run E2E tests
npx playwright test

# Run tests in headed mode
npx playwright test --headed

# Run specific test
npx playwright test users.spec.ts
```

## 🔧 Development

### Redux Store Configuration

```typescript
// Store configuration
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    users: usersSlice.reducer,
    agents: agentsSlice.reducer,
    providers: providersSlice.reducer,
    commissions: commissionsSlice.reducer,
    content: contentSlice.reducer,
    support: supportSlice.reducer,
    analytics: analyticsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});
```

### API Integration

```typescript
// API client with JWT handling
export const apiClient = {
  get: async (url: string, options?: RequestInit) => {
    const token = getToken();
    const response = await fetch(`${API_BASE}${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options?.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        removeToken();
        window.location.href = '/login';
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },
  // ... other methods
};
```

### Form Handling

```typescript
// React Hook Form with Zod validation
const form = useForm<CreateUserData>({
  resolver: zodResolver(createUserSchema),
  defaultValues: {
    name: '',
    email: '',
    password: '',
    role: 'Customer',
  },
});

const onSubmit = async (data: CreateUserData) => {
  try {
    await dispatch(createUser(data));
    toast.success('User created successfully');
  } catch (error) {
    toast.error('Failed to create user');
  }
};
```

## 🚀 Deployment

### Build for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

### Environment Variables

```env
# API Configuration
VITE_API_BASE=http://localhost:8000/api
VITE_WS_URL=ws://localhost:6001

# App Configuration
VITE_APP_NAME=Taxidia Back Office
VITE_APP_URL=http://localhost:5173
```

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel

# Set environment variables
vercel env add VITE_API_BASE
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM base AS build
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 📊 Performance

### Optimization Features

- **Code Splitting**: Route-based code splitting
- **Lazy Loading**: Component lazy loading
- **Memoization**: React.memo and useMemo
- **Bundle Optimization**: Tree shaking and minification

### Bundle Analysis

```bash
# Analyze bundle size
npm run build
npm run analyze

# Check performance
npm run lighthouse
```

## 🔍 Security

### Authentication Security

```typescript
// JWT token management
export const getToken = () => {
  return localStorage.getItem('jwt_token');
};

export const setToken = (token: string) => {
  localStorage.setItem('jwt_token', token);
};

export const removeToken = () => {
  localStorage.removeItem('jwt_token');
};
```

### Route Protection

```typescript
// Protected route wrapper
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}
```

## 🛠️ Troubleshooting

### Common Issues

1. **API Connection Issues**
   ```bash
   # Check API base URL
   echo $VITE_API_BASE
   
   # Test API connectivity
   curl http://localhost:8000/api/health
   ```

2. **Build Errors**
   ```bash
   # Clear Vite cache
   rm -rf node_modules/.vite
   
   # Reinstall dependencies
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **TypeScript Errors**
   ```bash
   # Check TypeScript configuration
   npx tsc --noEmit
   
   # Update types
   npm update @types/react @types/node
   ```

## 🤝 Contributing

1. Follow React best practices
2. Use TypeScript for type safety
3. Write tests for new features
4. Follow the established component patterns
5. Update documentation

## 📄 License

Proprietary software. All rights reserved.

---

**Taxidia Back Office** - Powerful, intuitive, and comprehensive admin panel.