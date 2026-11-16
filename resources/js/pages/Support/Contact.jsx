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
            return <FileSpreadsheet className="size-4 text-[#21865A]" />;
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
        <div className="w-full space-y-6">
            <Head title="Support - Message Center" />

            {/* Header Banner (Matches 1lib Design System) */}
            <div className="flex justify-between items-center bg-white p-8 rounded-3xl text-[#4B5563] border border-[#E5E5E5] border-t-[3px] border-t-[#E9A12B] shadow-sm dark:bg-white/[0.06] dark:border-white/10 dark:text-white">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-3 font-['Quicksand',system-ui,sans-serif] text-[#4B5563] dark:text-white">
                        <Mail className="size-6 text-[#A04040] dark:text-[#E9A12B]" /> Contact Form
                    </h2>
                    <p className="text-[#4B5563] dark:text-white/70 mt-1.5 text-sm">
                        Send direct messages to library staff or view received messages
                    </p>
                </div>
                <div className="flex gap-2 text-right">
                    <div className="bg-[#F9EDEF] px-5 py-2.5 rounded-2xl text-center border border-[#A04040]/20 dark:bg-white/10 dark:border-white/10">
                        <div className="text-xs uppercase tracking-wider font-semibold text-[#A04040] dark:text-white/60">Unread</div>
                        <div className="text-2xl font-bold text-[#A04040] dark:text-[#ffd7ba] font-['Quicksand',system-ui,sans-serif]">
                            {localUnread}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Message Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-[#E5E5E5] overflow-hidden dark:bg-[#280B14] dark:border-white/10">
                {/* Tabs Switcher */}
                <div className="flex border-b border-[#E5E5E5] bg-[#F8F8F8] dark:border-white/10 dark:bg-white/[0.02]">
                    <button
                        type="button"
                        onClick={() => handleSwitchTab('compose')}
                        className={`flex-1 py-4 font-semibold text-sm transition-colors border-b-2 flex items-center justify-center gap-2 ${
                            activeTab === 'compose'
                                ? 'border-[#A04040] text-[#A04040] bg-white dark:border-[#E9A12B] dark:text-white dark:bg-[#280B14]'
                                : 'border-transparent text-[#4B5563] hover:text-[#4B5563] dark:text-white/60 dark:hover:text-white'
                        }`}
                    >
                        <PenSquare className="size-4" /> Compose Message
                    </button>
                    <button
                        type="button"
                        onClick={() => handleSwitchTab('inbox')}
                        className={`flex-1 py-4 font-semibold text-sm transition-colors border-b-2 flex items-center justify-center gap-2 ${
                            activeTab === 'inbox'
                                ? 'border-[#A04040] text-[#A04040] bg-white dark:border-[#E9A12B] dark:text-white dark:bg-[#280B14]'
                                : 'border-transparent text-[#4B5563] hover:text-[#4B5563] dark:text-white/60 dark:hover:text-white'
                        }`}
                    >
                        <Inbox className="size-4" /> Inbox
                        {localUnread > 0 && (
                            <span className="bg-gradient-to-r from-[#D66C6C] to-[#A04040] text-white text-xs px-2 py-0.5 rounded-full font-bold ml-1 dark:bg-[#E9A12B] dark:text-black">
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
                                <div className="bg-[#21865A]/10 border border-[#21865A]/30 p-8 rounded-2xl text-center space-y-3">
                                    <CheckCircle2 className="size-14 text-[#21865A] mx-auto" />
                                    <h3 className="text-xl font-bold text-[#21865A]">
                                        Message Sent Successfully!
                                    </h3>
                                    <p className="text-sm text-[#4B5563] dark:text-white/80 max-w-md mx-auto">
                                        Your message has been delivered to the recipient's inbox in the system.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setSuccessSent(false)}
                                        className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-[#D66C6C] to-[#A04040] text-white font-medium px-5 py-2.5 rounded-xl hover:brightness-95 transition cursor-pointer"
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
                                        <label className="block text-sm font-semibold text-[#4B5563] mb-2 dark:text-white">
                                            To: Recipients
                                        </label>
                                        <div
                                            className={`flex flex-wrap items-center gap-2 p-3 border rounded-xl bg-white min-h-[48px] cursor-text focus-within:border-[#A04040] dark:bg-black/20 dark:border-white/10 dark:focus-within:border-[#E9A12B] ${
                                                recipientError || errors.recipients
                                                    ? 'border-[#C44545] bg-[#C44545]/10'
                                                    : 'border-[#E5E5E5]'
                                            }`}
                                        >
                                            <span className="text-[#4B5563] font-medium text-sm select-none">
                                                To:
                                            </span>
                                            {recipients.map((email, idx) => (
                                                <span
                                                    key={idx}
                                                    className="inline-flex items-center gap-1.5 bg-[#F9EDEF] border border-[#A04040]/20 rounded-full px-3 py-1 text-xs font-medium text-[#A04040] dark:bg-white/10 dark:border-white/10 dark:text-white"
                                                >
                                                    <UserIcon className="size-3 text-[#A04040] dark:text-[#ffd7ba]" />
                                                    {email}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeRecipient(idx)}
                                                        className="text-[#4B5563] hover:text-[#C44545] font-bold cursor-pointer"
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
                                                className="flex-1 min-w-[200px] border-none outline-none text-sm text-[#4B5563] bg-transparent dark:text-white placeholder:text-[#6B7280]"
                                            />
                                        </div>
                                        {recipientError && (
                                            <p className="text-[#C44545] text-xs mt-1.5 flex items-center gap-1">
                                                <TriangleAlert className="size-3" /> {recipientError}
                                            </p>
                                        )}
                                        {errors.recipients && (
                                            <p className="text-[#C44545] text-xs mt-1.5">
                                                {errors.recipients}
                                            </p>
                                        )}
                                    </div>

                                    {/* Subject */}
                                    <div>
                                        <label className="block text-sm font-semibold text-[#4B5563] mb-2 dark:text-white">
                                            Subject
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter message subject..."
                                            value={data.subject}
                                            onChange={(e) => setData('subject', e.target.value)}
                                            className={`w-full border rounded-xl p-3 text-sm text-[#4B5563] outline-none transition focus:border-[#A04040] bg-white dark:bg-black/20 dark:text-white dark:border-white/10 dark:focus:border-[#E9A12B] ${
                                                errors.subject ? 'border-[#C44545] bg-[#C44545]/10' : 'border-[#E5E5E5]'
                                            }`}
                                            required
                                        />
                                        {errors.subject && (
                                            <p className="text-[#C44545] text-xs mt-1.5">{errors.subject}</p>
                                        )}
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label className="block text-sm font-semibold text-[#4B5563] mb-2 dark:text-white">
                                            Message
                                        </label>
                                        <textarea
                                            rows="7"
                                            placeholder="Write your message here..."
                                            value={data.message}
                                            onChange={(e) => setData('message', e.target.value)}
                                            className={`w-full border rounded-xl p-3 text-sm text-[#4B5563] outline-none transition focus:border-[#A04040] bg-white dark:bg-black/20 dark:text-white dark:border-white/10 dark:focus:border-[#E9A12B] leading-relaxed ${
                                                errors.message ? 'border-[#C44545] bg-[#C44545]/10' : 'border-[#E5E5E5]'
                                            }`}
                                            required
                                        />
                                        {errors.message && (
                                            <p className="text-[#C44545] text-xs mt-1.5">{errors.message}</p>
                                        )}
                                    </div>

                                    {/* Attachment */}
                                    <div>
                                        <label className="block text-sm font-semibold text-[#4B5563] mb-2 dark:text-white">
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
                                                className="inline-flex items-center gap-2 border border-[#E5E5E5] bg-[#F8F8F8] hover:bg-[#E5E5E5]/60 text-[#4B5563] px-4 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                                            >
                                                <Paperclip className="size-4" /> Choose File
                                            </button>

                                            {selectedFile ? (
                                                <div className="inline-flex items-center gap-2 bg-[#F8F8F8] border border-[#E5E5E5] px-3 py-1.5 rounded-xl text-xs font-medium text-[#4B5563] dark:bg-white/10 dark:border-white/10 dark:text-white">
                                                    {getFileIcon(selectedFile.name)}
                                                    <span>{selectedFile.name}</span>
                                                    <span className="text-[#4B5563] dark:text-white/60">
                                                        ({(selectedFile.size / 1024).toFixed(1)} KB)
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={clearAttachment}
                                                        className="text-[#4B5563] hover:text-[#C44545] cursor-pointer"
                                                    >
                                                        <X className="size-3.5" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-[#4B5563] dark:text-white/60">
                                                    Max 5 MB (PDF, PNG, JPG, DOC, DOCX, XLSX)
                                                </span>
                                            )}
                                        </div>
                                        {attachmentError && (
                                            <p className="text-[#C44545] text-xs mt-1.5">{attachmentError}</p>
                                        )}
                                        {errors.attachment && (
                                            <p className="text-[#C44545] text-xs mt-1.5">{errors.attachment}</p>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full justify-center bg-gradient-to-r from-[#D66C6C] to-[#A04040] hover:brightness-95 text-white font-semibold py-3.5 rounded-xl transition flex items-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
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
                                <div className="text-center py-16 text-[#4B5563] space-y-3 dark:text-white/60">
                                    <Inbox className="size-16 text-[#4B5563]/50 mx-auto dark:text-white/40" />
                                    <p className="font-semibold text-[#4B5563] dark:text-white">Your inbox is empty.</p>
                                    <p className="text-xs text-[#4B5563] dark:text-white/60">
                                        Messages sent to you from other users will appear here.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {inboxMessages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`bg-white border rounded-2xl p-6 transition hover:shadow-md border-[#E5E5E5] dark:bg-[#1E070F] dark:border-white/10 ${
                                                !msg.is_read
                                                    ? 'border-[#A04040]/30 bg-[#F9EDEF]/30 dark:bg-white/[0.04]'
                                                    : ''
                                            }`}
                                        >
                                            <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                                                <h4 className="font-bold text-lg text-[#4B5563] dark:text-white">
                                                    {msg.subject}
                                                </h4>
                                                <span className="text-xs text-[#4B5563] bg-[#F8F8F8] px-3 py-1 rounded-full dark:bg-white/10 dark:text-white/70">
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

                                            <div className="text-xs text-[#4B5563] mb-4 pb-3 border-b border-[#E5E5E5] flex items-center gap-2 dark:border-white/10 dark:text-white/60">
                                                <span className="font-semibold text-[#4B5563] dark:text-white/80">From:</span>
                                                <span className="font-medium text-[#4B5563] dark:text-white">
                                                    {msg.sender?.full_name || msg.sender?.name || 'Unknown'}
                                                </span>
                                                <span className="text-[#4B5563] dark:text-white/60">
                                                    &lt;{msg.sender?.email}&gt;
                                                </span>
                                                {msg.sender?.role && (
                                                    <span className="bg-[#F9EDEF] text-[#A04040] px-2 py-0.5 rounded text-[10px] uppercase font-bold dark:bg-white/10 dark:text-white">
                                                        {msg.sender.role}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="text-[#4B5563] text-sm whitespace-pre-wrap leading-relaxed dark:text-[#F9EDEF]">
                                                {msg.message}
                                            </div>

                                            {msg.attachment && (
                                                <div className="mt-4 pt-3 border-t border-[#E5E5E5] dark:border-white/10">
                                                    <a
                                                        href={`/support/contact/download/${msg.id}`}
                                                        download
                                                        className="inline-flex items-center gap-2 text-xs font-semibold text-[#A04040] hover:text-[#8A3535] bg-[#F9EDEF] hover:bg-[#F9EDEF]/80 px-3.5 py-2 rounded-xl transition dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
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