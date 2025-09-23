import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { VideoService } from '../../core/services/video.service';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-video-upload',
    standalone: true,
  templateUrl: './video-upload.component.html',
  styleUrls: ['./video-upload.component.scss'],
  imports: [MatCardModule,MatButtonModule,MatIconModule]
})
export class VideoUploadComponent implements OnInit {
  videoUrl: string | null = null;
  videoFile: File | null = null;
  uploadedFilename: string | null = null;

  constructor(
  private videoService: VideoService,
    private cd: ChangeDetectorRef
) {}

ngOnInit() {

 this.getVideos() 

}

getVideos(){
    this.videoService.getProjectVideo().subscribe((res:any) => {
  if (res.videos.length) {
     const  baseUrl = 'https://api.mirrorengineering.com/'; 
    this.videoUrl = `${baseUrl}uploads/videos/${res.videos[0]}`;
    this.uploadedFilename = res.videos[0].split('/').pop();
  }
    this.cd.detectChanges();
});
}


  

  onFileSelected(event: Event) {
    const  baseUrl = 'https://api.mirrorengineering.com/'; 
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];

      this.videoService.uploadVideo(file).subscribe({
        next: (res) => {
          console.log('Uploaded:', res);
          this.videoUrl = `${baseUrl}/${res.path}`; // The API returns path
          this.uploadedFilename = res.path.split('/').pop();
        },
        error: (err) => console.error(err),
      });
    }
  }

  removeVideo() {
    if (this.uploadedFilename) {
      console.log(this.uploadedFilename);
      
      this.videoService.deleteVideo(this.uploadedFilename).subscribe({
        next: (res) => {
          console.log('Deleted:', res);
          this.videoUrl = null;
          this.uploadedFilename = null;
        },
        error: (err) => console.error(err),
      });
    }
  }
}
