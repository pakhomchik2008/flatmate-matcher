do $$
declare
  i int;
  uid uuid;
  unis text[] := array[
    'University of Warwick','University of Oxford','University of Cambridge',
    'Imperial College London','University College London','King''s College London',
    'London School of Economics','University of Edinburgh','University of Manchester',
    'University of Bristol','University of Birmingham','University of Leeds',
    'University of Nottingham','University of Sheffield','University of Southampton',
    'University of York','University of Glasgow','Durham University',
    'University of St Andrews','University of Exeter','Cardiff University',
    'Newcastle University','Queen Mary University of London','University of Bath',
    'Lancaster University','Loughborough University','University of Liverpool',
    'University of Reading','University of Surrey','University of Sussex',
    'University of East Anglia','Queen''s University Belfast'
  ];
  cities text[] := array[
    'Coventry','Oxford','Cambridge',
    'London','London','London',
    'London','Edinburgh','Manchester',
    'Bristol','Birmingham','Leeds',
    'Nottingham','Sheffield','Southampton',
    'York','Glasgow','Durham',
    'St Andrews','Exeter','Cardiff',
    'Newcastle','London','Bath',
    'Lancaster','Loughborough','Liverpool',
    'Reading','Guildford','Brighton',
    'Norwich','Belfast'
  ];
  first_names text[] := array[
    'Alex','Sam','Jordan','Charlie','Taylor','Morgan','Riley','Casey','Drew','Quinn',
    'Avery','Hayden','Reese','Skylar','Cameron','Emerson','Harper','Logan','Parker','Rowan',
    'Oliver','Amelia','Harry','Olivia','George','Isla','Noah','Ava','Leo','Mia',
    'Arthur','Sophia','Oscar','Lily','Charlie','Grace','Theo','Freya','Henry','Emily',
    'Jack','Ella','Mohammed','Aisha','Yusuf','Zara','Ahmed','Fatima','Ibrahim','Maryam',
    'Liam','Hannah','Daniel','Chloe','Ethan','Ruby','Lucas','Poppy','Max','Daisy',
    'Sebastian','Evie','Theodore','Phoebe','Felix','Sienna','Hugo','Anna','Caleb','Lucy',
    'Wei','Jing','Hiro','Yuki','Priya','Arjun','Anika','Kavya','Rohan','Diya',
    'Sofia','Mateo','Lucia','Diego','Valeria','Adrian','Camila','Elena','Marco','Nora',
    'Anya','Mikhail','Olga','Dmitri','Sasha','Katya','Igor','Natasha','Boris','Tatiana'
  ];
  last_names text[] := array[
    'Smith','Jones','Williams','Brown','Taylor','Davies','Wilson','Evans','Thomas','Roberts',
    'Johnson','Walker','White','Robinson','Wright','Thompson','Hughes','Edwards','Green','Hall',
    'Lewis','Wood','Harris','Clarke','Jackson','Wilkinson','Mason','Hughes','King','Wright',
    'Lee','Chen','Wang','Liu','Patel','Singh','Kumar','Khan','Hussain','Ali',
    'Garcia','Rodriguez','Martinez','Hernandez','Lopez','Gonzalez','Perez','Sanchez','Ramirez','Torres',
    'O''Brien','Murphy','Kelly','Ryan','Sullivan','Walsh','Byrne','Doyle','McCarthy','Connolly',
    'Nguyen','Tran','Pham','Le','Park','Kim','Choi','Yoon','Tanaka','Sato',
    'Müller','Schmidt','Fischer','Weber','Bauer','Becker','Schulz','Hoffmann','Wagner','Krüger',
    'Rossi','Ferrari','Russo','Bianchi','Romano','Conti','Greco','Costa','Esposito','Ricci',
    'Novak','Kowalski','Petrov','Ivanov','Sokolov','Volkov','Lebedev','Kozlov','Mihaylov','Stoyanov'
  ];
  bios text[] := array[
    'Engineering student, love climbing and cooking.','Med student, early riser, big on shared dinners.',
    'Studying CS, into board games and ramen.','Easy-going, like things tidy but not obsessive.',
    'Music student. I have a piano keyboard with headphones, promise!','PhD in physics. Quiet weekdays, social weekends.',
    'Love film nights and coffee runs.','Vegan, runner, can introvert hard during exams.',
    'History student, big on pub quizzes.','Postgrad in finance. Need a calm flat to focus.',
    'Architecture student — sometimes home, sometimes studio.','Art student, occasionally messy but always clean by Sunday.',
    'Politics student, love a good debate and a tidy kitchen.','Languages student, looking for chill flatmates.',
    'Maths PhD. Honestly just want quiet and decent wifi.','Pre-med, gym every morning, big meal prepper.',
    'Law student. I will absolutely respect the chore rota.','Psych student, love plants and slow mornings.',
    'Economics, into bouldering and indie films.','International student, excited to share food and stories.',
    'Biochem, partner over occasionally, hope that''s ok.','Postgrad in design, work mostly from home.',
    'Sports science, early gym, in bed by 11.','Looking for chilled flatmates who like the occasional dinner together.'
  ];
  uni_idx int;
  fn text;
  ln text;
  full_name text;
begin
  for i in 1..1000 loop
    uid := uuid_generate_v4();
    uni_idx := 1 + floor(random() * array_length(unis,1))::int;
    fn := first_names[1 + floor(random() * array_length(first_names,1))::int];
    ln := last_names[1 + floor(random() * array_length(last_names,1))::int];
    full_name := fn || ' ' || ln;

    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data, is_super_admin
    )
    values (
      '00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated',
      'seed_' || i || '_' || replace(uid::text, '-', '') || '@flatmate-seed.local',
      '', now(), now(), now(),
      '{"provider":"seed","providers":["seed"]}'::jsonb, '{}'::jsonb, false
    )
    on conflict (id) do nothing;

    insert into profiles (
      id, name, age, university, city, bio, avatar_url,
      move_in_date, budget_min, budget_max, looking_for, quiz_completed
    )
    values (
      uid, full_name,
      18 + floor(random() * 10)::int,
      unis[uni_idx], cities[uni_idx],
      bios[1 + floor(random() * array_length(bios,1))::int],
      'https://api.dicebear.com/7.x/avataaars/svg?seed=' || replace(uid::text,'-',''),
      (current_date + (floor(random() * 180))::int)::date,
      400 + floor(random() * 300)::int,
      700 + floor(random() * 600)::int,
      (array['room','flatmate','both'])[1 + floor(random() * 3)::int],
      true
    )
    on conflict (id) do nothing;

    insert into quiz_answers (
      user_id, sleep_schedule, cleanliness, noise_level, guests_frequency,
      study_location, smoking, pets, cooking_frequency, temperature_preference, work_schedule
    )
    values (
      uid,
      1 + floor(random() * 5)::int,
      1 + floor(random() * 5)::int,
      1 + floor(random() * 5)::int,
      1 + floor(random() * 5)::int,
      1 + floor(random() * 5)::int,
      random() < 0.18,
      random() < 0.28,
      1 + floor(random() * 5)::int,
      1 + floor(random() * 5)::int,
      1 + floor(random() * 5)::int
    )
    on conflict (user_id) do nothing;
  end loop;
end $$;

select count(*) as seeded_profiles
from profiles
where id in (select id from auth.users where email like 'seed_%@flatmate-seed.local');
