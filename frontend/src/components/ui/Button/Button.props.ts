import React, { ReactNode } from "react";

export type ButtonProps = {
    style?: 'success' | 'danger' | 'warning' | 'alternative';
    disabled?: boolean;
    icon?: ReactNode;
    className?: string;
    loading?: boolean;
    type?: string;

    children?: ReactNode;



    // Functions
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};