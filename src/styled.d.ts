import "styled-components";
import { ComponentType, ChangeEvent, ReactNode, IntrinsicElements } from "react";

declare module "react" {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    isMine?: boolean;
    active?: boolean;
    status?: string;
  }
}

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      text: string;
      textSecondary: string;
      background: string;
      border: string;
      error: string;
      success: string;
      warning: string;
    };
  }

  export interface StyledComponentProps<
    C extends keyof IntrinsicElements | ComponentType<any>,
    T extends object,
    O extends object = {},
    A extends keyof any = never
  > {
    isMine?: boolean;
    active?: boolean;
    status?: string;
    children?: ReactNode;
    htmlFor?: string;
    type?: string;
    to?: string;
    id?: string;
    name?: string;
    value?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
  }
}
