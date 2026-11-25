<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreBookRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'program_id' => 'required|exists:programs,id',
            'subject_id' => 'required|exists:course_subjects,id',
            'title' => 'required|string|max:300',
            'isbn' => 'nullable|string|max:20',
            'publication_year' => 'required|integer',
            'publisher' => 'required|string|max:150',
            'total_copies' => 'required|integer|min:1',
            'availability_status' => 'required|string',
        ];
    }
}
