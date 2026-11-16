import { usePage } from '@inertiajs/react';

export function usePermissions() {
    const { auth } = usePage().props;
    const user = auth?.user;
    const isAdmin = String(user?.role || '').toLowerCase() === 'admin';

    const canAdd = isAdmin || Boolean(user?.can_add ?? user?.permissions?.can_add ?? false);
    const canEdit = isAdmin || Boolean(user?.can_edit ?? user?.permissions?.can_edit ?? false);
    const canDelete = isAdmin || Boolean(user?.can_delete ?? user?.permissions?.can_delete ?? false);
    const canAccessUsers = isAdmin || Boolean(user?.can_access_users ?? user?.permissions?.can_access_users ?? false);

    return {
        user,
        isAdmin,
        canAdd,
        canEdit,
        canDelete,
        canAccessUsers,
        permissions: {
            can_add: canAdd,
            can_edit: canEdit,
            can_delete: canDelete,
            can_access_users: canAccessUsers,
        },
    };
}
