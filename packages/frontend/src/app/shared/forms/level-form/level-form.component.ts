import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Level } from 'src/app/core/models';
import { LevelService } from 'src/app/core/services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-level-form',
  template: `
  <div>
    <mat-card>
      <form [formGroup]="levelForm" (ngSubmit)="save()">
        <mat-form-field appearance="outline">
          <mat-label>Name</mat-label>
          <input
            matInput
            formControlName="name"
          />
        </mat-form-field>

        <br>

        <mat-form-field appearance="outline">
          <mat-label>Description</mat-label>
          <textarea
            matInput
            formControlName="description"
          ></textarea>
        </mat-form-field>

        <mat-card-actions>
          <button mat-button type="submit" [disabled]="!levelForm.valid" color="primary">
            Save
          </button>
        </mat-card-actions>
      </form>
    </mat-card>
  </div>`,
  styleUrls: [ './level-form.component.scss' ]
})
export class LevelFormComponent implements OnInit {
  @Input() level: Level;
  @Output() saved = new EventEmitter<Level>();

  levelForm: FormGroup;

  constructor(
    private readonly levelSrv: LevelService,
    private readonly fb: FormBuilder
  ) { }

  ngOnInit(): void {
    if (!this.level) {
      throw new Error('LevelFormComponent: level undefined');
    }

    this.levelForm = this.fb.group({
      name: [ this.level.name, [ Validators.required, Validators.minLength(3) ] ],
      description: [ this.level.description, [ Validators.maxLength(255) ] ]
    });
  }

  async save() {
    try {
      if (this.level.id) {
        this.level = await this.levelSrv.saveOne({ id: this.level.id, ...this.levelForm.value });
      } else {
        this.level = await this.levelSrv.addOne(this.levelForm.value);
      }

      this.saved.emit(this.levelForm.value);

    } catch (error) {
      console.error(error);
    }
  }

}
