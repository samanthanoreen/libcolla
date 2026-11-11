import React, { useState, useEffect, useRef } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import {
    CheckCircle2,
    Download,
    FileSpreadsheet,
    FileText,
    Image as ImageIcon,
    Inbox,
    Mail,
    Paperclip,
    PenSquare,
    RotateCcw,
    Send,
    Trash2,
    TriangleAlert,
    User as UserIcon,
    X,
} from 'lucide-react';

export default function Contact({
    allUsers = [],
    inboxMessages = [],
    unreadCount = 0,
    initialTab = 'compose',
}) {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [recipients, setRecipients] = useState([]);
    const [recipientInput, setRecipientInput] = useState('');
    const [recipientError, setRecipientError] = useState('');
    const [attachmentError, setAttachmentError] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [successSent, setSuccessSent] = useState(false);
    const [localUnread, setLocalUnread] = useState(unreadCount);

    const fileInputRef = useRef(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        subject: '',
        message: '',
        recipients: [],
        attachment: null,
    });

    // Sync recipients state with Inertia form data
    useEffect(() => {
        setData('recipients', recipients);
    }, [recipients]);

    // Handle switching to inbox & marking as read
    const handleSwitchTab = (tab) => {
        setActiveTab(tab);
        if (tab === 'inbox' && localUnread > 0) {
            router.post(
                '/support/contact/mark-read',
                {},
                {
                    preserveScroll: true,
                    preserveState: true,
                    onSuccess: () => setLocalUnread(0),
                }
            );
        }
    };

    // Add recipient chip
    const addRecipient = (emailToAdd) => {
        const email = (emailToAdd || recipientInput).trim().toLowerCase();
        if (!email) return;

        // Simple email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setRecipientError('Please enter a valid email address.');
            return;
        }

        // Check if user exists in allUsers
        const userExists = allUsers.some(
            (u) => u.email.toLowerCase() === email
        );
        if (!userExists) {
            setRecipientError(`No user found with email "${email}".`);
            return;
        }

        if (recipients.includes(email)) {
            setRecipientError('This recipient is already added.');
            setRecipientInput('');
            return;
        }

        setRecipients([...recipients, email]);
        setRecipientInput('');
        setRecipientError('');
        clearErrors('recipients');
    };

    // Remove recipient chip
    const removeRecipient = (indexToRemove) => {
        setRecipients(recipients.filter((_, idx) => idx !== indexToRemove));
    };

    // Handle keydown in recipient input
    const handleRecipientKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addRecipient();
        } else if (e.key === 'Backspace' && !recipientInput && recipients.length > 0) {
            removeRecipient(recipients.length - 1);
        }
    };

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const maxSize = 5 * 1024 * 1024; // 5 MB
        const allowedExtensions = ['pdf', 'png', 'jpg', 'jpeg', 'doc', 'docx', 'xlsx'];
        const ext = file.name.split('.').pop().toLowerCase();

        if (file.size > maxSize) {
            setAttachmentError('File size exceeds the 5 MB limit.');
            clearAttachment();
            return;
        }

        if (!allowedExtensions.includes(ext)) {
            setAttachmentError('Allowed file types: PDF, PNG, JPG, JPEG, DOC, DOCX, XLSX.');
            clearAttachment();
            return;
        }

        setAttachmentError('');
        setSelectedFile(file);
        setData('attachment', file);
    };

    const clearAttachment = () => {
        setSelectedFile(null);
        setData('attachment', null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const getFileIcon = (fileName) => {
        const ext = fileName?.split('.').pop()?.toLowerCase();
        if (['jpg', 'jpeg', 'png'].includes(ext)) {
            return <ImageIcon className="size-4 text-blue-500" />;
        }
        if (['xlsx', 'xls', 'csv'].includes(ext)) {
            return <FileSpreadsheet className="size-4 text-emerald-600" />;
        }
        return <FileText className="size-4 text-rose-500" />;
    };

    // Form submit
    const handleSubmit = (e) => {
        e.preventDefault();

        if (recipients.length === 0) {
            setRecipientError('Please add at least one recipient.');
            return;
        }

        post('/support/contact', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setSuccessSent(true);
                setRecipients([]);
                setRecipientInput('');
                clearAttachment();
                reset('subject', 'message');
            },
        });
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            <Head title="Support - Message Center" />

            {/* Header Banner */}
            <div className="flex justify-between items-center bg-slate-800 p-6 rounded-2xl text-white border border-white/10 shadow-sm">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <span className="text-[#c8102e]">✉️</span> Message Center
                    </h2>
                    <p className="text-white/70 mt-1 text-sm">
                        Send direct messages to library staff or view received messages
                    </p>
                </div>
                <div className="flex gap-2 text-right">
                    <div className="bg-white/10 px-4 py-2 rounded-xl text-center">
                        <div className="text-xs text-white/60">Unread</div>
                        <div className="text-2xl font-bold text-[#fca5a5]">
                            {localUnread}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Message Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Tabs Switcher */}
                <div className="flex border-b border-slate-200 bg-slate-50">
                    <button
                        type="button"
                        onClick={() => handleSwitchTab('compose')}
                        className={`flex-1 py-4 font-semibold text-sm transition-colors border-b-2 flex items-center justify-center gap-2 ${
                            activeTab === 'compose'
                                ? 'border-[#c8102e] text-[#c8102e] bg-white'
                                : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <PenSquare className="size-4" /> Compose Message
                    </button>
                    <button
                        type="button"
                        onClick={() => handleSwitchTab('inbox')}
                        className={`flex-1 py-4 font-semibold text-sm transition-colors border-b-2 flex items-center justify-center gap-2 ${
                            activeTab === 'inbox'
                                ? 'border-[#c8102e] text-[#c8102e] bg-white'
                                : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <Inbox className="size-4" /> Inbox
                        {localUnread > 0 && (
                            <span className="bg-[#c8102e] text-white text-xs px-2 py-0.5 rounded-full font-bold ml-1">
                                {localUnread}
                            </span>
                        )}
                    </button>
                </div>

                <div className="p-8">
                    {/* COMPOSE TAB */}
                    {activeTab === 'compose' && (
                        <div>
                            {successSent ? (
                                <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-2xl text-center space-y-3">
                                    <CheckCircle2 className="size-14 text-emerald-500 mx-auto" />
                                    <h3 className="text-xl font-bold text-emerald-900">
                                        Message Sent Successfully!
                                    </h3>
                                    <p className="text-sm text-emerald-700 max-w-md mx-auto">
                                        Your message has been delivered to the recipient's inbox in the system.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setSuccessSent(false)}
                                        className="mt-4 inline-flex items-center gap-2 bg-[#c8102e] text-white font-medium px-5 py-2.5 rounded-xl hover:bg-red-800 transition"
                                    >
                                        <RotateCcw className="size-4" /> Send Another Message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Datalist for autocomplete */}
                                    <datalist id="system-user-emails">
                                        {allUsers.map((u) => (
                                            <option key={u.id} value={u.email}>
                                                {u.full_name || u.name} ({u.role || 'staff'})
                                            </option>
                                        ))}
                                    </datalist>

                                    {/* Recipients field with chips */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            To: Recipients
                                        </label>
                                        <div
                                            className={`flex flex-wrap items-center gap-2 p-3 border rounded-xl bg-white min-h-[48px] cursor-text focus-within:border-[#c8102e] ${
                                                recipientError || errors.recipients
                                                    ? 'border-red-500 bg-red-50/20'
                                                    : 'border-slate-300'
                                            }`}
                                        >
                                            <span className="text-slate-400 font-medium text-sm select-none">
                                                To:
                                            </span>
                                            {recipients.map((email, idx) => (
                                                <span
                                                    key={idx}
                                                    className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-300 rounded-full px-3 py-1 text-xs font-medium text-slate-700"
                                                >
                                                    <UserIcon className="size-3 text-slate-400" />
                                                    {email}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeRecipient(idx)}
                                                        className="text-slate-400 hover:text-red-500 font-bold"
                                                    >
                                                        <X className="size-3" />
                                                    </button>
                                                </span>
                                            ))}
                                            <input
                                                type="text"
                                                list="system-user-emails"
                                                placeholder={
                                                    recipients.length === 0
                                                        ? 'Search user email and press Enter...'
                                                        : 'Add another...'
                                                }
                                                value={recipientInput}
                                                onChange={(e) => {
                                                    setRecipientInput(e.target.value);
                                                    setRecipientError('');
                                                }}
                                                onKeyDown={handleRecipientKeyDown}
                                                onBlur={() => {
                                                    if (recipientInput) addRecipient();
                                                }}
                                                className="flex-1 min-w-[200px] border-none outline-none text-sm text-slate-800 bg-transparent"
                                            />
                                        </div>
                                        {recipientError && (
                                            <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                                                <TriangleAlert className="size-3" /> {recipientError}
                                            </p>
                                        )}
                                        {errors.recipients && (
                                            <p className="text-red-500 text-xs mt-1.5">
                                                {errors.recipients}
                                            </p>
                                        )}
                                    </div>

                                    {/* Subject */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Subject
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter message subject..."
                                            value={data.subject}
                                            onChange={(e) => setData('subject', e.target.value)}
                                            className={`w-full border rounded-xl p-3 text-sm text-slate-800 outline-none focus:border-[#c8102e] ${
                                                errors.subject ? 'border-red-500 bg-red-50/20' : 'border-slate-300'
                                            }`}
                                            required
                                        />
                                        {errors.subject && (
                                            <p className="text-red-500 text-xs mt-1.5">{errors.subject}</p>
                                        )}
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Message
                                        </label>
                                        <textarea
                                            rows="7"
                                            placeholder="Write your message here..."
                                            value={data.message}
                                            onChange={(e) => setData('message', e.target.value)}
                                            className={`w-full border rounded-xl p-3 text-sm text-slate-800 outline-none focus:border-[#c8102e] leading-relaxed ${
                                                errors.message ? 'border-red-500 bg-red-50/20' : 'border-slate-300'
                                            }`}
                                            required
                                        />
                                        {errors.message && (
                                            <p className="text-red-500 text-xs mt-1.5">{errors.message}</p>
                                        )}
                                    </div>

                                    {/* Attachment */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Attachment (Optional)
                                        </label>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                onChange={handleFileChange}
                                                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xlsx"
                                                className="hidden"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="inline-flex items-center gap-2 border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-medium transition"
                                            >
                                                <Paperclip className="size-4" /> Choose File
                                            </button>

                                            {selectedFile ? (
                                                <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700">
                                                    {getFileIcon(selectedFile.name)}
                                                    <span>{selectedFile.name}</span>
                                                    <span className="text-slate-400">
                                                        ({(selectedFile.size / 1024).toFixed(1)} KB)
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={clearAttachment}
                                                        className="text-slate-400 hover:text-red-500"
                                                    >
                                                        <X className="size-3.5" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-400">
                                                    Max 5 MB (PDF, PNG, JPG, DOC, DOCX, XLSX)
                                                </span>
                                            )}
                                        </div>
                                        {attachmentError && (
                                            <p className="text-red-500 text-xs mt-1.5">{attachmentError}</p>
                                        )}
                                        {errors.attachment && (
                                            <p className="text-red-500 text-xs mt-1.5">{errors.attachment}</p>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full justify-center bg-[#c8102e] hover:bg-red-800 text-white font-medium py-3.5 rounded-xl transition flex items-center gap-2 shadow-sm disabled:opacity-50"
                                    >
                                        <Send className="size-4" />
                                        {processing ? 'Sending Message...' : 'Send Message'}
                                    </button>
                                </form>
                            )}
                        </div>
                    )}

                    {/* INBOX TAB */}
                    {activeTab === 'inbox' && (
                        <div>
                            {inboxMessages.length === 0 ? (
                                <div className="text-center py-16 text-slate-400 space-y-3">
                                    <Inbox className="size-16 text-slate-300 mx-auto" />
                                    <p className="font-semibold text-slate-600">Your inbox is empty.</p>
                                    <p className="text-xs text-slate-400">
                                        Messages sent to you from other users will appear here.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {inboxMessages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`bg-white border rounded-2xl p-6 transition hover:shadow-md ${
                                                !msg.is_read
                                                    ? 'border-[#c8102e]/30 bg-rose-50/10'
                                                    : 'border-slate-200'
                                            }`}
                                        >
                                            <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                                                <h4 className="font-bold text-lg text-slate-800">
                                                    {msg.subject}
                                                </h4>
                                                <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                                                    {new Date(msg.created_at).toLocaleString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                        hour: 'numeric',
                                                        minute: '2-digit',
                                                        hour12: true,
                                                    })}
                                                </span>
                                            </div>

                                            <div className="text-xs text-slate-500 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
                                                <span className="font-semibold text-slate-700">From:</span>
                                                <span className="font-medium text-slate-800">
                                                    {msg.sender?.full_name || msg.sender?.name || 'Unknown'}
                                                </span>
                                                <span className="text-slate-400">
                                                    &lt;{msg.sender?.email}&gt;
                                                </span>
                                                {msg.sender?.role && (
                                                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] uppercase font-bold">
                                                        {msg.sender.role}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="text-slate-700 text-sm whitespace-pre-wrap leading-relaxed">
                                                {msg.message}
                                            </div>

                                            {msg.attachment && (
                                                <div className="mt-4 pt-3 border-t border-slate-100">
                                                    <a
                                                        href={`/support/contact/download/${msg.id}`}
                                                        download
                                                        className="inline-flex items-center gap-2 text-xs font-semibold text-[#c8102e] hover:text-red-800 bg-red-50 hover:bg-red-100 px-3.5 py-2 rounded-xl transition"
                                                    >
                                                        <Download className="size-3.5" /> Download Attachment (
                                                        {msg.attachment.replace(/^\d+_/, '')})
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
