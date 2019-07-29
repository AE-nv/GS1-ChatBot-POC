# GS1-ChatBot-POC
In Analytics-POC-GS1, bottlenecks of support where determined. This repo contains an implementation of a chatbot which purpose is to address these bottlenecks and try to proof that chatbots (NLP) can be useful in a support context.

Architecture:

Frontend custom UI: VUE
Backend: Microsoft Bot Framework

The Microsoft Bot Framework communicates with the custom ui through DirectLine. A combination of LUIS and QNAMaker is used to interprete
the user requests.
