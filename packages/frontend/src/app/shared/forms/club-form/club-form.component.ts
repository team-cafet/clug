import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Club } from 'src/app/core/models';
import { ClubService } from 'src/app/core/services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-club-form',
  templateUrl: './club-form.component.html',
  styleUrls: [ './club-form.component.scss' ]
})
export class ClubFormComponent implements OnInit {
  @Input() club: Club;
  @Output() saved = new EventEmitter<Club>();

  clubForm: FormGroup;

  constructor(
    private readonly memberSrv: ClubService,
    private readonly clubSrv: ClubService,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit(): void {
    if (!this.club) {
      throw new Error('ClubFormComponent: club undefined');
    }

    this.clubForm = this.fb.group({
      designation: [ this.club.designation, [Validators.required, Validators.minLength(3) ] ],
      description: [ this.club.description, [Validators.maxLength(255)] ]
    });
  }

  async save() {
    try {
      if (this.club.id) {
        this.club = await this.clubSrv.saveOne({
          id: this.club.id,
          ...this.clubForm.value
        });
      } else {
        this.club = await this.clubSrv.addOne(this.clubForm.value);
      }

      this.saved.emit(this.club);
    } catch (error) {
      console.error(error);
    }
  }
}
