# GEMINI.md

## Project Overview

This is a Next.js web application called "PokeLearn". It allows users to search for Pokémon and view information about them. The application uses Supabase for user authentication (login/register) and the PokéAPI (pokeapi.co) as the data source for Pokémon information. The frontend is built with React, TypeScript, and Tailwind CSS, and it uses custom UI components.

## Building and Running

### Prerequisites

- Node.js and npm installed.
- Supabase project credentials. You need to create a `.env.local` file in the root of the project with the following content:

```
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

### Commands

- **`npm run dev`**: Starts the development server on `http://localhost:3000`.
- **`npm run build`**: Builds the application for production.
- **`npm run start`**: Starts the production server.
- **`npm run lint`**: Lints the code using ESLint.

## Development Conventions

- **Framework:** The project is built with Next.js and React.
- **Language:** TypeScript is used for static typing.
- **Styling:** Tailwind CSS is used for styling, with custom components in `src/components/ui`.
- **Authentication:** User authentication is handled by Supabase. The Supabase client is configured in `src/lib/supabase.ts`.
- **Data:** Pokémon data is fetched from the [PokéAPI](https://pokeapi.co/).
- **Code Structure:**
  - `src/app`: Contains the main application pages and routes.
  - `src/components`: Contains reusable React components.
  - `src/lib`: Contains utility functions and the Supabase client.
  - `public`: Contains static assets.
