<?php

namespace App\Exceptions;

use RuntimeException;

class SagaPlatformException extends RuntimeException
{
    public function __construct(
        public readonly string $safeCode,
        public readonly int $httpStatus = 503,
        public readonly bool $retryable = false,
    ) {
        parent::__construct($safeCode);
    }
}
