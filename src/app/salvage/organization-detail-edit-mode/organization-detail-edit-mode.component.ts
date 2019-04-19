// import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
// import { FormBuilder, Validators, FormGroup } from "@angular/forms";
// import { OrganizationGQL } from "../user-gql";
// import { UpdateOrganizationGQL } from "../update-organization-gql";
// import { Organization } from "../gql-schemas/organization.gql-schema";

// @Component({
//   selector: "app-organization-detail-edit-mode",
//   templateUrl: "./organization-detail-edit-mode.component.html",
//   styleUrls: ["./organization-detail-edit-mode.component.scss"]
// })
// export class OrganizationDetailEditModeComponent implements OnInit {
//   @Input() data: Organization;
//   @Output() updated: EventEmitter<void>;
//   protected formController: FormGroup;

//   constructor(
//     private fb: FormBuilder,
//     private updateOrganizationGQL: UpdateOrganizationGQL,
//     private organizationGQL: OrganizationGQL
//   ) {
//     this.updated = new EventEmitter<void>();
//   }

//   ngOnInit(): void {
//     this.formController = this.fb.group({
//       organizationId: [this.data._id],
//       name: [
//         this.data.name,
//         Validators.compose([Validators.required, Validators.maxLength(255)])
//       ],
//       website: [
//         this.data.website,
//         Validators.compose([Validators.maxLength(255)])
//       ],
//       contact_name: [
//         this.data.contact && this.data.contact.name,
//         Validators.compose([Validators.required, Validators.maxLength(255)])
//       ],
//       contact_phone: [
//         this.data.contact && this.data.contact.phone,
//         Validators.compose([Validators.maxLength(255)])
//       ],
//       contact_email: [
//         this.data.contact && this.data.contact.email,
//         Validators.compose([Validators.maxLength(255), Validators.email])
//       ],
//       contact_address: [
//         this.data.contact && this.data.contact.address,
//         Validators.compose([Validators.maxLength(1000)])
//       ]
//     });
//   }

//   protected save(): void {
//     console.log(this.formController.value);

//     this.updateOrganizationGQL
//       .mutate(this.formController.value, {
//         refetchQueries: [
//           {
//             query: this.organizationGQL.document,
//             variables: {
//               organizationId: this.formController.value.organizationId
//             }
//           }
//         ]
//       })
//       .subscribe(_ => this.updated.emit());
//   }

//   protected cancel(): void {
//     this.updated.emit();
//   }
// }
