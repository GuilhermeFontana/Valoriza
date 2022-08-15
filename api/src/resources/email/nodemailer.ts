import nodemailer from "nodemailer"
import hbs from "nodemailer-express-handlebars"
import path, { resolve } from "path";
import fs from "fs";

const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

transport.use("compile", hbs({
  viewEngine: {
    extname: ".html",
    partialsDir: path.resolve('./src/resources/email'),
    defaultLayout: false,
  },
  viewPath: path.resolve('./src/resources/email'),
  extName: '.html'
}));

async function resolveTemplate(templateName: string, context: object) {
  let html = fs.readFileSync(
    path.resolve(`./src/resources/email/templates/${templateName}.html`), 
    "ascii"
  );

  Object.entries(context).forEach(([key, value]) => {
    html = html.replace(`{{ ${key} }}`, value.toString());
  })

  return html;
}



async function sendEmail(to: string, title: string, templateName: string, context = {}){
  
  let template = await resolveTemplate(templateName, context)

  await transport.sendMail({
      to: to,
      from: process.env.EMAIL_SENDER,
      subject: title,
      html: template,
  })
  .catch((err) => {
    if (err.message === "No recipients defined")
      throw new Error("Destinatário não informado");

    throw new Error("Não foi possível enviar o email");
  })
}

export {
  sendEmail
}