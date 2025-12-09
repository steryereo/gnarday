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

1. An up-to-date version of [node.js](https://nodejs.org)
   - [nvm](https://github.com/nvm-sh/nvm) or another node version manager is recommended
1. [pnpm](https://pnpm.io/installation)
   - the [corepack](https://pnpm.io/installation#using-corepack) installation method is recommended, as it's the easiest
1. a local postgres database. We use supabase, but any postgres database will work
   - instructions for local supabase installation can be found [here](https://supabase.com/docs/guides/local-development/cli/getting-started)

### Installation

1. Clone the repository
1. Copy `.env.local.example` to `.env.local` and fill in the required variables
1. Install dependencies:

```bash
pnpm install
```

4. Start the development server:

```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

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
