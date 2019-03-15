import { NgModule} from '@angular/core';
import {MatButtonModule,
  MatFormFieldControl,
   MatCheckboxModule,
   MatStepperModule,
   MatFormFieldModule,
   MatTableModule,
   
   
  } from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';


@NgModule({
  
  imports: [MatButtonModule,
     MatCheckboxModule,
     MatStepperModule,
     MatFormFieldModule,
     MatTableModule,
   
   

     
    ],
  exports: [MatButtonModule,
     MatCheckboxModule,
     MatStepperModule,
     MatFormFieldModule,
     MatTableModule
    
     
    ]
  
})
export class MaterialModule { }