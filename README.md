# repair-tracker-app

A small full-stack app for a car-repair garage to track repair jobs: register a
car and its problem, then move the job through its workflow and filter by status.

![Repair Tracker demo](docs/media/repair-tracker-demo.gif)

*Filtering jobs by status (here, "Parts"), switching back to "All", then opening the New Job form and entering a problem description.*

## Features

- Create a repair job with license plate, device id, customer name/phone, car
  model/year, problem description and photos.
- List all jobs and filter them by status.
- Update a job's status as the repair progresses.
- Delete a job.

## Tech stack

- **Monorepo:** [Bun](https://bun.com) workspaces.
- **Web** (`apps/web`): React, Vite, Tailwind CSS, shadcn/ui (Radix UI), lucide-react.
- **API** (`apps/api`): Bun's native HTTP server, a small REST API.
- **Shared** (`packages/shared`): TypeScript domain types and helpers shared by both.

## Structure

```
apps/
  api/   # Bun HTTP server — REST endpoints for jobs (in-memory store)
  web/   # React + Vite front end
packages/
  shared/  # shared Job/Car/Customer/Device types and factories
```

## API

The API keeps jobs **in memory**, so data resets when the server restarts.

| Method | Path         | Purpose                        |
| ------ | ------------ | ------------------------------ |
| GET    | `/jobs`      | list all jobs                  |
| POST   | `/jobs`      | create a job (needs `licensePlate`, `deviceId`) |
| PATCH  | `/jobs/:id`  | update a job's status          |
| DELETE | `/jobs/:id`  | delete a job                   |

## Run it

Requires [Bun](https://bun.com).

```bash
bun install            # install all workspaces

# start the API (http://localhost:3001)
bun run --cwd apps/api dev

# in a second terminal, start the web app (http://localhost:5173)
bun run --cwd apps/web dev
```

The web app calls the API at `http://localhost:3001` (see `apps/web/src/api/jobs.tsx`).
