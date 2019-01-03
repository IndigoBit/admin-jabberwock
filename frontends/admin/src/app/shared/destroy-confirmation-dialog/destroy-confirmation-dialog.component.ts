import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "app-destroy-confirmation-dialog",
  templateUrl: "./destroy-confirmation-dialog.component.html",
  styleUrls: ["./destroy-confirmation-dialog.component.scss"]
})
export class DestroyConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DestroyConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { text: string }
  ) {}

  cancel(): void {
    this.dialogRef.close();
  }
}
