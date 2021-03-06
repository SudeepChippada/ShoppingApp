import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket, IBasketItem } from '../../models/basket';
import { IOrderItem } from '../../models/order';

@Component({
  selector: 'app-basket-summary',
  templateUrl: './basket-summary.component.html',
  styleUrls: ['./basket-summary.component.scss']
})
export class BasketSummaryComponent implements OnInit {
  
  // basket$: Observable<IBasket>;

  @Output() decrement: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();
  @Output() increment: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();
  @Output() remove: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();

  @Input() isBasket = true;

  // Here items can be either of IBasketItem[] or IOrderItem[]
   @Input() items: IBasketItem[] | IOrderItem[] = [];
  
  // Below is for styling purpose
  @Input() isOrder = false;

  constructor(private basketService: BasketService) { }

  ngOnInit(): void {
    // this.basket$ = this.basketService.basket$;
  }

  decrementItemQuantity(item: IBasketItem){
    this.decrement.emit(item);
  }

  incrementItemQuantity(item: IBasketItem){
    this.increment.emit(item);
  }

  removeBasketItem(item: IBasketItem){
    this.remove.emit(item);
  }
}
