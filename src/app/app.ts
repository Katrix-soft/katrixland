import { Component, signal, HostListener, OnInit } from '@angular/core';
import { loadMercadoPago } from '@mercadopago/sdk-js';
import { CyberCatComponent } from './cyber-cat/cyber-cat.component';
import { ParticleTextComponent } from './particle-text/particle-text.component';

@Component({
  selector: 'app-root',
  imports: [CyberCatComponent, ParticleTextComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  currentView = signal('home');
  activeSection = signal('caracteristicas');
  selectedService = signal('');
  isSubmitting = signal(false);
  submitSuccess = signal(false);
  submitError = signal(false);
  isMobileMenuOpen = signal(false);
  isEcommerceDropdownOpen = signal(false);
  isServiceDropdownOpen = signal(false);
  selectedProject = signal<string>('shoply');
  mp: any;

  async ngOnInit() {
    await loadMercadoPago();
    // @ts-ignore
    this.mp = new window.MercadoPago("TU_PUBLIC_KEY");
  }

  toggleEcommerceDropdown(event: Event) {
    event.stopPropagation();
    this.isEcommerceDropdownOpen.set(!this.isEcommerceDropdownOpen());
  }

  toggleServiceDropdown(event: Event) {
    event.stopPropagation();
    this.isServiceDropdownOpen.set(!this.isServiceDropdownOpen());
  }

  selectProject(project: string, event: Event) {
    event.stopPropagation();
    this.selectedProject.set(project);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (this.isEcommerceDropdownOpen()) {
      this.isEcommerceDropdownOpen.set(false);
    }
    if (this.isServiceDropdownOpen()) {
      this.isServiceDropdownOpen.set(false);
    }
  }

  setView(view: string, event: Event) {
    event.preventDefault();
    this.currentView.set(view);
    window.scrollTo(0, 0);
  }

  scrollToContact(service: string, event: Event) {
    event.preventDefault();
    this.selectedService.set(service);
    const element = document.getElementById('contacto');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToSection(sectionId: string) {
    this.activeSection.set(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  async pagarPlan(titulo: string, precio: number, event: Event) {
    event.preventDefault();
    try {
      const response = await fetch('/api/create_preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: titulo, price: precio })
      });
      const data = await response.json();
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        console.error('No se recibió init_point', data);
        alert('Hubo un error al procesar el pago. Por favor intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error al iniciar el pago', error);
      alert('Hubo un error al conectarse con el servidor de pagos.');
    }
  }

  async submitForm(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    
    // Verificación de Honeypot para bots
    if (formData.get('_honey')) {
      return;
    }

    this.isSubmitting.set(true);
    this.submitSuccess.set(false);
    this.submitError.set(false);

    try {
      const payload = {
        nombre: formData.get('nombre'),
        email: formData.get('email'),
        servicio_interes: formData.get('servicio_interes'),
        mensaje: formData.get('mensaje')
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        this.submitSuccess.set(true);
        form.reset();
        this.selectedService.set('');
        setTimeout(() => this.submitSuccess.set(false), 5000);
      } else {
        this.submitError.set(true);
      }
    } catch (error) {
      this.submitError.set(true);
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
