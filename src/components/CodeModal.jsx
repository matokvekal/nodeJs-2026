import { useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './CodeModal.css';

const CodeModal = ({ isOpen, onClose, code, title }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code || '').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="code-modal-overlay" onClick={onClose}>
      <div className="code-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="code-modal-header">
          <h3>{title || 'קוד מלא'}</h3>
          <div className="code-modal-actions">
            <button
              className={`copy-btn ${copied ? 'copied' : ''}`}
              onClick={handleCopy}
              title="העתק קוד"
            >
              {copied ? '✓ הועתק!' : '⎘ העתק'}
            </button>
            <button className="code-modal-close" onClick={onClose} title="סגור (ESC)">
              ✕
            </button>
          </div>
        </div>
        <div className="code-modal-body">
          <SyntaxHighlighter
            language="javascript"
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: '24px',
              background: 'transparent',
              fontSize: '1rem',
              lineHeight: '1.7',
              direction: 'ltr',
              textAlign: 'left',
            }}
            showLineNumbers
            lineNumberStyle={{ color: '#4a5568', minWidth: '2.5em', paddingRight: '1em' }}
          >
            {code || ''}
          </SyntaxHighlighter>
        </div>
        <div className="code-modal-footer">
          <p>לחץ ESC או מחוץ לחלון לסגירה</p>
        </div>
      </div>
    </div>
  );
};

export default CodeModal;
