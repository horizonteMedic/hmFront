import { useRef, useEffect } from 'react';

const AutoGrowingTextarea = ({ value, onChange = null, maxWidth = 'max-w-xs', className = '', style = {}, disabled = false }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      disabled={disabled}
      rows={5}
      className={`resize-none overflow-hidden bg-transparent outline-none text-[13px] text-black w-full ${maxWidth} ${className} ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}
      style={style}
    />
  );
};

export default AutoGrowingTextarea;
