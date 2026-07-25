<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class MediaUploadValidator
{
    public function validateStored(string $disk, string $path, string $type): array
    {
        $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        $size = Storage::disk($disk)->size($path);
        $mime = Storage::disk($disk)->mimeType($path) ?: 'application/octet-stream';

        if ($type === 'font') {
            if (! in_array($extension, ['woff', 'woff2'], true) || $size > 1024 * 1024) {
                throw ValidationException::withMessages(['path' => 'Font must be WOFF/WOFF2 and no larger than 1 MB.']);
            }

            $stream = Storage::disk($disk)->readStream($path);
            $signature = $stream ? fread($stream, 4) : false;
            if (is_resource($stream)) {
                fclose($stream);
            }

            if (! in_array($signature, ['wOFF', 'wOF2'], true)) {
                throw ValidationException::withMessages(['path' => 'Font signature is invalid.']);
            }

            app(MalwareScanner::class)->scan($disk, $path);

            return ['extension' => $extension, 'mime_type' => $extension === 'woff2' ? 'font/woff2' : 'font/woff', 'file_size' => $size];
        }

        $allowedMimes = ['image/jpeg' => ['jpg', 'jpeg'], 'image/png' => ['png'], 'image/webp' => ['webp']];
        if (! isset($allowedMimes[$mime]) || ! in_array($extension, $allowedMimes[$mime], true) || $size > 5 * 1024 * 1024) {
            throw ValidationException::withMessages(['path' => 'Image must be a valid JPG, PNG, or WebP no larger than 5 MB.']);
        }

        app(MalwareScanner::class)->scan($disk, $path);

        return ['extension' => $extension, 'mime_type' => $mime, 'file_size' => $size];
    }
}
