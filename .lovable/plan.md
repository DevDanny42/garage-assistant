

## Backend Communication Configuration

Currently, there is **no dedicated API configuration file** in your project. The app uses mock/hardcoded data throughout. Here's where things stand:

### Current State
- **No API service layer exists** -- pages like `Customers.tsx`, `Vehicles.tsx`, `JobCards.tsx`, `Inventory.tsx`, `Billing.tsx`, and `Reports.tsx` all use local mock data arrays.
- **No environment variables** are configured for a backend URL.
- **No HTTP client** (like Axios or a fetch wrapper) is set up.

### Recommended Approach

To connect with your Spring Boot backend, you would need to create an API layer. The typical structure would be:

```text
src/
  api/
    config.ts          -- Base URL, headers, Axios/fetch instance
    customers.ts       -- Customer API calls (GET, POST, PUT, DELETE)
    vehicles.ts        -- Vehicle API calls
    jobcards.ts        -- Job Card API calls
    inventory.ts       -- Inventory API calls
    billing.ts         -- Billing API calls
```

### Key File: `src/api/config.ts`

This would be the **single configuration file** where you define:

1. **Base URL** from environment variable (`VITE_API_URL`)
2. **Axios/fetch instance** with default headers
3. **Auth token injection** (reading from localStorage)
4. **Error handling interceptors**

### Environment Variable

You would also need to set `VITE_API_URL` in your project settings pointing to your deployed Spring Boot backend (e.g., `https://your-api.com/api`).

### Want me to build this?

If you approve this plan, I will:

1. Create `src/api/config.ts` with a configured Axios instance (base URL, auth headers, error interceptors)
2. Create service files for each entity (`customers.ts`, `vehicles.ts`, `jobcards.ts`, `inventory.ts`, `billing.ts`)
3. Add React Query hooks to replace mock data with real API calls
4. Update all admin pages to use the new API layer instead of hardcoded data

### Technical Details

- **HTTP Client**: Axios (needs to be installed) or native `fetch` wrapper
- **State Management**: TanStack React Query (already installed) for server state
- **Auth**: Bearer token from localStorage attached to every request
- **CORS**: Your Spring Boot backend must allow requests from the Lovable preview domain

