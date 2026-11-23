<?php

namespace UpiGateways\Exceptions;

use Exception;

class UpiGatewaysException extends Exception {
    protected $errorCode;

    public function __construct(string $message = "", int $code = 0, ?string $errorCode = null, ?Exception $previous = null) {
        parent::__construct($message, $code, $previous);
        $this->errorCode = $errorCode;
    }

    public function getErrorCode(): ?string {
        return $this->errorCode;
    }
}
