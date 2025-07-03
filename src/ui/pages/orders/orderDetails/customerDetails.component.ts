import { COUNTRIES } from "data/customers/countries.data";
import { ICustomer, ICustomerFromResponse } from "types/customer.types";
import { ProjectPage } from "ui/pages/project.page";

export class CustomerDetailsComponent extends ProjectPage {
  readonly uniqueElement = this.page.locator("#customer-section");

  readonly title = this.uniqueElement.locator("h4.modal-title");
  readonly editCustomerButton = this.uniqueElement.locator("#edit-customer-pencil");
  readonly key = this.uniqueElement.locator("span.strong-details");
  readonly value = this.uniqueElement.locator("span:not(.strong-details)");

  async clickEdit() {
    await this.editCustomerButton.click();
  }

  async getInfo(): Promise<CustomerDetails> {
    const [email, name, country, city, street, house, flat, phone, createdOn, notes] = await this.value.allInnerTexts();
    return {
      email,
      name,
      country: country as COUNTRIES,
      city,
      street,
      house: +house,
      flat: +flat,
      phone,
      createdOn,
      notes,
    };
  }
}

type CustomerDetails = ICustomer & Pick<ICustomerFromResponse, "createdOn">;
