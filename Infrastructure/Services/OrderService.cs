using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specifications;

namespace Infrastructure.Services
{
    public class OrderService : IOrderService
    {
        // private readonly IGenericRepository<Order> _orderRepo;
        // private readonly IGenericRepository<DeliveryMethod> _dmRepo;
        // private readonly  IGenericRepository<Product> _productRepo;
        private readonly  IBasketRepository _basketRepo;
        private readonly IUnitOfWork _unitOfWork;

        // public OrderService(IGenericRepository<Order> orderRepo, IGenericRepository<DeliveryMethod> dmRepo, IGenericRepository<Product> productRepo, IBasketRepository basketRepo)
        // {
        //     this._basketRepo = basketRepo;
        //     this._productRepo = productRepo;
        //     this._dmRepo = dmRepo;
        //     this._orderRepo = orderRepo;

        // }
        
        public OrderService(IBasketRepository basketRepo, IUnitOfWork unitOfWork)
        {
            this._unitOfWork = unitOfWork;
            this._basketRepo = basketRepo;
        }


        public async Task<Order> CreateOrderAsync(string buyerEmail, int deliveryMethodid, string basketId, Address shippingAddress)
        {
            // Get basket from basket repo
            var basket = await _basketRepo.GetBasketAsync(basketId);

            // get items from the product repo
            var items = new List<OrderItem>();
            foreach(var item in basket.Items)
            {
                // Now we create a new generic repository for our product with the statement _unitOfWork.Repository<Product>()
                var productItem = await _unitOfWork.Repository<Product>().GetByIdAsync(item.Id);
                var itemOrdered = new ProductItemOrdered(productItem.Id,productItem.Name, productItem.PictureUrl);
                var orderItem = new OrderItem(itemOrdered, productItem.Price, item.Quantity);
                items.Add(orderItem);
            }


            // get delivery method from repo
            // Now we create another new generic repository for our DeliveryMethod
            var deliveryMethod = await _unitOfWork.Repository<DeliveryMethod>().GetByIdAsync(deliveryMethodid);

            // calc sub total
            var subtotal = items.Sum(item => item.Price * item.Quantity);

            // create order
            var order = new Order(items,buyerEmail,shippingAddress,deliveryMethod, subtotal);
            _unitOfWork.Repository<Order>().Add(order);

            // ToDo: save to db
            var result = await _unitOfWork.Complete();

            if(result <= 0) return null;

            // delete basket

            await _basketRepo.DeleteBasketAsync(basketId);

            // return order
            return order;
        }

        public async Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync()
        {
            return await _unitOfWork.Repository<DeliveryMethod>().ListAllAsync();
        }

        public async Task<Order> GetOrderByIdAsync(int id, string buyerEmail)
        {
            var spec = new OrdersWithItemsAndOrderingSpecification(id, buyerEmail);

            return await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);
        }

        public async Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail)
        {
            var spec = new OrdersWithItemsAndOrderingSpecification(buyerEmail);

            return await _unitOfWork.Repository<Order>().ListAsync(spec);
        }
    }
}