import { Component, signal, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  currentView = signal('home');
  activeSection = signal('caracteristicas');
  selectedService = signal('');
  isSubmitting = signal(false);
  submitSuccess = signal(false);
  submitError = signal(false);
  isMobileMenuOpen = signal(false);
  isEcommerceDropdownOpen = signal(false);

  toggleEcommerceDropdown(event: Event) {
    event.stopPropagation();
    this.isEcommerceDropdownOpen.set(!this.isEcommerceDropdownOpen());
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (this.isEcommerceDropdownOpen()) {
      this.isEcommerceDropdownOpen.set(false);
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
      const response = await fetch('https://formsubmit.co/ajax/consultas@mail.katrix.com.ar', {
        method: 'POST',
        headers: {
            'Accept': 'application/json'
        },
        body: formData
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
