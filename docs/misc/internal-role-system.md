# Internal Role Management System

## Overview

We've implemented an internal role management system to replace dependency on Clerk's metadata system. This makes the application more portable and gives us complete control over user permissions.

## Role Hierarchy

```
HOST > ADMIN > MODERATOR > USER
```

### Role Definitions

- **HOST**: System owner with full access to all features
  - Can access Host Settings (/host/settings)
  - Can manage Environment Configuration (/host/environment)
  - Can access Admin Panel (/admin/external-integrations)
  - Can create API tokens
  - Can manage all user roles
  - Has all lower-level permissions

- **ADMIN**: System administrators
  - Can access Admin Panel (/admin/external-integrations)
  - Can create API tokens
  - Can run system sync operations
  - Has MODERATOR and USER permissions

- **MODERATOR**: Content moderators
  - Can run system sync operations
  - Has USER permissions

- **USER**: Standard users
  - Basic application access
  - Default role for new users

## Database Schema

Added to Profile model:
```prisma
enum UserRole {
  HOST
  ADMIN
  MODERATOR
  USER
}

model Profile {
  // ... existing fields
  role      UserRole @default(USER)
  // ... rest of model
  
  @@index([role], map: "Profile_role_idx")
}
```

## Implementation Files

### 1. Database Schema
- `prisma/schema.prisma` - Added UserRole enum and role field to Profile

### 2. API Endpoints
- `app/api/profile/role/route.ts` - GET/PUT endpoints for role management

### 3. React Hook
- `hooks/use-user-role.ts` - Custom hook for role-based access control

### 4. Migration Scripts
- `scripts/add-role-column.sql` - Manual SQL migration
- `scripts/set-host-role.ts` - Script to set initial HOST user

### 5. Updated Components
- `components/navigation/navigation-menu.tsx` - Role-based menu items

## Usage Examples

### In Components
```tsx
import { useUserRole } from "@/hooks/use-user-role";

function MyComponent() {
  const { isHost, isAdmin, isModerator, role, isLoading } = useUserRole();
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      {isHost && <HostOnlyFeature />}
      {isAdmin && <AdminFeature />}
      {isModerator && <ModeratorFeature />}
      <div>Your role: {role}</div>
    </div>
  );
}
```

### In API Routes
```tsx
import { currentProfile } from "@/lib/current-profile";

export async function POST(req: Request) {
  const profile = await currentProfile();
  
  if (!profile || profile.role !== "HOST") {
    return new Response("Forbidden", { status: 403 });
  }
  
  // HOST-only logic here
}
```

## Migration Steps

1. **Database Migration**:
   ```bash
   # Apply the SQL migration manually or run:
   npx tsx scripts/set-host-role.ts
   ```

2. **Set Initial HOST User**:
   ```bash
   npx tsx scripts/set-host-role.ts
   ```

3. **Verify Role System**:
   - Check navigation menu shows proper options
   - Test API endpoints respect role permissions
   - Verify role-based component rendering

## Security Features

- **Role Validation**: API endpoints validate roles before granting access
- **Hierarchical Permissions**: Higher roles inherit lower role permissions
- **Fallback Safety**: Defaults to USER role if errors occur
- **Database Constraints**: Role field has proper indexing and validation

## Benefits Over Clerk Metadata

1. **Portability**: Can migrate away from Clerk without losing role system
2. **Performance**: Database-level role queries vs API calls to Clerk
3. **Flexibility**: Can extend role system with custom logic
4. **Independence**: No external service dependency for authorization
5. **Auditability**: Role changes are tracked in our database

## Current Status

- ✅ Database schema updated
- ✅ API endpoints created
- ✅ React hook implemented
- ✅ Navigation menu updated
- ⏳ Database migration pending (Prisma file lock issue)
- ⏳ Initial HOST user setup pending

## Next Steps

1. Complete database migration
2. Set initial HOST user
3. Test all role-based features
4. Update any remaining Clerk metadata references
5. Add role change audit logging
6. Implement role management UI in Host Settings 