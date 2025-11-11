import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editor-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './editor-sidebar.component.html',
  styleUrls: ['./editor-sidebar.component.scss']
})
export class EditorSidebarComponent {
  selected: string = 'news';

  @Output() sectionChange = new EventEmitter<string>();

  setSection(section: string) {
    this.selected = section;
    this.sectionChange.emit(section);
  }

  selectSection(section: string) {
    this.setSection(section);
  }
}
