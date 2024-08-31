// import { GoogleGenerativeAI } from "@google/generative-ai";
//
// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
//
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//
// async function run() {
//   const prompt =
//     "Tienes que decir el especialista medico adecuado segun los sintomas del paciente";
//
//   const result = await model.generateContentStream(prompt);
//   const response = await result.response;
//   const text = response.text();
//   console.log(text);
// }
//
// run();
