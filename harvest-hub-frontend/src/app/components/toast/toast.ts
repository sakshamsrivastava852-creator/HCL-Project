import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NotificationService, Toast } from "../../services/notification.service";

@Component({
  selector: "app-toast",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./toast.html",
  styleUrl: "./toast.css"
})
export class ToastComponent implements OnInit {
  toasts: Toast[] = [];

  constructor(
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.notificationService.toasts$.subscribe(toasts => {
      this.toasts = toasts;
      this.cdr.detectChanges();
    });
  }

  dismiss(id: number) {
    this.notificationService.remove(id);
    this.cdr.detectChanges();
  }
}
