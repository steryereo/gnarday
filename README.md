# GnarZone

Count the number of days you've skied this season based on Strava activities.

WIP Game of G.N.A.R. tracker

## Tech Stack

### Frontend

- **[Next.js](https://nextjs.org)**
- **[Tailwind CSS](https://tailwindcss.com)**
- **[shadcn/ui](https://ui.shadcn.com)**
- **[Lucide](https://lucide.dev)**

### Backend

- **[Drizzle ORM](https://orm.drizzle.team)**
- **[PostgreSQL](https://www.postgresql.org)**
- **[Strava API](https://developers.strava.com)**

## Getting Started

### Prerequisites

1. [Node.js](https://nodejs.org), at the version pinned in `.nvmrc`
   - With [nvm](https://github.com/nvm-sh/nvm), run `nvm install` (first time) or `nvm use` in the repo root.
1. [pnpm](https://pnpm.io/installation)
   - The [corepack](https://pnpm.io/installation#using-corepack) install method is recommended.
1. [Docker Desktop](https://www.docker.com/products/docker-desktop/)
1. [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started)
1. A Strava API application ([strava.com/settings/api](https://www.strava.com/settings/api)):
   - The account that owns the app needs an active **Strava subscription**. Standard Tier API access is subscriber-only.

### Installation

1. Clone the repository and install dependencies:

   ```bash
   pnpm install
   ```

1. Start Docker Desktop and wait until it's running, then start the local Supabase stack from the repo root:

   ```bash
   supabase start
   ```

   It prints the local URLs. The ones you'll use:

   | Service  | URL                                                       |
   | -------- | --------------------------------------------------------- |
   | Postgres | `postgresql://postgres:postgres@127.0.0.1:54322/postgres` |
   | Studio   | http://127.0.0.1:54323                                    |

1. Copy `.env.local.example` to `.env.local` and fill it in:
   - `DATABASE_URL`: the local Postgres URL above
   - `AUTH_STRAVA_ID` / `AUTH_STRAVA_SECRET`: from your Strava API application


1. Apply the schema to the local database:

   ```bash
   pnpm drizzle-kit migrate
   ```

   Check that the tables exist in Studio (http://127.0.0.1:54323).

1. Start the development server:

   ```bash
   pnpm dev
   ```

1. Open [http://localhost:3000](http://localhost:3000)

### Day to day

- **Start:** with Docker running, run `supabase start`, then `pnpm dev`.
- **Stop:** stop the dev server with `Ctrl+C`, then run `supabase stop`.
- Local Supabase keeps its data in a Docker volume, so users and sessions persist between runs.

## Database Migrations

We use Drizzle ORM to manage database migrations, following "Option 3" from the [Drizzle ORM docs](https://orm.drizzle.team/docs/migrations).

1. Make changes to the database schema by editing the files in `src/db/schema` (more info [here](https://orm.drizzle.team/docs/sql-schema-declaration#schema-in-multiple-files))
1. run `pnpm drizzle-kit generate` to generate migration files based on your changes
1. run `pnpm drizzle-kit migrate` to apply the migrations to your local database
1. if everything looks good, make a pull request with your changes. The migrations will be applied to the production database when the changes are merged into the `main` branch

## Testing

```bash
pnpm test
```
