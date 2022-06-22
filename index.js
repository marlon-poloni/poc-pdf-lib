import * as fs from 'fs';
import {
  PDFDocument,
  StandardFonts,
  rgb,
} from 'pdf-lib';
import fetch from "node-fetch";

const PAYMENT_METHODS_LENGTH = 5;
const PRODUCTS_LENGTH = 5;

const MOCK_TESTE = {
  header: {
      company: "Empresa do Marlon",
      cnpj: "30.932.202/0001-32",
      client: "888.88-22.11",
      buy_date: (new Date()).toDateString()
  },
  sub_header: {
      is_fiscal: false,
      sell_detais: 12321312312,
      payment_methods: [...Array(PAYMENT_METHODS_LENGTH).keys()].map((_, index) => (
        index %2 === 0 
          ? { name: "Mastercard", details: "Crédito parcelado 10x R$ = 650,00" } 
          : { name: "Mastercard", details: "Débito 350,00" }          
      )),
      sell_value: "1000.00",
      discount: "0.00"
  },
  itens: [...Array(PRODUCTS_LENGTH).keys()].map((_, key) => (
    { name: `XPTO${key + 1}`, details: "31231231541212312", value: Math.round(Math.random() * (Math.round(Math.random() * 10000)))}
  ))
}
const files_dir = 'outputs';

const [h1, h2, h3, h4, h5, h6, p] = [30, 12, 10, 5, 4, 3]
const pdfDoc = await PDFDocument.create();
const [HelveticaFont, HelveticaFontBold, CourierBoldOblique] = await Promise.all([
  pdfDoc.embedFont(StandardFonts.Helvetica), 
  pdfDoc.embedFont(StandardFonts.HelveticaBold),
  pdfDoc.embedFont(StandardFonts.CourierBoldOblique)
])
 
const page = pdfDoc.addPage();
const estimate_height = 260 + ((MOCK_TESTE.sub_header.payment_methods?.length ||  1) * 10) + (MOCK_TESTE.itens?.length ||  1) * 30;
page.setWidth(302.36)
page.setHeight(estimate_height);

const { width, height } = page.getSize();
var y_pixel = estimate_height - 30;

// header
page.drawText(MOCK_TESTE.header.company, {
  x: 30,
  y: height - 2 * h3,
  size: h3,
  font: HelveticaFont,
  color: rgb(0,0,0),
});
y_pixel = y_pixel - 6;
page.drawText(MOCK_TESTE.header.cnpj, {
  x: 30,
  y: y_pixel,
  size: h3,
  font: HelveticaFont,
  color: rgb(0,0,0),
});
y_pixel = y_pixel - 6;
page.drawLine({ start: { x: 30, y: y_pixel}, end: { x: width - 30, y: y_pixel}, thickness: 0.5});

y_pixel = y_pixel - 12;
page.drawText("Cliente: " + MOCK_TESTE.header.client, {
  x: 30,
  y: y_pixel,
  size: h3,
  font: HelveticaFont,
  color: rgb(0,0,0),
});
page.drawText(MOCK_TESTE.header.buy_date, {
  x: width - 110,
  y: y_pixel,
  size: h3,
  font: HelveticaFont,
  color: rgb(0,0,0),
});
y_pixel = y_pixel - 5;
page.drawLine({ start: { x: 30, y: y_pixel}, end: { x: 110, y: y_pixel}, thickness: 0.5});

// sub_header
y_pixel = y_pixel - 15;
page.drawText(MOCK_TESTE.sub_header.is_fiscal ? "COMPROVANTE FISCAL": "COMPROVANTE NÃO FISCAL", {
  x:30,
  y: y_pixel,
  size: h3,
  font: HelveticaFontBold,
  color: rgb(0,0,0),
});
y_pixel = y_pixel - 15;
page.drawText(`Detalhamento da venda - ${MOCK_TESTE.sub_header.sell_detais}`, {
  x:30,
  y: y_pixel,
  size: h3,
  font: HelveticaFont,
  color: rgb(0,0,0),
});
MOCK_TESTE.sub_header.payment_methods.forEach((data) => {
  y_pixel = y_pixel - 12;
  page.drawText(data.name, {
    x:40,
    y: y_pixel,
    size: h3,
    font: HelveticaFontBold,
    color: rgb(0,0,0),
  })
  page.drawText(' - ' + data.details, {
    x:100,
    y: y_pixel,
    size: h3,
    font: HelveticaFont,
    color: rgb(0,0,0),
  })
})
y_pixel = y_pixel - 25;
page.drawText("Valor da venda", {
  x:120,
  y: y_pixel,
  size: h3,
  font: HelveticaFont,
  color: rgb(0,0,0),
})
page.drawText("Desconto", {
  x:215,
  y: y_pixel,
  size: h3,
  font: HelveticaFont,
  color: rgb(0,0,0),
})
y_pixel = y_pixel - 20;
page.drawText(`R$: ${MOCK_TESTE.sub_header.sell_value}`, {
  x:120,
  y: y_pixel,
  size: h2,
  font: HelveticaFontBold,
  color: rgb(0,0,0),
})
page.drawText(`R$: ${MOCK_TESTE.sub_header.discount}`, {
  x:215,
  y: y_pixel,
  size: h2,
  font: HelveticaFontBold,
  color: rgb(0,0,0),
})
y_pixel = y_pixel - 20;
page.drawText("Itens da venda:", {
  x:30,
  y: y_pixel,
  size: h2,
  font: HelveticaFont,
  color: rgb(0,0,0),
})

// itens list
var init_table_y = 550;
const max_length_price = Math.max(...MOCK_TESTE.itens.map(obj => `${obj?.value}`.length));

MOCK_TESTE.itens.forEach((data, index) => {
  if(index == 0) {
    y_pixel = y_pixel - 5;
    init_table_y = y_pixel;
    page.drawLine({ start: { x: 30, y: y_pixel}, end: { x: width - 30, y: y_pixel}, thickness: 0.5, dashArray: [3, 3]});
  }
  y_pixel = y_pixel - 10;
  page.drawText(`Produto: ${data.name}`, {
    x: 35,
    y: y_pixel,
    size: h3,
    font: HelveticaFontBold,
    color: rgb(0,0,0),
  })
  y_pixel = y_pixel - 15;
  page.drawText(data.details, {
    x: 35,
    y: y_pixel,
    size: h3,
    font: HelveticaFont,
    color: rgb(0,0,0),
  })
  page.drawText(`R$ ${data.value}`, {
    x: width - (65 + ( 3 * max_length_price)),
    y: y_pixel,
    size: h3,
    font: HelveticaFont,
    color: rgb(0,0,0),
  })
  y_pixel = y_pixel - 5;
  page.drawLine({ start: { x: 30, y: y_pixel}, end: { x: width - 30, y: y_pixel}, thickness: 0.5, dashArray: [3, 3]});
})
// draw table borders
page.drawLine({ start: { x: 30, y: init_table_y}, end: { x: 30, y: y_pixel}, thickness: 0.5, dashArray: [3, 3]});
page.drawLine({ start: { x: width - 30, y: init_table_y}, end: { x: width - 30, y: y_pixel}, thickness: 0.5, dashArray: [3, 3]});

// footer
y_pixel = y_pixel - 43;
const jpgImageBytes = await fetch("https://lh3.googleusercontent.com/iTw3ZA-O3TMmRG-QSjO2Il2fIzdFReTzNT8JQYdUw2W3kEcCQR_Juw7N_4aY_QYBK_aNeEZ7ZvqncBRHG_6B-dtupYK88JrdzoO8hWq94jybG7bEtH4ZrudLjNzy3H3LOgsel3b2-0NcPXSr-L-UWIE5L61xxA2MLDboas8Icf36nFja6Jf5qml0qnYAgQyCqzve12l6RyNk2MmvBbS0c0B4vD13DHKs1661tb3XkNFGNRZxrBCvxy_CgTESCDSJ6l41ls3M9pRcJwyDsB0_Fm6Nm-7G3LjcXiq80ySR8e14TC9PInjtNFKyP23rIz6p968HN5h3Nrk4E68lGh-TApVbeGzG1MOTAWy6Yx-WeD5LbSLvMb7sGrBkAKzvcF1xLElHpcNLHmLLvWsQpgLLgGWthh_v7dD_mwdmY2WEWIbFbenBiHf7rEPMeHJjyLJU0GwDabWrauoHnHx07ueo40g-xD5omxreGKK8ONlHj3b-oFhtbi2CrLAJC0McQmU8PPkUceMWFsxTRxWYrbtI3QESjF4MV0-1ZwYCHM-fXJ93qSLZiJg3XQ-JyXfvSmab-LcnMKMRZcM-OjqqoXfeFvf1Gcuw4dhpFOe49t7MUOsIL43ZYDcXGnJd8ErW13DyLholng9B4eGCDF808r8QvpChZTvljTOgfePRQ7g43DGtA_gNUVpOYVFdNmAJZvX1Sso4lyGGrS65mqoHsYcQvvG6hsrucchIv16dpQvvT3w_5zj1i7FU5RYhPsz8ttuj1J-GdB6Fi0hKvlNCbIPTTZjQZjBDn_VF=w112-h52-no?authuser=0").then((res) => (res.arrayBuffer()));
const jpgImage = await pdfDoc.embedPng(jpgImageBytes)
page.drawImage(jpgImage, {
  x: width - 90,
  y: y_pixel,
  width: 55,
  height: 25
});

// create buffer from pdf
const pdfBytes = await pdfDoc.save();

// create folder if not exists
if(!fs.existsSync(`./${files_dir}`)) {
  fs.mkdirSync(`./${files_dir}`)
}
// crate file from buffer
fs.writeFile(`./${files_dir}/out_${Date.now()}.pdf`, pdfBytes, (err) => (err ? console.error(err): console.log("Success!")));
