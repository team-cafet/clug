import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { PagesModule } from './pages/pages.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AppCommonModule } from './app-common.module';
import { AppRoutingModule } from './app-routing.module';
import { AppAdminComponent } from './app-admin.component';

@NgModule({
  declarations: [ AppComponent, AppAdminComponent ],
  imports: [
    AppRoutingModule,
    AppCommonModule,
    PagesModule,
    CoreModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
