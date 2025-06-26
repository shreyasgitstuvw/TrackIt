-- Create subjects table
CREATE TABLE IF NOT EXISTS public.subjects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    name text NOT NULL,
    color text,
    created_at timestamp with time zone DEFAULT timezone('utc', now())
);

ALTER TABLE public.subjects
ADD COLUMN total_classes integer NOT NULL DEFAULT 0,
ADD COLUMN attended_classes integer NOT NULL DEFAULT 0,
ADD COLUMN last_attended date;
-- Create attendance table
CREATE TABLE IF NOT EXISTS public.attendance (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_id uuid REFERENCES public.subjects(id) ON DELETE CASCADE,
    date date NOT NULL,
    status text NOT NULL CHECK (status IN ('present', 'absent')),
    notes text,
    created_at timestamp with time zone DEFAULT timezone('utc', now()),
    UNIQUE (user_id, subject_id, date)
);

-- Create goals table
CREATE TABLE IF NOT EXISTS public.goals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_id uuid REFERENCES public.subjects(id) ON DELETE CASCADE,
    goal_percent numeric NOT NULL CHECK (goal_percent >= 0 AND goal_percent <= 100),
    created_at timestamp with time zone DEFAULT timezone('utc', now())
);

-- Allow subject_id in goals to be nullable for global goals
ALTER TABLE public.goals ALTER COLUMN subject_id DROP NOT NULL; 