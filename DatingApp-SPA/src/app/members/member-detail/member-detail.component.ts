import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryImage, NgxGalleryOptions, NgxGalleryAnimation } from 'ngx-gallery';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(private userService: UserService, private alertify: AlertifyService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
    });

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ];
    this.galleryImages = this.getImages();
    // this.galleryImages = [
    //   {
    //     small: 'https://randomuser.me/api/portraits/men/39.jpg',
    //     medium: 'https://randomuser.me/api/portraits/men/39.jpg',
    //     big: 'https://randomuser.me/api/portraits/men/39.jpg'
    //   },
    //   {
    //     small: 'https://randomuser.me/api/portraits/men/3.jpg',
    //     medium: 'https://randomuser.me/api/portraits/men/3.jpg',
    //     big: 'https://randomuser.me/api/portraits/men/3.jpg'
    //   },
    //   {
    //     small: 'https://randomuser.me/api/portraits/men/9.jpg',
    //     medium: 'https://randomuser.me/api/portraits/men/9.jpg',
    //     big: 'https://randomuser.me/api/portraits/men/9.jpg'
    //   },
    //   {
    //     small: 'https://randomuser.me/api/portraits/men/19.jpg',
    //     medium: 'https://randomuser.me/api/portraits/men/19.jpg',
    //     big: 'https://randomuser.me/api/portraits/men/19.jpg'
    //   },
    //   {
    //     small: 'https://randomuser.me/api/portraits/men/69.jpg',
    //     medium: 'https://randomuser.me/api/portraits/men/69.jpg',
    //     big: 'https://randomuser.me/api/portraits/men/69.jpg'
    //   },
    //   {
    //     small: 'https://randomuser.me/api/portraits/men/89.jpg',
    //     medium: 'https://randomuser.me/api/portraits/men/89.jpg',
    //     big: 'https://randomuser.me/api/portraits/men/89.jpg'
    //   }
    // ];
    console.log(this.galleryImages);
    console.log(this.galleryOptions);
  }

  getImages() {
    const imageUrls = [];
    for (const photo of this.user.photos) {
      imageUrls.push({
        small: photo.url,
        medium: photo.url,
        big: photo.url,
        description: photo.description
      });
    }
    return imageUrls;
  }

  // // members/4
  // loadUser() {
  //   // tslint:disable-next-line:max-line-length
  //   this.userService.getUser(+this.route.snapshot.params.id).subscribe((user: User) => { // (+) mean the return id will be int not string
  //     this.user = user;
  //   }, error => {
  //     this.alertify.error(error);
  //   });
  // }
}
