<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSupportContactRequest;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SupportContactController extends Controller
{
    public function index(Request $request): Response
    {
        $userId = $request->user()->id;
        $tab = $request->query('tab', 'compose');

        if ($tab === 'inbox' || $request->has('mark_read')) {
            Message::where('recipient_id', $userId)
                ->where('is_read', false)
                ->update(['is_read' => true]);
        }

        $allUsers = User::select('id', 'name', 'full_name', 'email', 'role')
            ->orderBy('name')
            ->get();

        $inboxMessages = Message::with(['sender:id,name,full_name,email,role'])
            ->where('recipient_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        $unreadCount = Message::where('recipient_id', $userId)
            ->where('is_read', false)
            ->count();

        return Inertia::render('Support/Contact', [
            'allUsers' => $allUsers,
            'inboxMessages' => $inboxMessages,
            'unreadCount' => $unreadCount,
            'initialTab' => $tab,
        ]);
    }

    public function store(StoreSupportContactRequest $request)
    {
        $validated = $request->validated();

        $validUsers = User::whereIn('email', $validated['recipients'])->get();

        if ($validUsers->count() < count($validated['recipients'])) {
            $existingEmails = $validUsers->pluck('email')->all();
            $invalid = array_values(array_diff($validated['recipients'], $existingEmails));

            return back()->withErrors([
                'recipients' => 'The following users do not exist: ' . implode(', ', $invalid),
            ]);
        }

        $attachmentName = null;
        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            $attachmentName = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $file->getClientOriginalName());
            $file->storeAs('contacts', $attachmentName, 'public');
        }

        $senderId = $request->user()->id;

        foreach ($validUsers as $recipient) {
            Message::create([
                'sender_id' => $senderId,
                'recipient_id' => $recipient->id,
                'subject' => $validated['subject'],
                'message' => $validated['message'],
                'attachment' => $attachmentName,
                'is_read' => false,
            ]);
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Message sent successfully!',
        ]);

        return back()->with('success', 'Your message has been delivered to the recipient\'s inbox.');
    }

    public function markRead(Request $request)
    {
        $query = Message::where('recipient_id', $request->user()->id)
            ->where('is_read', false);

        if ($request->filled('message_id')) {
            $query->where('id', $request->integer('message_id'));
        }

        $query->update(['is_read' => true]);

        if ($request->wantsJson() && ! $request->header('X-Inertia')) {
            return response()->json(['status' => 'ok']);
        }

        return back();
    }

    public function download(Message $message, Request $request)
    {
        $userId = $request->user()->id;

        if ($userId !== $message->sender_id && $userId !== $message->recipient_id) {
            abort(403, 'Unauthorized access to message attachment.');
        }

        if (!$message->attachment) {
            abort(404, 'No attachment on this message.');
        }

        $path = storage_path('app/public/contacts/' . $message->attachment);

        if (!file_exists($path)) {
            // Also check alternate path
            $altPath = storage_path('app/contacts/' . $message->attachment);
            if (file_exists($altPath)) {
                $path = $altPath;
            } else {
                abort(404, 'Attachment file not found on server.');
            }
        }

        return response()->download($path);
    }
}
