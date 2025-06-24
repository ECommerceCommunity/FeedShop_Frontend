'use client'

import { Dialog } from '@headlessui/react'

interface WarningProps {
    open: boolean
    title: string
    message: string
    onConfirm: () => void
    onCancel: () => void
}

export default function Warning({ open, title, message, onConfirm, onCancel }: WarningProps) {
    return (
        <Dialog open={open} onClose={onCancel} className="relative z-10">
            {/* 배경 오버레이 */}
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

            {/* 다이얼로그 패널 */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-md bg-white p-6 rounded shadow">
                    <Dialog.Title className="text-lg font-bold text-center">
                        {title}
                    </Dialog.Title>
                    <p className="mt-2 text-sm text-center text-gray-600">
                        {message}
                    </p>
                    <div className="mt-6 flex gap-2">
                        <button onClick={onCancel} className="w-full px-4 py-2 border rounded">
                            취소
                        </button>
                        <button onClick={onConfirm} className="w-full px-4 py-2 bg-indigo-600 text-white rounded">
                            확인
                        </button>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    )
}
