import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { User } from 'src/app/_models/user';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  user: User;
  photoUrl: string;
  @ViewChild('editForm') editForm: NgForm;  // #editForm ="ngForm"
  @HostListener('window:beforeunload', ['$event'])    // hostListener will show confirm message if you had edit in your form/ if dirty and you want to close tap(window) and it's still dirty
  unloadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(private route: ActivatedRoute, private alertify: AlertifyService,
              private userService: UserService, private authService: AuthService, private title: Title) { }

  ngOnInit() {
    this.title.setTitle('Edit My Profile');
    this.route.data.subscribe(data => {
      this.user = data['profileUser'];
    });

    this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
  }

  updateUser() {
    this.userService.updateUser(this.authService.decodedToken.nameid, this.user).subscribe(next => {
      this.alertify.success('Profile Updated Successfully');
      this.editForm.reset(this.user); // reset the form keeping userData to make it not dirty to make button disabled and alert disappeared again
    }, error => {
      this.alertify.error(error);
      console.log(error);
    });
  }

  // updateMainPhoto(photoUrl) {
  //   this.user.photoUrl = photoUrl;
  // }
}
