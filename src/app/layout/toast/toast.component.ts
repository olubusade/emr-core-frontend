import { Component, OnInit } from '@angular/core';
import { Toast, ToastService } from 'src/app/core/service/toast.service';


@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.sass'] // You'll need CSS for styling/positioning
})
export class ToastComponent implements OnInit {
  toast: Toast | null = null;
  isVisible: boolean = false;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    // Subscribe to the observable in the service to listen for new toasts
    this.toastService.toast$
      .subscribe(toast => {
        if (toast) {
          this.toast = toast;
          this.isVisible = true;
          
          // Auto-hide the toast after a duration
          setTimeout(() => {
            this.close();
          }, toast.duration);
        }
      });
  }

  close() {
    this.isVisible = false;
    this.toast = null;
  }
}