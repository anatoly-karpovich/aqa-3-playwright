import {
  IOrder,
  ORDER_STATUSES,
  ORDER_HISTORY_ACTIONS,
  DELIVERY_CONDITIONS,
  IDeliveryAddress,
  IComment,
  IOrderProduct,
} from "types/order.types";
import { IUserInfo } from "types/manager.types";
import { ObjectId } from "bson";
import { defaultManagerMockData } from "data/managers/generateManager.data";
import { defaultProductMockData, generateProductData } from "data/products/generateProduct.data";
import { IProductFromResponse } from "types/products.types";
import { defaultCustomerMockData } from "data/customers/generateCustomer.data";
import { generateDelivery } from "data/orders/delivery";
import { CustomersMockBuilder } from "./customersBuilder";
import { ICustomerFromResponse } from "types/customer.types";

export class OrderBuilder {
  private data: IOrder | null = null;

  /**
   * Initializes a new instance of the OrderBuilder and sets the initial draft state.
   *
   * @param {Object} params - The parameters for constructing the order.
   * @param {number} [params.numberOfProducts=1] - The number of products to include in the draft order. Defaults to 1.
   * @param {IUserInfo} [params.performer=defaultManagerMockData] - The user performing the order creation. Defaults to a mock manager.
   */

  constructor(
    options: {
      numberOfProducts?: number;
      performer?: IUserInfo;
      customer?: ICustomerFromResponse;
    } = {
      numberOfProducts: 1,
      performer: defaultManagerMockData,
      customer: defaultCustomerMockData,
    }
  ) {
    const numberOfProducts = options.numberOfProducts ?? 1;
    const performer = options.performer ?? defaultManagerMockData;
    const customer = options.customer ?? defaultCustomerMockData;

    this.draft({ numberOfProducts, performer, customer });
  }

  /**
   * Sets the status of the order to the specified value and updates the order accordingly.
   * The method will transition the order to the given status and perform any additional
   * actions required for that status, such as updating the products' received status or
   * creating a history entry.
   *
   * @param {ORDER_STATUSES} status - The desired status to set for the order.
   * @param {IUserInfo} [performer=defaultManagerMockData] - The user responsible for
   * performing the status change. Defaults to a mock manager.
   * @returns {OrderBuilder} The current instance of OrderBuilder for method chaining.
   */

  withStatus(status: ORDER_STATUSES | "Reopened", performer = defaultManagerMockData): this {
    switch (status) {
      case ORDER_STATUSES.DRAFT:
        return this;
      case ORDER_STATUSES.IN_PROCESS:
        return this.inProcess(performer);
      case ORDER_STATUSES.PARTIALLY_RECEIVED:
        return this.partiallyReceived(performer);
      case ORDER_STATUSES.RECEIVED:
        return this.received(performer);
      case ORDER_STATUSES.CANCELED:
        return this.canceled(performer);
      case "Reopened":
        return this.reopened(performer);
    }
  }
  private draft({
    numberOfProducts = 1,
    performer = defaultManagerMockData,
    customer = defaultCustomerMockData,
  }: {
    numberOfProducts?: number;
    performer?: IUserInfo;
    customer?: ICustomerFromResponse;
  }) {
    this.data = {
      _id: new ObjectId().toHexString(),
      status: ORDER_STATUSES.DRAFT,
      customer: customer,
      products: [],
      delivery: null,
      total_price: 0,
      createdOn: new Date().toISOString(),
      comments: [],
      history: [],
      assignedManager: null,
    };

    let totalProducts = 1;
    if (numberOfProducts < 1) totalProducts = 1;
    else if (numberOfProducts > 5) totalProducts = 5;
    else totalProducts = numberOfProducts;

    for (let i = 0; i < totalProducts; i++) {
      this.data.products.push(this.generateProductData());
    }
    this.recalculateTotalPrice();
    this.createHistoryEntry(ORDER_HISTORY_ACTIONS.CREATED, performer);
    return this;
  }

  /**
   * Sets delivery details for the order. If delivery is already scheduled,
   * updates the delivery details instead of creating a new one.
   *
   * @param {Object} options
   * @param {IUserInfo} [options.performer] - User who scheduled the delivery.
   * Defaults to the default manager.
   * @param {number} [options.daysToAdd] - Number of days to add to the current date
   * to set the delivery date. Defaults to 5 days.
   * @param {DELIVERY_CONDITIONS} [options.condition] - Delivery condition.
   * Defaults to DELIVERY_CONDITIONS.DELIVERY.
   * @param {IDeliveryAddress} [options.address] - Delivery address.
   * Defaults to a mock address in Belarus.
   * @returns {OrderBuilder} - The order builder instance for chaining.
   */
  addDelivery({
    performer = defaultManagerMockData,
    condition = DELIVERY_CONDITIONS.DELIVERY,
    address,
  }: {
    performer?: IUserInfo;
    daysToAdd?: number;
    condition?: DELIVERY_CONDITIONS;
    address?: IDeliveryAddress;
  } = {}) {
    if (!this.data) return this;
    if (this.data.status !== ORDER_STATUSES.DRAFT) return this;
    const isScheduled = !!this.data.delivery;
    this.data.delivery = generateDelivery();

    this.createHistoryEntry(
      isScheduled ? ORDER_HISTORY_ACTIONS.DELIVERY_EDITED : ORDER_HISTORY_ACTIONS.DELIVERY_SCHEDULED,
      performer
    );
    return this;
  }

  changeCustomer(customer?: ICustomerFromResponse, performer = defaultManagerMockData) {
    if (!this.data) return this;
    const customerBuilder = new CustomersMockBuilder();
    customer ? customerBuilder.addCustomCustomer(customer) : customerBuilder.addRandomCustomer();
    this.data.customer = customerBuilder.build().Customers[0];
    this.createHistoryEntry(ORDER_HISTORY_ACTIONS.CUSTOMER_CHANGED, performer);
    return this;
  }

  /**
   * Add a product to the order.
   *
   * Defaults to the {@link defaultProductMockData} and  the performer - to the default manager.
   * If the order is not in the "draft" status, or if the order already has 5 products,
   * this function does nothing.
   *
   * @param {Object} [options] - The options for adding the product.
   * @param {IProductFromResponse} [options.product] - The product to add.
   * @param {IUserInfo} [options.performer] - The user who performed the action.
   * @returns {OrderBuilder} - The order builder instance for chaining.
   */
  addProduct({
    product = defaultProductMockData,
    performer = defaultManagerMockData,
  }: {
    product?: IProductFromResponse;
    performer?: IUserInfo;
  }) {
    if (!this.data) return this;
    if (this.data.status !== ORDER_STATUSES.DRAFT) return this;
    if (this.data.products.length >= 5) return this;

    this.data.products.push({ ...product, received: false });
    this.recalculateTotalPrice();
    this.createHistoryEntry(ORDER_HISTORY_ACTIONS.REQUIRED_PRODUCTS_CHANGED, performer);
    return this;
  }

  /**
   * Remove a product from the order.
   *
   * Defaults to the last product in the array and the performer - to the default manager.
   * If the order is not in the "draft" status, or if the product at the given index does not exist,
   * this function does nothing.
   *
   * @param {Object} [options] - The options for removing the product.
   * @param {number} [options.index] - The index of the product to remove.
   * @param {IUserInfo} [options.performer] - The user who performed the action.
   * @returns {OrderBuilder} - The order builder instance for chaining.
   */
  removeProduct({
    index = this.data!.products.length - 1,
    performer = defaultManagerMockData,
  }: {
    index?: number;
    performer?: IUserInfo;
  }) {
    if (!this.data) return this;
    if (this.data.status !== ORDER_STATUSES.DRAFT) return this;
    if (!this.data.products[index]) return this;

    this.data.products.splice(index, 1);
    this.recalculateTotalPrice();
    this.createHistoryEntry(ORDER_HISTORY_ACTIONS.REQUIRED_PRODUCTS_CHANGED, performer);
    return this;
  }

  /**
   * Assigns a manager to the order.
   *
   * Defaults the performer to the default manager.
   * If the order is not in the "draft" status, or if the order already has an assigned manager,
   * this function does nothing.
   *
   * @param {Object} [options] - The options for assigning the manager.
   * @param {IUserInfo} [options.manager] - The manager to assign.
   * @param {IUserInfo} [options.performer] - The user who performed the action.
   * @returns {OrderBuilder} - The order builder instance for chaining.
   */
  assignManager({
    manager = defaultManagerMockData,
    performer = defaultManagerMockData,
  }: {
    manager?: IUserInfo;
    performer?: IUserInfo;
  }) {
    if (!this.data) return this;
    this.data.assignedManager = manager;
    this.createHistoryEntry(ORDER_HISTORY_ACTIONS.MANAGER_ASSIGNED, performer);
    return this;
  }

  /**
   * Unassigns the manager from the order.
   *
   * Defaults the performer to the default manager.
   * If the order is not in the "draft" status, or if the order already has no assigned manager,
   * this function does nothing.
   *
   * @param {Object} [options] - The options for unassigning the manager.
   * @param {IUserInfo} [options.performer] - The user who performed the action.
   * @returns {OrderBuilder} - The order builder instance for chaining.
   */
  unassignManager({ performer = defaultManagerMockData }: { performer?: IUserInfo }) {
    if (!this.data) return this;
    this.data.assignedManager = null;
    this.createHistoryEntry(ORDER_HISTORY_ACTIONS.MANAGER_UNASSIGNED, performer);
    return this;
  }

  private inProcess(performer = defaultManagerMockData) {
    if (!this.data) {
      return this;
    }
    this.addDelivery({ performer });
    this.data!.status = ORDER_STATUSES.IN_PROCESS;
    this.createHistoryEntry(ORDER_HISTORY_ACTIONS.PROCESSED, performer);
    return this;
  }

  private partiallyReceived(performer = defaultManagerMockData) {
    if (!this.data) {
      return this;
    }
    if (this.data!.products.length < 2)
      throw new Error("For Partially Received status order must contain at least 2 products");
    this.inProcess(performer);
    this.data!.status = ORDER_STATUSES.PARTIALLY_RECEIVED;
    this.data!.products[0].received = true;
    this.createHistoryEntry(ORDER_HISTORY_ACTIONS.RECEIVED, performer);
    return this;
  }

  private received(performer = defaultManagerMockData) {
    if (!this.data) {
      return this;
    }
    this.inProcess(performer);
    if (this.data!.products.length > 1) {
      this.partiallyReceived(performer);
    }
    this.data!.status = ORDER_STATUSES.RECEIVED;
    this.data!.products.forEach((product) => (product.received = true));
    this.createHistoryEntry(ORDER_HISTORY_ACTIONS.RECEIVED_ALL, performer);
    return this;
  }

  private canceled(performer = defaultManagerMockData) {
    if (!this.data) {
      return this;
    }
    this.data!.status = ORDER_STATUSES.CANCELED;
    this.createHistoryEntry(ORDER_HISTORY_ACTIONS.CANCELED, performer);
    return this;
  }

  private reopened(performer = defaultManagerMockData) {
    this.canceled(performer);
    this.data!.status = ORDER_STATUSES.DRAFT;
    this.data!.delivery = null;
    this.createHistoryEntry(ORDER_HISTORY_ACTIONS.REOPENED, performer);
    return this;
  }

  private createHistoryEntry(action: ORDER_HISTORY_ACTIONS, performer: IUserInfo): void {
    if (!this.data) return;
    const order = structuredClone({ ...this.data, customer: this.data.customer._id });
    this.data.history.unshift({
      action,
      status: order.status,
      products: order.products,
      customer: order.customer.toString(),
      delivery: order.delivery,
      total_price: order.total_price,
      changedOn: new Date().toISOString(),
      performer,
      assignedManager: order.assignedManager,
    });
  }

  private recalculateTotalPrice() {
    if (!this.data) return;
    this.data.total_price = this.data.products.reduce((sum, p) => sum + p.price * p.amount, 0);
    return this;
  }

  /**
   * Adds a comment to the order.
   *
   * If the `comment` argument is not provided, a default mock comment will be created.
   * The comment is added to the `comments` array in the order object.
   * @param {Partial<IComment>} [comment] - The comment to add. If not provided, a default mock comment will be created.
   * @returns {OrderBuilder} - The order builder instance for chaining.
   */
  addComment(comment?: Partial<IComment>) {
    const newComment: IComment = {
      _id: new ObjectId().toHexString(),
      createdOn: new Date().toISOString(),
      text: "Mock comment",
      ...comment,
    };
    this.data!.comments.push(newComment);
    return this;
  }

  private generateProductData(): IOrderProduct {
    return {
      ...generateProductData(),
      _id: new ObjectId().toHexString(),
      received: false,
    };
  }

  /**
   * Builds and returns the order object.
   * @returns The order object built according to the methods called on this builder.
   */
  build() {
    return this.data!;
  }

  // setId(id: string) {
  //   this.data._id = id;
  //   return this;
  // }

  // setStatus(status: ORDER_STATUSES) {
  //   if (!this.data) {
  //     return this;
  //   }
  //   this.data.status = status;
  //   return this;
  // }

  // setCustomer(customer: ICustomerFromResponse) {
  //   if (!this.data) {
  //     return this;
  //   }
  //   this.data.customer = customer;
  //   return this;
  // }

  // setProducts(products: IOrderProduct[]) {
  //   this.data.products = products;
  //   return this;
  // }

  // addProduct(product: IOrderProduct) {
  //   this.data.products.push(product);
  //   this.recalculateTotalPrice();
  //   return this;
  // }

  // setDelivery(delivery: IDeliveryInfo | null) {
  //   this.data.delivery = delivery;
  //   return this;
  // }

  // setTotalPrice(price: number) {
  //   this.data.total_price = price;
  //   return this;
  // }

  // setCreatedOn(date: string) {
  //   this.data.createdOn = date;
  //   return this;
  // }

  // setComments(comments: any[]) {
  //   this.data.comments = comments;
  //   return this;
  // }

  // setHistory(history: IOrderHistoryEntry[]) {
  //   this.data.history = history;
  //   return this;
  // }

  // addDefaultHistoryAction(action: ORDER_HISTORY_ACTIONS) {
  //   switch (action) {
  //     case ORDER_HISTORY_ACTIONS.CREATED:
  //       this.addHistoryEntry({
  //         assignedManager: this.data.assignedManager,
  //         status: this.data.status,
  //         customer: this.data.customer.email,
  //         products: this.data.products,
  //         total_price: this.data.total_price,
  //         delivery: this.data.delivery,
  //         changedOn: this.data.createdOn,
  //         action: ORDER_HISTORY_ACTIONS.CREATED,
  //         performer: this.data.assignedManager,
  //       });
  //   }
  // }

  // addHistoryEntry(entry: IOrderHistoryEntry) {
  //   this.data.history.push(entry);
  //   return this;
  // }

  // setAssignedManager(manager: IUserInfo) {
  //   this.data.assignedManager = manager;
  //   return this;
  // }

  // clearProducts() {
  //   this.data.products = [];
  //   this.recalculateTotalPrice();
  //   return this;
  // }

  // clearComments() {
  //   this.data.comments = [];
  //   return this;
  // }

  // clearHistory() {
  //   this.data.history = [];
  //   return this;
  // }
}
