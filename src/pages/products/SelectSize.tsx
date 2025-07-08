'use client'

import { useState } from 'react'
import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions
} from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/16/solid'

type Option = {
  size: string;
  stock: number;
  disabled: boolean;
};

interface SelectBoxProps {
  readonly options: Option[]
  readonly onChange?: (selected: Option | null) => void
}

export default function SelectBox({ options, onChange }: SelectBoxProps) {
  const placeholder = { size: '옵션 선택', stock: -1, disabled: false }
  const fullOptions = [placeholder, ...options]

  const [selected, setSelected] = useState<Option>(placeholder)
  const [isOpen, setIsOpen] = useState(false)

  const handleChange = (option: Option) => {
    setSelected(option)

    if (option.size === '옵션 선택' && option.stock === -1) {
      onChange?.(null)
    } else {
      onChange?.(option)
    }

    setIsOpen(false)
    setTimeout(() => {
      setSelected(placeholder)
    }, 3000)
  }

  return (
    <Listbox value={selected} onChange={handleChange}>
      {({ open }) => (
        <div>
          <Label className="block text-sm font-medium text-gray-900 mb-1">사이즈</Label>
          <div className="relative mt-2">
            <ListboxButton
              className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pl-3 pr-2 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
              onClick={() => setIsOpen(!open)}
            >
              <span className="col-start-1 row-start-1 truncate pr-6">
                {selected.size}
              </span>
              <ChevronUpDownIcon
                aria-hidden="true"
                className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
              />
            </ListboxButton>

            {(isOpen || open) && (
              <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
                {fullOptions.map((option, idx) => {
                  const isPlaceholder = option.stock === -1
                  const isOutOfStock = option.stock === 0
                  const isLowStock = option.stock > 0 && option.stock < 5

                  let stockClass = '';
                  let stockText = '';

                  if (isOutOfStock) {
                    stockClass = 'text-gray-400 font-bold';
                    stockText = '품절';
                  } else if (isLowStock) {
                    stockClass = 'text-red-600 font-bold';
                    stockText = `재고 ${option.stock}개`;
                  }

                  return (
                    <ListboxOption
                      key={option.size + '-' + idx}
                      value={option}
                      disabled={isPlaceholder || isOutOfStock}
                      className={`group relative select-none px-4 py-2 text-gray-900
                        ${idx !== fullOptions.length - 1 ? 'border-b border-gray-200' : ''}
                        ${isPlaceholder || isOutOfStock ? 'bg-gray-100 opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-indigo-50'}
                      `}
                    >
                      <span className="flex justify-between items-center">
                        <span className="font-normal">{option.size}</span>
                        {!isPlaceholder && (
                          <span className={`ml-2 text-sm ${stockClass}`}>
                            {stockText}
                          </span>
                        )}
                      </span>
                    </ListboxOption>
                  )
                })}
              </ListboxOptions>
            )}
          </div>
        </div>
      )}
    </Listbox>
  )
}
