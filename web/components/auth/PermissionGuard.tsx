"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// You can share the Permission enum via a shared package or copy it for now.
// For now, mirroring the backend enum.
export enum Permission {
    VIEW_LISTINGS = 'view:listings',
    CREATE_LISTING = 'create:listing',
    EDIT_OWN_LISTING = 'edit:own_listing',
    PUBLISH_LISTING = 'publish:listing',
    DELETE_LISTING = 'delete:listing',
    MANAGE_AGENTS = 'manage:agents',
    VIEW_ANALYTICS = 'view:analytics',
    FILE_CLAIM = 'file:claim',
    RESOLVE_CLAIM = 'resolve:claimAdmin'
}

/*
  Mapping Logic (Client Side) - Ideally fetched from API /me endpoint 
  but simplified here using Role from Session.
*/
const RolePermissionMap: Record<string, string[]> = {
    'agency_admin': Object.values(Permission),
    'agency_user': [Permission.VIEW_LISTINGS],
    'user': [Permission.VIEW_LISTINGS, Permission.CREATE_LISTING, Permission.EDIT_OWN_LISTING, Permission.FILE_CLAIM]
};

interface PermissionGuardProps {
    requiredPermission: Permission;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export function PermissionGuard({ requiredPermission, children, fallback }: PermissionGuardProps) {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === "loading") {
        return <div>Loading permissions...</div>;
    }

    if (!session?.user) {
        return fallback || <div className="p-4 text-red-500">Please sign in to access this feature.</div>;
    }

    const userRole = (session.user as any).role || 'user';
    const permissions = RolePermissionMap[userRole] || [];

    if (!permissions.includes(requiredPermission)) {
        return fallback || <div className="p-4 bg-red-500/10 border border-red-500/20 rounded text-red-500">Access Denied: You do not have permission to perform this action.</div>;
    }

    return <>{children}</>;
}
