import {SpinnerProps} from "./Spinner.props";

import "./spinner.css";

export function Spinner(props: SpinnerProps) {
    return (
        <div
            className={`loader ${props.className}  border-l-indigo-700 dark:border-l-indigo-500`}
            style={{
                width: props.size ?? 40,
                height: props.size ?? 40,
                borderWidth: props.borderWidth ?? 3,
                borderLeftColor: props.color ? props.color : "",
            }}>
            Loading...
        </div>
    );
}