// import OpenAI from 'openai';
// import fs from 'fs/promises'; // ✅ Use this for ES Modules
const OpenAI = require('openai');
const fs = require('fs').promises;

const openai = new OpenAI({
  apiKey: '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',
  baseURL: 'https://integrate.api.nvidia.com/v1',
})
 
async function main(num) {
  // let 
  try{
    const filepath=`./recognized_txt${num}/recognized_text.txt`;
    const filecontent=await fs.readFile(filepath,"utf-8");
    const completion = await openai.chat.completions.create({
        model: "nvidia/llama-3.1-nemotron-70b-instruct",
        messages: [{"role":"user","content":filecontent}],
        temperature: 0.5,
        top_p: 1,
        max_tokens: 1024,
        stream: true,
      })
      for await (const chunk of completion) {
        process.stdout.write(chunk.choices[0]?.delta?.content || '')

      }
  }catch(error){
    console.log("Some error occured ",error)
  }
   
  
}

// main();
module.exports=main;