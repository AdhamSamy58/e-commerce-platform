const SibApiV3Sdk = require("@getbrevo/brevo");

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const apiKey = apiInstance.authentications["apiKey"];
apiKey.apiKey = process.env.SENDGRID_API_KEY;

const sendWelcomeEmail = (email, name) => {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = "Thanks for joining in!";
    sendSmtpEmail.htmlContent = `<html><body><h1>Welcome to the app, ${name}.</h1><h2>Let me know how you get along with the app.</h2></body></html>`;
    sendSmtpEmail.sender = {
        name: "E-commerce Platform",
        email: "memomemoahmed0100@gmail.com",
    };
    sendSmtpEmail.to = [{ email }];

    apiInstance.sendTransacEmail(sendSmtpEmail).then(
        function (data) {
            console.log(
                "Welcome e-mail has been sent successfully" +
                    JSON.stringify(data.body) +
                    "to " +
                    email
            );
        },
        function (error) {
            console.error(error);
        }
    );
};

const sendCancelEmail = (email, name) => {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = "Account has been deleted!";
    sendSmtpEmail.htmlContent = `<html><body><h1>Thanks ${name} for using my task app.</h1><h2>Let me know if there are any complaints about the app.</h2></body></html>`;
    sendSmtpEmail.sender = {
        name: "E-commerce Platform",
        email: "memomemoahmed0100@gmail.com",
    };
    sendSmtpEmail.to = [{ email }];

    apiInstance.sendTransacEmail(sendSmtpEmail).then(
        function (data) {
            console.log(
                "Delete e-mail has been sent successfully" +
                    JSON.stringify(data.body) +
                    "to " +
                    email
            );
        },
        function (error) {
            console.error(error);
        }
    );
};

const sendContactEmail = (email, name, message, mobile) => {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = "Support Ticket";
    sendSmtpEmail.htmlContent = `<html>

<body>
    <h1>Name : ${name}</h1>
    <h1>Email : ${email}</h1>
    <h1>Modile : ${mobile}</h1>
    <p>Message : ${message}</p>
</body>

</html>`;
    sendSmtpEmail.sender = {
        name: "E-commerce Platform",
        email: "memomemoahmed0100@gmail.com",
    };
    sendSmtpEmail.to = [{ email: "sharkm573@gmail.com" }];

    apiInstance.sendTransacEmail(sendSmtpEmail).then(
        function (data) {
            console.log(
                "Contact us e-mail has been sent successfully" +
                    JSON.stringify(data.body) +
                    "to sharkm573@gmail.com"
            );
        },
        function (error) {
            console.error(error);
        }
    );
};

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail,
    sendContactEmail,
};
