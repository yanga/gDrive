import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MyErrorStateMatcher} from '../gallery/gallery.component';
import {DataService} from '../../service/data.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  registrationForm = this.fb.group(
    {
      email: [null, [Validators.email, Validators.required]],
    }
  );

  matcher = new MyErrorStateMatcher();
  constructor(private fb: FormBuilder, private dataService: DataService) { }

  ngOnInit(): void {
  }

  submit(): void {
    this.dataService.setRegistration(this.registrationForm.controls.email.value);
  }
}
