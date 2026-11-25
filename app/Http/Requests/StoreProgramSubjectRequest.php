<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProgramSubjectRequest extends FormRequest
{
    private const SECTIONS = [
        'FIRST YEAR — 1st Semester',
        'FIRST YEAR — 2nd Semester',
        'SECOND YEAR — 1st Semester',
        'SECOND YEAR — 2nd Semester',
        'THIRD YEAR — 1st Semester',
        'THIRD YEAR — 2nd Semester',
        'THIRD YEAR — Summer',
        'FOURTH YEAR — 1st Semester',
        'FOURTH YEAR — 2nd Semester',
    ];

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return (bool) $this->user()?->can_add;
    }

    /**
     * Handle a failed authorization attempt.
     */
    protected function failedAuthorization(): void
    {
        abort(403, 'Unauthorized. Missing Add permission.');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'year_semester' => ['required', Rule::in(self::SECTIONS)],
            'subject_code' => ['required', 'string', 'max:50'],
            'subject_title' => ['required', 'string', 'max:200'],
            'lec_hours' => ['nullable', 'integer', 'min:0', 'max:9'],
            'lab_hours' => ['nullable', 'integer', 'min:0', 'max:9'],
            'credit_units' => ['required', 'numeric', 'min:0', 'max:9'],
            'pre_requisite' => ['nullable', 'string', 'max:255'],
        ];
    }
}
