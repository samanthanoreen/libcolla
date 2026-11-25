<?php

namespace App\Http\Middleware;

use App\Models\Message;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'notifications' => function () use ($request) {
                $user = $request->user();

                if (! $user) {
                    return [
                        'unreadCount' => 0,
                        'items' => [],
                    ];
                }

                $recipientMessages = Message::query()
                    ->where('recipient_id', $user->id);

                return [
                    'unreadCount' => (clone $recipientMessages)
                        ->where('is_read', false)
                        ->count(),
                    'items' => (clone $recipientMessages)
                        ->with(['sender:id,name,full_name,email,role'])
                        ->latest()
                        ->orderByDesc('id')
                        ->limit(8)
                        ->get()
                        ->map(function (Message $message) {
                            $isPermissionRequest = str_starts_with((string) $message->subject, 'Permission Request:');

                            return [
                                'id' => $message->id,
                                'subject' => $message->subject,
                                'message' => $message->message,
                                'is_read' => (bool) $message->is_read,
                                'created_at' => $message->created_at?->diffForHumans(),
                                'sender_id' => $message->sender_id,
                                'sender_name' => $message->sender?->full_name ?: $message->sender?->name ?: 'System',
                                'sender_role' => $message->sender?->role,
                                'is_permission_request' => $isPermissionRequest,
                                'href' => $isPermissionRequest
                                    ? ($message->sender_id ? "/users?edit={$message->sender_id}" : '/users')
                                    : '/support/contact?tab=inbox',
                            ];
                        })
                        ->values()
                        ->all(),
                ];
            },
            'flash' => [
                'status' => fn () => $request->session()->get('status'),
                'toast' => fn () => $request->session()->get('toast'),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
