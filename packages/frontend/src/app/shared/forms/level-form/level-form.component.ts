import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Level } from 'src/app/core/models';
import { LevelService } from 'src/app/core/services';

@Component({
  selector: 'app-level-form',
  template: `
  <div>
    <form>
      <mat-card class="club-card">
        <mat-form-field class="full-width">
          <mat-label>Name</mat-label>
          <input
            matInput
            [ngModelOptions]="{ standalone: true }"
            [(ngModel)]="level.name"
          />
        </mat-form-field>
        <mat-form-field class="full-width">
          <mat-label>Description</mat-label>
          <textarea
            matInput
            [ngModelOptions]="{ standalone: true }"
            [(ngModel)]="level.description"
          ></textarea>
        </mat-form-field>
        <mat-card-actions>
          <button mat-button type="button" color="primary" (click)="save()">
            Save
          </button>
        </mat-card-actions>
      </mat-card>
    </form>
  </div>`,
  styleUrls: [ './level-form.component.scss' ]
})
export class LevelFormComponent {
  @Input() level: Level;
  @Output() saved = new EventEmitter<Level>();

  constructor(
    private readonly levelSrv: LevelService
  ) { }

  async save() {
    const backupLevel = this.level;
    try {
      if (this.level.id) {
        this.level = await this.levelSrv.saveOne(this.level);
      } else {
        this.level = await this.levelSrv.addOne(this.level);
      }

      this.saved.emit(this.level);

    } catch (error) {
      console.error(error);
      this.level = backupLevel;
    }
  }

}
