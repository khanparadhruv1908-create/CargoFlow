import { useState, useEffect } from 'react';
import { FileText, Trash2, CheckCircle, Clock, XCircle, Eye, Plus } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const DOC_TYPES = ['Invoice', 'Packing List', 'BL', 'AWB', 'ID Proof', 'Other'];

export default function DocumentManager({ shipmentId }) {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(null);
    const [type, setType] = useState('Invoice');
    const [notes, setNotes] = useState('');

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
        e.preventDefault();
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
            toast.success("Document uploaded");
            setFile(null);
            setNotes('');
            fetchDocuments();
        } catch (error) {
            toast.error("Upload failed");
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

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Verified': return <CheckCircle className="text-green-500" size={14} />;
            case 'Rejected': return <XCircle className="text-red-500" size={14} />;
            default: return <Clock className="text-amber-500" size={14} />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
                <div>
                    <h3 className="text-lg font-black text-secondary tracking-tight">Shipment Documents</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verify and manage compliance paperwork</p>
                </div>
            </div>

            {/* Upload Area */}
            <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-100 mb-8">
                <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block ml-1">Type</label>
                        <select value={type} onChange={e => setType(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none">
                            {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block ml-1">File</label>
                        <input type="file" onChange={e => setFile(e.target.files[0])} className="w-full text-[10px] font-bold text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:bg-secondary file:text-white hover:file:bg-slate-800" accept=".pdf,.jpg,.jpeg,.png" />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block ml-1">Internal Note</label>
                        <input type="text" value={notes} onChange={e => setNotes(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none" placeholder="Reference..." />
                    </div>
                    <button type="submit" disabled={uploading || !file} className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl hover:shadow-lg shadow-primary/20 transition-all disabled:opacity-50">
                        {uploading ? "SYNCING..." : "UPLOAD DOC"}
                    </button>
                </form>
            </div>

            {/* List */}
            <div className="space-y-3">
                {loading ? (
                    <div className="p-10 text-center animate-pulse text-[10px] font-black text-slate-400 uppercase tracking-widest">Accessing Document Relay...</div>
                ) : documents.length === 0 ? (
                    <div className="p-10 text-center bg-slate-50 rounded-[24px] border border-dashed border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">No documents registered</div>
                ) : (
                    documents.map(doc => (
                        <div key={doc._id} className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-[20px] hover:shadow-lg hover:shadow-slate-900/5 transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-50 rounded-xl text-slate-400 border border-slate-100">
                                    <FileText size={18}/>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-black text-secondary text-sm tracking-tight">{doc.type}</span>
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 rounded-full border border-slate-100">
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

                            <div className="flex items-center gap-2">
                                <a href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${doc.fileUrl}`} target="_blank" rel="noreferrer" className="p-2.5 bg-slate-50 text-slate-400 hover:text-primary hover:bg-white rounded-xl border border-transparent hover:border-slate-100 transition-all shadow-sm">
                                    <Eye size={16}/>
                                </a>
                                {doc.status === 'Pending' && (
                                    <>
                                        <button onClick={() => handleVerify(doc._id, 'Verified')} className="p-2.5 bg-slate-50 text-slate-400 hover:text-green-600 hover:bg-white rounded-xl border border-transparent hover:border-slate-100 transition-all shadow-sm"><CheckCircle size={16}/></button>
                                        <button onClick={() => handleVerify(doc._id, 'Rejected')} className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-white rounded-xl border border-transparent hover:border-slate-100 transition-all shadow-sm"><XCircle size={16}/></button>
                                    </>
                                )}
                                <button onClick={() => handleDelete(doc._id)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-white rounded-xl border border-transparent hover:border-slate-100 transition-all shadow-sm"><Trash2 size={16}/></button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
