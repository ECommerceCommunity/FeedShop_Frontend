// src/pages/products/SelectSize.tsx 개선

"use client";

import { useState } from "react";
import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/16/solid";

type Option = {
  size: string;
  stock: number;
  disabled: boolean;
  optionId: number; // 옵션 ID 추가
};

interface SelectBoxProps {
  readonly options: Option[];
  readonly onChange?: (selected: Option | null) => void;
}

export default function SelectBox({ options, onChange }: SelectBoxProps) {
  const placeholder = {
    size: "옵션 선택",
    stock: -1,
    disabled: false,
    optionId: -1,
  };
  const fullOptions = [placeholder, ...options];

  const [selected, setSelected] = useState<Option>(placeholder);
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (option: Option) => {
    // 품절된 옵션은 선택할 수 없음
    if (option.stock === 0 && option.optionId !== -1) {
      return;
    }

    setSelected(option);

    if (option.size === "옵션 선택" && option.stock === -1) {
      onChange?.(null);
    } else {
      onChange?.(option);
    }

    setIsOpen(false);

    // 3초 후 플레이스홀더로 복원 (품절이 아닌 경우만)
    if (option.stock > 0) {
      setTimeout(() => {
        setSelected(placeholder);
      }, 3000);
    }
  };

  return (
    <Listbox value={selected} onChange={handleChange}>
      {({ open }) => (
        <div>
          <Label className="block text-sm font-medium text-gray-900 mb-1">
            사이즈 선택
          </Label>
          <div className="relative mt-2">
            <ListboxButton
              className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pl-3 pr-2 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
              onClick={() => setIsOpen(!open)}
            >
              <span className="col-start-1 row-start-1 truncate pr-6">
                {selected.size}
                {selected.stock === 0 && selected.optionId !== -1 && (
                  <span className="text-red-500 ml-2 font-semibold">
                    (품절)
                  </span>
                )}
              </span>
              <ChevronUpDownIcon
                aria-hidden="true"
                className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
              />
            </ListboxButton>

            {(isOpen || open) && (
              <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
                {fullOptions.map((option, idx) => {
                  const isPlaceholder = option.stock === -1;
                  const isOutOfStock = option.stock === 0 && !isPlaceholder;
                  const isLowStock = option.stock > 0 && option.stock < 5;

                  // 재고 상태에 따른 스타일링
                  let stockClass = "";
                  let stockText = "";
                  let bgClass = "";
                  let cursorClass = "cursor-pointer";

                  if (isOutOfStock) {
                    stockClass = "text-red-500 font-bold";
                    stockText = "품절";
                    bgClass = "bg-gray-100";
                    cursorClass = "cursor-not-allowed";
                  } else if (isLowStock) {
                    stockClass = "text-orange-600 font-semibold";
                    stockText = `재고 ${option.stock}개`;
                    bgClass = "bg-orange-50";
                  } else if (!isPlaceholder) {
                    stockClass = "text-green-600";
                    stockText = `재고 충분`;
                  }

                  return (
                    <ListboxOption
                      key={`${option.size}-${option.optionId}-${idx}`}
                      value={option}
                      disabled={isPlaceholder || isOutOfStock}
                      className={`group relative select-none px-4 py-3 text-gray-900 ${cursorClass}
                        ${
                          idx !== fullOptions.length - 1
                            ? "border-b border-gray-200"
                            : ""
                        }
                        ${
                          isPlaceholder || isOutOfStock
                            ? "opacity-60"
                            : "hover:bg-indigo-50 data-[focus]:bg-indigo-50"
                        }
                        ${bgClass}
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span
                            className={`block truncate font-medium ${
                              isOutOfStock
                                ? "text-gray-400 line-through"
                                : "text-gray-900"
                            }`}
                          >
                            {option.size.replace("SIZE_", "")}
                          </span>

                          {/* 매진 뱃지 */}
                          {isOutOfStock && (
                            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              매진
                            </span>
                          )}

                          {/* 품절 임박 뱃지 */}
                          {isLowStock && (
                            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              품절임박
                            </span>
                          )}
                        </div>

                        {/* 재고 정보 표시 */}
                        {!isPlaceholder && (
                          <span className={`text-xs ${stockClass}`}>
                            {stockText}
                          </span>
                        )}
                      </div>

                      {/* 선택된 옵션 체크 마크 */}
                      {selected.optionId === option.optionId &&
                        option.optionId !== -1 && (
                          <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                            <svg
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        )}
                    </ListboxOption>
                  );
                })}
              </ListboxOptions>
            )}
          </div>

          {/* 재고 안내 메시지 */}
          <div className="mt-2 text-xs text-gray-500">
            {selected.optionId !== -1 &&
              selected.stock > 0 &&
              selected.stock < 5 && (
                <p className="text-orange-600">
                  ⚠️ 해당 사이즈는 재고가 얼마 남지 않았습니다. (
                  {selected.stock}개 남음)
                </p>
              )}
            {options.filter((opt) => opt.stock === 0).length > 0 && (
              <p className="text-gray-400">일부 사이즈가 품절되었습니다.</p>
            )}
          </div>
        </div>
      )}
    </Listbox>
  );
}
