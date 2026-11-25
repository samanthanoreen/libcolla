<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateBookLibraryRequest extends FormRequest
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

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:300'],
            'call_no' => ['required', 'string', 'max:50'],
            'author' => ['required', 'string', 'max:100'],
            'year' => ['required', 'integer', 'min:1000', 'max:'.(date('Y') + 1)],
            'copies' => ['required', 'integer', 'min:1'],
        ];
    }
}
