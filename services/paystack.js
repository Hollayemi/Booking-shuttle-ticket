const Axios = require("axios");
const {
    PAYSTACK_CALLBACK_URL,
    PAYSTACK_INITIALIZE_URL,
    PAYSTACK_SECRET,
    PAYSTACK_TEST_SECRET,
  } = process.env;
  

exports.getPaymentUrl = async (req, res) => {
    console.log(req)
    try {
        const {noOfStudent, locPayment, email, userId} = req.body
        const amount = noOfStudent * locPayment

        const initializeTransaction = async (payload) => {
            console.log(payload)
            return new Promise(async (resolve, reject) => {
              try {
                // if (!process.env.PAYSTACK_SECRET) {
                //   reject(new Error("PAYSTACK SECRET KEY MISSING"));
                // }
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
                    
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${PAYSTACK_TEST_SECRET}`,
                      'Content-Type': 'application/json'
                    },
                  }
                );
                console.log(response, "response")
        
                await PayStackPayment.create({
                  access_code: response.data.data.access_code,
                  reference: response.data.data.reference,
                  user_email: payload.email,
                  authorization_url: response.data.data.authorization_url,
                });
                resolve(response.data);
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
                noOfStudent,
                locPayment,
                userId,
                email,
              },
            },
            email,
            amount,
          });
        
        
          
        // const totStudent = re
    } catch (error) {
        console.log(error)
        return res.status(500).send("Server Error")
    }
}
