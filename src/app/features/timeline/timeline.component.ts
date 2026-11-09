import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideLeftComponent } from './components/side-left/side-left.component';
import { SideRightComponent } from './components/side-right/side-right.component';

@Component({
  selector: 'app-timeline',
  imports: [SideLeftComponent, SideRightComponent, RouterOutlet],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.css',
})
export class TimelineComponent {}
