import "styled-components";
import { LinkProps } from "react-router-dom";

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
}

declare module "styled-components" {
  export interface StyledComponentPropsWithAs<
    C extends keyof JSX.IntrinsicElements | React.ComponentType<any>,
    T extends object,
    O extends object = {},
    A extends keyof any = never
  > {
    isMine?: boolean;
    active?: boolean;
    status?: string;
    children?: React.ReactNode;
    htmlFor?: string;
    type?: string;
    to?: string;
    id?: string;
    name?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
  }
}

declare module "styled-components" {
  export interface StyledComponentProps {
    isMine?: boolean;
    active?: boolean;
    status?: string;
    children?: React.ReactNode;
    htmlFor?: string;
    type?: string;
    to?: string;
    id?: string;
    name?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
  }
}

declare module "styled-components" {
  export interface StyledComponentPropsWithAs<
    C extends keyof JSX.IntrinsicElements,
    T extends object,
    O extends object = {},
    A extends keyof any = never
  > {
    isMine?: boolean;
  }
}

declare module "styled-components" {
  export interface StyledComponentPropsWithAs<
    C extends keyof JSX.IntrinsicElements,
    T extends object,
    O extends object = {},
    A extends keyof any = never
  > {
    isMine?: boolean;
  }
}

declare module "styled-components" {
  export interface StyledComponentPropsWithAs<
    C extends keyof JSX.IntrinsicElements,
    T extends object,
    O extends object = {},
    A extends keyof any = never
  > {
    isMine?: boolean;
  }
}
