# Supabase Authentication Setup

This project uses Supabase for authentication. Follow these steps to set up Supabase:

## 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and create a free account
2. Create a new project
3. Wait for the project to be provisioned (takes ~2 minutes)

## 2. Get Your API Credentials

1. In your Supabase project dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

## 3. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and replace the placeholder values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## 4. Enable Email Authentication (Optional)

By default, Supabase requires email confirmation for new users. To configure this:

1. Go to **Authentication** > **Providers** > **Email**
2. Configure your email settings:
   - **Confirm email**: Toggle based on your preference
   - **Secure email change**: Recommended to keep enabled

## 5. Test Your Authentication

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Navigate to `/register` and create a test account
3. Check your email for confirmation (if email confirmation is enabled)
4. Try logging in at `/login`

## Features Implemented

### Login Form (`/login`)

- Email and password authentication
- Password visibility toggle
- Error handling with user-friendly messages
- Loading states during authentication
- Automatic redirect after successful login

### Register Form (`/register`)

- User registration with full name, email, and password
- Password confirmation validation
- Password strength validation (minimum 6 characters)
- Success/error messages
- Email confirmation support (if enabled in Supabase)
- Automatic redirect to login after registration

## Database Setup (Optional)

If you want to store additional user data, you can create a `profiles` table:

1. Go to **SQL Editor** in your Supabase dashboard
2. Run this SQL:

```sql
-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

-- Create policy to allow users to view their own profile
create policy "Users can view own profile"
  on profiles for select
  using ( auth.uid() = id );

-- Create policy to allow users to update their own profile
create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

-- Function to automatically create profile on signup
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

## Troubleshooting

### "Invalid API key" error

- Double-check that you copied the correct API keys from Supabase
- Make sure there are no extra spaces in your `.env.local` file
- Restart your development server after updating environment variables

### "Email confirmation required" message

- Check your email for the confirmation link
- Or disable email confirmation in Supabase settings if you're testing

### Users can't log in after registration

- If email confirmation is enabled, users must confirm their email first
- Check spam folder for confirmation emails
- You can manually confirm users in Supabase dashboard under Authentication > Users

## Security Best Practices

1. Never commit `.env.local` to version control
2. Use Row Level Security (RLS) policies in Supabase for data protection
3. Implement proper session management
4. Use HTTPS in production
5. Regularly rotate your API keys if compromised

## Next Steps

- Implement password reset functionality
- Add social authentication (Google, GitHub, etc.)
- Create protected routes that require authentication
- Build a user profile page
- Add email verification reminders
