'use client';

import { Button } from '../ui/button';
import { MoreHorizontal, ShieldAlert, BadgeInfo, EyeOff, Gavel } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface GovernanceMenuProps {
    listingId: string;
    sourceType: 'CANONICAL' | 'OBSERVED';
    sourceName?: string;
    onAction?: (action: string, id: string) => void;
}

export function GovernanceMenu({ listingId, sourceType, sourceName, onAction }: GovernanceMenuProps) {

    const handleAction = (action: string) => {
        console.log(`[Governance] Action ${action} on ${listingId}`);
        if (onAction) onAction(action, listingId);
        // In real app, call API here
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Governance</DropdownMenuLabel>

                {sourceType === 'OBSERVED' && (
                    <>
                        <DropdownMenuItem onClick={() => handleAction('CLAIM')}>
                            <BadgeInfo className="mr-2 h-4 w-4" />
                            <span>Claim / Register</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('HIDE')}>
                            <EyeOff className="mr-2 h-4 w-4" />
                            <span>Hide from Search</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleAction('REPORT')} className="text-red-600">
                            <ShieldAlert className="mr-2 h-4 w-4" />
                            <span>Report Source as Hostile</span>
                        </DropdownMenuItem>
                    </>
                )}

                {sourceType === 'CANONICAL' && (
                    <>
                        <DropdownMenuItem onClick={() => handleAction('EDIT')}>
                            <Gavel className="mr-2 h-4 w-4" />
                            <span>Audit History</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('FLAG')} className="text-red-600">
                            <ShieldAlert className="mr-2 h-4 w-4" />
                            <span>Flag for Review</span>
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
