'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, SwitchCamera, Flashlight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui';
import { parseReferralCode } from '@/lib/utils';

interface QRCodeScannerProps {
  onScan: (code: string) => void;
  onClose?: () => void;
  isOpen?: boolean;
}

export function QRCodeScanner({ onScan, onClose, isOpen = true }: QRCodeScannerProps) {
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState();
        if (state === Html5QrcodeScannerState.SCANNING) {
          await scannerRef.current.stop();
        }
      } catch {
        // Ignore errors when stopping
      }
    }
  }, []);

  const startScanner = useCallback(async () => {
    if (!containerRef.current || !isOpen) return;

    try {
      setError(null);

      // Clean up existing scanner
      await stopScanner();

      const html5QrCode = new Html5Qrcode('qr-reader');
      scannerRef.current = html5QrCode;

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1,
      };

      await html5QrCode.start(
        { facingMode },
        config,
        (decodedText) => {
          // Parse the scanned content
          const code = parseReferralCode(decodedText);
          if (code) {
            onScan(code);
            stopScanner();
          }
        },
        () => {
          // QR code not detected, ignore
        }
      );

      setHasPermission(true);
    } catch (err) {
      console.error('Scanner error:', err);
      if (err instanceof Error) {
        if (err.message.includes('Permission')) {
          setHasPermission(false);
          setError('Camera permission denied. Please allow camera access to scan QR codes.');
        } else {
          setError('Unable to start camera. Please check your device settings.');
        }
      }
    }
  }, [facingMode, isOpen, onScan, stopScanner]);

  useEffect(() => {
    if (isOpen) {
      startScanner();
    }

    return () => {
      stopScanner();
    };
  }, [isOpen, startScanner, stopScanner]);

  const switchCamera = async () => {
    await stopScanner();
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black"
        style={{ backgroundColor: '#000000' }}
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/10"
          >
            <X className="w-6 h-6" />
          </Button>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={switchCamera}
              className="text-white hover:bg-white/10"
            >
              <SwitchCamera className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Scanner Container */}
        <div
          ref={containerRef}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div id="qr-reader" className="w-full max-w-md" />

          {/* Scanning overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-black/90" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64">
              {/* Cutout for scanner area */}
              <div className="absolute inset-0 bg-transparent border-2 border-white/50 rounded-2xl">
                {/* Corner decorations */}
                <div className="absolute -top-0.5 -left-0.5 w-8 h-8 border-t-4 border-l-4 border-brand-400 rounded-tl-xl" />
                <div className="absolute -top-0.5 -right-0.5 w-8 h-8 border-t-4 border-r-4 border-brand-400 rounded-tr-xl" />
                <div className="absolute -bottom-0.5 -left-0.5 w-8 h-8 border-b-4 border-l-4 border-brand-400 rounded-bl-xl" />
                <div className="absolute -bottom-0.5 -right-0.5 w-8 h-8 border-b-4 border-r-4 border-brand-400 rounded-br-xl" />
              </div>

              {/* Scanning line animation */}
              <motion.div
                className="absolute left-2 right-2 h-0.5 bg-brand-400"
                animate={{
                  top: ['10%', '90%', '10%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
          <p className="text-white/80 text-sm mb-2">
            Point your camera at a referral QR code
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2 text-red-400 text-sm"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </motion.div>
          )}

          {hasPermission === false && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => startScanner()}
              className="mt-4"
            >
              Try Again
            </Button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
