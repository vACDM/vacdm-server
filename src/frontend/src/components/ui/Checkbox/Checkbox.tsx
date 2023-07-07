import { joinClassNames } from "../../../utils/ui/classNameHelper";
import { CheckboxProps } from "./Checkbox.props";
import React, { useEffect, useState } from "react";

export function Checkbox(props: CheckboxProps) {
    const [checked, setChecked] = useState<boolean>(false);

    useEffect(() => {
        setChecked(props.checked ?? false);
    }, [props.checked]);

    const labelClasses = joinClassNames("checkbox-label", props.disabled ? "disabled" : "", props.className ?? "");

    const checkBoxClasses = joinClassNames("checkbox text-primary", props.disabled ? "disabled" : "");

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const checkState = e.target.checked;
        setChecked(checkState);
        props.onChange?.(checkState);
    }

    return (
        <label className={labelClasses}>
            <input
                id={props.id}
                className={checkBoxClasses}
                type="checkbox"
                disabled={props.disabled}
                readOnly={props.readOnly}
                checked={checked}
                onChange={e => handleChange(e)}
            />
            {props.children ? <span className={joinClassNames("ml-2", "select-none", props.disabled ? "opacity-50" : "")}>{props.children}</span> : null}
        </label>
    );
}