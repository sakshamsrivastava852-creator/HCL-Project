import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

@Injectable({
  providedIn: "root"
})
export class NotificationService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  public toasts$ = this.toastsSubject.asObservable();
  private nextId = 1;

  show(message: string, type: "success" | "error" | "info" | "warning" = "info", duration = 3500) {
    const id = this.nextId++;
    const current = this.toastsSubject.getValue();
    this.toastsSubject.next([...current, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => this.remove(id), duration);
    }
  }

  success(message: string, duration = 3500) {
    this.show(message, "success", duration);
  }

  error(message: string, duration = 4500) {
    this.show(message, "error", duration);
  }

  info(message: string, duration = 3500) {
    this.show(message, "info", duration);
  }

  warning(message: string, duration = 3500) {
    this.show(message, "warning", duration);
  }

  remove(id: number) {
    const current = this.toastsSubject.getValue();
    this.toastsSubject.next(current.filter(t => t.id !== id));
  }
}
