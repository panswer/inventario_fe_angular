import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';

@Component({
  selector: 'app-barcode-scanner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './barcode-scanner.component.html',
  styleUrl: './barcode-scanner.component.css',
})
export class BarcodeScannerComponent implements OnChanges, OnInit, OnDestroy {
  @Input() isScanning = false;
  @Output() barcodeScanned = new EventEmitter<string>();
  @Output() closeScanner = new EventEmitter<void>();

  private html5QrCode: Html5Qrcode | null = null;
  private scannerContainerId = 'barcode-scanner-container-' + Math.random().toString(36).substring(7);
  isCameraActive = false;
  errorMessage = '';
  isInitializing = true;

  ngOnInit(): void {
    // Container ID is set on init
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isScanning'] && this.isScanning) {
      setTimeout(() => this.startScanner(), 100);
    } else if (changes['isScanning'] && !this.isScanning) {
      this.stopScanner();
    }
  }

  ngOnDestroy(): void {
    this.stopScanner();
  }

  async startScanner(): Promise<void> {
    this.errorMessage = '';
    this.isInitializing = true;

    try {
      this.html5QrCode = new Html5Qrcode(this.scannerContainerId);

      // Try back camera first (environment), fallback to any camera
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 150 },
        aspectRatio: 1.0,
      };

      try {
        await this.html5QrCode.start(
          { facingMode: 'environment' },
          config,
          (decodedText: string) => this.onScanSuccess(decodedText),
          () => {}
        );
      } catch (backCameraError) {
        // If back camera fails, try front camera
        console.log('Back camera failed, trying front camera...');
        await this.html5QrCode.start(
          { facingMode: 'user' },
          config,
          (decodedText: string) => this.onScanSuccess(decodedText),
          () => {}
        );
      }

      this.isCameraActive = true;
      this.isInitializing = false;
    } catch (error: unknown) {
      this.isInitializing = false;
      this.isCameraActive = false;
      
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      
      if (errorMsg.includes('NotAllowedError') || errorMsg.includes('Permission')) {
        this.errorMessage = 'Acceso a cámara denegado. Por favor, permita el acceso a la cámara en su navegador.';
      } else if (errorMsg.includes('NotFoundError') || errorMsg.includes('not found')) {
        this.errorMessage = 'No se encontró ninguna cámara en el dispositivo.';
      } else if (errorMsg.includes('NotReadableError') || errorMsg.includes('in use')) {
        this.errorMessage = 'La cámara está siendo usada por otra aplicación.';
      } else {
        this.errorMessage = 'No se pudo acceder a la cámara. Verifique los permisos.';
      }
      
      this.closeScanner.emit();
    }
  }

  async stopScanner(): Promise<void> {
    if (this.html5QrCode) {
      try {
        const state = this.html5QrCode.getState();
        if (state === Html5QrcodeScannerState.SCANNING || state === Html5QrcodeScannerState.PAUSED) {
          await this.html5QrCode.stop();
          this.html5QrCode.clear();
        }
      } catch {
        // Ignore errors when stopping
      } finally {
        this.html5QrCode = null;
        this.isCameraActive = false;
      }
    }
  }

  private onScanSuccess(decodedText: string): void {
    this.barcodeScanned.emit(decodedText);
    this.stopScanner();
  }

  close(): void {
    this.stopScanner();
    this.closeScanner.emit();
  }

  get containerId(): string {
    return this.scannerContainerId;
  }
}
