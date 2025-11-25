'use client';

import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { Copy, Check, Share2, Download } from 'lucide-react';
import { Button } from '@/components/ui';
import { generateReferralUrl } from '@/lib/utils';

interface QRCodeDisplayProps {
  code: string;
  referrerName?: string;
  size?: number;
}

export function QRCodeDisplay({ code, referrerName, size = 240 }: QRCodeDisplayProps) {
  const [copied, setCopied] = useState(false);
  const referralUrl = generateReferralUrl(code);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = referralUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Get a discount!',
          text: `Use my referral code ${code} and get a special discount on your first visit!`,
          url: referralUrl,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      copyToClipboard();
    }
  };

  const downloadQR = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = size * 2;
      canvas.height = size * 2;
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }

      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `referral-${code}.png`;
      downloadLink.href = pngUrl;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center"
    >
      {/* QR Code Container */}
      <div className="relative p-6 bg-white rounded-3xl shadow-xl shadow-brand-500/10">
        {/* Decorative gradient border */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-400 to-accent-400 -z-10 blur-sm opacity-50" />
        <div className="absolute inset-[2px] rounded-3xl bg-white -z-10" />
        
        <QRCodeSVG
          id="qr-code-svg"
          value={referralUrl}
          size={size}
          level="H"
          includeMargin={false}
          bgColor="#ffffff"
          fgColor="#1c1917"
        />
      </div>

      {/* Code Display */}
      <div className="mt-6 text-center">
        <p className="text-sm text-surface-500 mb-1">Your referral code</p>
        <p className="text-3xl font-bold tracking-widest text-surface-900 font-mono">
          {code}
        </p>
        {referrerName && (
          <p className="text-sm text-surface-500 mt-2">
            Share this with friends to earn rewards!
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={copyToClipboard}
          className="gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Link
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={share}
          className="gap-2"
        >
          <Share2 className="w-4 h-4" />
          Share
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={downloadQR}
          className="gap-2"
        >
          <Download className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}
