# Изображения Choco Dips

Все 12 исходных фотографических иллюстраций созданы встроенным инструментом `image_gen`, без API-ключа и без сторонних стоковых URL. Изображение сайта, приложенное пользователем, использовано как визуальный референс для первого кадра. Это иллюстрации атмосферы; они не подтверждают реальный вид помещения, гостей или блюд кофейни.

Исходники сохранены инструментом в `C:/Users/Mizau/.codex/generated_images/01a1a710-4d0d-74c0-9221-08c28327c824/`. Все используемые сайтом файлы скопированы в `public/images/` и перекодированы в JPEG. Исходные PNG сохранены. Подложки для отсутствующих фото блюд — локальные JPEG с градиентом `#4A2A1B → #2B1810`.

Ниже приведены итоговые промпты.

## hero-1.jpg

Use case: photorealistic-natural. Create ONE wide 3:2 editorial food photograph for a coffee shop website hero. The attached website is a visual reference ONLY. Recreate the photograph at its top, without any website UI or text: dark grey-blue ceramic large plate occupying right 65% with folded chocolate crepes covered in white and milk chocolate marbled glaze, chopped hazelnuts, a brownie on top. Warm moody cafe interior with vase of muted pink flowers far left. Left 35% is dark, soft blurred negative space for live website text. Side lighting, realistic textures, rich dark cocoa, warm caramel, appetizing editorial photography. Full bleed photograph, no border, NO letters, no words, no logo, no watermark, no collage, no website layout.

## cat-coffee.jpg / hero-2.jpg

Use case: photorealistic-natural. Asset: coffee. Square 1:1 editorial photograph, overhead view of a ceramic cappuccino cup with a detailed heart of latte art, warm caramel crema, cream ceramic saucer on dark walnut table, soft late afternoon natural light, tactile realistic foam. Premium cozy coffee shop style, rich warm browns, no text, no logo, no UI.

## cat-breakfast.jpg / hero-3.jpg

Use case: photorealistic-natural. Asset: breakfast. Square 1:1 editorial food photograph for warm premium cafe: open sourdough toast with fried egg, pink shrimp, avocado and red cherry tomatoes, fresh microgreens, on a dark grey-blue ceramic plate. Shot at 45 degrees, warm sunlight, shallow depth of field, rich natural appetizing textures, no text, no UI, no logos.

## cat-desserts.jpg

Use case: photorealistic-natural. Asset: desserts. Square 1:1 editorial food photograph of one elegant slice of dark chocolate layer cake with shiny chocolate ganache, a few slender chocolate sticks on top, on a dark grey ceramic plate, warm moody cafe light, natural realistic texture, rich chocolate and caramel browns, no text, no logo, no UI.

## cat-main.jpg

Use case: photorealistic-natural. Asset: main. Square 1:1 editorial food photograph of a large rustic bruschetta covered with fresh green salad leaves, shaved parmesan, cherry tomatoes, grilled vegetables and olive oil, on cream ceramic plate, dark warm cafe table, softly lit natural photo, rich earth tones, no text, no logo, no UI.

## seasonal-apple.jpg

Use case: photorealistic-natural. Wide 3:2 premium cafe editorial photograph. A faceted cut-glass tumbler filled with a dark apple blackcurrant tea with thick chocolate-brown foamy cap, topped with dried rose petals and berries. Glass on RIGHT HALF of frame on dark wood table, warm golden cafe bokeh in background, left third dark negative space. Very realistic glass reflections and foam texture. No letters, no text, no logos, no UI.

## about-interior.jpg

Use case: photorealistic-natural. Wide 3:2 realistic editorial interior photograph of a cozy premium coffee shop in Nalchik: dark walnut round tables, caramel brown leather chairs, tall large windows at right with bright late afternoon sunlight and patterned shadows. Small glass vase with muted pink flowers on foreground table left. Warm chocolate brown cream palette, intimate elegant lived-in cafe. No people, no letters, no UI, no watermark.

## gallery-1.jpg

Use case: photorealistic-natural. Square 1:1 candid editorial lifestyle cafe photograph, young adult dark-haired woman seated at a table enjoying a beef burger held in both hands, deep red berry drink beside her, warm sunlit cafe, natural unposed mood, brown and caramel palette, realistic proportions and hands. No text, no logo, no UI.

## gallery-2.jpg

Use case: photorealistic-natural. Square 1:1 appetizing editorial food photograph, small dark ceramic bowl with warm baked apple crumble, thick caramel sauce and generous cloud of whipped vanilla cream dusted in cocoa. Warm cafe table, dark chocolate and golden brown palette, shallow depth of field, natural realistic texture. No text, no logos, no UI.

## gallery-3.jpg

Use case: photorealistic-natural. Square 1:1 editorial architecture photograph of cozy cafe entrance, dark framed glass door with elegant small cream serif lettering 'dips' and tiny orange 'CHOCO' above, plants in terracotta pots near door, golden evening light reflecting in glass, walnut and warm brown palette, inviting and authentic. Only lettering is 'dips' and 'CHOCO', no website interface.

## gallery-4.jpg

Use case: photorealistic-natural. Square 1:1 overhead editorial cafe photograph, two takeaway cups with heart shaped latte art in rich caramel crema and warm orange paper sleeves, small simple cream serif 'dips' lettering on sleeves, cream tray on walnut cafe table. Warm sunlight, natural realistic texture, premium cozy coffee shop. No website UI, no other text.

## gallery-5.jpg

Use case: photorealistic-natural. Square 1:1 candid editorial lifestyle cafe photograph, stylish young adult woman in black sunglasses and cream blouse with small dark polka dots, seated at a cafe table enjoying a small chocolate dessert with a spoon, a tray with coffee and small desserts on table, warm golden daylight, chocolate cream and caramel palette, realistic hands, natural photography. No text, no logos, no UI.

## Переиспользование

`menu/shrimp-toast.jpg` использует фотографию категории завтраков. `menu/choco-crepes.jpg` и `menu/breakfast-crepes.jpg` используют первый герой. `menu/apple-crumble.jpg` использует второй кадр галереи. У остальных 16 блюд оставлены согласованные градиентные подложки. `og-cover.jpg` — техническая версия первого героя размером 1200×630; для предпросмотра ссылок сайт использует брендированное изображение, формируемое `src/app/opengraph-image.tsx`.
