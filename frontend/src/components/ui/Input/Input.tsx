import { InputProps } from './Input.props';
import { joinClassNames } from '../../../utils/ui/classNameHelper';
import {Spinner} from "../Spinner/Spinner";
import { useEffect, useState } from 'react';;

export function Input(props: InputProps) {
  const [inputVal, setInputVal] = useState<string>(props.value ?? '');
  const [regexMatchFail, setRegexMatchFail] = useState<boolean>(false);

  useEffect(() => {
    setRegexMatchFail(false);
    setInputVal(props.value ?? '');
  }, [props.value]);

  useEffect(() => {
    if (props.regexCheckInitial) checkRegex(inputVal);
  }, []);

  const inputDefaultClass = 'input';
  const inputFocusClass = `focus:ring-red-500 focus-within:ring-indigo-500 focus-within:border-indigo-500 focus:border-indigo-500 rounded px-1 text-black max-w-[100px] text-xl`;
  const inputWrapperClass = `input-wrapper`;

  const classes = joinClassNames(
    inputDefaultClass,
    inputFocusClass,
    inputWrapperClass,
    props.inputError || regexMatchFail
      ? 'border-2 border-red-400 dark:border-red-700'
      : '',
    props.disabled || props.loading ? 'input-disabled' : '',
    props.preIcon || props.loading ? 'input-icon-pre' : '',
    props.label ? 'input-label' : ''
  );

  const labelClasses = joinClassNames(
    props.labelSmall ? 'text-sm' : '',
    props.description == null ? 'mb-2' : ''
  );

  function checkRegex(input: string) {
    if (props.regex == null) return;

    if (
      !input.match(props.regex) &&
      (input.length > 0 || props.regexMatchEmpty)
    ) {
      setRegexMatchFail(true);
    } else {
      setRegexMatchFail(false);
    }
  }

  return (
    <div className={props.className ?? ''}>
      {props.label && (
        <h6 className={labelClasses}>
          {props.label}{' '}
          {props.required && <span className={'text-red-500'}>*</span>}
        </h6>
      )}
      {props.description && (
        <p className={'mb-2 ' + (props.labelSmall ? 'text-xs' : '')}>
          {props.description}
        </p>
      )}

      <div className={'relative ' + (props.inputClassName ?? '')}>
        <input
          id={props.id}
          type={props.type ?? 'text'}
          value={inputVal}
          data-form-type={props.dataFormType ?? 'other'}
          name={props.name}
          required={props.required ?? false}
          readOnly={props.readOnly ?? false}
          maxLength={props.maxLength}
          onChange={(e) => {
            checkRegex(e.target.value);
            setInputVal(e.target.value);
            props.onChange?.(e);
          }}
          className={classes}
          disabled={props.disabled || props.loading}
          placeholder={props.placeholder}
        />
        {(props.preIcon || props.loading) && (
          <div className='absolute top-1 left-[1px]'>
            {props.loading && !props.hideSpinner && (
              <Spinner size={18} borderWidth={2} className={'m-[1px]'} />
            )}
            {(!props.loading || props.hideSpinner) && props.preIcon}
          </div>
        )}
      </div>

      {(props.inputError || regexMatchFail) && (
        <p className={'text-red-500 text-sm flex items-center mt-1.5'}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>

          {props.customInputErrorText ?? 'Input invalid.'}
        </p>
      )}
    </div>
  );
}
