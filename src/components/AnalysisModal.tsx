// src/components/AnalysisModal.tsx
import React from 'react';

interface AnalysisModalProps {
  show: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export default function AnalysisModal({ show, onClose, title, content }: AnalysisModalProps) {
  if (!show) return null;
  return (
    <div className="modal fade show" style={{ display: 'block' }}>
      <div className="modal-dialog modal-lg" style={{ zIndex: 9999 }}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title} の AI 分析</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <pre style={{ whiteSpace: 'pre-wrap' }}>{content}</pre>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>閉じる</button>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </div>
  );
}
