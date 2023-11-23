import React from 'react';

/**
 * ### Props:
 * 
 * type: "input" | "textarea"
 * 
 * placeholder: string
 * 
 * label: string
 * 
 * maxLength: number (of characters)
 * 
 * onChange: (event) => void
 * 
 * (Optional) internalType: string, default is 'text' - used for <input>
 * 
 * (Optional) spellcheck: boolean, default is true
 * 
 * (Optional) value: string
 * 
 * (optional) requiresEdit: boolean, default is false
 * 
 * (optional) onClickDone: (value) => void
 * 
 * (optional) disabled: boolean, default is false
 * 
 * (optional) pattern: string, regex pattern for <input> element restrictions
 * 
 * (optional) outerStyle: object, custom CSS for outer div (inside container div)
 * 
 * (Optional) style: object, custom CSS for input/textarea element
 * 
 * (Optional) containerStyle: object, custom CSS for outer container div
 */
const TextInput = ({
	type, placeholder, label, maxLength, onChange, 
	internalType, spellcheck, initValue, requiresEdit, 
	onClickDone, disabled, pattern, outerStyle, style, containerStyle }) => {

	const [editing, setEditing] = React.useState(!requiresEdit);
	
	const [value, setValue] = React.useState(initValue || '');
	const editorRef = React.useRef(null);

	const mainButtonClick = React.useCallback(() => {
		editing && onClickDone && value !== initValue && onClickDone(value);
		editing? editorRef.current.blur() : editorRef.current.focus();
		setEditing(!editing);
	}, [editing, initValue, onClickDone, value]);

	React.useEffect(() => {
		// set value to props initValue on every change of 'editing'
		// mainly used to prevent people changing displayName to <3 chars
		setValue(initValue);
	}, [editing, initValue]);

  return (
    
    <div style={containerStyle}>
      {label && <div className='minilabel'>{label}</div>}

			<div className='flex-row position-relative' style={outerStyle}>
				{type === 'input'?
					<input 
					ref={editorRef}
					onKeyDown={(e) => {
						if (e.key === 'Enter' && requiresEdit && !disabled) {
							e.preventDefault();
							mainButtonClick();
						}

						if (e.key === 'Escape' && requiresEdit && !disabled) {
							e.preventDefault();
							setEditing(false);
							setValue(initValue);
						}
					}}
					readOnly={!editing}
					type={internalType?? 'text'}
					style={{...style, opacity: disabled? 0.6 : 1}}
					value={value}
					onChange={(e) => { setValue(e.target.value); onChange && onChange(e); }}
					spellCheck={spellcheck ?? true}
					placeholder={placeholder}
          pattern={pattern}
					className='input-primary' 
					maxLength={maxLength} /> :

					<textarea 
					ref={editorRef}
					onKeyDown={(e) => {
						if (e.key === 'Enter' && requiresEdit && editing && !disabled) {
							e.preventDefault();
							mainButtonClick();
						}

						if (e.key === 'Escape' && requiresEdit && !disabled) {
							e.preventDefault();
							setEditing(false);
							setValue(initValue);
						}

					}}
					readOnly={!editing}
					placeholder={placeholder}
					spellCheck={spellcheck ?? true}
					value={value}
					onChange={(e) => { setValue(e.target.value); onChange && onChange(e); }}
					style={{...style, opacity: disabled? 0.6 : 1}}
					className='textarea-primary' 
					maxLength={maxLength} />}

				{requiresEdit && !disabled &&
					<div 
					style={{flexDirection: type === 'input'? 'row' : 'column'}}
					className='center-children flex-gap-10px margin-top-10px margin-right-10px position-absolute top-0 right-0'>

						<img 
						onClick={mainButtonClick}
						className='image-15px cursor-pointer' 
						src={editing? require('../assets/icons/checkmark_icon.png') : require('../assets/icons/edit.png')}
						alt='edit' />

						{editing && 
						<img 
						onClick={(e) => {
							editorRef.current.blur();
							setValue(initValue);		
							setEditing(false)}}
						className='image-15px invert-100 cursor-pointer' 
						src={require('../assets/icons/close.png')}
						alt='cancel' />}

					</div>}
		</div>
  </div>

  );
};

export default TextInput;