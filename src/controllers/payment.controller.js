import mercadopago from "mercadopago";
import {HOST,MERCADOPAGO_API_KEY} from '../config.js'

export const createOrder = async (req, res) => {
  mercadopago.configure({
    access_token: MERCADOPAGO_API_KEY,
  });

  const result = await mercadopago.preferences.create({
    items: [
      {
        title: "Laptop levono",
        unit_price: 25000,
        currency_id: "COP",
        quantity: 1,
      },
    ],
    back_urls: {
      success: `${HOST}/success`,

      failure: `${HOST}/failure`,

      pending: `${HOST}/pending`,
    },
    notification_url:
      "https://804b-2800-484-b483-def0-2451-275f-f872-890e.ngrok.io/webhook",
  });

  console.log(result);

  res.send(result.body);
};

export const receiveWebhook = async (req, res) => {
  const payment = req.query;
  try {
    if (payment.type === "payment") {
      const data = await mercadopago.payment.findById(payment["data.id"]);
      console.log(data);
      //Guardar en la base de datos
    }
    
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500).json({ error: error.message });
  }
};
