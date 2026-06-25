-- Migration 030: Fix seats_status_check to allow 'pending' status
-- The seat.service.ts sets status='pending' on checkout init to prevent race conditions,
-- but the DB constraint only allowed 'available' and 'booked', causing silent failures.

ALTER TABLE public.seats
  DROP CONSTRAINT IF EXISTS seats_status_check;

ALTER TABLE public.seats
  ADD CONSTRAINT seats_status_check
  CHECK (status = ANY (ARRAY['available'::text, 'pending'::text, 'booked'::text]));
