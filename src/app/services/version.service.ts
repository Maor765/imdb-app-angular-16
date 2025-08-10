// version.service.ts (optional)
import { Injectable } from '@angular/core';
import packageJson from './../../../package.json';

@Injectable({
  providedIn: 'root',
})
export class VersionService {
  version = packageJson.version;
}
