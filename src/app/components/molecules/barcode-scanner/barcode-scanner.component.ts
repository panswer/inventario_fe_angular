import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import Quagga from '@ericblade/quagga2';

interface BarcodeFormat {
  value: string;
  label: string;
}

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

  @ViewChild('scannerContainer') scannerContainer!: ElementRef<HTMLDivElement>;

  isCameraActive = false;
  errorMessage = '';
  isLoading = true;
  private isInitialized = false;

  selectedFormat = 'auto';
  
  barcodeFormats: BarcodeFormat[] = [
    { value: 'auto', label: 'Auto-detectar' },
    { value: 'ean_8', label: 'EAN-8' },
    { value: 'ean_13', label: 'EAN-13' },
    { value: 'upc', label: 'UPC-A/E' },
    { value: 'code_128', label: 'Code 128' },
    { value: 'code_39', label: 'Code 39' },
    { value: 'qr', label: 'QR Code' },
  ];

  ngOnInit(): void {
    // Nothing to initialize here
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isScanning']) {
      if (this.isScanning) {
        setTimeout(() => this.startScanner(), 100);
      } else {
        this.stopScanner();
      }
    }
  }

  ngOnDestroy(): void {
    this.stopScanner();
  }

  onFormatChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedFormat = select.value;
    this.restartScanner();
  }

  restartScanner(): void {
    this.stopScanner();
    this.isInitialized = false;
    setTimeout(() => this.startScanner(), 100);
  }

  private getReadersForFormat(format: string): any[] {
    switch (format) {
      case 'ean_8':
        return ['ean_8_reader'];
      case 'ean_13':
        return ['ean_reader'];
      case 'upc':
        return ['upc_reader', 'upc_e_reader'];
      case 'code_128':
        return ['code_128_reader'];
      case 'code_39':
        return ['code_39_reader'];
      case 'qr':
        return ['qr_code'];
      case 'auto':
      default:
        return [
          'ean_reader',
          'ean_8_reader',
          'upc_reader',
          'upc_e_reader',
          'code_128_reader',
          'code_39_reader',
          'code_93_reader',
        ];
    }
  }

  startScanner(): void {
    this.errorMessage = '';
    this.isLoading = true;
    this.isCameraActive = false;

    if (this.isInitialized) {
      return;
    }

    const container = this.scannerContainer?.nativeElement;
    if (!container) {
      this.errorMessage = 'Contenedor no encontrado';
      this.isLoading = false;
      return;
    }

    console.log('Initializing Quagga2 with format:', this.selectedFormat);

    const readers = this.getReadersForFormat(this.selectedFormat);
    console.log('Readers:', readers);

    Quagga.init(
      {
        inputStream: {
          type: 'LiveStream',
          target: container,
          constraints: {
            facingMode: 'environment',
            width: { min: 640, ideal: 1280, max: 1920 },
            height: { min: 480, ideal: 720, max: 1080 },
          },
        },
        decoder: {
          readers: readers,
        },
        locate: true,
        locator: {
          patchSize: 'medium',
          halfSample: true,
        },
      },
      (err: string | null) => {
        console.log('Quagga init result:', err);
        
        if (err) {
          this.isLoading = false;
          
          if (err.includes('NotAllowedError') || err.includes('Permission')) {
            this.errorMessage = 'Acceso a cámara denegado. Permita el acceso en su navegador.';
          } else if (err.includes('NotFoundError')) {
            this.errorMessage = 'No se encontró cámara en el dispositivo.';
          } else {
            this.errorMessage = 'Error al inicializar: ' + err;
          }
          
          this.closeScanner.emit();
          return;
        }

        console.log('Quagga initialized, starting...');
        this.isInitialized = true;
        
        try {
          Quagga.start();
          this.isCameraActive = true;
          this.isLoading = false;
          console.log('Quagga started successfully');
        } catch (startErr) {
          console.error('Error starting Quagga:', startErr);
          this.errorMessage = 'Error al iniciar el escáner';
          this.isLoading = false;
        }
      }
    );

    Quagga.onDetected((result) => {
      console.log('Detection result:', result);
      if (result && result.codeResult && result.codeResult.code) {
        console.log('Barcode detected:', result.codeResult.code);
        this.barcodeScanned.emit(result.codeResult.code);
        this.stopScanner();
      }
    });
  }

  stopScanner(): void {
    console.log('Stopping Quagga...');
    try {
      if (this.isInitialized) {
        Quagga.stop();
        Quagga.offDetected();
      }
    } catch (e) {
      console.error('Error stopping Quagga:', e);
    }
    this.isInitialized = false;
    this.isCameraActive = false;
    this.isLoading = false;
  }

  closeModal(): void {
    this.stopScanner();
    this.closeScanner.emit();
  }
}
