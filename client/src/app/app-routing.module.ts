import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component'
import { SignupLawyerComponent } from './signup-lawyer/signup-lawyer.component'
import { SignupClientComponent } from './signup-client/signup-client.component' 
import { AskquestionComponent } from './askquestion/askquestion.component'
import { EditprofileClientComponent } from './editprofile-client/editprofile-client.component'
import { AskedquestionClientComponent } from './askedquestion-client/askedquestion-client.component'
import { LawyerprofileClientComponent } from './lawyerprofile-client/lawyerprofile-client.component'
import { ReplyquestionLawyerComponent } from './replyquestion-lawyer/replyquestion-lawyer.component'
import { EditprofileLawyerComponent } from './editprofile-lawyer/editprofile-lawyer.component'
import { HomeComponent } from './home/home.component'
import { FindlawyerClientComponent } from './findlawyer-client/findlawyer-client.component'
import { ChooselawyerClientComponent } from './chooselawyer-client/chooselawyer-client.component'
import { RateLawyerComponent } from './rate-lawyer/rate-lawyer.component';
import { ChatComponent } from './chat/chat.component'
import { ReviewsComponent } from './reviews/reviews.component'
import { SavedlawyersClientComponent } from './savedlawyers-client/savedlawyers-client.component'
import { EndorseattorneyComponent } from './endorseattorney/endorseattorney.component'
import { ShowlawyerLawyerComponent } from './showlawyer-lawyer/showlawyer-lawyer.component'

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'signup-lawyer', component: SignupLawyerComponent },
  { path: 'signup-client', component: SignupClientComponent },
  { path: 'askquestion', component: AskquestionComponent },
  { path: 'editprofile-client', component: EditprofileClientComponent },
  { path: 'askedquestion-client', component: AskedquestionClientComponent },
  { path: 'lawyerprofile-client', component: LawyerprofileClientComponent },
  { path: 'replyquestion-lawyer', component: ReplyquestionLawyerComponent },
  { path: 'editprofile-lawyer', component: EditprofileLawyerComponent },
  { path: 'findlawyer-client', component: FindlawyerClientComponent },
  { path: 'chooselawyer-client', component: ChooselawyerClientComponent },
  { path: 'ratelawyer', component: RateLawyerComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'review', component: ReviewsComponent },
  { path: 'savedlawyers-client', component: SavedlawyersClientComponent },
  { path: 'endorseattorney', component: EndorseattorneyComponent },
  { path: 'showlawyer-lawyer', component: ShowlawyerLawyerComponent },
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
 