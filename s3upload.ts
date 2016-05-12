import {OnInit, Component, Input} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';
import {S3Upload} from './s3uploadservice';
import {UploadDirective} from './s3uploaddirective';

@Component({
  selector: 'upload',
  templateUrl: './templates/s3upload.html',
  directives: [UploadDirective],
  providers: [S3Upload, HTTP_PROVIDERS]
})

export class s3upload {

  constructor(private s3Upload: S3Upload) {}

  upload() {
    this.s3Upload.upload();
  }

  pauseUpload(index) {
  }

  removeUpload(index) {
  }

  onChange(event) {
   this.s3Upload.add(event.srcElement.files);
  }
}