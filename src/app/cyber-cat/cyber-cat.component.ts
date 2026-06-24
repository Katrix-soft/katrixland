import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-cyber-cat',
  standalone: true,
  templateUrl: './cyber-cat.component.html',
  styleUrls: ['./cyber-cat.component.css']
})
export class CyberCatComponent implements AfterViewInit {
  @ViewChild('videoPlayer') videoElement!: ElementRef<HTMLVideoElement>;

  ngAfterViewInit() {
    if (this.videoElement && this.videoElement.nativeElement) {
      this.videoElement.nativeElement.muted = true;
      this.videoElement.nativeElement.play().catch(err => {
        console.warn('Autoplay prevented by browser:', err);
      });
    }
  }
}
