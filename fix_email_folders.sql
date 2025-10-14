-- Fix email folder values
UPDATE emails SET folder = 'sent' WHERE user_type = 'admin' AND folder IS NULL;
UPDATE emails SET folder = 'inbox' WHERE folder IS NULL OR folder = '';

-- Check the results
SELECT id, user_id, user_type, folder, status FROM emails ORDER BY id;
