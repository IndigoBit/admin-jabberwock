import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  ChangeDetectionStrategy
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { observable } from "rxjs";

@Component({
  selector: "app-inline-text-edit",
  templateUrl: "./inline-text-edit.component.html",
  styleUrls: ["./inline-text-edit.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InlineTextEditComponent implements OnInit {
  @Input() data: any;
  @Input() label: string;
  @Input() inputType: string;
  @Input() viewOnlyMode: boolean;
  @Output() updatedData: EventEmitter<any>;
  @Output() editingData: EventEmitter<boolean>;
  protected formControl: FormControl;

  protected editMode: boolean;

  constructor() {
    this.updatedData = new EventEmitter();
    this.editingData = new EventEmitter();
  }

  ngOnInit() {
    this.resetForm();
  }

  edit() {
    this.editMode = true;
    this.editingData.emit(this.editMode);
  }

  cancel() {
    this.resetForm();
  }

  save() {
    const newFieldValue = this.formControl.value;

    // only send an update signal if there was actually a change to the value
    if (newFieldValue !== this.data) {
      this.updatedData.next(newFieldValue);
    }

    this.resetForm();
  }

  resetForm() {
    this.editMode = false;
    this.formControl = new FormControl(this.data);
    this.editingData.emit(this.editMode);
  }
}
