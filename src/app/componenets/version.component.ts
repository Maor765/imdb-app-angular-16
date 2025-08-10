import { Component } from '@angular/core';
import { VersionService } from '../services/version.service';

@Component({
  selector: 'app-version',
  template: `<div>Version: {{ versionService.version }}</div>`,
})
export class VersionComponent {
  constructor(public versionService: VersionService) {}
}
