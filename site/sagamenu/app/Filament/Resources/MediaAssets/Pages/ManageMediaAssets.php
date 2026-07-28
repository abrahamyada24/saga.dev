<?php

namespace App\Filament\Resources\MediaAssets\Pages;

use App\Filament\Resources\MediaAssets\MediaAssetResource;
use App\Services\MediaUploadValidator;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageMediaAssets extends ManageRecords
{
    protected static string $resource = MediaAssetResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make()->label('Upload media')->slideOver()->mutateDataUsing(function (array $data): array {
                $path = (string) $data['path'];
                $validated = app(MediaUploadValidator::class)->validateStored('public', $path, $data['type']);

                $data['organization_id'] = auth()->user()->currentOrganization()?->id;
                $data['uploaded_by_user_id'] = auth()->id();
                $data['disk'] = 'public';
                $data['original_name'] = basename($path);
                $data['extension'] = $validated['extension'];
                $data['mime_type'] = $validated['mime_type'];
                $data['file_size'] = $validated['file_size'];
                if ($data['type'] === 'video') {
                    $data['metadata'] = [
                        'source' => 'media_library',
                        'processing_status' => config('sagamenu.media.video_processing_required', true)
                            ? 'pending_processing'
                            : 'ready',
                    ];
                }

                return $data;
            }),
        ];
    }
}
