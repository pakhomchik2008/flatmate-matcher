-- Removes all seeded fake users (and cascades to their profiles, quiz_answers, messages).
delete from auth.users where email like 'seed_%@flatmate-seed.local';
