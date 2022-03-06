import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NoProductsFoundComponent } from "./components/no-products-found/no-products-found.component";
import { MDBBootstrapModule } from "angular-bootstrap-md";
// import { AngularFireModule } from "@angular/fire";
// import { AngularFireDatabaseModule } from "@angular/fire/database";
// import { AngularFireAuthModule } from "@angular/fire/auth";
import { FormsModule, FormBuilder } from "@angular/forms";
import { RouterModule, Router } from "@angular/router";
import { OwlModule } from "ngx-owl-carousel";
import { NgxPaginationModule } from "ngx-pagination";
import { HttpClientModule } from "@angular/common/http";
import { NoAccessComponent } from "./components/no-access/no-access.component";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { FilterByBrandPipe } from "./pipes/filterByBrand.pipe";
import { ProductService } from "./services/product.service";
import { AdminGaurd } from "./guards/admin-gaurd";
import { AuthGuard } from "./guards/auth_gaurd";
import { AuthService, GIGYA_CIAM } from "./services/auth.service";
import { CDPUserService } from "./services/user.service";
import { TranslatePipe } from "./pipes/translate.pipe";
import { NgxContentLoadingModule } from "ngx-content-loading";
import { CardLoaderComponent } from "./components/card-loader/card-loader.component";
import { MomentTimeAgoPipe } from "./pipes/moment-time-ago.pipe";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { CdkTableModule } from "@angular/cdk/table";
import { CdkTreeModule } from "@angular/cdk/tree";
import { FireBaseConfig } from "./../../environments/firebase.config";
import { GIGYA_CDP } from "../report.service";

declare const window: { gigya?: any; CDP?: any };

@NgModule({
  imports: [
    CommonModule,
    MDBBootstrapModule.forRoot(),
    // AngularFireModule.initializeApp(FireBaseConfig),
    // AngularFireDatabaseModule,
    // AngularFireAuthModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    OwlModule,
    NgxPaginationModule,
    NgxContentLoadingModule,
  ],
  declarations: [
    NoProductsFoundComponent,
    FilterByBrandPipe,
    NoAccessComponent,
    PageNotFoundComponent,
    TranslatePipe,
    CardLoaderComponent,
    MomentTimeAgoPipe,
  ],
  exports: [
    NoProductsFoundComponent,
    FormsModule,
    MDBBootstrapModule,
    // AngularFireModule,
    // AngularFireAuthModule,
    // AngularFireDatabaseModule,
    FormsModule,
    RouterModule,
    OwlModule,
    NgxPaginationModule,
    FilterByBrandPipe,
    NoAccessComponent,
    PageNotFoundComponent,
    TranslatePipe,
    MomentTimeAgoPipe,
    NgxContentLoadingModule,
    CardLoaderComponent,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    ScrollingModule,
  ],
  providers: [
    AuthService,
    // AuthGuard,
    // AdminGaurd,
    ProductService,
    CDPUserService,
    FormBuilder,
    {
      provide: GIGYA_CIAM,
      useFactory: () => window.gigya,
    },
    {
      provide: GIGYA_CDP,
      useFactory: () => window.CDP,
    },
  ],
})
export class SharedModule {}
