import * as fs from 'fs';
import {
  PDFDocument,
  StandardFonts,
  rgb,
} from 'pdf-lib';
import fetch from "node-fetch";

const PAYMENT_METHODS_LENGTH = 2;
const PRODUCTS_LENGTH = 15;

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
    { 
      name: `XPTO${key + 1} aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`, 
      details: "3123123154121212312312312333", 
      quantity: `${["0,100Kg", 3, 1, 4 , "0,20Kg", "0,131Kg", "0,103Kg", "1 Kg", "0,1Kg", 12][Math.round(Math.random() * 10)]}`, 
      unit_value: `${Math.round(Math.random() * 100)}`,  
      value: `${Math.round(Math.random() * (Math.round(Math.random() * 10000)))}`
    }
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
  font: HelveticaFontBold,
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

// header of itens list
y_pixel = y_pixel - 20;
const max_length_price = Math.max(...MOCK_TESTE.itens.map(obj => `${obj?.value}`.length));
const max_item_x_direction = width - (65 + ( 3 * max_length_price));

page.drawText("Itens da venda:", {
  x:30,
  y: y_pixel,
  size: h2,
  font: HelveticaFont,
  color: rgb(0,0,0),
})
const x_qnt_item = max_item_x_direction - 80;
page.drawText("Qtde.", {
  x: x_qnt_item,
  y: y_pixel,
  size: h3,
  font: HelveticaFontBold,
  color: rgb(0,0,0),
})
const x_v_unit_item = max_item_x_direction - 52;
page.drawText("V.Unit(R$)", {
  x: x_v_unit_item,
  y: y_pixel,
  size: h3,
  font: HelveticaFont,
  color: rgb(0,0,0),
})
const x_v_tot_item = max_item_x_direction - 5;
page.drawText("V.Total(R$)", {
  x: x_v_tot_item,
  y: y_pixel,
  size: h3,
  font: HelveticaFontBold,
  color: rgb(0,0,0),
})

// itens list body
var init_table_y = 550;

MOCK_TESTE.itens.forEach((data, index) => {
  if(index == 0) {
    y_pixel = y_pixel - 5;
    init_table_y = y_pixel;
    page.drawLine({ start: { x: 30, y: y_pixel}, end: { x: width - 30, y: y_pixel}, thickness: 0.5, dashArray: [3, 3]});
  }
  y_pixel = y_pixel - 10;
  page.drawText(`Produto: ${data.name}`.substring(0, 42), {
    x: 35,
    y: y_pixel,
    size: h3,
    font: HelveticaFontBold,
    color: rgb(0,0,0),
  })
  y_pixel = y_pixel - 15;
  page.drawText(data.details.substring(0, 16), {
    x: 35,
    y: y_pixel,
    size: h3,
    font: HelveticaFont,
    color: rgb(0,0,0),
  })
  page.drawText(data.quantity, {
    x: x_qnt_item,
    y: y_pixel,
    size: h3,
    font: HelveticaFont,
    color: rgb(0,0,0),
  })
  page.drawText(data.unit_value, {
    x: x_v_unit_item + 25,
    y: y_pixel,
    size: h3,
    font: HelveticaFont,
    color: rgb(0,0,0),
  })
  page.drawText(`R$ ${data.value}`, {
    x: max_item_x_direction,
    y: y_pixel,
    size: h3,
    font: HelveticaFontBold,
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
const jpgImageBytes = await Promise.resolve(
  fetch("https://storage.googleapis.com/ms-sales/imagens%2F2a7e2a8a-46b1-4ad5-b943-ef270c5a2c73.png")
    .then((res) => {
      try {
        return res.arrayBuffer()
      } catch (e) {
        console.log("error when getting image", [e?.message, res]);
      }
    }));
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
