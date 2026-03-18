import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden h-screen">
                {/* Simple App Bar here if needed, or leave it blank */}
                <header className="h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex items-center justify-end px-8 shadow-sm z-10">
                    <div className="flex items-center space-x-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                            A
                        </div>
                        <span className="hidden sm:inline">Admin User</span>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-slate-950 p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
