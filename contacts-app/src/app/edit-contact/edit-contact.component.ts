import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { addressTypeValues, Contact, phoneTypeValues } from '../contacts/contact.model';
import { ContactsService } from '../contacts/contacts.service';
import { RestrictedWordsValidator } from '../validators/restricted-words-validator.directive';
import { DateValueAccessorDirective } from '../date-value-accessor/date-value-accessor.directive';
import { ProfileIconSelectorComponent } from '../profile-icon-selector/profile-icon-selector.component';

@Component({
  imports: [CommonModule, FormsModule, RestrictedWordsValidator, DateValueAccessorDirective, ProfileIconSelectorComponent],
  standalone: true,
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.css'],
})
export class EditContactComponent implements OnInit {
  phoneTypes = phoneTypeValues;
  addressTypes = addressTypeValues;

  contact: Contact = {
    id: '',
    icon: '',
    personal: false,
    firstName: '',
    lastName: '',
    dateOfBirth: null,
    favoritesRanking: 0,
    phones: [{
      phoneNumber: '',
      phoneType: '',
    }],
    address: {
      streetAddress: '',
      city: '',
      state: '',
      postalCode: '',
      addressType: '',
    },
    notes: '',
  };
  constructor(
    private route: ActivatedRoute,
    private contactsService: ContactsService,
    private router: Router
  ) {}

  ngOnInit() {
    const contactId = this.route.snapshot.params['id'];
    if (!contactId) return;
    this.contactsService.getContact(contactId).subscribe((contact) => {
      if (contact) this.contact = contact;
    });
  }

  saveContact(form: NgForm) {
    console.log(form.value);
    this.contactsService.saveContact(this.contact).subscribe({
      next: () => this.router.navigate(['/contacts']),
    });
  }
}
