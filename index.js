import * as fs from 'fs';
import {
  PDFDocument,
  StandardFonts,
  rgb,
} from 'pdf-lib';

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
      payment_methods: [
          { name: "Mastercard", details: "Crédito parcelado 10x R$ = 650,00" },
          { name: "Mastercard", details: "Débito 350,00" }
      ],
      sell_value: "1000.00",
      discount: "0.00"
  },
  itens: [
      { name: "XPTO1", details: "31231231541212312", value: 100},
      { name: "XPTO2", details: "31231212312", value: 100},
      { name: "XPTO3", details: "316554665461212312", value: 100},
      { name: "XPTO4", details: "31237546456452312312", value: 100},
      { name: "XPTO5", details: "3123124532543243212", value: 100},
      { name: "XPTO6", details: "31231231541524432", value: 100},
      { name: "XPTO4", details: "31237546456452312312", value: 100},
      { name: "XPTO5", details: "3123124532543243212", value: 100},
      { name: "XPTO6", details: "31231231541524432", value: 100},
      { name: "XPTO6", details: "31231231541524432", value: 100},
      { name: "XPTO1", details: "31231231541212312", value: 100},
      { name: "XPTO2", details: "31231212312", value: 100},
      { name: "XPTO3", details: "316554665461212312", value: 100},
      { name: "XPTO4", details: "31237546456452312312", value: 100},
      { name: "XPTO5", details: "3123124532543243212", value: 100},
      { name: "XPTO6", details: "31231231541524432", value: 100},
      { name: "XPTO4", details: "31237546456452312312", value: 100},
      { name: "XPTO5", details: "3123124532543243212", value: 100},
      { name: "XPTO6", details: "31231231541524432", value: 100},
      { name: "XPTO6", details: "31231231541524432", value: 100},
  ]
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
const estimate_height = 260 + (MOCK_TESTE.sub_header.payment_methods?.length ||  1 * 20) + (MOCK_TESTE.itens?.length ||  1) * 30;
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
    x: (width - 200 / `${data.value}`.length),
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
y_pixel = y_pixel - 45;
page.drawText(`tiba`, {
  x: width - 100,
  y: y_pixel,
  size: h1,
  font: CourierBoldOblique,
  color: rgb(0,0,0),
})

const pdfBytes = await pdfDoc.save();

fs.writeFile(`./${files_dir}/out_${Date.now()}.pdf`, pdfBytes, (err) => (err ? console.error(err): console.log("Success!")));
