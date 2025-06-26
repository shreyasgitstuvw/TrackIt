-- Add unique index to ensure only one goal per user per subject (including global goals)
CREATE UNIQUE INDEX IF NOT EXISTS unique_user_subject_goal ON public.goals (user_id, subject_id); 