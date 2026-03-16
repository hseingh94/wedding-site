import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  isUnlocked = false;
  showRsvpForm = false; // Controls the Modal visibility
  currentSlideIndex = 0;
  audio = new Audio('music.mp3');
  
  selectedGuests: number = 1;
  guestNames: string[] = ['']; 

  slides = [
    '1.jpg',  '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg',
    '9.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg'
  ];
  
  animations = ['fade-blur', 'zoom-in', 'soft-glow', 'slide-up'];
  currentAnimation = 'fade-blur';
  countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
  targetDate = new Date('2026-09-01T00:00:00').getTime();
  
  slideInterval: any;
  timerInterval: any;
  private canvasRequestId: number | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.startCountdown();
    this.startSlideshow();
    setTimeout(() => this.initGoldDust(), 100);
  }

  unlock() {
    this.isUnlocked = true;
    this.audio.loop = true;
    this.audio.volume = 0.4;
    this.audio.play().catch(() => console.log("Audio blocked"));
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#FFFFFF', '#fcf6ba']
    });
  }

  toggleRsvp() {
    this.showRsvpForm = !this.showRsvpForm;
  }

  selectGuests(num: number) {
    this.selectedGuests = num;
    const newNames = new Array(num).fill('');
    this.guestNames.forEach((name, i) => {
      if (i < num) newNames[i] = name;
    });
    this.guestNames = newNames;
    this.cdr.detectChanges();
  }

  trackByIndex(index: number) { return index; }

  getWhatsAppLink() {
    const phone = "961XXXXXXXX"; 
    const namesList = this.guestNames.filter(n => n.trim() !== '').join(', ');
    const message = `Hi Hussein & Maguy! We are so happy to attend!\n\nTotal Guests: ${this.selectedGuests}\nNames: ${namesList || 'Not specified'}`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }

  // --- Utility ---
  startSlideshow() {
    this.slideInterval = setInterval(() => {
      this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slides.length;
      this.currentAnimation = this.animations[Math.floor(Math.random() * this.animations.length)];
      this.cdr.detectChanges();
    }, 3500);
  }

  startCountdown() {
    this.timerInterval = setInterval(() => {
      const now = new Date().getTime();
      const distance = this.targetDate - now;
      if (distance > 0) {
        this.countdown.days = Math.floor(distance / (1000 * 60 * 60 * 24));
        this.countdown.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        this.countdown.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        this.countdown.seconds = Math.floor((distance % (1000 * 60)) / 1000);
      }
      this.cdr.detectChanges();
    }, 1000);
  }

  initGoldDust() {
    const canvas = document.getElementById('particleCanvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let particles: any[] = [];
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: Math.random() * 0.4 - 0.2,
        speedY: Math.random() * 0.4 - 0.2,
        opacity: Math.random()
      });
    }
    const animate = () => {
      if (this.isUnlocked) {
        if (this.canvasRequestId) cancelAnimationFrame(this.canvasRequestId);
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.speedX; p.y += p.speedY;
        if (p.x > canvas.width) p.x = 0; if (p.y > canvas.height) p.y = 0;
        ctx.fillStyle = `rgba(212, 175, 55, ${p.opacity})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
      });
      this.canvasRequestId = requestAnimationFrame(animate);
    };
    animate();
  }

  ngOnDestroy() {
    if (this.slideInterval) clearInterval(this.slideInterval);
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.canvasRequestId) cancelAnimationFrame(this.canvasRequestId);
    this.audio.pause();
  }
}