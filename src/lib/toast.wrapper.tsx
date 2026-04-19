"use client"
import { SnackbarProvider, useSnackbar } from 'notistack'

export default function ToastWrapper({ children }: { children: React.ReactNode }) {
    return (
        <SnackbarProvider>
            {children}
        </SnackbarProvider>
    );
}