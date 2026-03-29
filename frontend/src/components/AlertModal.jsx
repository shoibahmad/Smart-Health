import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle, HelpCircle, Info } from 'lucide-react';

const AlertModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    type = 'info', // 'info', 'success', 'warning', 'danger', 'confirm'
    confirmText = 'Confirm',
    cancelText = 'Cancel'
}) => {
    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle size={32} color="#10b981" />;
            case 'warning': return <AlertCircle size={32} color="#f59e0b" />;
            case 'danger': return <AlertCircle size={32} color="#ef4444" />;
            case 'confirm': return <HelpCircle size={32} color="#6366f1" />;
            default: return <Info size={32} color="#3b82f6" />;
        }
    };

    const getAccentColor = () => {
        switch (type) {
            case 'success': return '#10b981';
            case 'warning': return '#f59e0b';
            case 'danger': return 'var(--danger)';
            case 'confirm': return 'var(--primary)';
            default: return 'var(--primary)';
        }
    };

    const getGlowColor = () => {
        switch (type) {
            case 'success': return 'rgba(16, 185, 129, 0.2)';
            case 'warning': return 'rgba(245, 158, 11, 0.2)';
            case 'danger': return 'var(--danger-glow)';
            default: return 'var(--primary-glow)';
        }
    };

    return (
        <AnimatePresence>
            <div style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem',
                background: 'rgba(15, 23, 42, 0.4)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
            }}>
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 15 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 15 }}
                    className="glass-card"
                    style={{
                        width: '100%',
                        maxWidth: '440px',
                        padding: '2.5rem',
                        position: 'relative',
                        textAlign: 'center',
                        borderRadius: '24px',
                        boxShadow: `0 25px 50px -12px ${getGlowColor()}`
                    }}
                >
                    <button 
                        onClick={onClose}
                        className="btn-secondary"
                        style={{
                            position: 'absolute',
                            top: '1.25rem',
                            right: '1.25rem',
                            padding: '0.5rem',
                            borderRadius: '12px'
                        }}
                    >
                        <X size={20} />
                    </button>

                    <div style={{ 
                        marginBottom: '1.5rem', 
                        display: 'flex', 
                        justifyContent: 'center',
                        filter: `drop-shadow(0 8px 16px ${getGlowColor()})`
                    }}>
                        {getIcon()}
                    </div>

                    <h3 style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: 700, 
                        color: 'var(--text-main)', 
                        marginBottom: '0.75rem',
                        fontFamily: 'Outfit, sans-serif'
                    }}>
                        {title}
                    </h3>
                    
                    <p style={{ 
                        color: 'var(--text-muted)', 
                        fontSize: '1rem', 
                        lineHeight: 1.6, 
                        fontWeight: 500,
                        marginBottom: '2.5rem',
                        padding: '0 0.5rem'
                    }}>
                        {message}
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        {(type === 'confirm' || type === 'danger') && (
                            <button
                                onClick={onClose}
                                className="btn-secondary"
                                style={{
                                    flex: 1,
                                    padding: '0.8rem 1.5rem',
                                    borderRadius: '14px',
                                    fontSize: '0.95rem',
                                    fontWeight: 600
                                }}
                            >
                                {cancelText}
                            </button>
                        )}
                        <button
                            onClick={() => {
                                if (onConfirm) onConfirm();
                                onClose();
                            }}
                            className={type === 'danger' ? 'btn-primary' : 'btn-primary'}
                            style={{
                                flex: 1,
                                padding: '0.8rem 1.5rem',
                                borderRadius: '14px',
                                fontSize: '0.95rem',
                                fontWeight: 700,
                                background: getAccentColor(),
                                boxShadow: `0 8px 20px -5px ${getGlowColor()}`
                            }}
                        >
                            {confirmText}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AlertModal;
