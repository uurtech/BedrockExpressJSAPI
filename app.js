import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";


// create bedrock runtime client
const client = new BedrockRuntimeClient({ region: "us-west-2" });

dotenv.config();
const app = express();
const port = 3000;
app.use(cors());
app.get('/api', async(req, res) => {

    // get url param from get query
    const url = req.query.url;

    // get query param from get query
    const query = req.query.query;
    
    // create request for prompt
    const request = {
        prompt: "\n\nHuman: crawl this " + url + " and asnwer me for : " + query + " \n\nAssistant:",
        max_tokens_to_sample: 2000
    }

    // create input for invoke model for anthropic
    const input = {
        modelId: "anthropic.claude-v2",
        body: JSON.stringify(request),
        contentType: "application/json",
        accept: "application/json"
    }

    // create a command to call invoke model
    const command = new InvokeModelCommand(input);

    console.log("Generating answer")
    // call invoke model    
    const response = await client.send(command);

    const complete = JSON.parse(
        Buffer.from(response.body).toString('utf8')
    );

    res.send(complete);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});