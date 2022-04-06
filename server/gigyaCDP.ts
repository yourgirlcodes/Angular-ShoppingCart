import { Express } from "express";
import { Customer } from "../gigya-cdp-sdk/entities/Customer";
import { CDP } from "../gigya-cdp-sdk";

const config = require("./gigyacdp.cred.json");

export function cdpInit(app: Express) {
  console.log("here");
  const gigyaCDP = new CDP(
    {
      userKey: config.userKey,
      secret: config.secret,
    },
    {
      dataCenter: config.dataCenter,
      env: config.env,
    } as any
  );

  let customer;

  app.get("/user/:id", async (req, res) => {
    if (req.params.id === "undefined") {
      customer = {};
    } else {
      await delay(1000);

      const busUnitsOperations = gigyaCDP.api.businessunits.for(
        config.businessUnitId
      );

      const views = await busUnitsOperations.views.getAll();
      const viewOps = busUnitsOperations.views.for(views[1].id);

      const customerFound = await pollFor(
        6000,
        (result) => {
          return !!(result.count > 0);
        },
        async () => {
          const result = await viewOps.customers
            .get({
              query: `select * from profile where attributes.ciamId = '${req.params?.id}'`,
            } as any)
            .then((re) => {
              return re as any;
            });
          return result;
        }
      );

      const customersOps = viewOps.customers as {
        for?(
          id: string
        ): {
          get(): Promise<Customer>;
          activities: { get({ query: string }): Promise<any> };
        };
      };

      const customerForIdOps = customersOps.for(customerFound._id);

      const [Orders, Cart, PurchasedItems] = await Promise.all([
        getCustomerInfo(customerForIdOps, "Orders"),
        getCustomerInfo(customerForIdOps, "Cart"),
        getCustomerInfo(customerForIdOps, "Purchased Items"),
      ]);

      console.log({ Orders });
      console.log({ Cart });
      console.log({ PurchasedItems });

      customer = {
        customer: customerFound,
        activities: {
          orders: Orders,
          cart: Cart,
          purchasedItems: PurchasedItems,
        },
      };
    }
    console.log("customer:", customer);
    return res.status(200).json(customer);
  });
}

function getCustomerInfo(customerForIdOps, item: string) {
  return customerForIdOps.activities
    .get({
      query: `select * from [${item}] limit 1000`,
    })
    .then((res) => res.activities);
}

function pollFor(
  timeoutMs,
  ingestAssertFn: (customer: any) => boolean,
  pollFn: () => Promise<any>,
  pollDelayMs = 500
): Promise<any> {
  return new Promise(async (resolve, reject) => {
    let wasTimeout = false;

    const timeoutId = setTimeout(() => {
      wasTimeout = true;
      reject("timeout");
    }, timeoutMs);

    while (!wasTimeout) {
      let result;
      try {
        result = await pollFn();
      } catch (e) {
        reject(e);
        break;
      }
      if (!ingestAssertFn(result)) {
        await delay(pollDelayMs);
      } else {
        clearTimeout(timeoutId);
        resolve(result.profiles[0]);
        break;
      }
    }
  });
}

export function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
