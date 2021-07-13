const { promises } = require('fs');
const copy = require("./templates/copy");
const EmailClient = require("./email-client");
require("dotenv").config();

const { FROM_EMAIL, EMAIL_USER } = process.env;

async function getTemplate(template) {
  const promise = await promises.readFile(
    `${__dirname}/templates/${template}/content.html`,
    'utf-8'
  );
  return promise;
}

function replaceTemplateContent(_html, content) {
  let html = _html;
  const copys = {
    ...copy,
    ...content,
  };
  Object.keys(copys).forEach((key) => {
    const value = copys[key];
    html = html.split(`{{${key}}}`).join(value);
  });
  return html;
}

async function getHTMLFromTemplate(content, template) {
  if (template) {
    const templateHTMLString = await getTemplate(template);
    const html = replaceTemplateContent(templateHTMLString, content);
    return html;
  }
  return null;
}

function getSubject(template) {
  return copy[`${template}_mail_subject`];
}


async function sendMail(mailParams) {
  const {
    to,
    subject: _subject,
    template,
    content,
    text,
  } = mailParams;
  let subject = _subject;
  if (!subject && template) {
    subject = getSubject(template);
  }

  if (text || template) {
    const html = await getHTMLFromTemplate(content, template);
    return EmailClient.send({
      from:FROM_EMAIL || EMAIL_USER,
      to,
      subject,
      text,
      html,
    });
  }
  return null;
}

module.exports = { sendMail, getHTMLFromTemplate, };
