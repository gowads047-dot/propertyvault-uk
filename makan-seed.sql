-- ============================================================
-- MAKAN: 50 Realistic Listings Across 10 Countries
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- STEP 1: Extend schema
ALTER TABLE listings DROP CONSTRAINT IF EXISTS listings_property_type_check;
ALTER TABLE listings ADD CONSTRAINT listings_property_type_check
  CHECK (property_type IN ('Room','Studio','Flat','Apartment','House','Villa','Penthouse','Land','Commercial'));

ALTER TABLE listings ADD COLUMN IF NOT EXISTS listing_type text DEFAULT 'rent'
  CHECK (listing_type IN ('rent','sale'));
ALTER TABLE listings ADD COLUMN IF NOT EXISTS country text DEFAULT 'gb';

-- STEP 2: Create demo landlord (bypasses RLS in SQL editor / service role)
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data, is_super_admin
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  'listings@makan.co',
  crypt('MakanSeed2026!', gen_salt('bf')),
  now(), now(), now(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Makan Listings","role":"landlord"}',
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (id, name, whatsapp, role)
VALUES ('11111111-1111-1111-1111-111111111111', 'Makan Listings', '447415721628', 'landlord')
ON CONFLICT (id) DO UPDATE SET name = 'Makan Listings', role = 'landlord';

-- STEP 3: Insert 50 listings
-- ─────────────────────────────────────────────────────
-- 🇬🇧 UNITED KINGDOM (5 listings)
-- ─────────────────────────────────────────────────────
INSERT INTO listings (title, description, property_type, bedrooms, price, city, area, furnished, features, images, status, user_id, listing_type, country, available_from) VALUES

(
  'Contemporary 2-bed apartment, Canary Wharf',
  E'Stunning 14th-floor apartment in a premium Canary Wharf development with floor-to-ceiling windows and panoramic Docklands views. The open-plan kitchen and living area features Bosch appliances, marble worktops, and a breakfast bar. Two double bedrooms, two bathrooms (master en-suite), and a private balcony overlooking the water.\n\nBuilding amenities: 24-hour concierge, residents'' gym, rooftop terrace, and secure underground parking. Two minutes'' walk to Canary Wharf Elizabeth line and Jubilee line stations. Available fully furnished to a high specification.',
  'Flat', 2, 2400, 'London', 'Canary Wharf', 'Furnished',
  ARRAY['Parking','Gym','Balcony','City view','En-suite','Air conditioning','Elevator','Security','Doorman','Furnished'],
  ARRAY[
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'rent', 'gb', '2026-07-01'
),

(
  'Stylish 1-bed apartment, Jewellery Quarter',
  E'Beautifully converted 1-bedroom apartment in a character former factory building in Birmingham''s iconic Jewellery Quarter. Exposed brickwork, original steel windows, and 3.5m ceilings give this apartment a genuine loft feel. The kitchen features integrated appliances including a wine cooler. Bedroom with fitted wardrobes and en-suite shower room.\n\nSituated on one of the Quarter''s quietest streets, 8 minutes'' walk to Birmingham New Street station and directly on the tram line. Surrounded by award-winning restaurants and independent bars. EPC: B. Gas safety certificate provided. Deposit protected with TDS.',
  'Flat', 1, 875, 'Birmingham', 'Jewellery Quarter', 'Furnished',
  ARRAY['Furnished','City view','Near transport','Washing machine','En-suite','EPC C+'],
  ARRAY[
    'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1449844908441-8d4832deb3c8?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'rent', 'gb', '2026-07-15'
),

(
  'Executive studio, Spinningfields',
  E'A sleek, fully-managed studio in Manchester''s business and cultural hub. This is not a typical studio — at 520 sq ft it feels genuinely spacious, with a mezzanine sleeping area separated from the open-plan living and kitchen space below. Custom-designed kitchen with Smeg appliances. Juliet balcony overlooking the street.\n\nSpinningfields is Manchester''s answer to Canary Wharf — surrounded by top restaurants, bars, and offices. Direct access to Deansgate-Castlefield tram stop. 12-month minimum. Bills not included. EPC: B.',
  'Studio', 0, 1050, 'Manchester', 'Spinningfields', 'Furnished',
  ARRAY['Furnished','Balcony','City view','Air conditioning','Near transport','Washing machine','EPC C+'],
  ARRAY[
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'rent', 'gb', '2026-08-01'
),

(
  '3-bed semi-detached for sale, West Bridgford',
  E'A well-presented 3-bedroom semi-detached house in the highly sought-after West Bridgford neighbourhood — one of Nottingham''s most desirable postcodes. The property features a modern fitted kitchen, a through-lounge diner, downstairs WC, and a landscaped rear garden with Indian sandstone patio.\n\nUpstairs: three bedrooms (master with built-in wardrobes) and a family bathroom with bath and separate shower. Gas central heating with a 2-year-old combi boiler. Double-glazed throughout. Off-road parking for two vehicles. Walking distance to the River Trent, Bridgford Park, and West Bridgford town centre with its excellent schools, cafes and independent shops. Chain-free.',
  'House', 3, 295000, 'Nottingham', 'West Bridgford', 'Unfurnished',
  ARRAY['Garden','Parking','Near school','Near transport','Central heating'],
  ARRAY[
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1449844908441-8d4832deb3c8?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'sale', 'gb', current_date
),

(
  '4-bed detached family home for sale, Chapel Allerton',
  E'An exceptional 4-bedroom detached house in Chapel Allerton, one of Leeds'' most vibrant and family-friendly neighbourhoods. Recently renovated to a high standard throughout, featuring a stunning open-plan kitchen/dining/family room with bi-fold doors opening to a southwest-facing garden.\n\nThe ground floor also has a separate sitting room, study, and downstairs WC. Upstairs: master bedroom with en-suite and walk-in wardrobe, three further double bedrooms, and a luxury family bathroom. Block-paved driveway for 3 cars plus integral garage. Within the catchment for excellent Ofsted-rated primary and secondary schools. 10 minutes'' drive from Leeds city centre and 15 minutes from the A1(M). No chain.',
  'House', 4, 465000, 'Leeds', 'Chapel Allerton', 'Unfurnished',
  ARRAY['Garden','Parking','Near school','Central heating','En-suite'],
  ARRAY[
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'sale', 'gb', current_date
),

-- ─────────────────────────────────────────────────────
-- 🇲🇦 MOROCCO (5 listings)
-- ─────────────────────────────────────────────────────

(
  'Authentic 4-bed riad with rooftop terrace, Marrakech Medina',
  E'A breathtaking riad in the heart of the Marrakech Medina — fully restored to the highest standard while preserving every original detail. Twelve-metre internal courtyard with a central mosaic fountain, fig tree, and handmade zellij tilework floor. Four en-suite bedrooms with hand-carved cedarwood doors and traditional Berber textiles.\n\nThe rooftop terrace offers panoramic views across the medina to the Atlas Mountains — with a plunge pool, daybed lounge area, and outdoor kitchen for entertaining. Currently operated as a successful boutique guesthouse generating 60,000–80,000 MAD per month in peak season. Sold fully furnished and operational. Ideal for diaspora buyers or hospitality investment.',
  'Villa', 4, 3200000, 'Marrakech', 'Medina', 'Furnished',
  ARRAY['Pool','Terrace','Furnished','Security','Near mosque'],
  ARRAY[
    'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1591382696684-38c427c7547a?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'sale', 'ma', current_date
),

(
  'Modern 2-bed apartment for rent, Gauthier, Casablanca',
  E'A contemporary 2-bedroom apartment on the 7th floor of a secure residence in Gauthier — Casablanca''s most prestigious residential district. The open-plan living and dining space is bright and airy, with floor-to-ceiling windows and a covered balcony. Kitchen fitted with Italian appliances. Master bedroom with dressing room. Second bedroom currently set up as an office.\n\nThe building has a concierge, elevator, and secure underground parking. Gauthier is within walking distance of the Corniche, the best restaurants in Casablanca, and the Maarif shopping district. Available for 12-month minimum lease to professionals or couples. No pets. Non-furnished option available at 7,500 MAD/mo.',
  'Apartment', 2, 9000, 'Casablanca', 'Gauthier', 'Furnished',
  ARRAY['Parking','Balcony','Air conditioning','Elevator','Security','Furnished'],
  ARRAY[
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'rent', 'ma', '2026-07-01'
),

(
  'Hillside 3-bed villa with sea views for sale, Tangier',
  E'A stunning contemporary villa perched on the hillside of La Montagne — Tangier''s most exclusive residential quarter, home to diplomats, international businesspeople, and returning diaspora. The property sits on a 900m² plot with landscaped gardens, a heated swimming pool, and unobstructed views across the Strait of Gibraltar to the coast of Spain.\n\nInteriors are architect-designed: double-height entrance hall, open-plan living and dining with sliding glass doors to the terrace, bespoke kitchen with marble island, and three en-suite bedrooms. Staff room, double garage, solar panels, and a borehole water supply. Just 8 minutes'' drive from the city centre and 12 minutes from the new Tanger-Med port. Ideal for investment or primary residence.',
  'Villa', 3, 4500000, 'Tangier', 'La Montagne', 'Part furnished',
  ARRAY['Pool','Garden','Parking','Sea view','Air conditioning','Security','En-suite'],
  ARRAY[
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1573408301185-9521eaa6d1f0?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1591382696684-38c427c7547a?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'sale', 'ma', current_date
),

(
  'Contemporary 1-bed apartment to rent, Agdal, Rabat',
  E'A well-finished 1-bedroom apartment in the Agdal district — Rabat''s most sought-after residential neighbourhood. The apartment occupies the 4th floor of a modern building with elevator and secure entry. Open-plan kitchen and living area with quality appliances and a small balcony. The bedroom features fitted wardrobes and the bathroom is fully tiled.\n\nAgdal is Rabat''s most walkable district — lined with cafes, bakeries, the French-speaking business community, and excellent transport links including the tramway to the city centre and Mohamed V University. Well-suited to diplomats, government professionals, and corporate tenants. Utilities not included. 6-month minimum lease considered.',
  'Apartment', 1, 5500, 'Rabat', 'Agdal', 'Furnished',
  ARRAY['Balcony','Elevator','Furnished','Near transport','Air conditioning'],
  ARRAY[
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'rent', 'ma', '2026-08-01'
),

(
  'Beachside 2-bed apartment for sale, Secteur Touristique, Agadir',
  E'A bright and well-presented 2-bedroom apartment in Agadir''s tourist zone — 200 metres from the beach and within the secure Founty Bay residence. The apartment has been recently renovated with quality materials: new kitchen, tiled floors throughout, air conditioning in all rooms, and a furnished terrace with sea glimpses.\n\nThe Founty Bay complex has a communal pool, 24-hour security, and a garden. This is a proven short-let investment: the current owner achieves 90%+ occupancy through tourism platforms in the high season (November–April). Strong potential for AirBnB or Booking.com income. Sold with existing rental management contract in place. Ideal for diaspora buyers seeking income-producing Moroccan property.',
  'Apartment', 2, 1800000, 'Agadir', 'Secteur Touristique', 'Furnished',
  ARRAY['Pool','Balcony','Sea view','Air conditioning','Security','Furnished','Near beach'],
  ARRAY[
    'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'sale', 'ma', current_date
),

-- ─────────────────────────────────────────────────────
-- 🇪🇬 EGYPT (5 listings)
-- ─────────────────────────────────────────────────────

(
  'Gated compound 4-bed villa for sale, Katameya Heights',
  E'An exceptional villa inside the prestigious Katameya Heights compound in New Cairo — one of Egypt''s most exclusive gated communities with 24-hour security, manicured golf course, tennis courts, and club membership. The property sits on a 500m² plot with a private pool, landscaped garden, and covered terrace.\n\nInside: a double-height entrance reception, formal sitting room, open dining and family room, and a fully-equipped chef''s kitchen on the ground floor. Four en-suite bedrooms upstairs, including a master suite with walk-in dressing room and Nile-valley views. Double garage plus staff accommodation. New Cairo location means excellent access to the New Administrative Capital, AUC, and the Ring Road. A rare opportunity at this price — motivated seller.',
  'Villa', 4, 18000000, 'Cairo', 'New Cairo', 'Unfurnished',
  ARRAY['Pool','Garden','Parking','Gym','Security','En-suite','Air conditioning'],
  ARRAY[
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1591382696684-38c427c7547a?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1573408301185-9521eaa6d1f0?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'sale', 'eg', current_date
),

(
  'Nile-view 2-bed flat to rent, Zamalek Island',
  E'A rare and beautifully maintained 2-bedroom apartment on the 8th floor of a classic Zamalek building with direct Nile views from the living room and master bedroom balcony. Zamalek is Cairo''s most diplomatic and cosmopolitan island neighbourhood — home to embassies, international schools, the Gezira Club, and the best restaurants in the city.\n\nThe apartment features original parquet flooring, high ceilings, a large reception room, two double bedrooms, two bathrooms, and a covered balcony. Kitchen is well-equipped. Building has a bawab (doorman) and is one of the last genuinely well-maintained classic buildings on the island. Available furnished. Suited to diplomats, senior executives, or returning Egyptians who want the best of Cairo. Utilities extra.',
  'Flat', 2, 25000, 'Cairo', 'Zamalek', 'Furnished',
  ARRAY['Balcony','City view','Furnished','Security','Doorman','Air conditioning'],
  ARRAY[
    'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'rent', 'eg', '2026-07-01'
),

(
  'Sea-view 3-bed apartment for sale, Stanley, Alexandria',
  E'A stunning 3-bedroom apartment on the 10th floor of a modern building directly on the Stanley Corniche in Alexandria — arguably the finest sea-view address in Egypt. The apartment has been fully renovated with premium finishes: Italian marble throughout, custom kitchen with Miele appliances, floor-to-ceiling glazing in the living room, and panoramic sea views from three rooms.\n\nThree double bedrooms, two bathrooms (master en-suite), and a covered terrace running the full width of the property. The building has 24-hour security, a lift, and a rooftop communal area. Stanley Beach is directly below — walk to the beach in two minutes. This is a unique lifestyle and investment purchase: Alexandria summer rental demand is exceptionally strong and prices here remain well below equivalent Cairo properties.',
  'Apartment', 3, 8500000, 'Alexandria', 'Stanley', 'Part furnished',
  ARRAY['Balcony','Sea view','Air conditioning','Elevator','Security','En-suite'],
  ARRAY[
    'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'sale', 'eg', current_date
),

(
  'Spacious 3-bed apartment to rent, Maadi',
  E'An elegant and generously proportioned 3-bedroom apartment in Maadi — Cairo''s leafy, tree-lined suburb that is the traditional home of Cairo''s expat community, diplomatic families, and Egyptian professionals. The apartment is on the 3rd floor of a well-managed building with security and a doorman.\n\nFeatures a large, light reception room, separate formal dining room, fully-equipped kitchen, three double bedrooms (master en-suite), and two further bathrooms. Private garage space and storage room. The building is on a quiet, tree-lined street two minutes from Road 9 (Maadi''s main social street), within the French and German school catchment areas, and 20 minutes from Tahrir Square. Available now. Suited to corporate or diplomatic tenants. 12-month minimum lease.',
  'Apartment', 3, 35000, 'Cairo', 'Maadi', 'Furnished',
  ARRAY['Parking','Garden','Furnished','Security','Doorman','Air conditioning','Near school'],
  ARRAY[
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'rent', 'eg', '2026-06-01'
),

(
  'Brand-new 2-bed apartment for sale, New Administrative Capital',
  E'A brand-new 2-bedroom apartment in R7 — the central residential district of Egypt''s New Administrative Capital, the most ambitious urban development project in the country''s modern history. This property is developer-direct, with a 10% down payment and flexible 7-year payment plan available.\n\nThe apartment features an open-plan living and dining area, modern kitchen with built-in appliances, two double bedrooms, and two bathrooms. The development includes a communal pool, gym, and landscaped gardens. Delivery in Q4 2026 with a government-backed quality guarantee. The New Capital hosts the new Presidential Palace, all government ministries, embassies, and the new opera house. Rental yields are expected at 12–15% as the city fills. Ideal first investment for returning diaspora.',
  'Apartment', 2, 6500000, 'Cairo', 'New Administrative Capital', 'Unfurnished',
  ARRAY['Pool','Gym','Elevator','Security','Air conditioning','Near transport'],
  ARRAY[
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'sale', 'eg', '2026-10-01'
),

-- ─────────────────────────────────────────────────────
-- 🇦🇪 UAE (5 listings)
-- ─────────────────────────────────────────────────────

(
  'Marina-view 2-bed apartment to rent, Dubai Marina',
  E'A high-floor, fully-furnished 2-bedroom apartment in one of Dubai Marina''s most sought-after towers with direct marina views from the living room and master bedroom. The apartment has been recently fitted out by an interior designer: custom Italian kitchen with Siemens appliances, bespoke wardrobes in both bedrooms, and luxury bathrooms with rain showers.\n\nThe building features a temperature-controlled infinity pool on the 25th floor, fully-equipped gym, sauna, and 24-hour security/concierge. Walking distance to Dubai Marina Mall, the Marina Walk waterfront promenade, tram and metro connections. Chiller-free building (significant saving). Ejari will be registered. Available from 1 July 2026. Cheques: 1, 2, or 4 accepted. Landlord based in UAE.',
  'Apartment', 2, 12000, 'Dubai', 'Dubai Marina', 'Furnished',
  ARRAY['Pool','Gym','Balcony','Sea view','Air conditioning','Elevator','Security','Doorman','Furnished'],
  ARRAY[
    'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'rent', 'ae', '2026-07-01'
),

(
  'Burj Khalifa-view 1-bed for sale, Downtown Dubai',
  E'A premium 1-bedroom apartment in the heart of Downtown Dubai with a direct Burj Khalifa and Dubai Fountain view from the living room and private terrace. Located in a luxury tower with resort-style amenities — two rooftop pools, a world-class spa, and a sky lounge.\n\nThe apartment is 890 sq ft (85m²) with an open-plan kitchen featuring Gaggenau appliances, built-in storage throughout, and floor-to-ceiling glazing maximising the view. Currently rented at AED 110,000 per annum (gross yield ~6.1%) with a tenant in place until January 2027. The apartment can be sold with tenant in situ or vacant. RERA Ejari in place. Title deed clear. Golden Visa eligible. Freehold ownership for all nationalities.',
  'Apartment', 1, 1800000, 'Dubai', 'Downtown Dubai', 'Furnished',
  ARRAY['Pool','Gym','Balcony','City view','Air conditioning','Elevator','Security','Doorman','Furnished'],
  ARRAY[
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'sale', 'ae', current_date
),

(
  'Private beach 4-bed villa for sale, Palm Jumeirah',
  E'An extraordinary 4-bedroom signature villa on the Palm Jumeirah fronds with 20 metres of private beach, a temperature-controlled infinity pool, and unobstructed sea views across the Arabian Gulf to the Dubai skyline and Burj Al Arab.\n\nThe villa spans 6,500 sq ft over three floors. Ground floor: a grand entrance atrium, formal majlis, family room, chef''s kitchen with Wolf and Sub-Zero appliances, and a guest suite. First floor: master suite with his-and-hers walk-in wardrobes and a spa bathroom, plus two further en-suite bedrooms. Top floor: private roof terrace with outdoor kitchen and panoramic 360° views. Four-car garage, maid''s room, driver''s room, and full smart home automation. One of only 18 of this villa type on the frond. Title deed clear.',
  'Villa', 4, 15000000, 'Dubai', 'Palm Jumeirah', 'Furnished',
  ARRAY['Pool','Garden','Parking','Sea view','Air conditioning','Security','Doorman','Furnished','En-suite','Maid''s room','Driver''s room'],
  ARRAY[
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1591382696684-38c427c7547a?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'sale', 'ae', current_date
),

(
  'Island-living 3-bed apartment for sale, Saadiyat Island, Abu Dhabi',
  E'A luxurious 3-bedroom apartment in a boutique low-rise development on Saadiyat Island — Abu Dhabi''s cultural and lifestyle destination, home to the Louvre Abu Dhabi, Guggenheim (under construction), Saadiyat Beach Club, and some of the Gulf''s finest white-sand beaches.\n\nThe apartment spans 2,100 sq ft and is finished to a standard more commonly found in boutique hotels: oak flooring, Italian marble bathrooms, custom joinery throughout, and a wraparound terrace with garden and partial sea view. Three en-suite bedrooms, a study, and a maid''s room. The development has a private beach access, temperature-controlled pool, fully-equipped gym, and valet parking. Freehold title. ADIB mortgage pre-approval available to eligible buyers. Golden Visa eligible.',
  'Apartment', 3, 4200000, 'Abu Dhabi', 'Saadiyat Island', 'Part furnished',
  ARRAY['Pool','Balcony','Sea view','Gym','Air conditioning','Elevator','Security','En-suite','Near beach'],
  ARRAY[
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1573408301185-9521eaa6d1f0?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'sale', 'ae', current_date
),

(
  'Corniche-view 2-bed apartment to rent, Al Majaz, Sharjah',
  E'A well-appointed 2-bedroom apartment on the 12th floor of a modern tower directly on the Al Majaz waterfront corniche — Sharjah''s most scenic neighbourhood with beautiful parks, walkways, and views of Khalid Lagoon. This is one of the best-value apartments in the UAE for its size and location.\n\nFeatures: split open-plan living and dining, modern kitchen with built-in appliances, two double bedrooms (master en-suite), two bathrooms, and a covered balcony with lagoon views. The building has an elevator, covered parking, and 24-hour security. Chiller-free building. Sharjah is 15 minutes from Dubai by car and significantly more affordable. Ejari and Tawtheeq registration will be arranged. Suited to families, professionals, or Dubai workers seeking more space for the money. Cheques: 2 or 4.',
  'Apartment', 2, 5500, 'Sharjah', 'Al Majaz', 'Part furnished',
  ARRAY['Parking','Balcony','City view','Air conditioning','Elevator','Security','En-suite'],
  ARRAY[
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1449844908441-8d4832deb3c8?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'rent', 'ae', '2026-07-01'
),

-- ─────────────────────────────────────────────────────
-- 🇸🇦 SAUDI ARABIA (5 listings)
-- ─────────────────────────────────────────────────────

(
  'Executive 3-bed compound apartment to rent, Al Olaya, Riyadh',
  E'A spacious 3-bedroom apartment within a premium residential compound in Al Olaya — Riyadh''s central business district. The compound offers a lifestyle package that draws senior expatriates and Saudi professionals alike: an Olympic-size pool, tennis and squash courts, a fully-equipped fitness centre, a supermarket, pharmacy, and restaurant all within the secure perimeter.\n\nThe apartment features an open-plan reception and dining room, an American-style kitchen with full appliances, a large master bedroom with en-suite and dressing room, two further bedrooms, and a maid''s room. Covered parking for two vehicles included. The compound is 5 minutes from King Fahd Road, 10 minutes from Kingdom Tower, and within the catchment of international schools. Ejar registration will be provided. Available to families or senior executives. 12-month lease.',
  'Apartment', 3, 12000, 'Riyadh', 'Al Olaya', 'Furnished',
  ARRAY['Pool','Gym','Parking','Air conditioning','Security','Furnished','Maid''s room','Near school'],
  ARRAY[
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'rent', 'sa', '2026-08-01'
),

(
  'Luxury 4-bed villa with private pool for sale, Al Rawdah, Jeddah',
  E'A stunning contemporary villa in Al Rawdah — one of Jeddah''s most established and desirable residential neighbourhoods, known for its mature trees, wide boulevards, and proximity to the Red Sea corniche. The villa occupies a 700m² plot with a landscaped garden, heated private pool, and outdoor covered dining terrace.\n\nThe ground floor features a double-height entrance hall, a formal majlis, a family sitting room, and a chef''s kitchen with a central island and full professional appliances. Upstairs: four en-suite bedrooms including a master suite with dressing room and sea-glimpse terrace. Maid''s room and driver''s accommodation. Full smart home system, solar panels, and 3-phase electricity. Title deed clear, no mortgage. A rare opportunity in one of Jeddah''s most sought-after streets.',
  'Villa', 4, 3500000, 'Jeddah', 'Al Rawdah', 'Unfurnished',
  ARRAY['Pool','Garden','Parking','Air conditioning','Security','Maid''s room','Driver''s room','En-suite'],
  ARRAY[
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1591382696684-38c427c7547a?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1573408301185-9521eaa6d1f0?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'sale', 'sa', current_date
),

(
  'Diplomatic Quarter 5-bed compound villa to rent, Riyadh',
  E'A prestigious 5-bedroom detached villa available for lease within a top-tier residential compound in Riyadh''s Diplomatic Quarter — the most prestigious address in the Kingdom, home to embassies, international organisations, and senior government officials. The compound features extensive greenery, walking trails, a country club, two pools, tennis courts, and 24-hour diplomatic-level security.\n\nThe villa spans 650m² and has been fully refurbished to an international standard: a designer kitchen, home cinema room, formal and informal reception spaces, five en-suite bedrooms with fitted wardrobes, a study, maid''s room, and covered garaging for four vehicles. Monthly rent includes maintenance, gardening, pool service, and full compound amenity access. Ejar-registered lease. Open to diplomatic missions, senior executives, and government-related tenants. 12-month minimum.',
  'Villa', 5, 25000, 'Riyadh', 'Diplomatic Quarter', 'Furnished',
  ARRAY['Pool','Gym','Garden','Parking','Air conditioning','Security','Furnished','Maid''s room','Driver''s room','En-suite'],
  ARRAY[
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'rent', 'sa', '2026-09-01'
),

(
  'Modern 2-bed apartment to rent, Al Khobar',
  E'A clean, modern 2-bedroom apartment in a well-managed building in Al Khobar — the Eastern Province''s most liveable city, popular with Aramco employees and oil sector professionals. The apartment is on the 5th floor with views of the city skyline from the living room balcony.\n\nFeatures a modern fitted kitchen, spacious open-plan living and dining room, two double bedrooms (master en-suite), two bathrooms, and a covered parking space. The building has a backup generator, water storage, and 24-hour security. Al Khobar offers easy access to the King Fahd Causeway to Bahrain and is 20 minutes from Saudi Aramco headquarters in Dhahran. Ejar registration provided. Bills not included. Available immediately.',
  'Apartment', 2, 6000, 'Dammam', 'Al Khobar', 'Part furnished',
  ARRAY['Parking','Balcony','Air conditioning','Elevator','Security','En-suite'],
  ARRAY[
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1449844908441-8d4832deb3c8?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'rent', 'sa', '2026-07-01'
),

(
  'Red Sea penthouse for sale, Al Hamra, Jeddah',
  E'An extraordinary full-floor penthouse on the 32nd floor of a landmark tower in Al Hamra — Jeddah''s most prestigious waterfront district, directly on the Red Sea corniche. This is a once-in-a-decade offering: 460m² of living space, a 120m² wraparound terrace, and 270° panoramic views of the Red Sea, the iconic King Fahd Fountain, and the Jeddah skyline.\n\nThe penthouse features a grand double-height entrance, a formal reception and dining room, a media/cinema room, a bespoke chef''s kitchen, and four en-suite bedrooms including a master suite with a private roof deck. Fully automated smart home system, a private elevator from the basement garage, and two dedicated parking spaces per floor. Building amenities include an infinity pool, spa, and 24-hour concierge. Title deed clear. Seller is motivated — genuine enquiries only.',
  'Penthouse', 4, 2800000, 'Jeddah', 'Al Hamra', 'Part furnished',
  ARRAY['Balcony','Sea view','Air conditioning','Elevator','Security','Doorman','En-suite','City view'],
  ARRAY[
    'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'sale', 'sa', current_date
),

-- ─────────────────────────────────────────────────────
-- 🇰🇼 KUWAIT (5 listings — all rent, foreign ownership restricted)
-- ─────────────────────────────────────────────────────

(
  'Premium sea-view 3-bed apartment to rent, Salmiya',
  E'A beautifully furnished 3-bedroom apartment with stunning Arabian Gulf views on the 15th floor of a prestigious Salmiya tower. Salmiya is Kuwait''s most vibrant residential and retail district — home to the Marina Crescent, The Avenues mall, and some of Kuwait''s best restaurants.\n\nThe apartment features a large reception room with panoramic sea views, an open dining area, a fitted kitchen, three double bedrooms (master en-suite), three bathrooms, and a covered terrace. The building has 24-hour security, a covered car park, and an elevator. Suitable for professionals, couples, or small families. Rent includes building maintenance. Utilities (KEWAP) not included. 12-month lease. Note: residential property ownership in Kuwait is restricted to Kuwaiti nationals and GCC citizens — this is a rental listing only.',
  'Apartment', 3, 700, 'Salmiya', 'Marina District', 'Furnished',
  ARRAY['Balcony','Sea view','Air conditioning','Elevator','Security','Furnished','En-suite'],
  ARRAY[
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'rent', 'kw', '2026-07-01'
),

(
  'Spacious 2-bed apartment to rent, Hawalli',
  E'A generous and well-maintained 2-bedroom apartment in Hawalli — one of Kuwait''s most established residential districts, popular with the large Arab, South Asian, and Egyptian communities who form a major part of Kuwait''s workforce. The apartment is on the 6th floor of a clean building with elevator and covered parking.\n\nFeatures a spacious reception and dining area, a functional kitchen, two double bedrooms, two bathrooms, and a small balcony. The building has a backup generator and 24-hour building security. Hawalli offers excellent value compared to Salmiya or Kuwait City centre, with good transport links and a wide range of restaurants, supermarkets, and services. Available now. Short-term (3-month) lease considered for the right tenant.',
  'Apartment', 2, 380, 'Kuwait City', 'Hawalli', 'Part furnished',
  ARRAY['Parking','Balcony','Air conditioning','Elevator','Security'],
  ARRAY[
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1449844908441-8d4832deb3c8?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'rent', 'kw', '2026-06-01'
),

(
  'Luxury 4-bed villa with garden to rent, Fintas',
  E'A spacious and well-equipped 4-bedroom detached villa in Fintas — one of Kuwait''s most family-friendly coastal areas, known for its lower density, sea access, and spacious plots. The villa sits on a 450m² plot with a walled garden, covered terrace, and private parking for four vehicles.\n\nThe ground floor has a large formal majlis, a family sitting room, a dining room, and a fully-equipped kitchen with a separate preparation area. Upstairs: four double bedrooms including a master suite with walk-in wardrobe and en-suite bathroom. Maid''s room on the ground floor. Central air conditioning, backup generator, and full satellite TV and internet infrastructure. Fintas is 15 minutes south of Kuwait City, convenient for the industrial areas of Shuaiba and the southern Kuwait border. Available for families. 12-month minimum lease.',
  'Villa', 4, 1200, 'Kuwait City', 'Fintas', 'Unfurnished',
  ARRAY['Garden','Parking','Air conditioning','Security','Maid''s room','En-suite'],
  ARRAY[
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1573408301185-9521eaa6d1f0?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'rent', 'kw', '2026-08-01'
),

(
  'Marina-front 1-bed apartment to rent, Marina Crescent, Salmiya',
  E'A chic and compact 1-bedroom apartment on the Marina Crescent waterfront — the most desirable address in Salmiya and one of the most recognisable locations in Kuwait. Floor-to-ceiling windows in the living room open to a balcony with full marina and Gulf views. The apartment is modern, fully furnished, and maintained to a hotel standard.\n\nKitchen with built-in appliances, a double bedroom with fitted wardrobes, and a stylish bathroom. The building has a rooftop pool, fully-equipped gym, underground parking, and 24-hour security. The Marina Crescent promenade with its restaurants, cafes, and yacht club is directly downstairs. Perfect for a single professional or couple. Available immediately. Bills extra. Monthly payment accepted.',
  'Apartment', 1, 500, 'Salmiya', 'Marina Crescent', 'Furnished',
  ARRAY['Pool','Gym','Balcony','Sea view','Air conditioning','Elevator','Security','Furnished'],
  ARRAY[
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'rent', 'kw', '2026-06-15'
),

(
  'Grand 5-bed family villa to rent, Rumaithiya',
  E'A substantial 5-bedroom villa in Rumaithiya — one of Kuwait''s most established and sought-after residential areas, popular with Kuwaiti families and long-term expatriate residents. This villa has been fully renovated in 2025 and is available furnished to a high specification.\n\nThe ground floor features a large formal diwaniya (traditional Kuwaiti reception room), a family sitting room, a formal dining room, a chef''s kitchen with full appliances, and a maid''s room. Upstairs: five double bedrooms with fitted wardrobes including a master suite with en-suite and dressing room. The garden is landscaped with covered outdoor seating. Covered parking for 4 cars. The villa is within walking distance of Rumaithiya''s main shopping street and 20 minutes from Kuwait City centre. Suited to large families or diplomatic households. 12-month lease minimum.',
  'Villa', 5, 1500, 'Kuwait City', 'Rumaithiya', 'Furnished',
  ARRAY['Garden','Parking','Air conditioning','Security','Furnished','Maid''s room','En-suite'],
  ARRAY[
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1591382696684-38c427c7547a?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'rent', 'kw', '2026-09-01'
),

-- ─────────────────────────────────────────────────────
-- 🇧🇭 BAHRAIN (5 listings)
-- ─────────────────────────────────────────────────────

(
  'Modern 2-bed apartment to rent, Seef District, Manama',
  E'A well-finished 2-bedroom apartment on the 9th floor of a premium tower in Seef — Bahrain''s commercial and retail heartland, home to City Centre Bahrain, the Avenues, and some of the island''s best dining. The apartment has been recently refurbished with quality materials throughout.\n\nFeatures: open-plan living and dining room, fully-fitted kitchen with built-in appliances, two double bedrooms (master en-suite), two bathrooms, and a covered balcony with district views. The building has covered parking, 24-hour security, an elevator, and a communal gym. No property tax in Bahrain — one of the Gulf''s most tenant-friendly markets. 12-month lease. RERA Bahrain tenancy contract provided. Bills (EWDB) not included. Available from 1 August 2026.',
  'Apartment', 2, 650, 'Manama', 'Seef District', 'Part furnished',
  ARRAY['Parking','Gym','Balcony','Air conditioning','Elevator','Security','En-suite'],
  ARRAY[
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'rent', 'bh', '2026-08-01'
),

(
  'Waterfront 3-bed villa for sale, Amwaj Islands',
  E'A beautiful 3-bedroom villa on the waterfront of Amwaj Islands — Bahrain''s most celebrated residential development, built on reclaimed land in the northeast of the island with a private marina, beach clubs, and resort lifestyle. The villa has 15 metres of direct water frontage, a private pontoon, and a temperature-controlled outdoor pool.\n\nThe ground floor features an open-plan kitchen and living space that flows through sliding glass doors to the terrace and pool. Three en-suite bedrooms upstairs including a master suite with panoramic water views. Maid''s room. The development has a community gym, beach access, retail outlets, and restaurants all within walking distance. Freehold title — open to all nationalities worldwide. No property tax, no capital gains tax, no inheritance tax. Bahrain residence visa included with purchase. Title deed clear.',
  'Villa', 3, 320000, 'Manama', 'Amwaj Islands', 'Part furnished',
  ARRAY['Pool','Garden','Parking','Sea view','Air conditioning','Security','En-suite','Maid''s room','Near beach'],
  ARRAY[
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1591382696684-38c427c7547a?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1573408301185-9521eaa6d1f0?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'sale', 'bh', current_date
),

(
  'Executive 1-bed apartment to rent, Diplomatic Area, Manama',
  E'A premium 1-bedroom apartment in a boutique tower in Manama''s Diplomatic Area — Bahrain''s financial district, home to the Bahrain Financial Harbour, the Central Bank, and embassies from around the world. The apartment is on the 18th floor with city and sea views from the living room.\n\nFully furnished to a corporate standard: custom kitchen, a large bedroom with king-size bed and built-in wardrobes, and a luxury bathroom. The building has 24-hour security, a rooftop pool and terrace, a fully-equipped gym, and valet parking. Three minutes'' walk to BFH and the financial district. RERA-registered tenancy contract. Available to corporate tenants and executives. Monthly or quarterly payments considered for corporate accounts. Bills not included.',
  'Apartment', 1, 550, 'Manama', 'Diplomatic Area', 'Furnished',
  ARRAY['Pool','Gym','City view','Air conditioning','Elevator','Security','Doorman','Furnished','En-suite'],
  ARRAY[
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'rent', 'bh', '2026-07-01'
),

(
  'Spacious 4-bed family villa for sale, Riffa',
  E'A generous and well-presented 4-bedroom detached villa in East Riffa — Bahrain''s largest residential area, popular with Bahraini families and long-term residents. The villa sits on a 450m² plot with a walled garden, covered parking for three vehicles, and a large covered outdoor dining area.\n\nThe ground floor has a large formal reception room, a dining room, a modern kitchen with full appliances, and a maid''s room. Upstairs: four double bedrooms (master en-suite), a family bathroom, and a study. The villa has central air conditioning, a backup generator, and fibre internet. Riffa offers excellent schools (including the Indian School Bahrain and British School of Bahrain), good transport links, and significantly more space per BHD than central Manama. Freehold title. Open to all nationalities.',
  'Villa', 4, 185000, 'Manama', 'Riffa', 'Unfurnished',
  ARRAY['Garden','Parking','Air conditioning','Security','Maid''s room','En-suite','Near school'],
  ARRAY[
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'sale', 'bh', current_date
),

(
  'Affordable 2-bed apartment to rent, Muharraq',
  E'A comfortable and well-located 2-bedroom apartment in Muharraq — Bahrain''s second city and the historic heart of the island, now enjoying significant regeneration investment. The apartment is a 5-minute drive from Bahrain International Airport and 10 minutes from Manama via the Muharraq Causeway.\n\nFeatures a reception and dining room, a fitted kitchen, two bedrooms, two bathrooms, and a balcony. The building has covered parking and an elevator. Muharraq is home to one of Bahrain''s most authentic old towns (on the UNESCO tentative list), excellent traditional souqs, and some of the best seafood restaurants in the country. Ideal for airport-adjacent workers, traditional families, or those seeking genuinely affordable Gulf living. Bills not included. 6-month lease considered.',
  'Apartment', 2, 400, 'Muharraq', 'Old Town', 'Part furnished',
  ARRAY['Parking','Balcony','Air conditioning','Elevator'],
  ARRAY[
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1449844908441-8d4832deb3c8?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'rent', 'bh', '2026-06-01'
),

-- ─────────────────────────────────────────────────────
-- 🇶🇦 QATAR (5 listings)
-- ─────────────────────────────────────────────────────

(
  'Luxury 2-bed apartment for sale, The Pearl Qatar, Doha',
  E'A prestigious 2-bedroom apartment on the Porto Arabia waterfront at The Pearl Qatar — the country''s most iconic address and Doha''s premier luxury residential island. The apartment is on the 8th floor with unobstructed marina and Gulf views from both the living room and the master bedroom balcony.\n\nFinished to a specification that would satisfy the most discerning buyer: Italian marble throughout, Poggenpohl kitchen with Miele appliances, custom joinery and cabinetry, and floor-to-ceiling glazing on the marina side. Two en-suite bedrooms, a maid''s room, and a covered parking space. The Pearl offers a lifestyle unlike anywhere else in Qatar: a 350-berth marina, over 250 luxury retail outlets and restaurants, beach clubs, and a walkable community. Foreign nationals can own freehold. Qatar residency permit included with purchase. Title deed available immediately.',
  'Apartment', 2, 2800000, 'Doha', 'The Pearl', 'Furnished',
  ARRAY['Balcony','Sea view','Air conditioning','Elevator','Security','Doorman','Furnished','En-suite','Maid''s room'],
  ARRAY[
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'sale', 'qa', current_date
),

(
  'Corporate 3-bed apartment to rent, West Bay, Doha',
  E'A fully-furnished 3-bedroom apartment in a premium West Bay tower — Doha''s business and diplomatic district, home to the Qatar government ministries, international corporations, luxury hotels, and the most prestigious corporate addresses in the country. The apartment is on the 24th floor with unobstructed city and Gulf views.\n\nFeatures a large open-plan reception and dining room, a chef''s kitchen, three en-suite bedrooms including a master suite with a separate dressing room, and a maid''s room. The building has a rooftop pool and deck, a fully-equipped gym, a business centre, 24-hour concierge, and valet parking. Lease registered with Qatar Municipality. Available to corporate tenants, embassies, and senior executives. Cheque or bank transfer accepted. 12-month minimum.',
  'Apartment', 3, 16000, 'Doha', 'West Bay', 'Furnished',
  ARRAY['Pool','Gym','City view','Air conditioning','Elevator','Security','Doorman','Furnished','En-suite','Maid''s room'],
  ARRAY[
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'rent', 'qa', '2026-07-01'
),

(
  'Modern 2-bed apartment to rent, Lusail City',
  E'A brand-new 2-bedroom apartment in Lusail — Qatar''s most modern and ambitious urban district, developed from scratch to host the 2022 FIFA World Cup Final and now one of the most exciting places to live in the GCC. The apartment is in a newly-completed tower in the Waterfront District with views of the Lusail Marina.\n\nFeatures an open-plan kitchen and living area with premium finishes, two en-suite bedrooms, a covered parking space, and a balcony overlooking the marina promenade. The building has a temperature-controlled pool, a fully-equipped gym, a co-working space, 24-hour security, and a smart home system. Lusail''s retail boulevard, cinema, and beachfront are all within 10 minutes'' walk. Qatar Municipality lease registration included. 12-month minimum. Bills not included.',
  'Apartment', 2, 11000, 'Doha', 'Lusail', 'Part furnished',
  ARRAY['Pool','Gym','Balcony','City view','Air conditioning','Elevator','Security','En-suite'],
  ARRAY[
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'rent', 'qa', '2026-07-15'
),

(
  'Cosy 1-bed apartment to rent, Al Sadd, Doha',
  E'A well-maintained and practical 1-bedroom apartment in Al Sadd — one of Doha''s most established and central residential districts, with excellent transport links including the Doha Metro (Al Sadd station) and walkable access to supermarkets, hospitals, restaurants, and parks.\n\nThe apartment is on the 5th floor of a clean, well-managed building with elevator and covered parking. Open-plan kitchen and living area, a good-sized double bedroom with fitted wardrobes, and a modern bathroom. Al Sadd offers genuinely competitive rents by Doha standards — a fantastic location for those who want to be central without paying West Bay prices. Bills (KAHRAMAA) not included. Municipality lease registration provided. Available immediately. Monthly payment considered for 3-month stay.',
  'Apartment', 1, 7500, 'Doha', 'Al Sadd', 'Furnished',
  ARRAY['Parking','Air conditioning','Elevator','Security','Furnished','Near transport'],
  ARRAY[
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1449844908441-8d4832deb3c8?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'rent', 'qa', '2026-06-01'
),

(
  'Premium 4-bed villa for sale, Lusail',
  E'An exceptional 4-bedroom standalone villa in the prestigious Fox Hills district of Lusail — Qatar''s most modern city and the site of the 2022 World Cup Final. The villa is in a gated community with shared amenities including a community pool, gym, and children''s play areas, with 24-hour security.\n\nThe villa spans 450m² over two floors with a private garden, covered terrace, and parking for three vehicles. Ground floor: a grand entrance, formal majlis, family room, dining room, and a chef''s kitchen with island. First floor: four en-suite bedrooms including a master suite with walk-in wardrobe and private terrace. Maid''s and driver''s accommodation. Smart home automation system. Freehold title — foreign nationals can purchase. Qatar residency permit included. An outstanding opportunity in one of the Gulf''s most talked-about new developments.',
  'Villa', 4, 5500000, 'Doha', 'Lusail', 'Unfurnished',
  ARRAY['Pool','Garden','Parking','Air conditioning','Security','En-suite','Maid''s room','Driver''s room'],
  ARRAY[
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'sale', 'qa', current_date
),

-- ─────────────────────────────────────────────────────
-- 🇴🇲 OMAN (5 listings)
-- ─────────────────────────────────────────────────────

(
  'Golf-course 3-bed villa for sale, Muscat Hills (ITC Freehold)',
  E'A stunning 3-bedroom villa in the award-winning Muscat Hills Golf & Country Club — one of Oman''s most prestigious Integrated Tourism Complexes (ITCs) and one of the few properties in Oman where foreign nationals can purchase freehold with full legal title and an Omani residency permit.\n\nThe villa overlooks the 7th fairway of the Par 72 championship golf course and has a private garden with a plunge pool and covered terrace. Inside: a spacious open-plan living and dining area with vaulted ceilings, a fully-equipped kitchen, three en-suite bedrooms including a master suite with mountain and fairway views. The Muscat Hills development has a 5-star hotel, spa, a championship golf course, a swimming academy, and restaurants. 15 minutes from Muscat International Airport. Title deed ready for transfer. Residence permit included.',
  'Villa', 3, 280000, 'Muscat', 'Muscat Hills', 'Part furnished',
  ARRAY['Pool','Garden','Parking','Gym','Air conditioning','Security','En-suite'],
  ARRAY[
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1573408301185-9521eaa6d1f0?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1591382696684-38c427c7547a?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'sale', 'om', current_date
),

(
  'Beachside 2-bed apartment to rent, The Wave Muscat',
  E'A beautifully furnished 2-bedroom apartment at The Wave Muscat — Oman''s premier waterfront lifestyle development, designed around a private marina and direct access to a pristine white-sand beach on the Sea of Oman. The apartment is on the 4th floor of a low-rise building facing the marina and has a terrace with water views.\n\nOpen-plan kitchen and living room with quality Smeg appliances, two en-suite bedrooms, a study, and a covered terrace. The Wave has a marina, three beach clubs, golf course, retail village, international restaurants, a pharmacy, and a supermarket all within the complex. 15 minutes from Muscat International Airport and 20 minutes from the CBD. Available fully furnished. Suited to professionals, couples, or small families who want Muscat''s best lifestyle address.',
  'Apartment', 2, 800, 'Muscat', 'The Wave Muscat', 'Furnished',
  ARRAY['Pool','Balcony','Sea view','Air conditioning','Elevator','Security','Furnished','En-suite','Near beach'],
  ARRAY[
    'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'rent', 'om', '2026-07-01'
),

(
  'City-view 2-bed apartment to rent, Qurum, Muscat',
  E'A comfortable and well-located 2-bedroom apartment in Qurum — Muscat''s most established and popular expat neighbourhood, known for its walkable high street, Qurum Beach, and proximity to the city''s best schools, hospitals, and shopping centres including the well-known Qurum City Centre.\n\nThe apartment is on the 5th floor of a clean, well-managed building with elevator and covered parking. Features an open reception and dining area, a functional kitchen with full appliances, two double bedrooms, two bathrooms, and a balcony with partial sea views on clear days. 5 minutes to Qurum Beach (free public beach), 10 minutes to Muscat Grand Mall, and 15 minutes to the airport. Rental Dispute Committee contract available on request. Available immediately.',
  'Apartment', 2, 600, 'Muscat', 'Qurum', 'Part furnished',
  ARRAY['Parking','Balcony','Air conditioning','Elevator','Security','Near beach','Near school'],
  ARRAY[
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'rent', 'om', '2026-08-01'
),

(
  'Luxury 4-bed marina townhouse for sale, Al Mouj, Muscat (ITC Freehold)',
  E'An exceptional 4-bedroom marina-front townhouse at Al Mouj (The Wave Golf & Beach Resort) — one of Oman''s most exclusive ITCs and one of the rare places in the Sultanate where foreign nationals can purchase freehold with an included Omani residency permit.\n\nThe townhouse spans three floors with a ground-floor terrace directly overlooking the marina. Features an open-plan kitchen and living room on the ground floor, three en-suite bedrooms on the first floor, and a master suite with a private roof terrace and panoramic marina and sea views on the top floor. Private mooring available for purchase separately. The Al Mouj development has two golf courses, beach clubs, a boutique hotel, a retail village, and international restaurants. Under 20 minutes from Muscat International Airport. Title deed ready. An outstanding lifestyle and investment purchase.',
  'House', 4, 450000, 'Muscat', 'Al Mouj Marina', 'Unfurnished',
  ARRAY['Balcony','Sea view','Gym','Air conditioning','Security','En-suite'],
  ARRAY[
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1573408301185-9521eaa6d1f0?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'sale', 'om', current_date
),

(
  'Tropical 3-bed apartment to rent, Salalah',
  E'A spacious and well-appointed 3-bedroom apartment in Salalah — Oman''s second city and a destination unlike any other in the Gulf. Situated in the Dhofar region, Salalah experiences the khareef monsoon season (June–September), transforming the landscape into lush green hills and dramatic waterfalls — the reason Saudis, Emiratis, and Kuwaitis flock here every summer.\n\nThe apartment is on the 4th floor of a modern building near Al Hafah district, 10 minutes from Salalah Beach and 5 minutes from the souq. Open-plan living and dining room, a fitted kitchen with appliances, three double bedrooms, two bathrooms, and a covered balcony. The building has covered parking and 24-hour security. Available immediately. Particularly well-suited to khareef season tourism rental (June–August commands significant premium). Long-term lease also welcome.',
  'Apartment', 3, 450, 'Salalah', 'Al Hafah', 'Part furnished',
  ARRAY['Parking','Balcony','Air conditioning','Security','Near beach'],
  ARRAY[
    'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1449844908441-8d4832deb3c8?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'rent', 'om', '2026-06-01'
),

-- ─────────────────────────────────────────────────────
-- 🇯🇴 JORDAN (5 listings)
-- ─────────────────────────────────────────────────────

(
  'Executive 3-bed apartment to rent, Abdoun, Amman',
  E'A prestigious 3-bedroom apartment in Abdoun — Amman''s most exclusive residential neighbourhood, home to embassies, international organisations, the most upmarket restaurants in the city, and Jordan''s most desirable postal address. The apartment is on the 7th floor of a well-maintained building with panoramic views of western Amman.\n\nFeatures a formal reception room, a separate dining room, a fully-equipped kitchen, three double bedrooms (master en-suite with a walk-in wardrobe and dressing room), three bathrooms, and two covered balconies. The building has a concierge, covered parking for two vehicles, a gym, and 24-hour security. Well-suited to diplomatic families, senior UN or NGO professionals, or Jordanian executives. 12-month minimum lease. References required. Lease contract registered as per Jordanian law.',
  'Apartment', 3, 950, 'Amman', 'Abdoun', 'Furnished',
  ARRAY['Parking','Gym','Balcony','City view','Air conditioning','Elevator','Security','Furnished','En-suite'],
  ARRAY[
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'rent', 'jo', '2026-08-01'
),

(
  'Red Sea 2-bed apartment for sale, Aqaba — South Beach',
  E'A bright and attractive 2-bedroom apartment on Aqaba''s South Beach — Jordan''s only coastal city, a free economic zone with significant tax advantages, and the country''s emerging tourism and marine leisure destination. The apartment is on the 3rd floor of a beachside complex with pool access and sea views from the living room.\n\nThe South Beach area is where all the best beach clubs, dive centres, and resort hotels are concentrated — it''s the liveliest part of Aqaba and enjoys the best coral reef access in Jordan. The apartment is 80m² with an open-plan kitchen and living room, two bedrooms, two bathrooms, and a terrace. Foreign nationals can purchase property in Aqaba under the ASEZA (Aqaba Special Economic Zone Authority) rules — a more open framework than in mainland Jordan. Title deed clear. Strong AirBnB potential — tourism season runs October to May.',
  'Apartment', 2, 120000, 'Aqaba', 'South Beach', 'Part furnished',
  ARRAY['Pool','Balcony','Sea view','Air conditioning','Elevator','Security','Near beach'],
  ARRAY[
    'https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'sale', 'jo', current_date
),

(
  'Contemporary 2-bed apartment to rent, Sweifieh, Amman',
  E'A well-finished contemporary 2-bedroom apartment in Sweifieh — one of West Amman''s most vibrant and walkable neighbourhoods, known for its excellent restaurants, coffee shops, boutique retail, and lively street life. The apartment is on the 4th floor of a modern building completed in 2023.\n\nOpen-plan kitchen and living room with quality Turkish appliances and marble worktops, two double bedrooms, two bathrooms, and a covered balcony overlooking a tree-lined street. The building has covered parking, an elevator, and 24-hour security. Sweifieh is central to everything West Amman has to offer — 5 minutes from Taj Mall, 10 minutes from the third circle, and within walking distance of the best coffee in the city. Available to professionals, couples, or small families. 12-month lease. References required.',
  'Apartment', 2, 750, 'Amman', 'Sweifieh', 'Part furnished',
  ARRAY['Parking','Balcony','Air conditioning','Elevator','Security','Near transport'],
  ARRAY[
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1449844908441-8d4832deb3c8?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'rent', 'jo', '2026-07-01'
),

(
  'Luxury 4-bed villa with garden for sale, Dabouq, Amman',
  E'An exceptional 4-bedroom detached villa in Dabouq — West Amman''s most exclusive residential area, characterised by large plots, mature pine trees, clean air, and the closest thing in Jordan to a country estate within 25 minutes of the city centre. The villa sits on a 900m² plot with a terraced garden, a large covered entertaining terrace, and a private pool.\n\nInside: a grand entrance hall, a formal reception room with a marble fireplace, a family room, a chef''s kitchen with a large island and Miele appliances, and a guest suite on the ground floor. Upstairs: a master suite with a walk-in wardrobe, spa bathroom, and a private balcony with views of the Amman hills, plus three further en-suite bedrooms. Staff accommodation, triple garage, and solar panels. Dabouq is home to international schools (American Community School, Bishop''s School) and is the preferred address of the diplomatic community. Chain-free. Foreign buyers eligible under Jordanian investment residency rules.',
  'Villa', 4, 480000, 'Amman', 'Dabouq', 'Unfurnished',
  ARRAY['Pool','Garden','Parking','Air conditioning','Security','En-suite','Near school'],
  ARRAY[
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1591382696684-38c427c7547a?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'sale', 'jo', current_date
),

(
  '3-bed apartment to rent, University District, Irbid',
  E'A practical and well-located 3-bedroom apartment in Irbid''s University District — adjacent to Jordan University of Science and Technology (JUST) and Yarmouk University, making this one of Jordan''s most active rental markets for students, academics, and young professional families.\n\nThe apartment is on the 3rd floor of a clean, well-managed building. Open-plan kitchen and living room, three bedrooms, two bathrooms, and a balcony. The building has covered parking and an elevator. Irbid is Jordan''s second city and home to over 100,000 students — rental demand is robust year-round. The northern location also means easy access to Syria (when open), and to the Aqaba road south. Suited to student households (3 friends sharing), small families, or academic staff. 9 or 12-month lease available.',
  'Apartment', 3, 350, 'Irbid', 'University District', 'Part furnished',
  ARRAY['Parking','Balcony','Air conditioning','Elevator','Near school'],
  ARRAY[
    'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80'
  ],
  'active', '11111111-1111-1111-1111-111111111111', 'rent', 'jo', '2026-09-01'
);

-- ✅ Done — 50 listings inserted across 10 countries
-- Verify with: SELECT country, listing_type, count(*) FROM listings WHERE user_id = '11111111-1111-1111-1111-111111111111' GROUP BY 1,2 ORDER BY 1,2;
