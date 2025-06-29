'use client'

import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import ProductUploadPage from './RegisterStorePage'

type RegisterStoreModalProps = Readonly<{
    onClose: () => void
}>

export default function RegisterStoreModal({ onClose }: RegisterStoreModalProps) {
    const [open, setOpen] = useState(true)

    return (
        <div>
            <Dialog open={open} onClose={setOpen} className="relative z-50">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
                />
                <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel
                            transition
                            className="relative transform overflow-y-auto max-h-[90vh] rounded-lg bg-white 
    text-left shadow-xl transition-all 
    data-[closed]:translate-y-4 data-[closed]:opacity-0 
    data-[enter]:duration-300 data-[leave]:duration-200 
    data-[enter]:ease-out data-[leave]:ease-in 
    sm:my-4 sm:w-full sm:max-w-3xl
    data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                        >
                            <ProductUploadPage onClose={() => {
                                setOpen(false)
                                onClose()
                            }} />
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}
