import { formatDistanceToNow, isToday } from 'date-fns';
import { Package, CreditCard, Shield, FileText, Check, CheckCheck } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function NotificationDropdown({ notifications, onClose }) {
    const queryClient = useQueryClient();

    const readMutation = useMutation({
        mutationFn: async (id) => await api.put(`/notifications/${id}/read`),
        onSuccess: () => queryClient.invalidateQueries(['notifications'])
    });

    const readAllMutation = useMutation({
        mutationFn: async () => await api.put('/notifications/read-all'),
        onSuccess: () => {
            queryClient.invalidateQueries(['notifications']);
            toast.success("All caught up!");
        }
    });

    const getIcon = (type) => {
        switch (type) {
            case 'shipment': return <Package size={16} className="text-blue-500" />;
            case 'payment': return <CreditCard size={16} className="text-emerald-500" />;
            case 'document': return <FileText size={16} className="text-amber-500" />;
            default: return <Shield size={16} className="text-gray-400" />;
        }
    };

    const todayNotifs = notifications.filter(n => isToday(new Date(n.createdAt)));
    const earlierNotifs = notifications.filter(n => !isToday(new Date(n.createdAt)));

    const NotificationItem = ({ n }) => (
        <div 
            onClick={() => !n.isRead && readMutation.mutate(n._id)}
            className={`p-4 flex gap-4 cursor-pointer transition-colors border-b border-gray-50 last:border-0 ${!n.isRead ? 'bg-blue-50/50 hover:bg-blue-50' : 'bg-white hover:bg-gray-50'}`}
        >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${!n.isRead ? 'bg-white shadow-sm' : 'bg-gray-100'}`}>
                {getIcon(n.type)}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                    <p className={`text-sm tracking-tight truncate ${!n.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-600'}`}>{n.title}</p>
                    <span className="text-[10px] font-bold text-gray-400 uppercase shrink-0 ml-2">
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                    </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{n.message}</p>
            </div>
            {!n.isRead && (
                <div className="w-2 h-2 bg-blue-600 rounded-full shrink-0 mt-2" />
            )}
        </div>
    );

    return (
        <>
            <div className="fixed inset-0 z-40" onClick={onClose} />
            <div className="absolute right-0 mt-3 w-[380px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                <div className="px-5 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 uppercase tracking-tighter">Notifications</h3>
                    {notifications.some(n => !n.isRead) && (
                        <button 
                            onClick={() => readAllMutation.mutate()}
                            className="text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest flex items-center gap-1"
                        >
                            Mark all as read
                        </button>
                    )}
                </div>

                <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                        <div className="p-12 text-center">
                            <Shield size={32} className="mx-auto text-gray-200 mb-3" />
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No alerts detected</p>
                        </div>
                    ) : (
                        <>
                            {todayNotifs.length > 0 && (
                                <div className="px-5 py-2 bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Today</div>
                            )}
                            {todayNotifs.map(n => <NotificationItem key={n._id} n={n} />)}
                            
                            {earlierNotifs.length > 0 && (
                                <div className="px-5 py-2 bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-y border-gray-100">Earlier</div>
                            )}
                            {earlierNotifs.map(n => <NotificationItem key={n._id} n={n} />)}
                        </>
                    )}
                </div>

                <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
                    <button className="text-[10px] font-black text-gray-400 hover:text-gray-600 uppercase tracking-widest">View All Activity</button>
                </div>
            </div>
        </>
    );
}
