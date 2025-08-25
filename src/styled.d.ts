import "styled-components";
import {
  ComponentType,
  ChangeEvent,
  ReactNode,
  IntrinsicElements,
} from "react";

// 다음 우편번호 서비스 타입 정의
declare global {
  interface Window {
    daum: {
      Postcode: new (options: {
        oncomplete: (data: any) => void;
        onclose?: () => void;
      }) => {
        open: () => void;
      };
    };
  }
}

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
