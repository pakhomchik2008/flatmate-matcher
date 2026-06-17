-- Run AFTER universities-schema.sql.
-- QS World University Rankings 2024 – European universities.
-- Ranks are approximate; scores omitted as they change annually.

truncate universities restart identity;

insert into universities (name, abbreviation, city, country, qs_rank) values

-- ══════════════════════════════════════════
-- UNITED KINGDOM  (~90 institutions)
-- ══════════════════════════════════════════
('University of Cambridge',              null,   'Cambridge',      'United Kingdom', 2),
('University of Oxford',                 null,   'Oxford',         'United Kingdom', 3),
('Imperial College London',              'ICL',  'London',         'United Kingdom', 6),
('University College London',            'UCL',  'London',         'United Kingdom', 9),
('University of Edinburgh',              null,   'Edinburgh',      'United Kingdom', 22),
('University of Manchester',             null,   'Manchester',     'United Kingdom', 32),
('King''s College London',               'KCL',  'London',         'United Kingdom', 40),
('London School of Economics',           'LSE',  'London',         'United Kingdom', 45),
('University of Bristol',                null,   'Bristol',        'United Kingdom', 55),
('University of Warwick',                null,   'Coventry',       'United Kingdom', 67),
('University of Glasgow',                null,   'Glasgow',        'United Kingdom', 78),
('University of Birmingham',             null,   'Birmingham',     'United Kingdom', 84),
('University of Leeds',                  null,   'Leeds',          'United Kingdom', 92),
('Durham University',                    null,   'Durham',         'United Kingdom', 92),
('University of Sheffield',              null,   'Sheffield',      'United Kingdom', 95),
('University of Nottingham',             null,   'Nottingham',     'United Kingdom', 108),
('University of Southampton',            null,   'Southampton',    'United Kingdom', 100),
('University of St Andrews',             null,   'St Andrews',     'United Kingdom', 100),
('Newcastle University',                 null,   'Newcastle',      'United Kingdom', 130),
('University of Exeter',                 null,   'Exeter',         'United Kingdom', 151),
('Lancaster University',                 null,   'Lancaster',      'United Kingdom', 162),
('Queen Mary University of London',      'QMUL', 'London',         'United Kingdom', 150),
('University of Bath',                   null,   'Bath',           'United Kingdom', 175),
('Loughborough University',              null,   'Loughborough',   'United Kingdom', 224),
('University of York',                   null,   'York',           'United Kingdom', 195),
('Cardiff University',                   null,   'Cardiff',        'United Kingdom', 201),
('University of Liverpool',              null,   'Liverpool',      'United Kingdom', 201),
('University of Leicester',              null,   'Leicester',      'United Kingdom', 241),
('University of Surrey',                 null,   'Guildford',      'United Kingdom', 241),
('University of Reading',                null,   'Reading',        'United Kingdom', 280),
('Queen''s University Belfast',          'QUB',  'Belfast',        'United Kingdom', 241),
('University of Aberdeen',               null,   'Aberdeen',       'United Kingdom', 301),
('University of Strathclyde',            null,   'Glasgow',        'United Kingdom', 301),
('Heriot-Watt University',               null,   'Edinburgh',      'United Kingdom', 351),
('University of Sussex',                 null,   'Brighton',       'United Kingdom', 351),
('University of Dundee',                 null,   'Dundee',         'United Kingdom', 401),
('Brunel University London',             null,   'Uxbridge',       'United Kingdom', 451),
('University of Essex',                  null,   'Colchester',     'United Kingdom', 464),
('Royal Holloway University of London',  'RHUL', 'Egham',          'United Kingdom', 490),
('Swansea University',                   null,   'Swansea',        'United Kingdom', 401),
('University of Kent',                   null,   'Canterbury',     'United Kingdom', 501),
('Aston University',                     null,   'Birmingham',     'United Kingdom', 551),
('University of Hull',                   null,   'Hull',           'United Kingdom', 601),
('Keele University',                     null,   'Keele',          'United Kingdom', 651),
('University of Lincoln',                null,   'Lincoln',        'United Kingdom', 701),
('City, University of London',           null,   'London',         'United Kingdom', 551),
('Northumbria University',               null,   'Newcastle',      'United Kingdom', 601),
('University of Portsmouth',             null,   'Portsmouth',     'United Kingdom', 751),
('University of Plymouth',               null,   'Plymouth',       'United Kingdom', 751),
('Coventry University',                  null,   'Coventry',       'United Kingdom', 801),
('Manchester Metropolitan University',   'MMU',  'Manchester',     'United Kingdom', 801),
('University of Salford',                null,   'Salford',        'United Kingdom', 701),
('Bangor University',                    null,   'Bangor',         'United Kingdom', 751),
('University of East Anglia',            'UEA',  'Norwich',        'United Kingdom', 330),
('Oxford Brookes University',            null,   'Oxford',         'United Kingdom', 751),
('University of Ulster',                 null,   'Belfast',        'United Kingdom', 801),
('University of Stirling',               null,   'Stirling',       'United Kingdom', 651),
('University of West of England',        'UWE',  'Bristol',        'United Kingdom', 801),
('University of Huddersfield',           null,   'Huddersfield',   'United Kingdom', 751),
('University of Bradford',               null,   'Bradford',       'United Kingdom', 851),
('University of Greenwich',              null,   'London',         'United Kingdom', 851),
('Robert Gordon University',             'RGU',  'Aberdeen',       'United Kingdom', 751),
('Edinburgh Napier University',          null,   'Edinburgh',      'United Kingdom', 801),
('University of the West of Scotland',   'UWS',  'Paisley',        'United Kingdom', 901),
('Sheffield Hallam University',          null,   'Sheffield',      'United Kingdom', 1001),
('Bournemouth University',               null,   'Bournemouth',    'United Kingdom', 1001),
('Nottingham Trent University',          'NTU',  'Nottingham',     'United Kingdom', 1001),
('University of Derby',                  null,   'Derby',          'United Kingdom', 1001),
('University of Chester',                null,   'Chester',        'United Kingdom', null),
('University of Central Lancashire',     'UCLan','Preston',        'United Kingdom', 1001),
('University of Bedfordshire',           null,   'Luton',          'United Kingdom', null),
('University of Brighton',               null,   'Brighton',       'United Kingdom', null),
('University of Hertfordshire',          null,   'Hatfield',       'United Kingdom', 1001),
('University of Winchester',             null,   'Winchester',     'United Kingdom', null),
('Anglia Ruskin University',             'ARU',  'Cambridge',      'United Kingdom', 1001),
('University of Wolverhampton',          null,   'Wolverhampton',  'United Kingdom', null),
('University of Sunderland',             null,   'Sunderland',     'United Kingdom', null),
('Leeds Beckett University',             null,   'Leeds',          'United Kingdom', 1001),
('University of Northampton',            null,   'Northampton',    'United Kingdom', null),
('University of the Arts London',        'UAL',  'London',         'United Kingdom', null),
('Westminster University',               null,   'London',         'United Kingdom', 1001),
('Kingston University',                  null,   'Kingston',       'United Kingdom', 1001),
('London South Bank University',         'LSBU', 'London',         'United Kingdom', null),
('Middlesex University',                 null,   'London',         'United Kingdom', 1001),
('St George''s University of London',    null,   'London',         'United Kingdom', null),
('Goldsmiths, University of London',     null,   'London',         'United Kingdom', 601),
('SOAS University of London',            'SOAS', 'London',         'United Kingdom', 501),
('Birkbeck, University of London',       null,   'London',         'United Kingdom', null),
('De Montfort University',               'DMU',  'Leicester',      'United Kingdom', 1001),
('University of Teesside',               null,   'Middlesbrough',  'United Kingdom', null),
('University of the West of England',    'UWE',  'Bristol',        'United Kingdom', 801),
('University of Worcester',              null,   'Worcester',      'United Kingdom', null),
('University of Suffolk',                null,   'Ipswich',        'United Kingdom', null),

-- ══════════════════════════════════════════
-- SWITZERLAND
-- ══════════════════════════════════════════
('ETH Zurich',                           'ETH',  'Zurich',         'Switzerland',    7),
('EPFL',                                 'EPFL', 'Lausanne',       'Switzerland',    30),
('University of Zurich',                 'UZH',  'Zurich',         'Switzerland',    89),
('University of Basel',                  null,   'Basel',          'Switzerland',    151),
('University of Geneva',                 null,   'Geneva',         'Switzerland',    162),
('University of Bern',                   null,   'Bern',           'Switzerland',    175),
('University of Lausanne',               'UNIL', 'Lausanne',       'Switzerland',    195),
('University of St. Gallen',             'HSG',  'St. Gallen',     'Switzerland',    241),

-- ══════════════════════════════════════════
-- GERMANY
-- ══════════════════════════════════════════
('Technical University of Munich',       'TUM',  'Munich',         'Germany',        37),
('Ludwig Maximilian University Munich',  'LMU',  'Munich',         'Germany',        54),
('Heidelberg University',                null,   'Heidelberg',     'Germany',        87),
('Humboldt University of Berlin',        'HU Berlin', 'Berlin',    'Germany',        120),
('Free University of Berlin',            'FU Berlin', 'Berlin',    'Germany',        107),
('Technical University of Berlin',       'TU Berlin', 'Berlin',    'Germany',        154),
('RWTH Aachen University',               'RWTH', 'Aachen',         'Germany',        106),
('University of Hamburg',                null,   'Hamburg',        'Germany',        201),
('University of Frankfurt',              null,   'Frankfurt',      'Germany',        201),
('Karlsruhe Institute of Technology',    'KIT',  'Karlsruhe',      'Germany',        119),
('University of Stuttgart',              null,   'Stuttgart',      'Germany',        280),
('University of Freiburg',               null,   'Freiburg',       'Germany',        201),
('University of Göttingen',              null,   'Göttingen',      'Germany',        195),
('University of Bonn',                   null,   'Bonn',           'Germany',        201),
('University of Tübingen',               null,   'Tübingen',       'Germany',        201),
('University of Cologne',                null,   'Cologne',        'Germany',        195),
('Technical University of Dresden',      null,   'Dresden',        'Germany',        280),
('University of Mannheim',               null,   'Mannheim',       'Germany',        301),
('University of Düsseldorf',             null,   'Düsseldorf',     'Germany',        350),
('Ruhr University Bochum',               null,   'Bochum',         'Germany',        330),
('University of Erlangen-Nuremberg',     'FAU',  'Erlangen',       'Germany',        280),
('University of Mainz',                  null,   'Mainz',          'Germany',        401),
('University of Kiel',                   null,   'Kiel',           'Germany',        401),
('University of Hannover',               null,   'Hannover',       'Germany',        401),
('University of Münster',                null,   'Münster',        'Germany',        351),
('University of Würzburg',               null,   'Würzburg',       'Germany',        401),
('University of Jena',                   null,   'Jena',           'Germany',        501),
('University of Ulm',                    null,   'Ulm',            'Germany',        451),
('University of Bayreuth',               null,   'Bayreuth',       'Germany',        551),
('University of Marburg',                null,   'Marburg',        'Germany',        601),
('University of Leipzig',                null,   'Leipzig',        'Germany',        401),
('University of Bremen',                 null,   'Bremen',         'Germany',        451),
('University of Potsdam',                null,   'Potsdam',        'Germany',        601),
('University of Regensburg',             null,   'Regensburg',     'Germany',        601),
('Hamburg University of Technology',     'TUHH', 'Hamburg',        'Germany',        551),
('Technical University of Darmstadt',    'TU Darmstadt', 'Darmstadt', 'Germany',    281),
('Bielefeld University',                 null,   'Bielefeld',      'Germany',        601),
('Goethe University Frankfurt',          null,   'Frankfurt',      'Germany',        311),
('University of Konstanz',               null,   'Konstanz',       'Germany',        501),
('Saarland University',                  null,   'Saarbrücken',    'Germany',        601),

-- ══════════════════════════════════════════
-- FRANCE
-- ══════════════════════════════════════════
('Université Paris-Saclay',              null,   'Paris',          'France',         15),
('Sorbonne University',                  null,   'Paris',          'France',         59),
('Paris Sciences et Lettres',            'PSL',  'Paris',          'France',         24),
('Université de Paris',                  null,   'Paris',          'France',         236),
('Sciences Po',                          null,   'Paris',          'France',         263),
('École Polytechnique',                  null,   'Palaiseau',      'France',         61),
('HEC Paris',                            'HEC',  'Paris',          'France',         44),
('CentraleSupélec',                      null,   'Paris',          'France',         201),
('École Normale Supérieure de Lyon',     'ENS Lyon', 'Lyon',       'France',         401),
('University of Lyon',                   null,   'Lyon',           'France',         551),
('Université Grenoble Alpes',            'UGA',  'Grenoble',       'France',         301),
('University of Bordeaux',               null,   'Bordeaux',       'France',         401),
('University of Toulouse III',           null,   'Toulouse',       'France',         451),
('University of Strasbourg',             null,   'Strasbourg',     'France',         301),
('University of Montpellier',            null,   'Montpellier',    'France',         401),
('Aix-Marseille University',             null,   'Marseille',      'France',         451),
('University of Nice Côte d''Azur',      null,   'Nice',           'France',         501),
('University of Rennes',                 null,   'Rennes',         'France',         651),
('University of Nantes',                 null,   'Nantes',         'France',         651),
('INSEAD',                               null,   'Fontainebleau',  'France',         null),
('Université Paris Dauphine-PSL',        null,   'Paris',          'France',         401),
('ESSEC Business School',                'ESSEC','Paris',           'France',         null),

-- ══════════════════════════════════════════
-- NETHERLANDS
-- ══════════════════════════════════════════
('Delft University of Technology',       'TU Delft', 'Delft',      'Netherlands',   47),
('University of Amsterdam',              'UvA',  'Amsterdam',      'Netherlands',    53),
('Leiden University',                    null,   'Leiden',         'Netherlands',    78),
('Utrecht University',                   null,   'Utrecht',        'Netherlands',    95),
('Eindhoven University of Technology',   'TU/e', 'Eindhoven',      'Netherlands',   107),
('Groningen University',                 'RUG',  'Groningen',      'Netherlands',    130),
('Radboud University',                   null,   'Nijmegen',       'Netherlands',    151),
('Maastricht University',                'UM',   'Maastricht',     'Netherlands',    241),
('Erasmus University Rotterdam',         'EUR',  'Rotterdam',      'Netherlands',    195),
('Vrije Universiteit Amsterdam',         'VU',   'Amsterdam',      'Netherlands',    201),
('Tilburg University',                   null,   'Tilburg',        'Netherlands',    351),
('University of Twente',                 'UT',   'Enschede',       'Netherlands',    241),
('Wageningen University',                'WUR',  'Wageningen',     'Netherlands',    151),

-- ══════════════════════════════════════════
-- BELGIUM
-- ══════════════════════════════════════════
('KU Leuven',                            null,   'Leuven',         'Belgium',        54),
('Ghent University',                     'UGent','Ghent',           'Belgium',        130),
('Université Libre de Bruxelles',        'ULB',  'Brussels',       'Belgium',        201),
('Vrije Universiteit Brussel',           'VUB',  'Brussels',       'Belgium',        351),
('University of Antwerp',                null,   'Antwerp',        'Belgium',        351),
('University of Liège',                  null,   'Liège',          'Belgium',        501),
('University of Namur',                  null,   'Namur',          'Belgium',        601),
('Hasselt University',                   null,   'Hasselt',        'Belgium',        null),

-- ══════════════════════════════════════════
-- SWEDEN
-- ══════════════════════════════════════════
('KTH Royal Institute of Technology',    'KTH',  'Stockholm',      'Sweden',         89),
('Lund University',                      null,   'Lund',           'Sweden',         95),
('Uppsala University',                   null,   'Uppsala',        'Sweden',         107),
('Stockholm University',                 'SU',   'Stockholm',      'Sweden',         175),
('Chalmers University of Technology',    null,   'Gothenburg',     'Sweden',         241),
('University of Gothenburg',             null,   'Gothenburg',     'Sweden',         301),
('Linköping University',                 null,   'Linköping',      'Sweden',         401),
('Umeå University',                      null,   'Umeå',           'Sweden',         401),
('Stockholm School of Economics',        'SSE',  'Stockholm',      'Sweden',         null),
('Karolinska Institutet',                'KI',   'Stockholm',      'Sweden',         162),

-- ══════════════════════════════════════════
-- DENMARK
-- ══════════════════════════════════════════
('University of Copenhagen',             'UCPH', 'Copenhagen',     'Denmark',        99),
('Technical University of Denmark',      'DTU',  'Kongens Lyngby', 'Denmark',        146),
('Aarhus University',                    'AU',   'Aarhus',         'Denmark',        154),
('University of Southern Denmark',       'SDU',  'Odense',         'Denmark',        481),
('Copenhagen Business School',           'CBS',  'Copenhagen',     'Denmark',        null),

-- ══════════════════════════════════════════
-- NORWAY
-- ══════════════════════════════════════════
('University of Oslo',                   'UiO',  'Oslo',           'Norway',         175),
('Norwegian University of Science and Technology', 'NTNU', 'Trondheim', 'Norway',   351),
('University of Bergen',                 'UiB',  'Bergen',         'Norway',         401),
('UiT The Arctic University of Norway',  'UiT',  'Tromsø',         'Norway',         651),
('BI Norwegian Business School',         'BI',   'Oslo',           'Norway',         null),

-- ══════════════════════════════════════════
-- FINLAND
-- ══════════════════════════════════════════
('University of Helsinki',               'UH',   'Helsinki',       'Finland',        107),
('Aalto University',                     null,   'Espoo',          'Finland',        154),
('University of Turku',                  'UTU',  'Turku',          'Finland',        451),
('Tampere University',                   null,   'Tampere',        'Finland',        451),
('University of Oulu',                   null,   'Oulu',           'Finland',        551),
('University of Jyväskylä',              null,   'Jyväskylä',      'Finland',        551),

-- ══════════════════════════════════════════
-- AUSTRIA
-- ══════════════════════════════════════════
('University of Vienna',                 null,   'Vienna',         'Austria',        138),
('Technical University of Vienna',       'TU Wien', 'Vienna',      'Austria',        201),
('Medical University of Vienna',         null,   'Vienna',         'Austria',        null),
('University of Graz',                   null,   'Graz',           'Austria',        551),
('Graz University of Technology',        'TU Graz', 'Graz',        'Austria',        501),
('University of Innsbruck',              null,   'Innsbruck',      'Austria',        501),
('Vienna University of Economics',       'WU',   'Vienna',         'Austria',        401),
('Johannes Kepler University Linz',      'JKU',  'Linz',           'Austria',        601),

-- ══════════════════════════════════════════
-- IRELAND
-- ══════════════════════════════════════════
('Trinity College Dublin',               'TCD',  'Dublin',         'Ireland',        81),
('University College Dublin',            'UCD',  'Dublin',         'Ireland',        181),
('University College Cork',              'UCC',  'Cork',           'Ireland',        301),
('University of Galway',                 null,   'Galway',         'Ireland',        280),
('Dublin City University',               'DCU',  'Dublin',         'Ireland',        451),
('University of Limerick',               'UL',   'Limerick',       'Ireland',        551),
('Maynooth University',                  null,   'Maynooth',       'Ireland',        601),
('Technological University Dublin',      'TUD',  'Dublin',         'Ireland',        null),

-- ══════════════════════════════════════════
-- ITALY
-- ══════════════════════════════════════════
('Politecnico di Milano',                'Polimi','Milan',          'Italy',          139),
('University of Bologna',                null,   'Bologna',        'Italy',          154),
('Sapienza University of Rome',          null,   'Rome',           'Italy',          171),
('University of Padova',                 null,   'Padova',         'Italy',          241),
('University of Milan',                  'UNIMI','Milan',           'Italy',          301),
('Politecnico di Torino',                null,   'Turin',          'Italy',          330),
('University of Naples Federico II',     null,   'Naples',         'Italy',          401),
('University of Florence',               null,   'Florence',       'Italy',          401),
('Scuola Normale Superiore',             'SNS',  'Pisa',           'Italy',          280),
('University of Trento',                 null,   'Trento',         'Italy',          451),
('University of Pisa',                   null,   'Pisa',           'Italy',          401),
('University of Genova',                 null,   'Genoa',          'Italy',          551),
('University of Turin',                  null,   'Turin',          'Italy',          451),
('University of Catania',                null,   'Catania',        'Italy',          701),
('Bocconi University',                   null,   'Milan',          'Italy',          301),
('LUISS University',                     null,   'Rome',           'Italy',          null),
('University of Verona',                 null,   'Verona',         'Italy',          601),
('University of Siena',                  null,   'Siena',          'Italy',          601),

-- ══════════════════════════════════════════
-- SPAIN
-- ══════════════════════════════════════════
('Universitat de Barcelona',             'UB',   'Barcelona',      'Spain',          175),
('Universitat Autònoma de Barcelona',    'UAB',  'Barcelona',      'Spain',          201),
('Universidad Autónoma de Madrid',       'UAM',  'Madrid',         'Spain',          241),
('Universidad Complutense de Madrid',    'UCM',  'Madrid',         'Spain',          241),
('Universitat Politècnica de Catalunya', 'UPC',  'Barcelona',      'Spain',          201),
('Universidad Politécnica de Madrid',    'UPM',  'Madrid',         'Spain',          301),
('Universidad de Granada',               'UGR',  'Granada',        'Spain',          351),
('Universitat Pompeu Fabra',             'UPF',  'Barcelona',      'Spain',          226),
('University of Seville',                null,   'Seville',        'Spain',          401),
('University of Valencia',               null,   'Valencia',       'Spain',          451),
('Universidad de Navarra',               null,   'Pamplona',       'Spain',          451),
('IE University',                        'IE',   'Madrid',         'Spain',          null),
('ESADE Business School',                'ESADE','Barcelona',       'Spain',          null),
('University of the Basque Country',     'UPV',  'Bilbao',         'Spain',          501),
('University of Salamanca',              null,   'Salamanca',      'Spain',          551),
('University of Zaragoza',               null,   'Zaragoza',       'Spain',          601),
('University of Murcia',                 null,   'Murcia',         'Spain',          651),
('University of Alicante',               null,   'Alicante',       'Spain',          601),

-- ══════════════════════════════════════════
-- PORTUGAL
-- ══════════════════════════════════════════
('University of Lisbon',                 'ULisboa', 'Lisbon',       'Portugal',      235),
('University of Porto',                  'UP',   'Porto',          'Portugal',       301),
('NOVA University Lisbon',               'NOVA', 'Lisbon',         'Portugal',       355),
('University of Coimbra',                null,   'Coimbra',        'Portugal',       401),
('University of Minho',                  null,   'Braga',          'Portugal',       651),
('Instituto Superior Técnico',           'IST',  'Lisbon',         'Portugal',       401),
('Catholic University of Portugal',      'UCP',  'Lisbon',         'Portugal',       null),

-- ══════════════════════════════════════════
-- POLAND
-- ══════════════════════════════════════════
('University of Warsaw',                 null,   'Warsaw',         'Poland',         284),
('Jagiellonian University',              null,   'Kraków',         'Poland',         301),
('Warsaw University of Technology',      'PW',   'Warsaw',         'Poland',         351),
('AGH University of Krakow',             'AGH',  'Kraków',         'Poland',         451),
('University of Wroclaw',                null,   'Wroclaw',        'Poland',         501),
('Adam Mickiewicz University',           null,   'Poznań',         'Poland',         601),
('Gdańsk University of Technology',      'GUT',  'Gdańsk',         'Poland',         651),
('Wroclaw University of Technology',     null,   'Wroclaw',        'Poland',         551),
('Poznan University of Technology',      null,   'Poznań',         'Poland',         701),
('Łódź University of Technology',        null,   'Łódź',           'Poland',         801),
('University of Silesia',                null,   'Katowice',       'Poland',         801),
('Nicolaus Copernicus University',       'NCU',  'Toruń',          'Poland',         701),
('University of Gdańsk',                 null,   'Gdańsk',         'Poland',         801),

-- ══════════════════════════════════════════
-- CZECH REPUBLIC
-- ══════════════════════════════════════════
('Charles University',                   'CUNI', 'Prague',         'Czech Republic', 258),
('Czech Technical University',           'CTU',  'Prague',         'Czech Republic', 451),
('Masaryk University',                   'MUNI', 'Brno',           'Czech Republic', 501),
('Brno University of Technology',        'VUT',  'Brno',           'Czech Republic', 601),
('Prague University of Economics',       null,   'Prague',         'Czech Republic', null),
('University of Ostrava',                null,   'Ostrava',        'Czech Republic', null),

-- ══════════════════════════════════════════
-- HUNGARY
-- ══════════════════════════════════════════
('Eötvös Loránd University',             'ELTE', 'Budapest',       'Hungary',        551),
('Budapest University of Technology',    'BME',  'Budapest',       'Hungary',        651),
('University of Debrecen',               null,   'Debrecen',       'Hungary',        801),
('University of Pécs',                   null,   'Pécs',           'Hungary',        null),
('Corvinus University of Budapest',      null,   'Budapest',       'Hungary',        null),

-- ══════════════════════════════════════════
-- GREECE
-- ══════════════════════════════════════════
('National and Kapodistrian University of Athens', 'NKUA', 'Athens', 'Greece',      451),
('National Technical University of Athens', 'NTUA', 'Athens',       'Greece',       451),
('Aristotle University of Thessaloniki', 'AUTH', 'Thessaloniki',   'Greece',         551),
('University of Patras',                 null,   'Patras',         'Greece',         651),
('University of Crete',                  null,   'Heraklion',      'Greece',         801),
('Athens University of Economics',       'AUEB', 'Athens',         'Greece',         null),

-- ══════════════════════════════════════════
-- ROMANIA
-- ══════════════════════════════════════════
('University of Bucharest',              null,   'Bucharest',      'Romania',        801),
('Babeș-Bolyai University',              'UBB',  'Cluj-Napoca',    'Romania',        1001),
('Polytechnic University of Bucharest',  null,   'Bucharest',      'Romania',        null),
('Alexandru Ioan Cuza University',       null,   'Iași',           'Romania',        null),

-- ══════════════════════════════════════════
-- RUSSIA / EASTERN EUROPE
-- ══════════════════════════════════════════
('Lomonosov Moscow State University',    'MSU',  'Moscow',         'Russia',         87),
('Saint Petersburg State University',    'SPbU', 'Saint Petersburg','Russia',         242),
('Moscow Institute of Physics and Technology','MIPT','Moscow',      'Russia',         201),
('National Research Nuclear University', 'MEPHI','Moscow',         'Russia',         301),
('Higher School of Economics',           'HSE',  'Moscow',         'Russia',         301),

-- ══════════════════════════════════════════
-- TURKEY
-- ══════════════════════════════════════════
('Koç University',                       null,   'Istanbul',       'Turkey',         301),
('Bilkent University',                   null,   'Ankara',         'Turkey',         351),
('Middle East Technical University',     'METU', 'Ankara',         'Turkey',         401),
('Istanbul Technical University',        'ITU',  'Istanbul',       'Turkey',         401),
('Bogaziçi University',                  null,   'Istanbul',       'Turkey',         351),
('Sabancı University',                   null,   'Istanbul',       'Turkey',         451),
('Istanbul University',                  null,   'Istanbul',       'Turkey',         601),

-- ══════════════════════════════════════════
-- SLOVAKIA / OTHER CENTRAL EUROPE
-- ══════════════════════════════════════════
('Comenius University',                  null,   'Bratislava',     'Slovakia',       null),
('Slovak University of Technology',      'STU',  'Bratislava',     'Slovakia',       null),
('University of Ljubljana',              null,   'Ljubljana',      'Slovenia',       601),
('University of Zagreb',                 null,   'Zagreb',         'Croatia',        801),

-- ══════════════════════════════════════════
-- LUXEMBOURG / MALTA / CYPRUS
-- ══════════════════════════════════════════
('University of Luxembourg',             null,   'Luxembourg City','Luxembourg',     451),
('University of Malta',                  null,   'Msida',          'Malta',          null),
('University of Cyprus',                 null,   'Nicosia',        'Cyprus',         null),
('Cyprus University of Technology',      'CUT',  'Limassol',       'Cyprus',         null),

-- ══════════════════════════════════════════
-- ICELAND / ESTONIA / LATVIA / LITHUANIA
-- ══════════════════════════════════════════
('University of Iceland',                null,   'Reykjavik',      'Iceland',        null),
('University of Tartu',                  null,   'Tartu',          'Estonia',        601),
('University of Latvia',                 null,   'Riga',           'Latvia',         null),
('Vilnius University',                   null,   'Vilnius',        'Lithuania',      null),

-- ══════════════════════════════════════════
-- SERBIA / BULGARIA
-- ══════════════════════════════════════════
('University of Belgrade',               null,   'Belgrade',       'Serbia',         801),
('Sofia University',                     null,   'Sofia',          'Bulgaria',       null);
