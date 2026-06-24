-- ============================================================
-- MAKAN: Photo corrections — run AFTER makan-seed.sql
-- Every listing gets location & type-matched Unsplash photos
-- ============================================================

-- 🇬🇧 UK ─────────────────────────────────────────────────
-- Canary Wharf 2-bed flat: modern high-rise interior, city view
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1449844908441-8d4832deb3c8?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%Canary Wharf%';

-- Birmingham Jewellery Quarter 1-bed: brick/loft interior
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1449844908441-8d4832deb3c8?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%Jewellery Quarter%';

-- Manchester Spinningfields studio: compact modern studio
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%Spinningfields%';

-- West Bridgford 3-bed semi: UK suburban house exterior + interior
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1449844908441-8d4832deb3c8?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%West Bridgford%';

-- Chapel Allerton Leeds 4-bed detached: larger UK family home
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1449844908441-8d4832deb3c8?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%Chapel Allerton%';

-- 🇲🇦 MOROCCO ─────────────────────────────────────────────
-- Marrakech riad: traditional Moroccan courtyard + interiors
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1591382696684-38c427c7547a?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%Medina%' AND country = 'ma';

-- Casablanca Gauthier 2-bed: modern continental apartment
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1449844908441-8d4832deb3c8?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%Gauthier%';

-- Tangier hillside villa: Mediterranean white villa exterior
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1573408301185-9521eaa6d1f0?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%Montagne%';

-- Rabat Agdal 1-bed: neat modern apartment
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%Agdal%';

-- Agadir beach apartment: bright Mediterranean coastal flat
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1573408301185-9521eaa6d1f0?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%Agadir%';

-- 🇪🇬 EGYPT ───────────────────────────────────────────────
-- Katameya Heights villa: gated compound, Egyptian villa pool
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1591382696684-38c427c7547a?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%Katameya%';

-- Zamalek 2-bed: classic Nile-island apartment, high ceiling
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1449844908441-8d4832deb3c8?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%Zamalek%';

-- Alexandria Stanley sea-view: bright coastal apartment
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%Stanley%';

-- Maadi 3-bed: classic expat apartment, leafy suburb
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1449844908441-8d4832deb3c8?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%Maadi%';

-- New Capital 2-bed: brand-new modern Egyptian apartment
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%Administrative Capital%';

-- 🇦🇪 UAE ─────────────────────────────────────────────────
-- Dubai Marina 2-bed: premium marina-view tower apartment
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%Dubai Marina%';

-- Downtown Dubai 1-bed: ultra-luxury high-rise with Burj view
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1449844908441-8d4832deb3c8?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%Downtown Dubai%';

-- Palm Jumeirah 4-bed villa: private beach villa, infinity pool
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1591382696684-38c427c7547a?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1573408301185-9521eaa6d1f0?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%Palm Jumeirah%';

-- Saadiyat Abu Dhabi 3-bed: low-rise luxury island apartment
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1573408301185-9521eaa6d1f0?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%Saadiyat%';

-- Sharjah Al Majaz 2-bed: mid-range lagoon-view apartment
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1449844908441-8d4832deb3c8?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%Al Majaz%';

-- 🇸🇦 SAUDI ARABIA ────────────────────────────────────────
-- Riyadh Al Olaya compound: executive compound apartment
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1573408301185-9521eaa6d1f0?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1449844908441-8d4832deb3c8?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%Al Olaya%';

-- Jeddah Al Rawdah villa: large Jeddah family villa with pool
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1591382696684-38c427c7547a?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%Al Rawdah%';

-- Riyadh Diplomatic Quarter villa: premium compound villa
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%Diplomatic Quarter%';

-- Al Khobar 2-bed: clean modern apartment
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1449844908441-8d4832deb3c8?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%Khobar%';

-- Jeddah Al Hamra penthouse: Red Sea penthouse, luxury
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%Al Hamra%';

-- 🇰🇼 KUWAIT ──────────────────────────────────────────────
-- Salmiya Marina 3-bed: Gulf sea-view tower apartment
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1449844908441-8d4832deb3c8?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%Salmiya%' AND bedrooms = 3;

-- Hawalli 2-bed: mid-range practical apartment
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1449844908441-8d4832deb3c8?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%Hawalli%';

-- Fintas villa: spacious coastal villa, garden
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%Fintas%';

-- Marina Crescent 1-bed: chic waterfront studio/1-bed
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1449844908441-8d4832deb3c8?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%Marina Crescent%';

-- Rumaithiya 5-bed villa: large Kuwaiti family villa
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1591382696684-38c427c7547a?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%Rumaithiya%';

-- 🇧🇭 BAHRAIN ─────────────────────────────────────────────
-- Seef 2-bed: modern Bahrain commercial district flat
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%Seef%';

-- Amwaj Islands villa: waterfront villa, marina
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1591382696684-38c427c7547a?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1573408301185-9521eaa6d1f0?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%Amwaj%';

-- Diplomatic Area 1-bed: corporate/diplomatic tower
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%Diplomatic Area%';

-- Riffa villa: Bahrain family villa
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%Riffa%';

-- Muharraq 2-bed: affordable traditional area apartment
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1449844908441-8d4832deb3c8?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%Muharraq%';

-- 🇶🇦 QATAR ───────────────────────────────────────────────
-- The Pearl 2-bed: Porto Arabia marina-front luxury
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1573408301185-9521eaa6d1f0?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%Pearl Qatar%' OR (title ILIKE '%Pearl%' AND country = 'qa');

-- West Bay 3-bed: corporate high-rise Doha
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1449844908441-8d4832deb3c8?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%West Bay%';

-- Lusail 2-bed rent: new-build modern apartment
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%Lusail%' AND listing_type = 'rent';

-- Al Sadd 1-bed: central Doha apartment
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1449844908441-8d4832deb3c8?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%Al Sadd%';

-- Lusail villa sale: Fox Hills gated villa
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1591382696684-38c427c7547a?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%Lusail%' AND listing_type = 'sale';

-- 🇴🇲 OMAN ────────────────────────────────────────────────
-- Muscat Hills golf villa: ITC villa, green fairway
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1573408301185-9521eaa6d1f0?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1591382696684-38c427c7547a?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%Muscat Hills%';

-- The Wave 2-bed: marina-front modern apartment
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1449844908441-8d4832deb3c8?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%Wave Muscat%';

-- Qurum 2-bed: established Muscat residential apartment
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%Qurum%';

-- Al Mouj marina townhouse: luxury 3-floor townhouse
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1573408301185-9521eaa6d1f0?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%Al Mouj%';

-- Salalah 3-bed: lush greenery, tropical Oman apartment
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1449844908441-8d4832deb3c8?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%Salalah%';

-- 🇯🇴 JORDAN ──────────────────────────────────────────────
-- Abdoun 3-bed: premium Amman apartment, diplomatic area
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1449844908441-8d4832deb3c8?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%Abdoun%';

-- Aqaba South Beach 2-bed: coastal Red Sea apartment
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1573408301185-9521eaa6d1f0?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%Aqaba%';

-- Sweifieh 2-bed: vibrant West Amman apartment
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1449844908441-8d4832deb3c8?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%Sweifieh%';

-- Dabouq 4-bed villa: exclusive Amman hilltop villa
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%Dabouq%';

-- Irbid university area 3-bed: affordable student apartment
UPDATE listings SET images = ARRAY[
  'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80'
] WHERE title ILIKE '%Irbid%';

-- ✅ Verify
SELECT title, LEFT(images[1], 60) AS first_photo
FROM listings
WHERE user_id = '11111111-1111-1111-1111-111111111111'
ORDER BY country, city;
