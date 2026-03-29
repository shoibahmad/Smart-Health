import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Edit2, Save, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import AlertModal from './AlertModal';

const UpdateProfileName = () => {
    const { user, updateLocalUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(user?.full_name || '');
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: '', message: '', type: 'info' });

    if (!user) return null;

    const handleSave = async () => {
        if (!newName.trim() || newName.trim() === user.full_name) {
            setIsEditing(false);
            return;
        }

        setSaving(true);
        try {
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, { full_name: newName.trim() });

            // Sync with local context immediately
            if (updateLocalUser) {
                updateLocalUser({ full_name: newName.trim() });
            }

            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setIsEditing(false);
            }, 2000);
        } catch (error) {
            console.error("Failed to update name:", error);
            setAlertConfig({
                isOpen: true,
                title: "Update Error",
                message: "We couldn't update your name. Please check your connection or try again later.",
                type: "danger"
            });
        }
        setSaving(false);
    };

    const handleCancel = () => {
        setNewName(user.full_name || '');
        setIsEditing(false);
    };

    return (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', position: 'relative' }}>
            <AnimatePresence mode="wait">
                {isEditing ? (
                    <motion.div
                        key="edit-mode"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-color)', padding: '0.25rem 0.5rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}
                    >
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                            disabled={saving || success}
                            autoFocus
                            style={{
                                border: 'none',
                                background: 'transparent',
                                fontSize: 'inherit',
                                fontWeight: 'inherit',
                                color: 'var(--text-main)',
                                outline: 'none',
                                width: '200px',
                                padding: '0.2rem'
                            }}
                        />
                        {success ? (
                            <CheckCircle2 size={18} style={{ color: '#10b981' }} />
                        ) : (
                            <>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    style={{
                                        background: 'transparent', border: 'none', color: '#10b981', cursor: saving ? 'wait' : 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.25rem', borderRadius: '4px'
                                    }}
                                    title="Save"
                                >
                                    <Save size={18} />
                                </button>
                                <button
                                    onClick={handleCancel}
                                    disabled={saving}
                                    style={{
                                        background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: saving ? 'wait' : 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.25rem', borderRadius: '4px'
                                    }}
                                    title="Cancel"
                                >
                                    <X size={18} />
                                </button>
                            </>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="view-mode"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <span style={{ color: 'inherit', fontSize: 'inherit', fontWeight: 'inherit', margin: 0 }}>
                            {user.full_name}
                        </span>
                        <button
                            onClick={() => setIsEditing(true)}
                            style={{
                                background: 'rgba(96, 165, 250, 0.1)',
                                border: 'none',
                                color: 'var(--primary)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '0.35rem',
                                borderRadius: '6px',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(96, 165, 250, 0.2)'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(96, 165, 250, 0.1)'}
                            title="Edit Name"
                        >
                            <Edit2 size={16} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <AlertModal 
                isOpen={alertConfig.isOpen}
                onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
                title={alertConfig.title}
                message={alertConfig.message}
                type={alertConfig.type}
            />
        </div>
    );
};

export default UpdateProfileName;
