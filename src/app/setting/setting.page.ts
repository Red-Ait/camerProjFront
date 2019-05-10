import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {

  apiUri = '';
  constructor(private storage: Storage) { }

  ngOnInit() {
    this.storage.get('uri').then(uri => {
      if (uri !== null) {
        this.apiUri = uri;
      }
    });
  }
  save() {
    this.storage.set('uri', this.apiUri);
  }
}
