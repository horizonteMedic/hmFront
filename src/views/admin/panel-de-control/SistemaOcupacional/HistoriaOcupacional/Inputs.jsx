import { useRef, useEffect, useState } from 'react';

const AutoGrowingTextarea = ({ value, onChange = null, maxWidth = 'max-w-xs', className = '', style = {}}) => {
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
      rows={5}
      className={`resize-none overflow-hidden bg-transparent outline-none text-[13px] text-black w-full ${maxWidth} ${className} `}
      style={style}
    />
  );
};

export default AutoGrowingTextarea;