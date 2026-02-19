import { ListingStatus } from '../rules/types';

// MLS Internal Permission Keys
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

// Blue Jax Roles (Source of Truth)
export type BlueJaxRole = 'agency_admin' | 'agency_user' | 'location_admin' | 'user';

// Mapping Strategy
export const RolePermissionMap: Record<BlueJaxRole, Permission[]> = {
    'agency_admin': [
        Permission.VIEW_LISTINGS,
        Permission.CREATE_LISTING,
        Permission.EDIT_OWN_LISTING,
        Permission.PUBLISH_LISTING,
        Permission.DELETE_LISTING,
        Permission.MANAGE_AGENTS,
        Permission.VIEW_ANALYTICS,
        Permission.FILE_CLAIM,
        Permission.RESOLVE_CLAIM
    ],
    'location_admin': [
        // Broker Owner
        Permission.VIEW_LISTINGS,
        Permission.CREATE_LISTING,
        Permission.EDIT_OWN_LISTING,
        Permission.PUBLISH_LISTING, // Can publish
        Permission.MANAGE_AGENTS,
        Permission.FILE_CLAIM
    ],
    'user': [
        // Standard Agent
        Permission.VIEW_LISTINGS,
        Permission.CREATE_LISTING,
        Permission.EDIT_OWN_LISTING,
        // Cannot publish directly? Maybe needs broker approval (Rule Engine check)
        Permission.FILE_CLAIM
    ],
    'agency_user': [
        Permission.VIEW_LISTINGS
    ]
};

export function getPermissionsForRole(role: BlueJaxRole): Permission[] {
    return RolePermissionMap[role] || [];
}

export function hasPermission(userPermissions: Permission[], required: Permission): boolean {
    return userPermissions.includes(required);
}
