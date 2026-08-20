# Component API Documentation

Quick reference for all reusable components built for EventHub.

## Form Components

### Button
```tsx
<Button 
  variant="primary" | "secondary" | "danger" | "ghost"
  size="sm" | "md" | "lg"
  fullWidth={boolean}
  loading={boolean}
  transactionState={TransactionState}
  disabled={boolean}
>
  Click me
</Button>
```

**Transaction States**: idle, wallet-required, wallet-selection, waiting-for-wallet, user-rejected, pending, success, failed, insufficient-balance, wallet-unavailable

### Input
```tsx
<Input
  label="Email"
  type="text" | "email" | "password" | "number" | "date" | "time"
  value={string}
  onChange={handler}
  error={string}
  helperText={string}
  placeholder={string}
  required={boolean}
/>
```

### Select
```tsx
<Select
  label="Category"
  value={string}
  onChange={handler}
  error={string}
  options={[{ value: string, label: string }]}
  required={boolean}
/>
```

### SearchBar
```tsx
<SearchBar
  value={string}
  onChange={handler}
  placeholder="Search..."
/>
```

### FilterBar
```tsx
<FilterBar
  categoryFilter={string}
  onCategoryChange={handler}
  dateFilter={string}        // optional
  onDateChange={handler}     // optional
  statusFilter={string}      // optional
  onStatusChange={handler}   // optional
/>
```

## Feedback Components

### Toast
```tsx
<Toast
  message={string}
  type="success" | "error" | "info" | "warning"
  onClose={handler}
  duration={3000}  // milliseconds
/>
```

### EmptyState
```tsx
<EmptyState
  icon={<svg>...</svg>}  // optional
  title="No results"
  description="Try something else"  // optional
  action={<Button>...</Button>}     // optional
/>
```

### LoadingSkeleton
```tsx
<LoadingSkeleton count={3} />
<CardSkeleton />
```

## Layout Components

### Modal
```tsx
<Modal
  isOpen={boolean}
  onClose={handler}
  title="Create Event"  // optional
  size="sm" | "md" | "lg" | "xl"
>
  {children}
</Modal>
```

### ConfirmationDialog
```tsx
<ConfirmationDialog
  isOpen={boolean}
  onClose={handler}
  onConfirm={handler}
  title="Delete Event?"
  message="This cannot be undone"
  confirmText="Delete"
  cancelText="Cancel"
  variant="danger" | "primary"
/>
```

### PageHeader
```tsx
<PageHeader
  title="Dashboard"
  description="Overview of your events"  // optional
  action={<Button>...</Button>}          // optional
/>
```

### DashboardLayout
```tsx
<DashboardLayout>
  {children}
</DashboardLayout>
```

Automatically adds:
- Sidebar navigation (role-based)
- Header with search, notifications, user avatar
- Responsive mobile menu

### Navbar
```tsx
<Navbar />
```

Public navigation bar for Landing/About/Events pages.

### Sidebar
```tsx
<Sidebar role="user" | "admin" />
```

Dashboard sidebar with role-specific links and mobile drawer.

## Display Components

### EventCard
```tsx
<EventCard
  event={Event}
  showActions={boolean}     // optional
  onRegister={handler}      // optional
/>
```

### EventStatusBadge
```tsx
<EventStatusBadge status="upcoming" | "ongoing" | "completed" | "cancelled" />
```

### StatsCard
```tsx
<StatsCard
  title="Total Events"
  value={42}
  icon={<svg>...</svg>}
  color="indigo" | "purple" | "blue" | "green"
/>
```

### ActivityItem
```tsx
<ActivityItem activity={Activity} />
```

Renders activity with icon, message, and relative timestamp.

### UserAvatar
```tsx
<UserAvatar
  name="John Doe"
  avatar="https://..."  // optional
  size="sm" | "md" | "lg"
/>
```

Shows image if provided, otherwise displays initials.

## Routing Components

### ProtectedRoute
```tsx
<ProtectedRoute requiredRole="user" | "admin">
  <Dashboard />
</ProtectedRoute>
```

Redirects to /login if not authenticated, redirects to appropriate dashboard if wrong role.

## Context

### AuthContext
```tsx
const { user, isAuthenticated, isLoading } = useAuth();
```

Provides current user, auth status, and loading state throughout the app.

## Type Definitions

### Key Types

```typescript
type UserRole = 'user' | 'admin';

type EventCategory = 'Cultural' | 'Sports' | 'Tech' | 'Business' | 'Education' | 'Other';

type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

type RegistrationStatus = 'registered' | 'attended' | 'cancelled';

type TransactionState = 
  | 'idle'
  | 'wallet-required'
  | 'wallet-selection'
  | 'waiting-for-wallet'
  | 'user-rejected'
  | 'pending'
  | 'success'
  | 'failed'
  | 'insufficient-balance'
  | 'wallet-unavailable';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  date: string;
  time: string;
  location: string;
  organizer: string;
  maxParticipants: number;
  currentParticipants: number;
  coverImage?: string;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}

interface Registration {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  eventId: string;
  eventTitle: string;
  registrationDate: string;
  status: RegistrationStatus;
}

interface Activity {
  id: string;
  type: 'event-created' | 'event-updated' | 'event-deleted' | 'user-registered' | 'registration-cancelled';
  message: string;
  timestamp: string;
  userId?: string;
  userName?: string;
  eventId?: string;
  eventTitle?: string;
}
```

## Service Layer

### authService

```typescript
authService.login(credentials: LoginCredentials): Promise<AuthResponse>
authService.signup(data: SignupData): Promise<AuthResponse>
authService.logout(): void
authService.getCurrentUser(): User | null
authService.updateProfile(userId: string, updates: Partial<User>): Promise<User>
```

### eventsService

```typescript
eventsService.getEvents(): Promise<Event[]>
eventsService.getEventById(id: string): Promise<Event | null>
eventsService.createEvent(data: CreateEventData): Promise<Event>
eventsService.updateEvent(data: UpdateEventData): Promise<Event>
eventsService.deleteEvent(id: string): Promise<void>
eventsService.registerForEvent(eventId: string, userId: string, userName: string, userEmail: string): Promise<Registration>
eventsService.cancelRegistration(registrationId: string, userId: string): Promise<void>
eventsService.getUserRegistrations(userId: string): Promise<Registration[]>
eventsService.getAllRegistrations(): Promise<Registration[]>
eventsService.getActivities(): Promise<Activity[]>
eventsService.getUserActivities(userId: string): Promise<Activity[]>
```

## Design Tokens

### Colors

```css
/* Pastel Colors */
--pastel-purple: #E9D5FF
--pastel-orange: #FED7AA
--pastel-green: #BBF7D0
--pastel-pink: #FBCFE8
--pastel-blue: #BFDBFE
--pastel-yellow: #FEF08A

/* Gradient */
.gradient-primary: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #3b82f6 100%)
```

### Border Radius

```css
.rounded-custom: 14px
.rounded-custom-lg: 18px
```

### Spacing

Use Tailwind's spacing scale (4, 6, 8, 12, 16, 24px, etc.) with generous padding/margins.

### Shadows

```css
.shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
.shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1)
.shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1)
```

## Accessibility

All components follow WCAG 2.1 AA standards:
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Focus indicators
- Color contrast compliance
- Screen reader friendly

## Responsive Breakpoints

```css
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Desktops */
xl: 1280px  /* Large desktops */
```

## Best Practices

1. **Always import types separately**: `import type { ... }`
2. **Use service layer**: Never put data directly in components
3. **Reuse components**: Don't duplicate markup
4. **Error handling**: Use try-catch with Toast for user feedback
5. **Loading states**: Show LoadingSkeleton during data fetch
6. **Empty states**: Always provide EmptyState for zero-data scenarios
7. **Validation**: Validate all forms before submission
8. **Responsive**: Test on mobile, tablet, and desktop
9. **Accessibility**: Ensure keyboard navigation and screen reader support

---

All components are production-ready and blockchain-integration-ready!
