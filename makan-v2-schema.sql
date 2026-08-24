-- ############################################################
-- ##  DEMO DATA — LOCAL USE ONLY. DO NOT RUN IN PRODUCTION. ##
-- ############################################################
--
-- Every row below is invented. The properties do not exist, and the copy
-- carries fabricated financial claims: "90%+ occupancy in high season on
-- Airbnb", "12-15% rental yield projected", "6.1% gross yield", "motivated
-- seller", "Currently generating 60-80k MAD/mo as a guesthouse".
--
-- Published to a real user those would be a misleading commercial practice
-- under the Consumer Protection from Unfair Trading Regulations, and the
-- liability sits with the publisher.
--
-- Production is clean as of 24 Aug 2026 (/makan/rooms/ returns 0 rooms).
-- Keep it that way. If you need data for screenshots, run this against a
-- local Supabase instance and label every row visibly as a sample.
--

-- MAKAN v2 schema additions — run in Supabase SQL Editor
ALTER TABLE listings ADD COLUMN IF NOT EXISTS size_sqm integer;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS video_url text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS floor_plan_url text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS highlights text[];
ALTER TABLE listings ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0;

-- Seed highlights + sizes for the 50 demo listings
UPDATE listings SET size_sqm = 85,  highlights = ARRAY['Floor-to-ceiling windows with Docklands views','24-hour concierge & residents gym','2 min walk to Elizabeth & Jubilee line'] WHERE title ILIKE '%Canary Wharf%';
UPDATE listings SET size_sqm = 52,  highlights = ARRAY['Original exposed brick & steel factory windows','Loft-style 3.5m ceilings throughout','Direct tram access to New Street station'] WHERE title ILIKE '%Jewellery Quarter%';
UPDATE listings SET size_sqm = 48,  highlights = ARRAY['520 sq ft mezzanine layout — feels nothing like a studio','Smeg appliances & Juliet balcony','Steps from Deansgate-Castlefield tram'] WHERE title ILIKE '%Spinningfields%';
UPDATE listings SET size_sqm = 102, highlights = ARRAY['Chain-free in one of Notts best postcodes','Southwest-facing landscaped garden','Top-rated schools within walking distance'] WHERE title ILIKE '%West Bridgford%';
UPDATE listings SET size_sqm = 148, highlights = ARRAY['Recently renovated open-plan kitchen with bi-fold doors','Master with en-suite & walk-in wardrobe','Ofsted-rated schools & 10 min to city centre'] WHERE title ILIKE '%Chapel Allerton%';

UPDATE listings SET size_sqm = 280, highlights = ARRAY['12m internal courtyard with original mosaic fountain','Rooftop with Atlas Mountain panorama & plunge pool','Currently generating 60–80k MAD/mo as a guesthouse'] WHERE title ILIKE '%Medina%' AND country='ma';
UPDATE listings SET size_sqm = 95,  highlights = ARRAY['7th floor with covered balcony in Casablancas top district','Italian appliances & optional unfurnished at 7,500 MAD','Walking distance to Corniche & Maarif'] WHERE title ILIKE '%Gauthier%';
UPDATE listings SET size_sqm = 320, highlights = ARRAY['900m² hillside plot with unobstructed Strait of Gibraltar view','Heated pool & direct view of the Spanish coast','8 min from city centre & Tanger-Med port'] WHERE title ILIKE '%Montagne%';
UPDATE listings SET size_sqm = 68,  highlights = ARRAY['Diplomatic district — tramway at the door','Quiet tree-lined street close to AUC','Available 6-month lease considered'] WHERE title ILIKE '%Agdal%';
UPDATE listings SET size_sqm = 78,  highlights = ARRAY['200m from the beach inside secured residence','90%+ occupancy in high season on Airbnb','Sold with existing rental management contract'] WHERE title ILIKE '%Agadir%';

UPDATE listings SET size_sqm = 500, highlights = ARRAY['Inside Katameya Heights — Egypts most exclusive compound','Private pool on 500m² plot with golf course access','Rare opportunity at this price — motivated seller'] WHERE title ILIKE '%Katameya%';
UPDATE listings SET size_sqm = 180, highlights = ARRAY['8th floor with direct Nile views from balcony','Original parquet floors & high ceilings — classic Zamalek','Last genuinely maintained classic building on the island'] WHERE title ILIKE '%Zamalek%';
UPDATE listings SET size_sqm = 145, highlights = ARRAY['10th floor directly on Stanley Corniche — 2 min to beach','Full renovation with Italian marble & Miele appliances','Summer rental demand is exceptional here'] WHERE title ILIKE '%Stanley%';
UPDATE listings SET size_sqm = 220, highlights = ARRAY['Leafy Maadi street — preferred by Cairo expat community','Within French & German school catchment areas','Private garage + storage included'] WHERE title ILIKE '%Maadi%';
UPDATE listings SET size_sqm = 110, highlights = ARRAY['Brand-new stock in Egypts flagship urban development','10% down — 7-year payment plan available','12–15% rental yield projected as city fills'] WHERE title ILIKE '%Administrative Capital%';

UPDATE listings SET size_sqm = 105, highlights = ARRAY['High-floor marina view — chiller-free building','Designer-fitted interior with custom Italian kitchen','Walk to tram, metro & Dubai Marina Mall'] WHERE title ILIKE '%Dubai Marina%';
UPDATE listings SET size_sqm = 83,  highlights = ARRAY['Direct Burj Khalifa & Dubai Fountain view','Currently tenanted at AED 110k pa — 6.1% gross yield','Golden Visa eligible — freehold for all nationalities'] WHERE title ILIKE '%Downtown Dubai%';
UPDATE listings SET size_sqm = 620, highlights = ARRAY['20m of private beach on the Palm frond','Temperature-controlled infinity pool with Gulf views','One of only 18 of this villa type on the frond'] WHERE title ILIKE '%Palm Jumeirah%';
UPDATE listings SET size_sqm = 195, highlights = ARRAY['Louvre Abu Dhabi & Guggenheim on the doorstep','Private beach access & boutique hotel amenities','ADIB mortgage pre-approval available'] WHERE title ILIKE '%Saadiyat%';
UPDATE listings SET size_sqm = 112, highlights = ARRAY['12th floor lagoon view — Sharjah at a fraction of Dubai prices','Chiller-free building — significant saving','15 min from Dubai by car'] WHERE title ILIKE '%Al Majaz%';

UPDATE listings SET size_sqm = 185, highlights = ARRAY['Premium Al Olaya compound — full resort amenities','10 min from Kingdom Tower & KAFD','Available to families & senior executives — 12-month lease'] WHERE title ILIKE '%Al Olaya%';
UPDATE listings SET size_sqm = 680, highlights = ARRAY['700m² plot with heated private pool in prime Al Rawdah','Solar panels + smart home — motivated seller','Title deed clear, no mortgage'] WHERE title ILIKE '%Al Rawdah%';
UPDATE listings SET size_sqm = 650, highlights = ARRAY['Diplomatic Quarter — Riyadhs most prestigious address','Compound access: country club, 2 pools, tennis','Maintenance, garden & pool service all included'] WHERE title ILIKE '%Diplomatic Quarter%';
UPDATE listings SET size_sqm = 98,  highlights = ARRAY['Near Aramco HQ in Dhahran — strong corporate demand','5th floor with city view balcony','Available immediately — Ejar registration provided'] WHERE title ILIKE '%Khobar%';
UPDATE listings SET size_sqm = 460, highlights = ARRAY['Full-floor 32nd floor penthouse — 270° Red Sea panorama','Private lift from basement & 120m² wraparound terrace','Motivated seller — genuine enquiries only'] WHERE title ILIKE '%Al Hamra%';

UPDATE listings SET size_sqm = 165, highlights = ARRAY['Arabian Gulf views from 15th floor in top Salmiya tower','Walking distance to The Avenues & Marina Crescent','Rent includes building maintenance'] WHERE title ILIKE '%Salmiya%' AND bedrooms=3;
UPDATE listings SET size_sqm = 110, highlights = ARRAY['Excellent value in well-connected Hawalli','Clean building with backup generator','Short-term 3-month lease considered'] WHERE title ILIKE '%Hawalli%';
UPDATE listings SET size_sqm = 420, highlights = ARRAY['450m² walled plot in family-friendly Fintas coastal area','Ground floor maid''s room included','15 min south of Kuwait City'] WHERE title ILIKE '%Fintas%';
UPDATE listings SET size_sqm = 72,  highlights = ARRAY['Waterfront Marina Crescent — Salmiyahs best address','Rooftop pool & gym in building','Monthly payment accepted'] WHERE title ILIKE '%Marina Crescent%';
UPDATE listings SET size_sqm = 580, highlights = ARRAY['Fully renovated 2025 — furnished to high spec','Large diwaniya on ground floor','Walking distance to Rumaithiyas main shopping street'] WHERE title ILIKE '%Rumaithiya%';

UPDATE listings SET size_sqm = 120, highlights = ARRAY['Seef commercial district — best transport links in Bahrain','Recently refurbished with quality finishes throughout','No property tax — one of Gulf''s most tenant-friendly markets'] WHERE title ILIKE '%Seef%';
UPDATE listings SET size_sqm = 310, highlights = ARRAY['15m of direct water frontage with private pontoon','Freehold — open to all nationalities + residence visa','No property tax, no capital gains tax, no inheritance tax'] WHERE title ILIKE '%Amwaj%';
UPDATE listings SET size_sqm = 88,  highlights = ARRAY['18th floor with city & sea views','3 min walk to Bahrain Financial Harbour','Corporate accounts: monthly or quarterly payments accepted'] WHERE title ILIKE '%Diplomatic Area%';
UPDATE listings SET size_sqm = 420, highlights = ARRAY['450m² plot — excellent schools within catchment','British School of Bahrain & Indian School nearby','Freehold title open to all nationalities'] WHERE title ILIKE '%Riffa%';
UPDATE listings SET size_sqm = 105, highlights = ARRAY['5 min from Bahrain International Airport','Authentic Muharraq old town on the doorstep','6-month lease considered'] WHERE title ILIKE '%Muharraq%';

UPDATE listings SET size_sqm = 195, highlights = ARRAY['Porto Arabia waterfront — highest price-per-sqft in Qatar','Poggenpohl kitchen with Miele appliances throughout','Qatar residency permit included with purchase'] WHERE title ILIKE '%Pearl%' AND country='qa';
UPDATE listings SET size_sqm = 240, highlights = ARRAY['24th floor — city & Gulf views in both directions','Business centre, valet & 24-hr concierge included','Open to embassies & corporate tenants'] WHERE title ILIKE '%West Bay%';
UPDATE listings SET size_sqm = 118, highlights = ARRAY['Brand-new tower in Lusail Waterfront District','Smart home system & co-working space in building','10 min walk to Lusail retail boulevard & cinema'] WHERE title ILIKE '%Lusail%' AND listing_type='rent';
UPDATE listings SET size_sqm = 74,  highlights = ARRAY['Doha Metro Al Sadd station — walkable','Central location at a fraction of West Bay prices','Monthly payment considered for 3-month stays'] WHERE title ILIKE '%Al Sadd%';
UPDATE listings SET size_sqm = 450, highlights = ARRAY['Fox Hills gated community — site of 2022 World Cup Final','Freehold for all nationalities + Qatar residency permit','Smart home automation & maid''s accommodation'] WHERE title ILIKE '%Lusail%' AND listing_type='sale';

UPDATE listings SET size_sqm = 280, highlights = ARRAY['Par 72 championship golf course fairway view','One of few ITCs in Oman with freehold foreign ownership','Residence permit + 5-star hotel amenities on site'] WHERE title ILIKE '%Muscat Hills%';
UPDATE listings SET size_sqm = 130, highlights = ARRAY['Marina-front in Oman''s most prestigious ITC','Private beach access & three beach clubs on site','15 min from Muscat Airport'] WHERE title ILIKE '%Wave Muscat%';
UPDATE listings SET size_sqm = 115, highlights = ARRAY['Qurum Beach 5 min walk — free public beach','10 min to Muscat Grand Mall','Rental Dispute Committee contract available'] WHERE title ILIKE '%Qurum%';
UPDATE listings SET size_sqm = 410, highlights = ARRAY['Three-floor marina townhouse with private mooring option','Freehold + Omani residence permit included','Two championship golf courses on site'] WHERE title ILIKE '%Al Mouj%';
UPDATE listings SET size_sqm = 165, highlights = ARRAY['Salalah transforms to lush green hills in khareef season','Premium short-let rates June–August — strong ROI','10 min from Salalah Beach & the souq'] WHERE title ILIKE '%Salalah%';

UPDATE listings SET size_sqm = 195, highlights = ARRAY['Amman''s most prestigious address — diplomatic & UN community','7th floor with panoramic west Amman views','Concierge, gym & 2 covered parking spaces'] WHERE title ILIKE '%Abdoun%';
UPDATE listings SET size_sqm = 80,  highlights = ARRAY['ASEZA free zone — more open foreign ownership rules','Strong Airbnb potential — tourism season Oct–May','200m from Red Sea dive sites & beach clubs'] WHERE title ILIKE '%Aqaba%';
UPDATE listings SET size_sqm = 105, highlights = ARRAY['Vibrant Sweifieh — best cafes & restaurants in West Amman','Modern build 2023 — quality Turkish appliances','5 min from Taj Mall & third circle'] WHERE title ILIKE '%Sweifieh%';
UPDATE listings SET size_sqm = 820, highlights = ARRAY['900m² plot with terraced garden & private pool','International schools: American & Bishop''s within 5 min','Preferred address of Amman''s diplomatic community'] WHERE title ILIKE '%Dabouq%';
UPDATE listings SET size_sqm = 135, highlights = ARRAY['Adjacent to JUST & Yarmouk University — year-round demand','9 or 12-month lease available','Easy access to Syria border & south Jordan'] WHERE title ILIKE '%Irbid%';

-- Verify
SELECT title, size_sqm, highlights[1] AS headline FROM listings
WHERE user_id = '11111111-1111-1111-1111-111111111111'
ORDER BY country, city;
