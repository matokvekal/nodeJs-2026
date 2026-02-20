import EventLoopAnimation from './EventLoopAnimation';
import HeapVisualization from './HeapVisualization';
import ThreadPoolAnimation from './ThreadPoolAnimation';
import './AnimationModal.css';

const AnimationModal = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;

  const renderAnimation = () => {
    switch (type) {
      case 'eventloop':  return <EventLoopAnimation />;
      case 'heap':       return <HeapVisualization />;
      case 'threadpool': return <ThreadPoolAnimation />;
      default:           return null;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'eventloop':  return 'Event Loop - זרימת הביצוע';
      case 'heap':       return 'V8 Heap Memory - ניהול זיכרון';
      case 'threadpool': return 'Thread Pool - עיבוד מקביל';
      default:           return 'אנימציה';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{getTitle()}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {renderAnimation()}
        </div>
        <div className="modal-footer">
          <p className="modal-hint">לחץ ESC או מחוץ למודל לסגירה</p>
        </div>
      </div>
    </div>
  );
};

export default AnimationModal;
