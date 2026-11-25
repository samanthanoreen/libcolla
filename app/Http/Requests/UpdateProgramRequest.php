<?php

namespace App\Http\Requests;

class UpdateProgramRequest extends StoreProgramRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return (bool) $this->user()?->can_edit;
    }

    /**
     * Handle a failed authorization attempt.
     */
    protected function failedAuthorization(): void
    {
        abort(403, 'Unauthorized. Missing Edit permission.');
    }
}
