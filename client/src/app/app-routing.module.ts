import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component'
import { SignupLawyerComponent } from './signup-lawyer/signup-lawyer.component'
import { SignupClientComponent } from './signup-client/signup-client.component' 

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'signup-lawyer', component: SignupLawyerComponent },
  { path: 'signup-client', component: SignupClientComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {

}
