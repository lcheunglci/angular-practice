import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactsService } from '../contacts/contacts.service';
import { addressTypeValues, phoneTypeValues } from '../contacts/contact.model';
import { restrictedWords } from '../validators/restricted-words.validator';

@Component({
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.css'],
})
export class EditContactComponent implements OnInit {
  phoneTypes = phoneTypeValues;
  addressTypes = addressTypeValues;
  contactForm = this.fb.nonNullable.group({
    id: '',
    icon: '',
    personal: false,
    firstName: ['', [Validators.required, Validators.minLength(3)]],
    lastName: '',
    dateOfBirth: <Date | null>null,
    favoritesRanking: <number | null>null,
    phones: this.fb.array([this.createPhoneGroup()]),
    address: this.fb.nonNullable.group({
      streetAddress: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      addressType: '',
    }),
    notes: ['', restrictedWords(['foo', 'bar'])],
  });

  constructor(
    private route: ActivatedRoute,
    private contactsService: ContactsService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    const contactId = this.route.snapshot.params['id'];
    if (!contactId) return;

    this.contactsService.getContact(contactId).subscribe((contact) => {
      if (!contact) {
        return;
      }

      for (let i = 1; i < contact.phones.length; i++) {
        this.contactForm.controls.phones.push(this.createPhoneGroup());
      }

      this.contactForm.setValue(contact);
    });
  }

  createPhoneGroup() {
    const phoneGroup = this.fb.nonNullable.group({
      phoneNumber: '',
      phoneType: '',
      preferred: false,
    });

    phoneGroup.controls.preferred.valueChanges.subscribe(value => {
      ;
    })

    return phoneGroup;
  }
  
  addPhone() {
    return this.contactForm.controls.phones.push(this.createPhoneGroup());
  }

  get firstName() {
    return this.contactForm.controls.firstName;
  }

  get address() {
    return this.contactForm.controls.address;
  }

  get notes() {
    return this.contactForm.controls.notes;
  }

  saveContact() {
    this.contactsService
      .saveContact(this.contactForm.getRawValue())
      .subscribe({ next: () => this.router.navigate(['/contacts']) });
  }
}
