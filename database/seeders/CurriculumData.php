<?php

namespace Database\Seeders;

/**
 * Reads the CIC prospectus data (BSIT-BTM, BSIT-IS, BSCS, BLIS) and the dummy
 * library books from database/seeders/data/*.json, so every seeder works
 * from the same source.
 */
final class CurriculumData
{
    /** @return array<int, array<string, mixed>> */
    public static function programs(): array
    {
        return self::read('curricula.json')['programs'];
    }

    /** @return array<int, array<string, mixed>> */
    public static function books(): array
    {
        return self::read('dummy_books.json')['books'];
    }

    /** semester_offered value used across the app, derived from the section label. */
    public static function semesterOffered(string $section): string
    {
        return match (true) {
            str_contains($section, 'Summer') => 'Summer',
            str_contains($section, '2nd Semester') => '2nd Semester',
            default => '1st Semester',
        };
    }

    /** @return array<string, mixed> */
    private static function read(string $file): array
    {
        return json_decode(
            file_get_contents(database_path('seeders/data/'.$file)),
            true,
            512,
            JSON_THROW_ON_ERROR,
        );
    }
}
