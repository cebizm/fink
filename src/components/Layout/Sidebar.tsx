import React from 'react';
import { Receipt, CalendarClock, CreditCard, Home } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Receipt, label: 'Transactions', path: '/transactions' },
    { icon: CalendarClock, label: 'Subscriptions', path: '/subscriptions' },
    { icon: CreditCard, label: 'Bills', path: '/bills' },
];

export const Sidebar: React.FC = () => {
    return (
        <aside className="sidebar">
            <div className="logo-container">
                <div className="logo-icon">F</div>
                <h1 className="logo-text">Fink</h1>
            </div>

            <nav className="nav-menu">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `nav-item ${isActive ? 'active' : ''}`
                        }
                    >
                        <item.icon size={20} />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="user-profile">
                <div className="avatar">
                    U
                </div>
                <div>
                    <p className="font-medium text-sm">User</p>
                    <p className="text-xs text-muted">Premium Plan</p>
                </div>
            </div>
        </aside>
    );
};
