-- ============================================================
-- MAKAN: Area-accurate price corrections
-- Run this AFTER makan-seed.sql
-- ============================================================

-- 🇬🇧 UNITED KINGDOM
-- Canary Wharf E14: 2-bed furnished ~£3,200/mo (premium tower, concierge)
UPDATE listings SET price = 3200 WHERE title ILIKE '%Canary Wharf%';

-- Jewellery Quarter B1: 1-bed converted warehouse ~£975/mo
UPDATE listings SET price = 975 WHERE title ILIKE '%Jewellery Quarter%';

-- Spinningfields M3: studio ~£1,150/mo (Manchester's most expensive district)
UPDATE listings SET price = 1150 WHERE title ILIKE '%Spinningfields%';

-- West Bridgford NG2: 3-bed semi ~£315,000 (one of Notts most sought after)
UPDATE listings SET price = 315000 WHERE title ILIKE '%West Bridgford%';

-- Chapel Allerton LS7: 4-bed detached ~£490,000
UPDATE listings SET price = 490000 WHERE title ILIKE '%Chapel Allerton%';

-- 🇲🇦 MOROCCO
-- Marrakech Medina riad 4-bed sale: ~3,900,000 MAD (restored riads command premium)
UPDATE listings SET price = 3900000 WHERE title ILIKE '%Medina%' AND country = 'ma';

-- Casablanca Gauthier 2-bed rent: ~14,000 MAD/mo (Gauthier = premium Casablanca)
UPDATE listings SET price = 14000 WHERE title ILIKE '%Gauthier%';

-- Tangier La Montagne 3-bed villa: ~5,500,000 MAD (sea views = premium)
UPDATE listings SET price = 5500000 WHERE title ILIKE '%Montagne%';

-- Rabat Agdal 1-bed rent: ~7,000 MAD/mo (diplomatic district)
UPDATE listings SET price = 7000 WHERE title ILIKE '%Agdal%';

-- Agadir tourist zone 2-bed sale: ~1,600,000 MAD
UPDATE listings SET price = 1600000 WHERE title ILIKE '%Agadir%';

-- 🇪🇬 EGYPT
-- Katameya Heights villa sale: ~24,000,000 EGP (post-devaluation prices)
UPDATE listings SET price = 24000000 WHERE title ILIKE '%Katameya%';

-- Zamalek 2-bed rent: ~50,000 EGP/mo (Zamalek = Cairo's most expensive island)
UPDATE listings SET price = 50000 WHERE title ILIKE '%Zamalek%';

-- Alexandria Stanley 3-bed sale: ~12,500,000 EGP (sea-front commands 40% premium)
UPDATE listings SET price = 12500000 WHERE title ILIKE '%Stanley%';

-- Maadi 3-bed rent: ~42,000 EGP/mo (expat favourite, corporate rental demand)
UPDATE listings SET price = 42000 WHERE title ILIKE '%Maadi%';

-- New Administrative Capital 2-bed sale: ~5,800,000 EGP
UPDATE listings SET price = 5800000 WHERE title ILIKE '%Administrative Capital%';

-- 🇦🇪 UAE
-- Dubai Marina 2-bed rent: ~15,000 AED/mo (chiller-free, marina view premium)
UPDATE listings SET price = 15000 WHERE title ILIKE '%Dubai Marina%';

-- Downtown Dubai 1-bed sale: ~2,200,000 AED (Burj Khalifa view adds 25-30%)
UPDATE listings SET price = 2200000 WHERE title ILIKE '%Downtown Dubai%';

-- Palm Jumeirah 4-bed villa sale: ~19,500,000 AED (frond villa, private beach)
UPDATE listings SET price = 19500000 WHERE title ILIKE '%Palm Jumeirah%';

-- Saadiyat Island Abu Dhabi 3-bed sale: ~5,800,000 AED (cultural district premium)
UPDATE listings SET price = 5800000 WHERE title ILIKE '%Saadiyat%';

-- Sharjah Al Majaz 2-bed rent: ~4,800 AED/mo (good value vs Dubai, lagoon view)
UPDATE listings SET price = 4800 WHERE title ILIKE '%Al Majaz%';

-- 🇸🇦 SAUDI ARABIA
-- Riyadh Al Olaya compound 3-bed rent: ~16,000 SAR/mo (KAFD area compound)
UPDATE listings SET price = 16000 WHERE title ILIKE '%Al Olaya%';

-- Jeddah Al Rawdah 4-bed villa sale: ~4,500,000 SAR (established prime area)
UPDATE listings SET price = 4500000 WHERE title ILIKE '%Al Rawdah%';

-- Riyadh Diplomatic Quarter 5-bed villa rent: ~32,000 SAR/mo
UPDATE listings SET price = 32000 WHERE title ILIKE '%Diplomatic Quarter%';

-- Al Khobar 2-bed rent: ~5,500 SAR/mo (near Aramco, strong demand)
UPDATE listings SET price = 5500 WHERE title ILIKE '%Al Khobar%' OR title ILIKE '%Khobar%';

-- Jeddah Al Hamra penthouse sale: ~3,800,000 SAR (32nd floor, 460m², Red Sea view)
UPDATE listings SET price = 3800000 WHERE title ILIKE '%Al Hamra%';

-- 🇰🇼 KUWAIT
-- Salmiya Marina 3-bed rent: ~750 KWD/mo (sea view premium)
UPDATE listings SET price = 750 WHERE title ILIKE '%Salmiya%' AND bedrooms = 3;

-- Hawalli 2-bed rent: ~350 KWD/mo (affordable, well-connected)
UPDATE listings SET price = 350 WHERE title ILIKE '%Hawalli%';

-- Fintas 4-bed villa rent: ~1,100 KWD/mo (coastal, family area)
UPDATE listings SET price = 1100 WHERE title ILIKE '%Fintas%';

-- Marina Crescent 1-bed rent: ~550 KWD/mo (premium waterfront address)
UPDATE listings SET price = 550 WHERE title ILIKE '%Marina Crescent%';

-- Rumaithiya 5-bed villa rent: ~1,400 KWD/mo (Kuwaiti family neighbourhood)
UPDATE listings SET price = 1400 WHERE title ILIKE '%Rumaithiya%';

-- 🇧🇭 BAHRAIN
-- Seef 2-bed rent: ~550 BHD/mo (commercial district, solid demand)
UPDATE listings SET price = 550 WHERE title ILIKE '%Seef%';

-- Amwaj Islands 3-bed villa sale: ~290,000 BHD (waterfront freehold)
UPDATE listings SET price = 290000 WHERE title ILIKE '%Amwaj%';

-- Diplomatic Area 1-bed rent: ~650 BHD/mo (BFH, financial district premium)
UPDATE listings SET price = 650 WHERE title ILIKE '%Diplomatic Area%';

-- Riffa 4-bed villa sale: ~160,000 BHD (established family area)
UPDATE listings SET price = 160000 WHERE title ILIKE '%Riffa%';

-- Muharraq 2-bed rent: ~260 BHD/mo (old town, affordable)
UPDATE listings SET price = 260 WHERE title ILIKE '%Muharraq%';

-- 🇶🇦 QATAR
-- The Pearl 2-bed sale: ~3,400,000 QAR (Porto Arabia waterfront = highest $/sqft in Qatar)
UPDATE listings SET price = 3400000 WHERE title ILIKE '%Pearl Qatar%' OR title ILIKE '%Pearl%' AND country = 'qa';

-- West Bay 3-bed rent: ~19,000 QAR/mo (corporate/diplomatic, high demand)
UPDATE listings SET price = 19000 WHERE title ILIKE '%West Bay%';

-- Lusail 2-bed rent: ~9,500 QAR/mo (brand new stock, competitive)
UPDATE listings SET price = 9500 WHERE title ILIKE '%Lusail%' AND listing_type = 'rent' AND bedrooms = 2;

-- Al Sadd 1-bed rent: ~5,800 QAR/mo (central but not premium)
UPDATE listings SET price = 5800 WHERE title ILIKE '%Al Sadd%';

-- Lusail 4-bed villa sale: ~6,800,000 QAR (Fox Hills, gated)
UPDATE listings SET price = 6800000 WHERE title ILIKE '%Lusail%' AND listing_type = 'sale';

-- 🇴🇲 OMAN
-- Muscat Hills villa sale: ~340,000 OMR (golf course ITC, freehold, residency)
UPDATE listings SET price = 340000 WHERE title ILIKE '%Muscat Hills%';

-- The Wave 2-bed rent: ~950 OMR/mo (marina front, Oman's most premium ITC)
UPDATE listings SET price = 950 WHERE title ILIKE '%Wave Muscat%';

-- Qurum 2-bed rent: ~480 OMR/mo (established expat area, good value)
UPDATE listings SET price = 480 WHERE title ILIKE '%Qurum%';

-- Al Mouj marina townhouse sale: ~560,000 OMR (3 floors, marina frontage, residency)
UPDATE listings SET price = 560000 WHERE title ILIKE '%Al Mouj%';

-- Salalah 3-bed rent: ~300 OMR/mo (secondary city, khareef season demand)
UPDATE listings SET price = 300 WHERE title ILIKE '%Salalah%';

-- 🇯🇴 JORDAN
-- Abdoun 3-bed rent: ~1,300 JOD/mo (Amman's most exclusive address, diplomatic demand)
UPDATE listings SET price = 1300 WHERE title ILIKE '%Abdoun%';

-- Aqaba South Beach 2-bed sale: ~88,000 JOD (ASEZA free zone, AirBnB potential)
UPDATE listings SET price = 88000 WHERE title ILIKE '%Aqaba%';

-- Sweifieh 2-bed rent: ~600 JOD/mo (West Amman hub, good demand)
UPDATE listings SET price = 600 WHERE title ILIKE '%Sweifieh%';

-- Dabouq 4-bed villa sale: ~540,000 JOD (Amman's most exclusive villa area)
UPDATE listings SET price = 540000 WHERE title ILIKE '%Dabouq%';

-- Irbid University District 3-bed rent: ~275 JOD/mo (student city, affordable)
UPDATE listings SET price = 275 WHERE title ILIKE '%Irbid%';

-- ✅ Verify all prices updated:
SELECT title, city, area, listing_type, price, country
FROM listings
WHERE user_id = '11111111-1111-1111-1111-111111111111'
ORDER BY country, listing_type;
