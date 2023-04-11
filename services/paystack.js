const Axios = require("axios");
const PayStackPayment  = require('../models/payment');
const { validatePickup } = require("../models/validation");
const {
    PAYSTACK_CALLBACK_URL,
    PAYSTACK_INITIALIZE_URL,
    PAYSTACK_SECRET,
    PAYSTACK_TEST_SECRET,
  } = process.env;
  

exports.getPaymentUrl = async (req, res) => {
    try {
      const { error } = validatePickup(req.body)
      if(!error){
        const locs100 = ['Senate Building', 'ENT Hall', 'NLT 900', 'Glass House']
        const {number_of_students, pick_location} = req.body

        const locPayment = locs100.includes(pick_location) ? 100 : 50
        const amount = number_of_students * locPayment

        const initializeTransaction = async (payload) => {
            return new Promise(async (resolve, reject) => {
              try {
                if (!payload.email || payload.email.trim() === "") {
                  reject(new Error("Could not initialize. Email not provided"));
                }
                if (!payload.amount || isNaN(payload.amount)) {
                  reject(new Error("Could not initialize. Amount not provided"));
                }
                const url =
                  PAYSTACK_CALLBACK_URL ||
                  "https://api.carrotsuite.space/api/subScription/paystack-callback";
        
                const response = await Axios.post(
                  PAYSTACK_INITIALIZE_URL,
                  {
                    email: payload.email,
                    metadata: payload.metadata,
                    amount: parseInt(payload.amount) * 100,
                    callback: (response) => {
                      this.verifyTransaction(response.reference)
                    }
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${PAYSTACK_SECRET}`,
                      'Content-Type': 'application/json'
                    },
                  }
                );
                
                await PayStackPayment({
                  access_code: response.data.data.access_code,
                  ride_code: Math.floor(Math.random() * 899999 + 100000).toString(),
                  payloadData: payload.metadata.pickupdata,
                  reference: response.data.data.reference,
                  authorization_url: response.data.data.authorization_url,
                });
                resolve(response.data);
                return response.data.authorization_url
              } catch (error) {
                // console.log(error, "errrrrrrrrrrrrrrrrrrrrrrrrr");
                reject(error);
              }
            });
          }

          
        const response = await initializeTransaction({
            metadata: {
              pickupdata: {
                payment_date: new Date(),
                amount,
                ...req.body,
                email: "stephanyemmitty@gmail.com",
              },
            },
            email: "stephanyemmitty@gmail.com",
            amount,
          });
        
          return res.status(200).send({link: response.data.authorization_url, status: "success"})
        
        }else{
          return res.status(501).json({message:error.details[0].message, type:"error"})
        }
        // const totStudent = re
    } catch (error) {
        console.log(error)
        return res.status(500).send("Server Error")
    }
}

exports.verifyTransaction = async(reference) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await Axios.get(
        `${PAYSTACK_TXN_VERIFY_URL}/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_TEST_SECRET}`,
          },
        }
      );
      console.log(response, "verifinggggggggg");
      const new_plan = response.data.data.metadata.new_plan;
      new_plan.authorization_code =
        response.data.data.authorization.authorization_code;
      const companyBilling = await CompanyBilling.findOne({
        where: {
          transaction_ref: response.data.data.reference,
        },
      });

      if (!companyBilling)
        return reject({ message: "CompanyBilling not found" });
      if (companyBilling.amount * 100 !== response.data.data.amount) {
        reject(new Error("Amount do not match"));
      }
      console.log(new_plan);

      companyBilling.payment_status = "PAYMENT_CONFIRMED";
      await companyBilling.save();
      await VisitorSuiteCompanyPlan.update(new_plan, {
        where: { company: companyBilling.company },
      });

      resolve(companyBilling);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}