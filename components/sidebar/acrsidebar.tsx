'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { BarChart3, ShieldAlert, Globe, Lock, Scan, AlertTriangle, GlobeLockIcon, HomeIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Acrsidebar() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    return (
        <aside
            className={`
        w-56
        flex-shrink-0
        h-[calc(100vh-64px)]
        flex flex-col
        px-10 py-4
        border-r border-white/10
        ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}
      `}
        >

            {/* Navigation (scrolls if needed) */}

            <NavItem href="/" icon={<HomeIcon/>} label="Home" theme={theme} />

            {/* Footer action (always pinned) */}
        </aside>
    );
}

function NavItem({
    href,
    icon,
    label,
    theme,
}: {
    href: string;
    icon: React.ReactNode;
    label: string;
    theme?: string;
}) {
    return (
        <Link
            href={href}
            className={`
        flex h-[48px] items-center gap-3
        rounded-md px-3 text-sm font-medium
        transition-colors
        ${theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-800 hover:text-green-400'
                    : 'text-gray-700 hover:bg-gray-200 hover:text-green-600'
                }
      `}
        >
            {icon}
            <span>{label}</span>
        </Link>
    );
}
