import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersComponent } from './orders.component';
import { OrderDetailedComponent } from './order-detailed/order-detailed.component';
import { OrdersRoutingModule } from './orders-routing.module';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    OrdersComponent,
    OrderDetailedComponent
  ],
  imports: [
    // Importing OrdersRoutingModule is important to use routerLink in orders.component.html
    CommonModule,OrdersRoutingModule, SharedModule
  ]
})
export class OrdersModule { }
