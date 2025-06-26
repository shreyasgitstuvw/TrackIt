-- Migration: Add attendance tracking fields to subjects table
ALTER TABLE subjects
  ADD COLUMN total_classes integer NOT NULL DEFAULT 0,
  ADD COLUMN attended_classes integer NOT NULL DEFAULT 0,
  ADD COLUMN last_attended date,
  ADD COLUMN attendance_goal integer;

