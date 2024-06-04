import { Component, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonFooter,
  IonButton,
  IonSpinner
} from '@ionic/angular/standalone';
import { LunaSDK } from 'capacitor-luna-id-sdk';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonButton, IonSpinner, NgIf],
})
export class HomePage implements OnInit {
  init: boolean = false;
  bestShot: SafeResourceUrl | null = null;

  constructor(private sanitizer: DomSanitizer) {
  }

  async ngOnInit() {
    const {initialized} = await LunaSDK.initialize({
      livenessEnabled: true,
      interactionEnabled: true,
      trackFaceIdentity: false,
      interactionTimeout: 30000,
      headers:{
        'X-Authorization': 'Y2I3MDk2MWQtYTBlMi00MzY4LWFhNzgtOGUyYmI5N2M3NWExOjZDNTNFMTdDODVGNzk0RTg3RThGMEJCNDZENjU2Qjk2'
      }
    })
    this.init = initialized;
  }

  async start() {
    const { base64String } = await LunaSDK.start();
    if (base64String) {
      try {
        const blob = this.b64toBlob(base64String);
        const objectUrl = window.URL.createObjectURL(blob);
        this.bestShot = this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);
      } catch (e) {
        console.error('BESTSHOT', e);
      }
    }
  }

  b64toBlob(
    data: string,
    contentType: string = ''
  ) {
    const binaryData = atob(data);
    const bytes = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      bytes[i] = binaryData.charCodeAt(i);
    }
    return new Blob([bytes], { type: contentType });
  }
}
