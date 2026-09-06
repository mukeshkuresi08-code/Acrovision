import { useState } from 'react';
import Modal from '../ui/Modal';
import { useData } from '../../hooks/useData';
import { ScanEye, CheckCircle2, RefreshCw } from 'lucide-react';

export default function EdgeAIScanModal({ isOpen, onClose, field }) {
  const { triggerEdgeScan } = useData();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  if (!field) return null;

  const handleStartScan = async () => {
    setIsScanning(true);
    setScanResult(null);
    try {
      const result = await triggerEdgeScan(field.id, field.name, field.crop?.name);
      setScanResult(result);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edge AI Vision Scan — ${field.name}`}
      maxWidth="680px"
    >
      <div>
        {/* Camera Feed / Visual Simulation Area */}
        <div
          style={{
            position: 'relative',
            height: '280px',
            backgroundColor: '#0F1713',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid var(--forest-800)',
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&w=800&q=80"
            alt="Field Crop Canopy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: isScanning ? 0.6 : 0.9,
              transition: 'opacity 0.3s ease',
            }}
          />

          {/* Scanner Overlay HUD */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '16px',
              pointerEvents: 'none',
            }}
          >
            {/* Top HUD */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span
                style={{
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: 'var(--forest-300)',
                  fontSize: '0.75rem',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                ESP32-CAM • 1080p Lens
              </span>
              <span
                style={{
                  backgroundColor: isScanning ? 'var(--status-action-solid)' : 'var(--fresh-green)',
                  color: '#FFFFFF',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '4px',
                }}
              >
                {isScanning ? 'INFERENCE ACTIVE' : 'CAM READY'}
              </span>
            </div>

            {/* Scanning Line Animation */}
            {isScanning && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  backgroundColor: 'var(--forest-400)',
                  boxShadow: '0 0 12px 2px var(--forest-400)',
                  animation: 'scanLine 1.5s ease-in-out infinite',
                }}
              />
            )}

            {/* Bottom HUD */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span
                style={{
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: '#FFFFFF',
                  fontSize: '0.75rem',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                Quantized Edge Model: YOLO-Agri-v2
              </span>
              <span
                style={{
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: 'var(--intel-teal-text)',
                  fontSize: '0.75rem',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                Latency: ~42ms
              </span>
            </div>
          </div>
        </div>

        {/* Scan Controls & Results */}
        <div style={{ marginTop: 'var(--space-lg)' }}>
          {!scanResult && !isScanning && (
            <div style={{ textAlign: 'center', padding: 'var(--space-md)' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
                Capture an optical leaf scan from the field camera node to detect fungal spots, chlorosis, or moisture stress.
              </p>
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={handleStartScan}
                style={{ width: '100%' }}
              >
                <ScanEye size={20} />
                <span>Run Edge AI Diagnostic</span>
              </button>
            </div>
          )}

          {isScanning && (
            <div style={{ textAlign: 'center', padding: 'var(--space-lg)' }}>
              <RefreshCw size={24} className="spin" style={{ color: 'var(--forest-700)', margin: '0 auto 12px auto' }} />
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Processing Optical Canopy Scan...</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Analyzing spectral reflectance, leaf contours, and chlorophyll indices on edge node.
              </p>
            </div>
          )}

          {scanResult && !isScanning && (
            <div
              style={{
                backgroundColor: 'var(--forest-50)',
                border: '1px solid var(--forest-200)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-md)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--forest-900)', fontWeight: 800 }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--forest-700)' }} />
                  <span>Scan Completed Successfully</span>
                </div>
                <span className="badge badge-intel">
                  {scanResult.scanConfidence}% Confidence
                </span>
              </div>

              <p style={{ fontSize: '0.875rem', color: 'var(--forest-800)', lineHeight: 1.45 }}>
                {scanResult.summary}
              </p>

              <div
                style={{
                  marginTop: 'var(--space-md)',
                  paddingTop: 'var(--space-sm)',
                  borderTop: '1px solid var(--forest-200)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '0.8rem', color: 'var(--forest-700)', fontWeight: 600 }}>
                  Health Score: {scanResult.overallHealthScore}%
                </span>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleStartScan}
                >
                  <RefreshCw size={13} />
                  <span>Scan Again</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scanLine {
          0% { top: 0%; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { top: 96%; opacity: 0; }
        }
      `}</style>
    </Modal>
  );
}
