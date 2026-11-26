import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  @Input() roleFilter: string = ''; 
  users: any[] = [];
  errorMessage: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    if (this.roleFilter) {
      this.authService.getUsersByRole(this.roleFilter).subscribe({
        next: (res) => this.users = res,
        error: (err) => this.errorMessage = err
      });
    } else {
      this.authService.getAllUsers().subscribe({
        next: (res) => this.users = res,
        error: (err) => this.errorMessage = err
      });
    }
  }
}