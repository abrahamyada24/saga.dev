<?php

namespace Database\Seeders;

use App\Models\Catalog;
use App\Models\Collection;
use App\Models\Inclusion;
use App\Models\Location;
use App\Models\MediaAsset;
use App\Models\Offering;
use App\Models\OfferingMedia;
use App\Models\OptionGroup;
use App\Models\Organization;
use App\Models\QrRoute;
use App\Models\Subscription;
use App\Models\User;
use App\Models\VariantGroup;
use App\Services\Publishing\CatalogPublisher;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DemoCoffeeMenuSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::query()->create([
            'name' => 'SagaDev Admin',
            'email' => 'admin@sagamenu.local',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'global_role' => 'sagadev_admin',
            'is_active' => true,
        ]);

        $owner = User::query()->create([
            'name' => 'Saga Coffee Owner',
            'email' => 'owner@sagamenu.local',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'global_role' => 'owner',
            'is_active' => true,
        ]);

        $organization = Organization::query()->create([
            'name' => 'Saga Coffee Demo',
            'slug' => 'saga-coffee',
            'business_type' => 'fnb',
            'status' => 'active',
            'onboarding_status' => 'complete',
            'pilot_status' => 'approved',
            'attention_status' => 'clear',
            'pilot_started_at' => now(),
            'pilot_approved_at' => now(),
            'plan_key' => 'pro',
            'locale' => 'id',
            'currency' => 'IDR',
            'contact_name' => 'Andreas',
            'contact_email' => 'hello@sagacoffee.local',
            'contact_phone' => '+6281234567890',
            'address' => 'Madiun, Jawa Timur',
            'settings' => ['onboarding_status' => 'pilot_ready'],
        ]);

        $organization->users()->attach($admin->id, ['role' => 'owner', 'status' => 'active', 'is_primary' => true, 'accepted_at' => now()]);
        $organization->users()->attach($owner->id, ['role' => 'owner', 'status' => 'active', 'is_primary' => true, 'accepted_at' => now()]);

        $location = Location::query()->create([
            'organization_id' => $organization->id,
            'name' => 'Saga Coffee Madiun',
            'slug' => 'madiun',
            'address' => 'Jl. Pahlawan, Madiun, Jawa Timur',
            'maps_url' => 'https://maps.google.com/?q=Madiun',
            'phone' => '+6281234567890',
            'is_default' => true,
            'opening_hours' => ['daily' => '08:00-22:00'],
        ]);

        $catalog = Catalog::query()->create([
            'organization_id' => $organization->id,
            'location_id' => $location->id,
            'name' => 'Main Menu',
            'slug' => 'main-menu',
            'vertical' => 'fnb',
            'status' => 'draft',
            'store_display_enabled' => true,
            'mobile_catalog_enabled' => true,
            'default_view_mode' => 'photo',
            'hero_title' => 'Saga Coffee',
            'hero_subtitle' => 'Kopi pilihan, comfort food, dan seasonal menu untuk waktu santai di Madiun.',
            'seo_title' => 'Saga Coffee Menu',
            'seo_description' => 'Lihat signature coffee, non-coffee, makanan, snack, dan paket terbaru Saga Coffee.',
            'appearance' => [
                'preset' => 'editorial_kv',
                'primary_color' => '#236354',
                'accent_color' => '#cbf45a',
                'paper_color' => '#f3f5f1',
                'heading_font' => 'Plus Jakarta Sans',
                'body_font' => 'Plus Jakarta Sans',
                'density' => 'comfortable',
                'mobile_layout' => 'editorial_list',
                'store_layout' => 'editorial_grid',
            ],
            'business_info' => [
                'address' => $location->address,
                'hours' => 'Setiap hari, 08.00-22.00 WIB',
                'phone' => $location->phone,
                'maps_url' => $location->maps_url,
                'instagram' => '@sagacoffee.demo',
            ],
            'settings' => ['privacy_notice_enabled' => true],
        ]);

        $collections = collect(['Signature', 'Coffee', 'Non-Coffee', 'Food', 'Snacks', 'Promo & Bundle'])
            ->mapWithKeys(function (string $name, int $index) use ($organization, $catalog): array {
                $collection = Collection::query()->create([
                    'organization_id' => $organization->id,
                    'catalog_id' => $catalog->id,
                    'name' => $name,
                    'slug' => Str::slug($name),
                    'description' => $this->collectionDescription($name),
                    'is_visible' => true,
                    'sort_order' => $index + 1,
                ]);

                return [$name => $collection];
            });

        $milkOptions = OptionGroup::query()->create([
            'organization_id' => $organization->id,
            'name' => 'Pilihan Susu',
            'description' => 'Tersedia sebagai informasi opsi penyajian.',
            'sort_order' => 1,
        ]);
        $milkOptions->values()->createMany([
            ['name' => 'Fresh Milk', 'price_delta_minor' => 0, 'sort_order' => 1],
            ['name' => 'Oat Milk', 'price_delta_minor' => 7000, 'sort_order' => 2],
            ['name' => 'Soy Milk', 'price_delta_minor' => 5000, 'sort_order' => 3],
        ]);

        $extraOptions = OptionGroup::query()->create([
            'organization_id' => $organization->id,
            'name' => 'Tambahan',
            'description' => 'Tambahan tersedia; konfirmasi kepada staf saat berkunjung.',
            'sort_order' => 2,
        ]);
        $extraOptions->values()->createMany([
            ['name' => 'Extra Shot', 'price_delta_minor' => 8000, 'sort_order' => 1],
            ['name' => 'Vanilla Syrup', 'price_delta_minor' => 5000, 'sort_order' => 2],
            ['name' => 'Caramel Syrup', 'price_delta_minor' => 5000, 'sort_order' => 3],
        ]);

        $items = [
            ['Signature', 'Iced Aren Latte', 28000, ['Best Seller'], true, 'Espresso, susu, dan gula aren dengan rasa karamel yang lembut.'],
            ['Signature', 'Saga Cream Coffee', 32000, ['Signature'], true, 'Cold coffee dengan house cream yang ringan dan silky.'],
            ['Signature', 'Espresso Tonic', 30000, ['New'], true, 'Espresso bright dengan tonic dan citrus finish.'],
            ['Signature', 'Caramel Cloud Macchiato', 34000, ['Seasonal'], false, 'Kopi karamel berlapis dengan cloud foam.'],
            ['Coffee', 'Americano', 22000, [], false, 'Espresso bersih dengan pilihan hot atau iced.'],
            ['Coffee', 'Cafe Latte', 27000, [], false, 'Kopi susu klasik dengan tekstur lembut.'],
            ['Coffee', 'Cappuccino', 27000, [], false, 'Espresso, steamed milk, dan foam yang seimbang.'],
            ['Coffee', 'Manual Brew V60', 35000, ['Recommended'], false, 'Single origin pilihan dengan profil rasa mingguan.'],
            ['Non-Coffee', 'Matcha Cream', 30000, ['Best Seller'], true, 'Matcha earthy dengan susu dan cream lembut.'],
            ['Non-Coffee', 'Chocolate Signature', 29000, [], false, 'Cokelat kaya rasa, tersedia hot atau iced.'],
            ['Non-Coffee', 'Lychee Tea', 24000, [], false, 'Teh ringan dengan aroma leci yang segar.'],
            ['Non-Coffee', 'Strawberry Yakult', 27000, ['New'], false, 'Minuman yogurt strawberry yang bright.'],
            ['Food', 'Chicken Mentai Rice', 42000, ['Best Seller'], true, 'Rice bowl ayam dengan saus mentai gurih.'],
            ['Food', 'Beef Blackpepper Rice', 45000, [], false, 'Rice bowl sapi dengan blackpepper sauce.'],
            ['Food', 'Truffle Egg Toast', 38000, ['Recommended'], false, 'Toast, scrambled egg, dan aroma truffle.'],
            ['Food', 'Spaghetti Aglio Olio', 39000, ['Spicy'], false, 'Pasta bawang putih, chili, dan herbs.'],
            ['Snacks', 'Butter Croissant', 26000, [], false, 'Croissant butter berlapis dengan bagian luar renyah.'],
            ['Snacks', 'French Fries', 24000, [], false, 'Kentang goreng renyah untuk sharing.'],
            ['Snacks', 'Chicken Popcorn', 28000, ['Sold Out'], false, 'Ayam crispy bite-size dengan dipping sauce.'],
            ['Snacks', 'Cinnamon Roll', 28000, ['Limited'], false, 'Soft roll dengan cinnamon glaze.'],
            ['Promo & Bundle', 'Coffee Date Bundle', 59000, ['Promo'], true, 'Dua minuman dan satu snack untuk sharing.'],
            ['Promo & Bundle', 'Work From Cafe Set', 65000, ['Promo'], false, 'Kopi, rice bowl, dan mineral water.'],
            ['Promo & Bundle', 'Morning Starter', 45000, ['Promo'], false, 'Americano dan butter croissant.'],
            ['Promo & Bundle', 'Non-Coffee Duo', 52000, ['Promo'], false, 'Dua pilihan minuman non-coffee favorit.'],
        ];

        $images = [
            'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=82',
            'https://images.unsplash.com/photo-1512568400610-62da28bc8a13?auto=format&fit=crop&w=1200&q=82',
            'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=82',
            'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1200&q=82',
            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=82',
            'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=82',
        ];

        foreach ($items as $index => [$collectionName, $name, $price, $badges, $featured, $description]) {
            $isSoldOut = in_array('Sold Out', $badges, true);
            $offering = Offering::query()->create([
                'organization_id' => $organization->id,
                'catalog_id' => $catalog->id,
                'primary_collection_id' => $collections[$collectionName]->id,
                'name' => $name,
                'slug' => Str::slug($name),
                'short_description' => $description,
                'full_description' => $description.' Dibuat untuk menampilkan detail rasa, pilihan penyajian, dan informasi penting sebelum customer datang ke outlet.',
                'price_type' => 'fixed',
                'price_min_minor' => $price,
                'currency' => 'IDR',
                'original_price_minor' => str_contains($collectionName, 'Promo') ? $price + 10000 : null,
                'promo_price_minor' => str_contains($collectionName, 'Promo') ? $price : null,
                'promo_label' => str_contains($collectionName, 'Promo') ? 'Harga paket' : null,
                'promo_terms' => str_contains($collectionName, 'Promo') ? 'Tersedia selama persediaan masih ada.' : null,
                'availability' => $isSoldOut ? 'sold_out' : 'available',
                'visibility' => 'both',
                'badges' => array_values(array_filter($badges, fn ($badge) => $badge !== 'Sold Out')),
                'tags' => [$collectionName, $featured ? 'featured' : 'regular'],
                'ingredients' => in_array($collectionName, ['Signature', 'Coffee', 'Non-Coffee'], true) ? 'Minuman dibuat fresh saat disajikan.' : null,
                'allergens' => in_array($collectionName, ['Signature', 'Coffee', 'Non-Coffee'], true) ? ['Susu'] : [],
                'caffeine_level' => in_array($collectionName, ['Signature', 'Coffee'], true) ? 'medium' : null,
                'serving_note' => in_array($collectionName, ['Signature', 'Coffee', 'Non-Coffee'], true) ? 'Tersedia hot atau iced pada menu tertentu.' : 'Silakan tanyakan detail bahan kepada staf.',
                'external_action_label' => 'Tanya Staf',
                'external_action_url' => 'https://example.com/info/'.Str::slug($name),
                'is_featured' => $featured,
                'sort_order' => $index + 1,
                'metadata' => ['demo' => true],
            ]);

            $collections[$collectionName]->offerings()->attach($offering->id, ['sort_order' => $index + 1]);

            $media = MediaAsset::query()->create([
                'organization_id' => $organization->id,
                'type' => 'image',
                'disk' => 'public',
                'path' => $images[$index % count($images)],
                'original_name' => Str::slug($name).'.jpg',
                'mime_type' => 'image/jpeg',
                'extension' => 'jpg',
                'file_size' => 0,
                'width' => 1200,
                'height' => 900,
                'alt_text' => $name,
                'metadata' => ['focal_x' => 50, 'focal_y' => 50],
            ]);

            OfferingMedia::query()->create([
                'organization_id' => $organization->id,
                'offering_id' => $offering->id,
                'media_asset_id' => $media->id,
                'role' => 'primary_image',
                'sort_order' => 1,
                'is_active' => true,
            ]);

            if (in_array($collectionName, ['Signature', 'Coffee', 'Non-Coffee'], true)) {
                $offering->optionGroups()->attach([
                    $milkOptions->id => ['sort_order' => 1],
                    $extraOptions->id => ['sort_order' => 2],
                ]);

                $temperature = VariantGroup::query()->create(['offering_id' => $offering->id, 'name' => 'Penyajian', 'sort_order' => 1]);
                $temperature->values()->createMany([
                    ['name' => 'Hot', 'price_minor' => $price, 'sort_order' => 1],
                    ['name' => 'Iced', 'price_minor' => $price, 'sort_order' => 2],
                ]);
            }

            if (str_contains($collectionName, 'Promo')) {
                Inclusion::query()->insert([
                    ['offering_id' => $offering->id, 'name' => 'Pilihan minuman', 'sort_order' => 1, 'created_at' => now(), 'updated_at' => now()],
                    ['offering_id' => $offering->id, 'name' => 'Menu pendamping', 'sort_order' => 2, 'created_at' => now(), 'updated_at' => now()],
                ]);
            }
        }

        Subscription::query()->create([
            'organization_id' => $organization->id,
            'plan_key' => 'pro',
            'status' => 'trialing',
            'starts_at' => now(),
            'ends_at' => now()->addDays(30),
            'entitlements' => ['catalogs' => 3, 'custom_font' => true, 'analytics' => true],
        ]);

        QrRoute::query()->create([
            'organization_id' => $organization->id,
            'catalog_id' => $catalog->id,
            'code' => 'saga-coffee-main',
            'label' => 'Counter Utama',
            'source_key' => 'counter-main',
            'destination_surface' => 'mobile',
            'status' => 'active',
        ]);

        app(CatalogPublisher::class)->publish($catalog, $admin, 'Initial demo publish');
    }

    private function collectionDescription(string $name): string
    {
        return match ($name) {
            'Signature' => 'Racikan khas Saga Coffee.',
            'Coffee' => 'Espresso-based dan manual brew.',
            'Non-Coffee' => 'Pilihan segar tanpa espresso.',
            'Food' => 'Comfort food untuk makan santai.',
            'Snacks' => 'Camilan ringan untuk sharing.',
            default => 'Paket pilihan dengan harga khusus.',
        };
    }
}
