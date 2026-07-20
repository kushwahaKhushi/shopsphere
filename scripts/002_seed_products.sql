-- =============================================================
-- ShopSphere  |  Migration 002 — Seed Products
-- Run once AFTER 001_initial_schema.sql
-- DO NOT re-run — duplicates will be ignored via ON CONFLICT
-- =============================================================

insert into public.products
  (id, name, category, subcategory, price, original_price, discount,
   rating, review_count, stock, brand, description, features, images, tags)
values

('p1','Samsung Galaxy S24 Ultra','Electronics','Smartphones',
 124999,134999,7, 4.5,2847,45,'Samsung',
 'The Samsung Galaxy S24 Ultra is the pinnacle of Samsung''s flagship lineup. With its stunning 6.8-inch Dynamic AMOLED display, 200MP camera system, and the powerful Snapdragon 8 Gen 3 processor, it redefines what a smartphone can do.',
 ARRAY['6.8-inch QHD+ Dynamic AMOLED 2X, 120Hz','200MP main + 12MP ultrawide + 10MP 3x + 50MP 5x telephoto','Snapdragon 8 Gen 3 for Galaxy','5000mAh battery with 45W fast charging','Integrated S Pen','IP68 water resistance'],
 ARRAY['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80','https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80'],
 ARRAY['smartphone','samsung','5g','flagship']),

('p2','Apple MacBook Air M3','Electronics','Laptops',
 114900,119900,4, 4.8,1523,20,'Apple',
 'The MacBook Air with M3 chip delivers exceptional performance in an incredibly thin and light design. With up to 18 hours of battery life and a gorgeous Liquid Retina display.',
 ARRAY['13.6-inch Liquid Retina display','Apple M3 chip with 8-core CPU','8GB unified memory, 256GB SSD','Up to 18 hours battery life','1080p FaceTime HD camera','MagSafe 3 charging'],
 ARRAY['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80','https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&q=80'],
 ARRAY['laptop','apple','macbook','m3']),

('p3','Sony WH-1000XM5 Headphones','Electronics','Audio',
 26990,34990,23, 4.7,4210,60,'Sony',
 'Industry-leading noise canceling with two processors and eight microphones. 30-hour battery life with quick charge. Exceptional call quality with Auto NC Optimizer.',
 ARRAY['Industry-leading noise cancellation','30-hour battery life','Quick charge: 3 min = 3 hours','Multipoint connection — 2 devices simultaneously','360 Reality Audio certified','Foldable design'],
 ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80','https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80'],
 ARRAY['headphones','sony','noise-cancelling','wireless']),

('p4','Nike Air Max 270','Fashion','Footwear',
 8995,12995,31, 4.3,876,100,'Nike',
 'The Nike Air Max 270 features Nike''s biggest heel Air unit yet for an incredibly cushioned feel. Inspired by two icons of big Air: the Air Max 180 and Air Max 93.',
 ARRAY['Mesh upper for breathability','270-degree Max Air unit in heel','Foam midsole for lightweight cushioning','Rubber outsole for traction','Padded collar for comfort'],
 ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80','https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80'],
 ARRAY['shoes','nike','airmax','running']),

('p5','Levi''s 511 Slim Fit Jeans','Fashion','Clothing',
 2499,3999,37, 4.2,3421,200,'Levi''s',
 'The Levi''s 511 Slim Fit Jeans are a modern classic. Cut close to the body from hip to ankle, they are versatile enough for work or weekend.',
 ARRAY['Slim fit from hip to ankle','Stretch denim for comfort','5-pocket styling','99% Cotton, 1% Elastane','Machine washable'],
 ARRAY['https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80','https://images.unsplash.com/photo-1604176424472-9d9944ec8d34?w=600&q=80'],
 ARRAY['jeans','levis','denim','slim-fit']),

('p6','Prestige 3 Litre Pressure Cooker','Home & Kitchen','Cookware',
 1299,1899,32, 4.4,6712,150,'Prestige',
 'Prestige Deluxe Alpha Outer Lid Pressure Cooker made of high-grade aluminium. The unique Tri-Vent pressure release system ensures safe cooking.',
 ARRAY['3-litre capacity','High-grade aluminium body','Tri-Vent pressure release system','Induction and gas compatible','ISI certified','2-year warranty'],
 ARRAY['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80','https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&q=80'],
 ARRAY['cooker','prestige','kitchen','cookware']),

('p7','boAt Rockerz 450 Bluetooth Headphones','Electronics','Audio',
 1299,3990,67, 4.1,18420,300,'boAt',
 'boAt Rockerz 450 is an on-ear wireless headphone with superior sound quality. With 15 hours of playback and a foldable design, perfect for everyday use.',
 ARRAY['40mm dynamic drivers','15 hours playback','Bluetooth 5.0','Built-in mic','Foldable design','USB Type-C charging'],
 ARRAY['https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80','https://images.unsplash.com/photo-1524678714210-9917a6c619c2?w=600&q=80'],
 ARRAY['headphones','boat','bluetooth','wireless']),

('p8','Canon EOS 1500D DSLR Camera','Electronics','Cameras',
 34990,44995,22, 4.5,2109,25,'Canon',
 'The Canon EOS 1500D is a great entry-level DSLR with a 24.1 MP APS-C CMOS sensor. Built-in Wi-Fi and NFC for easy sharing.',
 ARRAY['24.1 MP APS-C CMOS sensor','DIGIC 4+ image processor','9-point autofocus','Full HD 1080p video','Built-in Wi-Fi and NFC','Kit lens: EF-S 18-55mm'],
 ARRAY['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80','https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=80'],
 ARRAY['camera','canon','dslr','photography']),

('p9','Wipro 9W LED Bulb Pack of 6','Home & Kitchen','Lighting',
 349,599,42, 4.3,9834,500,'Wipro',
 'Wipro LED bulbs offer energy-efficient lighting with a lifespan of up to 15,000 hours. 9W equivalent of a 60W incandescent bulb, saving up to 85% energy.',
 ARRAY['9W = 60W equivalent','850 lumens brightness','Cool white 6500K','15,000 hours lifespan','B22 base','BEE 5-star rated'],
 ARRAY['https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&q=80','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'],
 ARRAY['led','bulb','wipro','lighting']),

('p10','Fastrack Casual Watch for Men','Fashion','Watches',
 1795,2995,40, 4.0,1243,80,'Fastrack',
 'Fastrack casual watch with a round dial, stainless steel case, and durable silicon strap. Perfect for everyday casual wear.',
 ARRAY['Quartz movement','44mm stainless steel case','Silicon strap','Scratch-resistant mineral glass','Water resistant 30m','3 ATM'],
 ARRAY['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80','https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=600&q=80'],
 ARRAY['watch','fastrack','casual','men']),

('p11','Xiaomi Smart TV 5A 43 inch','Electronics','Televisions',
 24999,32999,24, 4.2,5671,35,'Xiaomi',
 'Xiaomi Smart TV 5A features a 43-inch full HD display with Dolby Audio and DTS:X. Powered by Android TV 11 with access to Netflix, Prime Video, Disney+ Hotstar.',
 ARRAY['43-inch Full HD (1920x1080)','Android TV 11','Dolby Audio + DTS:X','2GB RAM + 8GB storage','3x HDMI, 2x USB','Bluetooth 5.0 + Wi-Fi'],
 ARRAY['https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&q=80','https://images.unsplash.com/photo-1461151304267-38535e780c79?w=600&q=80'],
 ARRAY['tv','xiaomi','smart-tv','android']),

('p12','Wildcraft 45L Rucksack Backpack','Sports & Outdoors','Bags',
 2299,3999,43, 4.1,789,120,'Wildcraft',
 'The Wildcraft 45L Rucksack is built for adventurers who demand performance. Multiple compartments, padded back panel, and rain cover included.',
 ARRAY['45-litre capacity','Polyester 600D fabric','Padded back panel and shoulder straps','Multiple compartments','Side hydration pocket','Rain cover included'],
 ARRAY['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80','https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&q=80'],
 ARRAY['backpack','wildcraft','trekking','travel'])

on conflict (id) do nothing;
