import {Component, OnInit} from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import {HttpEventType, HttpResponse} from '@angular/common/http';
import {UploadFileService} from '../../service/UploadFileService';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  image: any = '';
  desg = null;
  ss: any;
  aux: any;
  selectedFiles: FileList;
  currentFileUpload: File;
  progress: { percentage: number } = { percentage: 0 };
  constructor(private camera: Camera, private uploadService: UploadFileService,
              private navCtrl: NavController
  ) { }

  ngOnInit() {

  }
  toSetting() {
    this.navCtrl.navigateForward('/setting');
  }
  openCam() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      this.uploadCam(this.base64ToFile(imageData));
    }, (err) => {
      // Handle error
      alert('error  ' + JSON.stringify(err));
    });

  }
  uploadCam(img: File) {
    this.progress.percentage = 0;
    this.currentFileUpload = img;
    this.uploadService.pushFileToStorage(this.currentFileUpload).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progress.percentage = Math.round(100 * event.loaded / event.total);
      } else if (event instanceof HttpResponse) {
      }
    });
  }

  base64ToFile(base64: string) {
    const date = new Date().valueOf();
    let text = '';
    const possibleText = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      text += possibleText.charAt(Math.floor(Math.random() *    possibleText.length));
    }
    const imageName = date + '.' + text + '.jpeg';
    const imageBlob = this.dataURItoBlob(base64);
    return  new File([imageBlob], imageName, { type: 'image/jpeg' });
  }

  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    return blob;
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
    this.upload();
  }
  upload() {
    this.progress.percentage = 0;
    if (this.selectedFiles !== undefined) {
      this.currentFileUpload = this.selectedFiles.item(0);
      this.uploadService.pushFileToStorage(this.currentFileUpload).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress.percentage = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
        }
      });
      this.selectedFiles = undefined;
    }
  }
  voirPhotos() {
    this.uploadService.allPhotos().subscribe(data => {
      this.desg = data;
    });
  }
}
