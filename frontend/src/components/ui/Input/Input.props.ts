import React, {ReactElement} from "react";

export type InputProps = {
    label?: string | ReactElement;
    id?: string;
    name?: string;
    inputError?: boolean;
    customInputErrorText?: string;
    required?: boolean;
    description?: string;
    labelSmall?: boolean;
    hideSpinner?: boolean;
    className?: string;
    inputClassName?: string;
    type?: string;
    value?: string;
    maxLength?: number;

    placeholder?: string;
    disabled?: boolean;
    readOnly?: boolean;
    loading?: boolean;

    dataFormType?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => any;

    preIcon?: ReactElement;
    regex?: RegExp;
    regexMatchEmpty?: boolean;
    regexCheckInitial?: boolean;
};