import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener } from '@angular/core';

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  density: number;
  isBlue: boolean;
  alpha: number;
}

@Component({
  selector: 'app-particle-text',
  standalone: true,
  templateUrl: './particle-text.component.html',
  styleUrls: ['./particle-text.component.scss']
})
export class ParticleTextComponent implements AfterViewInit, OnDestroy {
  @ViewChild('particleCanvas', { static: true }) particleCanvas!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private width: number = 0;
  private height: number = 0;

  private particles: Particle[] = [];
  private words: string[] = ['KATRIX', 'AUTOMATIZACIÓN', 'INFRAESTRUCTURA', 'IA'];
  private currentWordIndex: number = 0;

  private particleSize: number = 2.5;
  private particleSpacing: number = 5;
  private mouseRadius: number = 100;

  private mouse: { x: number | null; y: number | null } = { x: null, y: null };

  private animationFrameId: number = 0;
  private timeouts: any[] = [];

  ngAfterViewInit(): void {
    const canvas = this.particleCanvas.nativeElement;
    this.ctx = canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
    
    const parent = canvas.parentElement || document.body;
    this.width = canvas.width = parent.clientWidth;
    this.height = canvas.height = parent.clientHeight;

    this.animate();
    this.changeWord(this.words[0]);

    const initialTimeout = setTimeout(() => this.nextWord(), 8000);
    this.timeouts.push(initialTimeout);
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.timeouts.forEach(t => clearTimeout(t));
  }

  @HostListener('window:resize')
  onResize(): void {
    const canvas = this.particleCanvas.nativeElement;
    const parent = canvas.parentElement || document.body;
    this.width = canvas.width = parent.clientWidth;
    this.height = canvas.height = parent.clientHeight;
    this.changeWord(this.words[this.currentWordIndex]);
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.particleCanvas && this.particleCanvas.nativeElement) {
      const rect = this.particleCanvas.nativeElement.getBoundingClientRect();
      this.mouse.x = event.clientX - rect.left;
      this.mouse.y = event.clientY - rect.top;
    } else {
      this.mouse.x = event.clientX;
      this.mouse.y = event.clientY;
    }
  }

  @HostListener('window:mouseout')
  onMouseOut(): void {
    this.mouse.x = null;
    this.mouse.y = null;
  }

  // --- Métodos adaptados de la clase Particle y auxiliares ---

  private createParticle(x: number, y: number): Particle {
    return {
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      baseX: x,
      baseY: y,
      size: this.particleSize,
      density: (Math.random() * 30) + 1,
      isBlue: Math.random() > 0.5,
      alpha: Math.random() * 0.5 + 0.5
    };
  }

  private updateParticle(p: Particle): void {
    if (this.mouse.x !== null && this.mouse.y !== null) {
      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const distanceSq = dx * dx + dy * dy;
      const maxDistanceSq = this.mouseRadius * this.mouseRadius;
      
      if (distanceSq < maxDistanceSq) {
        const distance = Math.sqrt(distanceSq);
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const force = (this.mouseRadius - distance) / this.mouseRadius;
        
        const directionX = forceDirectionX * force * p.density * 3;
        const directionY = forceDirectionY * force * p.density * 3;
        
        p.x -= directionX;
        p.y -= directionY;
        return;
      }
    }

    // Regresar a la posición base si no está afectado por el mouse
    if (p.x !== p.baseX) {
      const dx = p.x - p.baseX;
      p.x -= dx / 10;
    }
    if (p.y !== p.baseY) {
      const dy = p.y - p.baseY;
      p.y -= dy / 10;
    }
  }

  private explodeParticle(p: Particle): void {
    p.baseX = Math.random() * this.width;
    p.baseY = Math.random() * this.height;
  }

  private getWordPixels(word: string): { x: number; y: number }[] {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = 'white';
    
    const baseFontSize = this.width > 800 ? 120 : (this.width > 500 ? 80 : 50);
    this.ctx.font = `bold ${baseFontSize}px "Courier New", monospace`;
    
    const textWidth = this.ctx.measureText(word).width;
    if (textWidth > this.width * 0.9) {
      const scaledFontSize = Math.floor(baseFontSize * ((this.width * 0.9) / textWidth));
      this.ctx.font = `bold ${scaledFontSize}px "Courier New", monospace`;
    }

    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(word, this.width / 2, this.height / 2);

    const imageData = this.ctx.getImageData(0, 0, this.width, this.height);
    const pixels: { x: number; y: number }[] = [];

    for (let y = 0; y < this.height; y += this.particleSpacing) {
      for (let x = 0; x < this.width; x += this.particleSpacing) {
        const index = (y * this.width + x) * 4;
        const alpha = imageData.data[index + 3];
        if (alpha > 128) {
          pixels.push({ x, y });
        }
      }
    }
    return pixels;
  }

  private changeWord(word: string): void {
    const newPixels = this.getWordPixels(word);
    this.ctx.clearRect(0, 0, this.width, this.height);

    if (this.particles.length < newPixels.length) {
      const diff = newPixels.length - this.particles.length;
      for (let i = 0; i < diff; i++) {
        this.particles.push(this.createParticle(newPixels[0].x, newPixels[0].y));
      }
    } else if (this.particles.length > newPixels.length) {
      this.particles.splice(newPixels.length);
    }

    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].baseX = newPixels[i].x;
      this.particles[i].baseY = newPixels[i].y;
    }
  }

  private explodeParticles(): void {
    for (let i = 0; i < this.particles.length; i++) {
      this.explodeParticle(this.particles[i]);
    }
  }

  private animate = (): void => {
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    for (let i = 0; i < this.particles.length; i++) {
      this.updateParticle(this.particles[i]);
    }

    this.ctx.fillStyle = '#2563eb';
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      if (p.isBlue) {
        this.ctx.globalAlpha = p.alpha;
        this.ctx.fillRect(p.x - p.size, p.y - p.size, p.size * 2, p.size * 2);
      }
    }

    this.ctx.fillStyle = '#8b5cf6';
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      if (!p.isBlue) {
        this.ctx.globalAlpha = p.alpha;
        this.ctx.fillRect(p.x - p.size, p.y - p.size, p.size * 2, p.size * 2);
      }
    }

    this.ctx.globalAlpha = 1.0;
    this.animationFrameId = requestAnimationFrame(this.animate);
  }

  private nextWord = (): void => {
    this.explodeParticles();
    
    const timeout1 = setTimeout(() => {
      this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
      this.changeWord(this.words[this.currentWordIndex]);
      
      const timeout2 = setTimeout(this.nextWord, 8000);
      this.timeouts.push(timeout2);
    }, 1000);
    
    this.timeouts.push(timeout1);
  }
}
