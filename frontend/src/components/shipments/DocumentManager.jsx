import { useState, useEffect, useRef } from 'react';
import { FileText, Upload, Trash2, CheckCircle, Clock, XCircle, Eye, Download, Plus, ShieldCheck, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const DOC_TYPES = ['Invoice', 'Packing List', 'BL', 'AWB', 'ID Proof', 'Other'];

export default function DocumentManager({ shipmentId, isAdmin = false }) {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(null);
    const [type, setType] = useState('Invoice');
    const [notes, setNotes] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (shipmentId) fetchDocuments();
    }, [shipmentId]);

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/documents/${shipmentId}`);
            setDocuments(res.data);
        } catch (error) {
            toast.error("Failed to load documents");
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        if (e) e.preventDefault();
        if (!file) return toast.error("Please select a file");

        const formData = new FormData();
        formData.append('file', file);
        formData.append('shipmentId', shipmentId);
        formData.append('type', type);
        formData.append('notes', notes);

        try {
            setUploading(true);
            await api.post('/documents/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success("Document uploaded successfully");
            setFile(null);
            setNotes('');
            fetchDocuments();
        } catch (error) {
            toast.error(error.response?.data?.message || "Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleVerify = async (id, status) => {
        try {
            await api.put(`/documents/${id}/verify`, { status });
            toast.success(`Document ${status}`);
            fetchDocuments();
        } catch (error) {
            toast.error("Verification failed");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this document?")) return;
        try {
            await api.delete(`/documents/${id}`);
            toast.success("Document removed");
            fetchDocuments();
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    const onDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => {
        setIsDragging(false);
    };

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            if (allowedTypes.includes(droppedFile.type)) {
                setFile(droppedFile);
            } else {
                toast.error("Only PDFs and Images are allowed");
            }
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Verified': return <CheckCircle className="text-green-500" size={14} />;
            case 'Rejected': return <XCircle className="text-red-500" size={14} />;
            default: return <Clock className="text-amber-500" size={14} />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black text-secondary tracking-tight">Compliance Vault</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manage and verify shipment documentation</p>
                </div>
                {file && (
                    <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-2 duration-300">
                        <span className="text-[10px] font-black text-primary bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10 truncate max-w-[150px]">
                            {file.name}
                        </span>
                        <button onClick={() => setFile(null)} className="p-1.5 bg-rose-50 text-rose-500 rounded-lg"><XCircle size={14}/></button>
                    </div>
                )}
            </div>

            {/* Drag & Drop Upload Zone */}
            {!file ? (
                <div 
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    onClick={() => fileInputRef.current.click()}
                    className={`
                        border-2 border-dashed rounded-[32px] p-10 text-center transition-all cursor-pointer group
                        ${isDragging ? 'border-primary bg-primary/5 scale-[0.99]' : 'border-slate-200 bg-slate-50/50 hover:border-primary/50 hover:bg-white'}
                    `}
                >
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden" 
                        onChange={(e) => setFile(e.target.files[0])}
                        accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Upload size={24} className="text-primary" />
                    </div>
                    <h4 className="text-sm font-black text-secondary uppercase tracking-widest">Drop files here or click to browse</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">Support: PDF, JPG, PNG (Max 5MB)</p>
                </div>
            ) : (
                <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-6 animate-in zoom-in-95 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block ml-1">Document Type</label>
                            <select value={type} onChange={e => setType(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none transition-all">
                                {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block ml-1">Internal Reference / Note</label>
                            <input 
                                type="text" 
                                value={notes} 
                                onChange={e => setNotes(e.target.value)} 
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all" 
                                placeholder="e.g. Original Customs Invoice" 
                            />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button className="flex-1 shadow-xl shadow-primary/20" onClick={handleUpload} isLoading={uploading} icon={ShieldCheck}>
                            {uploading ? 'SYNCHRONIZING...' : 'AUTHORIZE & UPLOAD'}
                        </Button>
                        <Button variant="ghost" className="px-8" onClick={() => setFile(null)}>Cancel</Button>
                    </div>
                </div>
            )}

            {/* Document List */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">
                    <FileText size={14} /> Registered Documentation
                </div>
                
                {loading ? (
                    <div className="p-12 text-center animate-pulse text-[10px] font-black text-slate-400 uppercase tracking-widest">Accessing Secure Storage...</div>
                ) : documents.length === 0 ? (
                    <div className="p-16 text-center bg-white rounded-[32px] border border-dashed border-slate-100 flex flex-col items-center">
                        <AlertCircle size={32} className="text-slate-200 mb-4" />
                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No documents found for this manifest</h5>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-3">
                        {documents.map(doc => (
                            <div key={doc._id} className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-[24px] hover:shadow-lg hover:shadow-slate-900/5 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                                        <FileText size={20}/>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-black text-secondary text-sm tracking-tight">{doc.type}</span>
                                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded-full border border-slate-100">
                                                {getStatusIcon(doc.status)}
                                                <span className={`text-[8px] font-black uppercase ${
                                                    doc.status === 'Verified' ? 'text-green-600' :
                                                    doc.status === 'Rejected' ? 'text-red-600' : 'text-amber-600'
                                                }`}>{doc.status}</span>
                                            </div>
                                        </div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                            {new Date(doc.createdAt).toLocaleString()} • {doc.uploadedBy?.name}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <a 
                                        href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${doc.fileUrl}`} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        className="p-2.5 bg-slate-50 text-slate-400 hover:text-primary hover:bg-white rounded-xl border border-transparent hover:border-slate-100 transition-all shadow-sm"
                                    >
                                        <Eye size={18}/>
                                    </a>
                                    
                                    {isAdmin && doc.status === 'Pending' && (
                                        <>
                                            <button onClick={() => handleVerify(doc._id, 'Verified')} className="p-2.5 bg-slate-50 text-slate-400 hover:text-green-600 hover:bg-white rounded-xl border border-transparent hover:border-slate-100 transition-all shadow-sm"><CheckCircle size={18}/></button>
                                            <button onClick={() => handleVerify(doc._id, 'Rejected')} className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-white rounded-xl border border-transparent hover:border-slate-100 transition-all shadow-sm"><XCircle size={18}/></button>
                                        </>
                                    )}
                                    
                                    <button onClick={() => handleDelete(doc._id)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-white rounded-xl border border-transparent hover:border-slate-100 transition-all shadow-sm">
                                        <Trash2 size={18}/>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

const Button = ({ children, onClick, variant = 'primary', isLoading = false, icon: Icon, className = "" }) => (
    <button 
        onClick={onClick}
        disabled={isLoading}
        className={`
            inline-flex items-center justify-center px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50
            ${variant === 'primary' ? 'bg-primary text-white hover:bg-blue-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
            ${className}
        `}
    >
        {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
        ) : Icon && (
            <Icon size={14} className="mr-2" />
        )}
        {children}
    </button>
);
